var FlickrAPI= require('../lib/flickr').FlickrAPI;
var sys= require('sys');


var API_KEY= "enter here"
var SHARED_SECRET= "enter here"
var AUTHENTICATION_TOKEN= "enter here"

var flickr= new FlickrAPI(API_KEY, SHARED_SECRET);
flickr.setAuthenticationToken(AUTHENTICATION_TOKEN);
var args={};
args["is_public"] = "0";


flickr.upload.async("./test/girls.jpg","girls.jpg", args, function(err, ticketid) {
	sys.p(ticketid);
});