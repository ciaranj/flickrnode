var Urls= function Urls(request) {
    this._request= request;
};

Urls.prototype.lookupUser= function(url, callback) {
    return this._request.executeRequest("flickr.urls.lookupUser",  {"url": url}, false, null, callback);
};

exports.Urls= Urls;