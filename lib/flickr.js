
var sys = require("sys"),
   http = require("http"),
   md5 = require('md5');
var flickr = http.createClient(80, "api.flickr.com");

function generate_signature(shared_secret, arguments) {
    var argument_pairs= [];
    for(var key in arguments ) {
        argument_pairs[argument_pairs.length]= [key, arguments[key]];
    }
    
    argument_pairs.sort(function(a,b) {
        if ( a[0]== b[0] ) return 0 ;
        return a[0] < b[0] ? -1 : 1;  
    });
    var args= "";
    for(var i=0;i<argument_pairs.length;i++) {
        args+= argument_pairs[i][0];
        args+= argument_pairs[i][1];
    }
    var sig= shared_secret+args;
    return md5.md5(sig);
}

function create_flickr_request(method, arguments, api_key, shared_secret, sign, result_mapper) {
    var promise= new process.Promise()
    var argumentString = "";
    var api_sig= undefined;
    if( arguments === undefined )  arguments = {};

    // apply default arguments 
    arguments.format= "json";
    arguments.nojsoncallback= "1";
    arguments["method"]= method;
    arguments.api_key= api_key;
    
    if( shared_secret && sign) {
        api_sig= generate_signature(shared_secret, arguments);
        if( api_sig ) {
            arguments.api_sig= api_sig;
        }
    }
    var operator= "?";
    for(var key in arguments) {
        argumentString+= (operator + key + "=" + arguments[key]);
        if( operator == "?" ) operator= "&";
    }
    var request= flickr.request("GET", 
                          "/services/rest"+ argumentString, 
                          {"host": "api.flickr.com"});
    request.finish(function (response) {
        var result= "";
        response.setBodyEncoding("utf8");
        response.addListener("body", function (chunk) {
          result+= chunk;
        });
        response.addListener("complete", function () {
            var res= JSON.parse(result);
            if( res.stat == "ok" ) {
                // Munge the response to strip out the stat and just return the response value
                for(var key in res) {
                    if( key !== "stat" ) {
                        res= res[key];
                    }
                }
                if( result_mapper ) {
                    res= result_mapper(res);
                }
                promise.emitSuccess(res);
            } 
            else {
                promise.emitError({code: res.code, message: res.message});
            }
        });
    });       
    return promise;                   
}

flickr.Auth= function Auth(api_key, shared_secret) {
    this.api_key= api_key;
    this.shared_secret= shared_secret;
};

flickr.Auth.prototype.getFrob= function() {
    return create_flickr_request("flickr.auth.getFrob",
                                       {}, this.api_key, this.shared_secret, true, function(res) { return res._content; });
};

flickr.Auth.prototype.getToken= function(frob) {
    return create_flickr_request("flickr.auth.getToken",
                                       {"frob":frob}, this.api_key, this.shared_secret, true);
};


flickr.People= function People(api_key, shared_secret) {
    this.api_key= api_key;
    this.shared_secret= shared_secret;
};

flickr.People.prototype.findByUsername= function(username){
      return create_flickr_request("flickr.people.findByUsername",
                                         {"username": username}, this.api_key, this.shared_secret);
};

flickr.Photos= function Photos(api_key, shared_secret) {
  this.api_key= api_key;  
  this.shared_secret= shared_secret;
};

flickr.Photos.prototype.getInfo= function(photo_id, secret) {
    var arguments=  {"photo_id": photo_id};
    if( secret !== undefined ) arguments.secret= secret;

    return create_flickr_request("flickr.photos.getInfo",
                                 arguments, 
                                 this.api_key, this.shared_secret);
};

flickr.Photosets= function Photosets(api_key, shared_secret) {
  this.api_key= api_key;  
  this.shared_secret= shared_secret;
};

flickr.Photosets.prototype.getInfo= function(photoset_id) {
    return create_flickr_request("flickr.photosets.getInfo",
                                 {"photoset_id": photoset_id},
                                 this.api_key, this.shared_secret);
};

flickr.Photosets.prototype.getList= function(user_id) {
    return create_flickr_request("flickr.photosets.getList",
                                 {"user_id": user_id},
                                 this.api_key, this.shared_secret);
};

flickr.Photosets.prototype.getPhotos= function(photoset_id, extras, privacy_filter, per_page, page, media) {
    var arguments=  {"photoset_id": photoset_id};
    
    if( extras !== undefined && extras.join !== undefined ) arguments.extras= extras.join(",");
    if( privacy_filter !== undefined ) arguments.privacy_filter= privacy_filter;
    if( per_page !== undefined ) arguments.per_page= per_page;
    if( page !== undefined ) arguments.page= page;
    if( media !== undefined ) arguments.media= media;
    return create_flickr_request("flickr.photosets.getPhotos",
                                 arguments, this.api_key, this.shared_secret);

};

flickr.FlickrAPI= function FlickrAPI(api_key, shared_secret) {
    this.api_key= api_key;
    this.shared_secret= shared_secret;
    this.people= new flickr.People(api_key,shared_secret);
    this.photos= new flickr.Photos(api_key,shared_secret);
    this.photosets= new flickr.Photosets(api_key,shared_secret);
    this.auth= new flickr.Auth(api_key, shared_secret);
};

flickr.FlickrAPI.prototype.getLoginUrl= function(permissions, frob) {
    var promise= new process.Promise();
    if( frob === undefined ) {
        var self= this;
        this.auth.getFrob()
                 .addErrback(function(err) {promise.emitError(err);})
                 .addCallback(function(frob){
                     var sig= generate_signature(self.shared_secret, {
                                                "api_key": self.api_key, 
                                                "perms": permissions,
                                                "frob":frob
                                                });
                    promise.emitSuccess("http://flickr.com/services/auth/?api_key="+self.api_key+"&perms="+permissions+"&frob="+frob+"&api_sig="+ sig, frob)
                 });
    } else {
         var sig= generate_signature(this.shared_secret, {
                                    "api_key": this.api_key, 
                                    "perms": permissions,
                                    "frob":frob
                                    });
        promise.emitSuccess("http://flickr.com/services/auth/?api_key="+self.api_key+"&perms="+permissions+"&frob="+frob+"&api_sig="+ sig, frob)
    }
    return promise;
};


exports.FlickrAPI = flickr.FlickrAPI;