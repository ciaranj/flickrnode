var sys= require('sys');

require.paths.unshift('lib')
var FlickrAPI= require('flickr').FlickrAPI;

var API_KEY="";
var USER_NAME= "";

var flickr= new FlickrAPI(API_KEY);

flickr.people.findByUsername(USER_NAME).addErrback(fail).addCallback(function(user){
    flickr.photosets.getList(user.id).addErrback(fail).addCallback(function(photosets){
        flickr.photosets.getPhotos(photosets.photoset[0].id, ["url_sq", "url_m"]).addErrback(fail).addCallback(function(photoset){
            sys.puts("FOO: " + sys.inspect(photoset));
        });
    });
});

function fail (err) {
    sys.puts("ERR: " + err.code + " -  " + err.message);
};