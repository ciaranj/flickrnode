var Collections= function Collections(request) {
    this._request= request;
};

Collections.prototype.getInfo= function(arguments, callback) {
    this._request.executeRequest("flickr.collections.getInfo", arguments, false, null, callback);
};
Collections.prototype.getTree= function(arguments, callback) {
    this._request.executeRequest("flickr.collections.getTree", arguments, false, null, callback);
};

exports.Collections= Collections;
