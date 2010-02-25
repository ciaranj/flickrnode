var Request= require("./request").Request,
    Auth= require("./auth").Auth,
    Blogs= require("./blogs").Blogs,
    People= require("./people").People,
    Photos= require("./photos").Photos,
    Photosets= require("./photosets").Photosets,
    Contacts= require("./contacts").Contacts,
    Feeds= require("./feeds").Feeds,
    Urls= require("./urls").Urls;

var FlickrAPI= function FlickrAPI(api_key, shared_secret, auth_token) {
    this._configure(api_key, shared_secret, auth_token);
};

FlickrAPI.prototype._configure= function(api_key, shared_secret, auth_token) { 
    this.api_key= api_key;
    
    this._request= new Request(api_key, shared_secret, auth_token);
    
    this.people= new People(this._request);
    this.photos= new Photos(this._request);
    this.photosets= new Photosets(this._request);
    this.auth= new Auth(this._request);
    this.blogs= new Blogs(this._request);
    this.contacts= new Contacts(this._request);
    this.urls= new Urls(this._request);

    this._feedRequest= new Request(api_key, shared_secret, auth_token, true);
    this.feeds= new Feeds(this._feedRequest);
};
    
FlickrAPI.prototype.setAuthenticationToken= function(auth_token) {
   this._request.setAuthenticationToken(auth_token);
   this._feedRequest.setAuthenticationToken(auth_token);
};

FlickrAPI.prototype.getLoginUrl= function(permissions, frob, callback) {
    if( frob ) {
         var sig= this._request.generateSignature(this.shared_secret, {
                                    "api_key": this.api_key, 
                                    "perms": permissions,
                                    "frob":frob
                                    });
        callback(null, "http://flickr.com/services/auth/?api_key="+this.api_key+"&perms="+permissions+"&frob="+frob+"&api_sig="+ sig, frob);
    } else {     
        var self= this;
        this.auth.getFrob(function(err, frob) {
            if( err ) {
                callback(err);
            } else {
                 var sig= self._request.generateSignature(self.shared_secret, {
                                            "api_key": self.api_key, 
                                            "perms": permissions,
                                            "frob":frob
                                            });
                callback(null, "http://flickr.com/services/auth/?api_key="+self.api_key+"&perms="+permissions+"&frob="+frob+"&api_sig="+ sig, frob)
            }
        });
    }
};


exports.FlickrAPI = FlickrAPI;
