var PhotoComments= require("./photos_comments").PhotosComments;

var Photos= function Photos(request) {
    this._request= request;
    this.comments= new PhotoComments(this._request);
};

Photos.prototype.getInfo= function(photo_id, secret, callback) {
    var arguments=  {"photo_id": photo_id};
    if( secret ) arguments.secret= secret;
    
    this._request.executeRequest("flickr.photos.getInfo", arguments, false, null, callback);
};

Photos.prototype.search= function(arguments, callback) {
    this._request.executeRequest("flickr.photos.search", arguments, false, null, callback);

};

exports.Photos= Photos;