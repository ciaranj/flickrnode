var Blogs= function Blogs(request) {
    this._request= request;
};
Blogs.prototype.getList= function(callback) {
    this._request.executeRequest("flickr.blogs.getList",
                                 {}, true, null, callback);
};

exports.Blogs = Blogs;