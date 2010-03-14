var PhotosComments= function PhotosComments(request) {
    this._request= request;
};
//TODO: Test for  adate object and convert to millis in that case.
//if( min_comment_date !== undefined ) arguments.min_comment_date= min_comment_date;
//if( max_comment_date !== undefined ) arguments.max_comment_date= max_comment_date;

PhotosComments.prototype.getList= function(photo_id, optional_arguments, callback) {
    var arguments=  {"photo_id": photo_id};
    optional_arguments = optional_arguments || {};
    for(var key in optional_arguments) arguments[key]= optional_arguments[key];
    
    this._request.executeRequest("flickr.photos.comments.getList", arguments, false, null, callback);
};

exports.PhotosComments= PhotosComments;