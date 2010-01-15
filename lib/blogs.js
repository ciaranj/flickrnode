Blogs= function Blogs(request) {
    this._request= request;
};
Blogs.prototype.getList= function() {
    return this._request.getRequestPromise("flickr.blogs.getList",
                                       {}, true);
};

exports.Blogs = Blogs;