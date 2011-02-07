var sys = require("sys"),
   http = require("http"),
   md5 = require('./md5');

var Request= function Request(api_key, shared_secret, auth_token, isFeedRequest) {
    this._configure(api_key, shared_secret, auth_token);
    this.isFeedRequest= false;
    if( isFeedRequest !== undefined ) this.isFeedRequest= isFeedRequest;  

    if( this.isFeedRequest ) {
        this.baseUrl= "/services/feeds";  
    }
    else {
        this.baseUrl= "/services/rest";  
    }
};

Request.prototype._configure= function(api_key, shared_secret, auth_token) {
    this.api_key= api_key;
    this.shared_secret= shared_secret;
    this.auth_token= auth_token;
};

Request.prototype.setAuthenticationToken= function(auth_token) {
    this._configure(this.api_key, this.shared_secret, auth_token);
};

Request.prototype.generateSignature= function(shared_secret, arguments) {
    var argument_pairs= [];
    for(var key in arguments ) {   
        argument_pairs[argument_pairs.length]= [key, arguments[key]];
    }
    
    argument_pairs.sort(function(a,b) {
        if ( a[0]== b[0] ) return 0 ;
        return a[0] < b[0] ? -1 : 1;  
    });
    var args= "";
    for(var i=0;i<argument_pairs.length;i++) {
        args+= argument_pairs[i][0];
        args+= argument_pairs[i][1];
    }
    var sig= this.shared_secret+args;
    return md5.md5(sig);
};

Request.prototype.getHttpClient= function() {
    return http.createClient(80, "api.flickr.com");
};

Request.prototype.executeRequest= function(method, arguments, sign_it, result_mapper, callback) {
    var argumentString = "";
    var api_sig= undefined;
    if( arguments === undefined )  arguments = {};

    // apply default arguments 
    arguments.format= "json";
    arguments.nojsoncallback= "1";

    if( this.isFeedRequest ) {
        argumentString= "/"+ method;
    }
    else {
        arguments.api_key= this.api_key;
        arguments["method"]= method;
        if( this.auth_token ) arguments.auth_token= this.auth_token;
    
        if( this.shared_secret && (sign_it || this.auth_token) ) {
            api_sig= this.generateSignature(this.shared_secret, arguments);
            if( api_sig ) {
                arguments.api_sig= api_sig;
            }
        }
    }
    var operator= "?";
    for(var key in arguments) {
        argumentString+= (operator + key + "=" + arguments[key]);
        if( operator == "?" ) operator= "&";
    }
   
    var request= this.getHttpClient().request("GET", 
                          this.baseUrl+ argumentString, 
                          {"host": "api.flickr.com"});
    var isFeedRequest= this.isFeedRequest;          
    request.addListener('response', function (response) {
        var result= "";
        response.setEncoding("utf8");
        response.addListener("data", function (chunk) {
          result+= chunk;
        });
        response.addListener("end", function () {   
            // Bizarrely Flickr seems to send back invalid JSON (it escapes single quotes in certain circumstances?!?!!?)
            // We fix that here.
            if( result ) {  
                result= result.replace(/\\'/g,"'");
            }
            if( isFeedRequest ) {
                var m;
                if(!result || (m= result.match(/[\S\s]+We were unable to generate the feed you requested, for the following reason:<\/p>\s*?<p[\S\s]+?>([\S\s]+?)<\/p>[\S\s]+/) ) ) {
                    var  errorString= m[1].replace(/^\s+/,"");
                    errorString= errorString.replace(/\s+$/, "");
                    callback({code: -1, message: errorString});
                }
                else {
                    var res= JSON.parse(result);
                    if( result_mapper ) {
                        res= result_mapper(res);
                    }
                    callback(null, res);
                }
            } 
            else {
                var res= JSON.parse(result);
                if( res.stat && res.stat == "ok" ) {
                    // Munge the response to strip out the stat and just return the response value
                    for(var key in res) {
                        if( key !== "stat" ) {
                            res= res[key];
                        }
                    }
                    if( result_mapper ) {
                        res= result_mapper(res);
                    }
                    callback(null, res);
                } 
                else {
                    callback({code: res.code, message: res.message});
                }
            }
        });
    });       
    request.end();
};

exports.Request = Request;