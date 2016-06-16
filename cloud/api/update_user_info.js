var ApiBase = require('./api_base.js');
var g = require('./globals.js');
var findUserInfo            = g.findUserInfo;

var main = function(){
    var self            = this;
    var promise         = new Parse.Promise();
    var userId          = parseInt(self.request.params.userId);
    var userName        = self.request.params.userName;
    var userPassword    = self.request.params.userPassword;

    // edit here...
    findUserInfo(userId)
    .then(
        function(userInfo){
            userInfo.set("userName", userName);
            userInfo.set("password", userPassword);
            return userInfo.save();
        }
    )
    .then(
        function(userInfo){
            self.result.userInfo = userInfo;
            promise.resolve();
        },
        function(error){
            self.apiStatus = -1;
            promise.reject(error);
        }
    )
    return promise;
}

Parse.Cloud.define("update_user_info", function(request, response) {
    var api = new ApiBase({
        request : request,
        response : response,
        main : main
    });
    api.execute();
});


