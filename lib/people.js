var People= function People(request) {
    this._request= request;
};

People.prototype.findByUsername= function(username, callback){
      this._request.executeRequest("flickr.people.findByUsername",
                                         {"username": username}, false, null, callback);
};

exports.People= People;
