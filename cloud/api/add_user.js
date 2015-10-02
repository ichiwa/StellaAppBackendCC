var g = require('cloud/api/globals.js');
var createUserId = g.createUserId;
var ApiBase = require('cloud/api/api_base.js');
/**
 * ユーザを追加する
 */
var main = function(){
    var promise = new Parse.Promise();
    var UserInfo = Parse.Object.extend("UserInfo");
    var self = this;
    var userName = self.request.params.userName;
    createUserId()
    .then(
        function(userId) {
            var user = new UserInfo();
            user.set("userId", userId);
            user.set("userName", userName);
            user.set('password', '');
            user.set('installationId', self.request.params.installationId);
            return user.save();
        }
    )
    .then(
        function(userInfo){
            self.result.userInfo = userInfo;
            promise.resolve();
        },
        function(error){
            self.apiStatus = -1;
            promise.error(error);
        }
    )
    return promise;
}
Parse.Cloud.define("add_user", function(request, response) {
    var api = new ApiBase({
        request : request,
        response : response,
        main : main
    });
    api.execute();
});
