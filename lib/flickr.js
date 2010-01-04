var sys = require("sys"),
   http = require("http");
var flickr = http.createClient(80, "api.flickr.com");

function create_flickr_request(method, arguments) {
    var promise= new process.Promise()
    var argumentString = "";
    for(var key in arguments) {
        argumentString+= ("&" + key + "=" + arguments[key]);
    }
    var request= flickr.request("GET", 
                          "/services/rest?format=json&nojsoncallback=1&method=" + method + argumentString, 
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
                promise.emitSuccess(res);
            } 
            else {
                promise.emitError({code: res.code, message: res.message});
            }
        });
    });       
    return promise;                   
}

exports.photos= {
    getInfo: function(photo_id, api_key, secret) {
        var arguments=  {"api_key": api_key, 
                         "photo_id": photo_id};
        if( secret !== undefined ) arguments.secret= secret;
        
        return create_flickr_request("flickr.photos.getInfo",
                                     arguments);
    }
};

exports.photosets= { 
    getList: function(user_id, api_key) {
        return create_flickr_request("flickr.photosets.getList",
                                           {"api_key": api_key, 
                                            "user_id": user_id});
    },
    getInfo: function(photoset_id, api_key) {
        return create_flickr_request("flickr.photosets.getInfo",
                                           {"api_key": api_key, 
                                            "photoset_id": photoset_id});
    },

    getPhotos: function(photoset_id, api_key, extras, privacy_filter, per_page, page, media) {
        
        var arguments=  {"api_key": api_key, 
                         "photoset_id": photoset_id};
        
        if( extras !== undefined && extras.join !== undefined ) arguments.extras= extras.join(",");
        if( privacy_filter !== undefined ) arguments.privacy_filter= privacy_filter;
        if( per_page !== undefined ) arguments.per_page= per_page;
        if( page !== undefined ) arguments.page= page;
        if( media !== undefined ) arguments.media= media;
        return create_flickr_request("flickr.photosets.getPhotos",
                                     arguments);
    }
};

exports.people= {
  findByUsername: function(username, api_key) {
      return create_flickr_request("flickr.people.findByUsername",
                                         {"api_key": api_key, 
                                          "username": username});
  }
};
