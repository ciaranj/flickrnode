var Feeds= function Feeds(request) {
    this._request= request;
};
Feeds.prototype.photosComments= function(user_id, lang, callback) {
    var arguments=  {"user_id": user_id};
    if( lang ) arguments.lang= lang;
    
    this._request.executeRequest("photos_comments.gne",
                                       arguments, false, null, callback);
};

exports.Feeds = Feeds;