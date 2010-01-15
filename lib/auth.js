Auth= function Auth(request) {
    this._request= request;
};

Auth.prototype.getFrob= function() {
    return this._request.getRequestPromise("flickr.auth.getFrob",
                                       {}, true, function(res) { return res._content; });
};

Auth.prototype.getToken= function(frob) {
   return this._request.getRequestPromise("flickr.auth.getToken",
                                      {"frob":frob}, true, function(res) {
                                           return {
                                              "token": res.token._content,
                                              "perms": res.perms._content,
                                              "user": res.user
                                           };
                                       });
};

exports.Auth= Auth;