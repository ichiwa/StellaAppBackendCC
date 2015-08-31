var ApiBase = require('cloud/api/api_base.js');
var g = require('cloud/api/globals.js');

var main = function(){
    var self = this;
    var promise = new Parse.Promise();
    
    // edit here...
    
    return Parse.Promise.as();
    //return promise;
}

Parse.Cloud.define("hello", function(request, response) {
    var api = new ApiBase({
        request : request,
        response : response,
        main : main
    });
    api.execute();
});


