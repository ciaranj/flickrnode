var Photosets= function Photosets(request) {
    this._request= request;
};

Photosets.prototype.getInfo= function(photoset_id) {
    return this._request.getRequestPromise("flickr.photosets.getInfo",  {"photoset_id": photoset_id});
};

Photosets.prototype.getList= function(user_id) {
    return this._request.getRequestPromise("flickr.photosets.getList", {"user_id": user_id});
};

Photosets.prototype.getPhotos= function(photoset_id, extras, privacy_filter, per_page, page, media) {
    var arguments=  {"photoset_id": photoset_id};
    
    if( extras !== undefined && extras.join !== undefined ) arguments.extras= extras.join(",");
    if( privacy_filter !== undefined ) arguments.privacy_filter= privacy_filter;
    if( per_page !== undefined ) arguments.per_page= per_page;
    if( page !== undefined ) arguments.page= page;
    if( media !== undefined ) arguments.media= media;
    return this._request.getRequestPromise("flickr.photosets.getPhotos", arguments);
};

exports.Photosets= Photosets;