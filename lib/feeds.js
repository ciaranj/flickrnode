var Feeds= function Feeds(request) {
    this._request= request;
};
Feeds.prototype.photosComments= function(user_id, lang) {
    var arguments=  {"user_id": user_id};
    if( lang !== undefined ) arguments.lang= lang;
    
    return this._request.getRequestPromise("photos_comments.gne",
                                       arguments, false);
};

exports.Feeds = Feeds;