var ApiBase = require('cloud/api/api_base.js');
var g = require('cloud/api/globals.js');
var findUserInfo            = g.findUserInfo;
var findUserPartnerShip     = g.findUserPartnerShip;
var findUserScheduledTaskOfRange= g.findUserScheduledTaskOfRange;
/**
 * パートナー情報を一週間分返す
 */
var main = function(){
    var self = this;
    var promise = new Parse.Promise();
    var userId  = parseInt(self.request.params.userId);
    var partnerId  = parseInt(self.request.params.partnerId);
    var from    = new Date(self.request.params.from); // yyyy-mm-dd 00:00:00
    var to      = new Date(self.request.params.to);   // yyyy-mm-dd 00:00:00
    var partnerUserInfo;
    findUserInfo(userId)
    .then(
        function(userInfo){
            return findUserInfo(partnerId);
        }
    )
    .then(
        function(userInfo){
            partnerUserInfo = userInfo;
            return findUserPartnerShip(userId, partnerId);
        }
    )
    .then(
        function(userPartnerShip){
            if (userPartnerShip){
                return findUserScheduledTaskOfRange(partnerId, from, to);
            } else {
                var error = new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, "PartnerShip not found.");
                return Parse.Promise.error(error);
            }
        }
    )
    .then(
        function(userScheduledTaskArray){
            self.result.partnerUserInfo = partnerUserInfo;
            self.result.userScheduledTaskArray = userScheduledTaskArray;
            promise.resolve();
        },
        function(error){
            self.apiStatus = -1;
            promise.reject(error);
        }
    )
    return promise;
}
Parse.Cloud.define("sync_scheduled_task", function(request, response) {
    var api = new ApiBase({
        request : request,
        response : response,
        main : main
    });
    api.execute();
});


