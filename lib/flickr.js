var sys = require("sys"),
   http = require("http");
var flickr = http.createClient(80, "api.flickr.com");

function create_flickr_request(method, arguments, api_key) {
    var promise= new process.Promise()
    var argumentString = "";
    
    arguments.api_key= api_key;
    
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


flickr.People= function People(api_key) {
    this.api_key= api_key;
};

flickr.People.prototype.findByUsername= function(username){
      return create_flickr_request("flickr.people.findByUsername",
                                         {"username": username}, this.api_key);
};

flickr.Photos= function Photos(api_key) {
  this.api_key= api_key;  
};

flickr.Photos.prototype.getInfo= function(photo_id, secret) {
    var arguments=  {"photo_id": photo_id};
    if( secret !== undefined ) arguments.secret= secret;

    return create_flickr_request("flickr.photos.getInfo",
                                 arguments, 
                                 this.api_key);
};

flickr.Photosets= function Photosets(api_key) {
  this.api_key= api_key;  
};

flickr.Photosets.prototype.getInfo= function(photoset_id) {
    return create_flickr_request("flickr.photosets.getInfo",
                                 {"photoset_id": photoset_id},
                                 this.api_key);
};

flickr.Photosets.prototype.getList= function(user_id) {
    return create_flickr_request("flickr.photosets.getList",
                                 {"user_id": user_id},
                                 this.api_key);
};

flickr.Photosets.prototype.getPhotos= function(photoset_id, api_key, extras, privacy_filter, per_page, page, media) {
    var arguments=  {"photoset_id": photoset_id};
    
    if( extras !== undefined && extras.join !== undefined ) arguments.extras= extras.join(",");
    if( privacy_filter !== undefined ) arguments.privacy_filter= privacy_filter;
    if( per_page !== undefined ) arguments.per_page= per_page;
    if( page !== undefined ) arguments.page= page;
    if( media !== undefined ) arguments.media= media;
    return create_flickr_request("flickr.photosets.getPhotos",
                                 arguments, this.api_key);

};

flickr.FlickrAPI= function FlickrAPI(api_key) {
    this.api_key= api_key;
    this.people= new flickr.People(api_key);
    this.photos= new flickr.Photos(api_key);
    this.photosets= new flickr.Photosets(api_key);
};

exports.FlickrAPI = flickr.FlickrAPI;