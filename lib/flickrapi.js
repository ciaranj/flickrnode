var Request= require("./request").Request,
    Auth= require("./auth").Auth,
    Blogs= require("./blogs").Blogs,
    People= require("./people").People,
    Photos= require("./photos").Photos,
    Photosets= require("./photosets").Photosets;

var FlickrAPI= function FlickrAPI(api_key, shared_secret, auth_token) {
    this._configure(api_key, shared_secret, auth_token);
};

FlickrAPI.prototype._configure= function(api_key, shared_secret, auth_token) {
    this._request= new Request(api_key, shared_secret, auth_token);
    
    this.people= new People(this._request);
    this.photos= new Photos(this._request);
    this.photosets= new Photosets(this._request);
    this.auth= new Auth(this._request);
    this.blogs= new Blogs(this._request);
};
    
FlickrAPI.prototype.setAuthenticationToken= function(auth_token) {
   this._request.setAuthenticationToken(auth_token);
};

FlickrAPI.prototype.getLoginUrl= function(permissions, frob) {
    var promise= new process.Promise();
    if( frob === undefined ) {
        var self= this;
        this.auth.getFrob()
                 .addErrback(function(err) {promise.emitError(err);})
                 .addCallback(function(frob){
                     var sig= self._request.generateSignature(self.shared_secret, {
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


exports.FlickrAPI = FlickrAPI;
