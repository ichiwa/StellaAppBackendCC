var g = require('cloud/api/globals.js');
// functions 
var PUSH                    = g.PUSH;
var findUserInfo            = g.findUserInfo;
var findUserPartnerShip     = g.findUserPartnerShip;
var findUserHousework       = g.findUserHousework;
var ApiBase = require('cloud/api/api_base.js');
/**
 * ユーザの家事情報を保存する
 * 1日分
 */
var main = function(){
    var self = this;
    var promise = new Parse.Promise();
    var userId         = parseInt(self.request.params.userId);
    var targetDate     = self.request.params.targetDate;
    var houseworks     = self.request.params.houseworks;
    findUserInfo(userId)
    .then(
        function(userInfo){
            return findUserHousework(userId, targetDate);
        }
    )
    .then(
        function(userHousework){
            // insert
            if (!userHousework){
                var UserHousework = Parse.Object.extend("UserHousework");
                userHousework = new UserHousework();
                userHousework.set("userId", userId);
                userHousework.set("targetDate", new Date(targetDate));
            }
            userHousework.set("houseworks", houseworks);
            return userHousework.save();
        }
    )
    .then(
        function(userHousework){
            self.result.userInfo = userHousework;
            promise.resolve();
        },
        function(error){
            self.apiStatus = -1;
            promise.reject(error);
        }
    )
    // .then(
    //     function(userPartnerShip){
    //         // あれば
    //         if (userPartnerShip){
    //             targetUserId = 0;
    //             // to partnerId
    //             if (userPartnerShip.get("userId") == userId){
    //                 targetUserId = userPartnerShip.get("partnerId");
    //             // to userId
    //             } else {
    //                 targetUserId = userPartnerShip.get("userId");
    //             }
    //             var data = {
    //                 "userId" : targetUserId,
    //                 "message" : "",
    //                 "command" : ""
    //             }
    //             return sendPushNotification(data);
    //         // なければ次へ
    //         } else {
    //             return Parse.Promise.as();
    //         }
    //     }
    // )
    // .then(
    //     function(){
    //         promise.resolve();
    //     },
    //     function(error){
    //         self.apiStatus = -1;
    //         promise.reject(error);
    //     }
    // )
    return promise;
}
Parse.Cloud.define("save_user_housework_of_a_day", function(request, response) {
    var api = new ApiBase({
        request : request, 
        response : response,
        main : main
    });
    api.execute();
});

