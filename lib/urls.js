var Urls= function Urls(request) {
    this._request= request;
};

Urls.prototype.lookupUser= function(url) {
    return this._request.getRequestPromise("flickr.urls.lookupUser",  {"url": url});
};

exports.Urls= Urls;