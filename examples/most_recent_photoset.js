var sys= require('sys');

require.paths.unshift('lib')
var flickr= require('flickr');

var API_KEY="";
var USER_NAME= ""

flickr.people.findByUsername(USER_NAME,API_KEY).addErrback(fail).addCallback(function(user){
    flickr.photosets.getList(user.id, API_KEY).addErrback(fail).addCallback(function(photosets){
        flickr.photosets.getPhotos(photosets.photoset[0].id, API_KEY, ["url_sq", "url_m"]).addErrback(fail).addCallback(function(photoset){
            sys.puts("FOO: " + sys.inspect(photoset));
        });
    });
});

function fail (err) {
    sys.puts("ERR: " + err.code + " -  " + err.message);
};