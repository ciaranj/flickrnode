var PhotosComments= function PhotosComments(request) {
    this._request= request;
};
//TODO: Test for  adate object and convert to millis in that case.
PhotosComments.prototype.getList= function(photo_id, min_comment_date, max_comment_date) {
    var arguments=  {"photo_id": photo_id};
    if( min_comment_date !== undefined ) arguments.min_comment_date= min_comment_date;
    if( max_comment_date !== undefined ) arguments.max_comment_date= max_comment_date;
    
    return this._request.getRequestPromise("flickr.photos.comments.getList", arguments);
};

exports.PhotosComments= PhotosComments;