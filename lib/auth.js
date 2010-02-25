var Auth= function Auth(request) {
    this._request= request;
};

Auth.prototype.getFrob= function(callback) {
    this._request.executeRequest("flickr.auth.getFrob",
                                       {}, true, function(res) { return res._content; }, callback);
};

Auth.prototype.getToken= function(frob, callback) {
   this._request.executeRequest("flickr.auth.getToken",
                                      {"frob":frob}, true, function(res) {
                                           return {
                                              "token": res.token._content,
                                              "perms": res.perms._content,
                                              "user": res.user
                                           };
                                       }, callback);
};

exports.Auth= Auth;