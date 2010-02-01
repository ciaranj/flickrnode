var Contacts= function Contacts(request) {
    this._request= request;
};
Contacts.prototype.getPublicList= function(user_id, page, per_page) {
    var arguments=  {"user_id": user_id};
    if( page !== undefined ) arguments.page= page;
    if( per_page !== undefined ) arguments.per_page= per_page;
    
    return this._request.getRequestPromise("flickr.contacts.getPublicList",
                                       arguments, false);
};

exports.Contacts = Contacts;