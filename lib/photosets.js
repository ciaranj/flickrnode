var Photosets= function Photosets(request) {
    this._request= request;
};

Photosets.prototype.getInfo= function(photoset_id, callback) {
    this._request.executeRequest("flickr.photosets.getInfo",  {"photoset_id": photoset_id}, false, null, callback);
};

Photosets.prototype.getList= function(user_id, callback) {
   this._request.executeRequest("flickr.photosets.getList", {"user_id": user_id}, false, null, callback);
};

Photosets.prototype.getPhotos= function(photoset_id, optional_arguments, callback) {
    var arguments=  {"photoset_id": photoset_id};                      
    //TODO: Consider using a mixin here, but be ware I've messed around with the extras argument...
    if( optional_arguments.extras !== undefined && optional_arguments.extras.join !== undefined ) arguments.extras= optional_arguments.extras.join(",");
    if( optional_arguments.privacy_filter !== undefined ) arguments.privacy_filter= optional_arguments.privacy_filter;
    if( optional_arguments.per_page !== undefined ) arguments.per_page=optional_arguments. per_page;
    if( optional_arguments.page !== undefined ) arguments.page= optional_arguments.page;
    if( optional_arguments.media !== undefined ) arguments.media= optional_arguments.media;
    this._request.executeRequest("flickr.photosets.getPhotos", arguments, false, null, callback);
};

exports.Photosets= Photosets;