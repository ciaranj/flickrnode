
var sys = require("sys"),
   http = require("http"),
   md5 = require('./md5');
var flickr= {};
var flickr_request = http.createClient(80, "api.flickr.com");

flickr.Request= function Request(api_key, shared_secret, auth_token) {
    this._configure(api_key, shared_secret, auth_token);
};

flickr.Request.prototype._configure= function(api_key, shared_secret, auth_token) {
    this.api_key= api_key;
    this.shared_secret= shared_secret;
    this.auth_token= auth_token;
};

flickr.Request.prototype.setAuthenticationToken= function(auth_token) {
    this._configure(this.api_key, this.shared_secret, auth_token);
};

flickr.Request.prototype.generateSignature= function(shared_secret, arguments) {
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
};

flickr.Request.prototype.getRequestPromise= function(method, arguments, sign_it, result_mapper) {
    var promise= new process.Promise()
    var argumentString = "";
    var api_sig= undefined;
    if( arguments === undefined )  arguments = {};

    // apply default arguments 
    arguments.format= "json";
    arguments.nojsoncallback= "1";
    arguments["method"]= method;
    arguments.api_key= this.api_key;
    if( this.auth_token ) arguments.auth_token= this.auth_token;
    
    if( this.shared_secret && (sign_it || this.auth_token) ) {
        api_sig= this.generateSignature(this.shared_secret, arguments);
        if( api_sig ) {
            arguments.api_sig= api_sig;
        }
    }
    var operator= "?";
    for(var key in arguments) {
        argumentString+= (operator + key + "=" + arguments[key]);
        if( operator == "?" ) operator= "&";
    }
    var request= flickr_request.request("GET", 
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
};

flickr.Auth= function Auth(request) {
    this._request= request;
};

flickr.Auth.prototype.getFrob= function() {
    return this._request.getRequestPromise("flickr.auth.getFrob",
                                       {}, true, function(res) { return res._content; });
};

flickr.Auth.prototype.getToken= function(frob) {
   return this._request.getRequestPromise("flickr.auth.getToken",
                                      {"frob":frob}, true, function(res) {
                                           return {
                                              "token": res.token._content,
                                              "perms": res.perms._content,
                                              "user": res.user
                                           };
                                       });
};

flickr.Blogs= function Blogs(request) {
    this._request= request;
};
flickr.Blogs.prototype.getList= function() {
    return this._request.getRequestPromise("flickr.blogs.getList",
                                       {}, true);
};


flickr.People= function People(request) {
    this._request= request;
};

flickr.People.prototype.findByUsername= function(username){
      return this._request.getRequestPromise("flickr.people.findByUsername",
                                         {"username": username});
};

flickr.Photos= function Photos(request) {
    this._request= request;
};

flickr.Photos.prototype.getInfo= function(photo_id, secret) {
    var arguments=  {"photo_id": photo_id};
    if( secret !== undefined ) arguments.secret= secret;
    
    return this._request.getRequestPromise("flickr.photos.getInfo", arguments);
};

//TODO: parameter based API is a bit rubbish here :(
flickr.Photos.prototype.search= function(user_id,tags,tag_mode,text,min_upload_date,max_upload_date,min_taken_date,max_taken_date,license,sort,bbox,accuracy,safe_search,content_type,machine_tags,machine_tag_mode,group_id,contacts,woe_id,place_id,media,has_geo,geo_context,lat,lon,radius,radius_units,is_commons,in_gallery,extras,per_page,page) {
    var arguments=  {};
    if( user_id !== undefined ) arguments.user_id= user_id;
    if( tags !== undefined ) arguments.tags= tags;
    if( tag_mode !== undefined ) arguments.tag_mode= tag_mode;
    if( text !== undefined ) arguments.text= text;
    if( min_upload_date !== undefined ) arguments.min_upload_date= min_upload_date;
    if( max_upload_date !== undefined ) arguments.max_upload_date= max_upload_date;
    if( min_taken_date !== undefined ) arguments.min_taken_date= min_taken_date;
    if( max_taken_date !== undefined ) arguments.max_taken_date= max_taken_date;
    if( license !== undefined ) arguments.license= license;
    if( sort !== undefined ) arguments.sort= sort;
    if( bbox !== undefined ) arguments.bbox= bbox;
    if( accuracy !== undefined ) arguments.accuracy= accuracy;
    if( safe_search !== undefined ) arguments.safe_search= safe_search
    if( content_type !== undefined ) arguments.content_type= content_type;
    if( machine_tags !== undefined ) arguments.machine_tags= machine_tags;
    if( machine_tag_mode !== undefined ) arguments.machine_tag_mode= machine_tag_mode;
    if( group_id !== undefined ) arguments.group_id= group_id;
    if( contacts !== undefined ) arguments.contacts= contacts;
    if( woe_id !== undefined ) arguments.woe_id= woe_id;
    if( place_id !== undefined ) arguments.place_id= place_id;
    if( media !== undefined ) arguments.media= media;
    if( has_geo !== undefined ) arguments.has_geo= has_geo;
    if( geo_context !== undefined ) arguments.geo_context= geo_context;
    if( lat !== undefined ) arguments.lat= lat;
    if( lon !== undefined ) arguments.lon= lon;
    if( radius !== undefined ) arguments.radius= radius;
    if( radius_units !== undefined ) arguments.radius_units= radius_units;
    if( is_commons !== undefined ) arguments.is_commons = is_commons;
    if( in_gallery !== undefined ) arguments.in_gallery= in_gallery;
    if( extras !== undefined ) arguments.extras= extras;
    if( per_page !== undefined ) arguments.per_page= per_page;
    if( page !== undefined ) arguments.page= page;
    
    return this._request.getRequestPromise("flickr.photos.search", arguments);
};

flickr.Photosets= function Photosets(request) {
    this._request= request;
};

flickr.Photosets.prototype.getInfo= function(photoset_id) {
    return this._request.getRequestPromise("flickr.photosets.getInfo",  {"photoset_id": photoset_id});
};

flickr.Photosets.prototype.getList= function(user_id) {
    return this._request.getRequestPromise("flickr.photosets.getList", {"user_id": user_id});
};

flickr.Photosets.prototype.getPhotos= function(photoset_id, extras, privacy_filter, per_page, page, media) {
    var arguments=  {"photoset_id": photoset_id};
    
    if( extras !== undefined && extras.join !== undefined ) arguments.extras= extras.join(",");
    if( privacy_filter !== undefined ) arguments.privacy_filter= privacy_filter;
    if( per_page !== undefined ) arguments.per_page= per_page;
    if( page !== undefined ) arguments.page= page;
    if( media !== undefined ) arguments.media= media;
    return this._request.getRequestPromise("flickr.photosets.getPhotos", arguments);
};

flickr.FlickrAPI= function FlickrAPI(api_key, shared_secret, auth_token) {
    this._configure(api_key, shared_secret, auth_token);
};

flickr.FlickrAPI.prototype._configure= function(api_key, shared_secret, auth_token) {
    this._request= new flickr.Request(api_key, shared_secret, auth_token);
    
    this.people= new flickr.People(this._request);
    this.photos= new flickr.Photos(this._request);
    this.photosets= new flickr.Photosets(this._request);
    this.auth= new flickr.Auth(this._request);
    this.blogs= new flickr.Blogs(this._request);
};
    

flickr.FlickrAPI.prototype.setAuthenticationToken= function(auth_token) {
   this._request.setAuthenticationToken(auth_token);
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
