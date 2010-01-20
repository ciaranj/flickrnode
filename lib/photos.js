var Photos= function Photos(request) {
    this._request= request;
};

Photos.prototype.getInfo= function(photo_id, secret) {
    var arguments=  {"photo_id": photo_id};
    if( secret !== undefined ) arguments.secret= secret;
    
    return this._request.getRequestPromise("flickr.photos.getInfo", arguments);
};

//TODO: parameter based API is a bit rubbish here :(
Photos.prototype.search= function(user_id,tags,tag_mode,text,min_upload_date,max_upload_date,min_taken_date,max_taken_date,license,sort,bbox,accuracy,safe_search,content_type,machine_tags,machine_tag_mode,group_id,contacts,woe_id,place_id,media,has_geo,geo_context,lat,lon,radius,radius_units,is_commons,in_gallery,extras,per_page,page) {
    var arguments=  {};
    if( user_id !== undefined ) arguments.user_id= user_id;
    if( tags !== undefined ) arguments.tags= tags;
    if( tag_mode !== undefined ) arguments.tag_mode= tag_mode;
    if( text !== undefined ) arguments.text= text;
    if( min_upload_date !== undefined ) arguments.min_upload_date= min_upload_date;
    if( max_upload_date !== undefined ) arguments.max_upload_date= max_upload_date;
    if( min_taken_date !== undefined ) arguments.min_taken_date= min_taken_date;
    if( max_taken_date !== undefined ) arguments.max_taken_date= max_taken_date;
    if( license !== undefined ) arguments.license= license;
    if( sort !== undefined ) arguments.sort= sort;
    if( bbox !== undefined ) arguments.bbox= bbox;
    if( accuracy !== undefined ) arguments.accuracy= accuracy;
    if( safe_search !== undefined ) arguments.safe_search= safe_search
    if( content_type !== undefined ) arguments.content_type= content_type;
    if( machine_tags !== undefined ) arguments.machine_tags= machine_tags;
    if( machine_tag_mode !== undefined ) arguments.machine_tag_mode= machine_tag_mode;
    if( group_id !== undefined ) arguments.group_id= group_id;
    if( contacts !== undefined ) arguments.contacts= contacts;
    if( woe_id !== undefined ) arguments.woe_id= woe_id;
    if( place_id !== undefined ) arguments.place_id= place_id;
    if( media !== undefined ) arguments.media= media;
    if( has_geo !== undefined ) arguments.has_geo= has_geo;
    if( geo_context !== undefined ) arguments.geo_context= geo_context;
    if( lat !== undefined ) arguments.lat= lat;
    if( lon !== undefined ) arguments.lon= lon;
    if( radius !== undefined ) arguments.radius= radius;
    if( radius_units !== undefined ) arguments.radius_units= radius_units;
    if( is_commons !== undefined ) arguments.is_commons = is_commons;
    if( in_gallery !== undefined ) arguments.in_gallery= in_gallery;
    if( extras !== undefined ) arguments.extras= extras;
    if( per_page !== undefined ) arguments.per_page= per_page;
    if( page !== undefined ) arguments.page= page;
    
    return this._request.getRequestPromise("flickr.photos.search", arguments);
};

exports.Photos= Photos;