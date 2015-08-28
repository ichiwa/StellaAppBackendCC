var ApiBase = require('cloud/api/api_base.js');
var g = require('cloud/api/globals.js');

Parse.Cloud.define("hello", function(request, response) {
    var api = new ApiBase({
        request : request,
        response : response,
        run : function(){
            return Parse.Promise.as();
        }
    });
    console.log("calling run !!!!!");
    api.run();
});


