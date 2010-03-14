var Contacts= function Contacts(request) {
    this._request= request;
};

/* Takes optional arguments:
 * page  - Current Page.
 * per_page - Number of records per page
 */
Contacts.prototype.getPublicList= function(user_id, optional_arguments, callback) {
    var arguments=  {"user_id": user_id};
    optional_arguments = optional_arguments || {};
    for(var key in optional_arguments) arguments[key]= optional_arguments[key];
    
    this._request.executeRequest("flickr.contacts.getPublicList",
                                       arguments, false, null, callback );
};

exports.Contacts = Contacts;