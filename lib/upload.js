var http=require("http")
var multipartform = require("./multipartform")
var fs = require("fs")
var path = require("path")
var sys= require("sys")

var Upload = function Upload(request) {
    this._request= request;
};

// Uploads using the Flickr async api.  http://www.flickr.com/services/api/upload.async.html
// Returns a ticket id when.
Upload.prototype.async = function(path_to_photo, suggested_filename, optional_arguments, callback) {
	//first make sure the file exists and all that
	self = this;
	fs.stat(path_to_photo, function(err, stats) {
		if (err) {
			callback(err);
			return;
		}
		
		//http headers
		request_headers = {}
		request_headers["Host"] = "up.flickr.com";
		request_headers["User-Agent"] = "node.js";
		request_headers["Content-Type"] = "multipart/form-data; boundary=" + multipartform.defaultBoundary;
		request_headers['Transfer-Encoding'] = 'chunked';
		
		//generate a sig
		arguments = {}
		
		arguments["api_key"] = self._request.api_key;
		if( self._request.auth_token) arguments["auth_token"]= self._request.auth_token;		
		arguments["async"] = "true";
		for(var key in optional_arguments) arguments[key]= optional_arguments[key];
		arguments["api_sig"] = self._request.generateSignature(self._request.shared_secret, arguments);
		
		//construct the multipart params
		var parts = {}
		for (var key in arguments) parts[key] = arguments[key];
	    parts["photo"] = multipartform.file(path_to_photo, suggested_filename || path.basename(path_to_photo), stats.size);

		//set the content-length
		request_headers["Content-Length"] = multipartform.sizeOf(parts);
		
		//create the http request
		http_request = self._request.getHttpClient().request("POST", "/services/upload/", request_headers);
		// This doesn't send the request, just sets up the response handling.
		// We defer to the FlickrRequest to parse the response and return back the ticketid.
		self._request.listenResponse(http_request, null, function(err, ticket_json) {
			callback(err, ticket_json);
		});
		
		// write out the multiparts to the request
		// when we are done close the request, so the http request fires off
		multipartform.write(http_request, parts, null, function(err) {
			if (err) {
				callback(err);
				return;
			}
			http_request.close();
		});
	});
}


exports.Upload= Upload;