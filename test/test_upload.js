var FlickrAPI= require('../lib/flickr').FlickrAPI;
var sys= require('sys');


var API_KEY= "5a7499da64e7142d77809edb1f202a72"
var SHARED_SECRET= "f9eef1ff339d9322"
var AUTHENTICATION_TOKEN= "72157620432370689-1c40342f96135c89"

var flickr= new FlickrAPI(API_KEY, SHARED_SECRET);
flickr.setAuthenticationToken(AUTHENTICATION_TOKEN);
var args={};
args["is_public"] = "0";


flickr.upload.async("./test/girls.jpg","girls.jpg", args, function(err, ticketid) {
	sys.p(ticketid);
});