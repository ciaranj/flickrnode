var People= function People(request) {
    this._request= request;
};

People.prototype.findByUsername= function(username){
      return this._request.getRequestPromise("flickr.people.findByUsername",
                                         {"username": username});
};

exports.People= People;
