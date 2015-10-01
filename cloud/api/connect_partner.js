var g = require('cloud/api/globals.js');
// functions 
var findUserInfo = g.findUserInfo;
var findUserPartnerShip = g.findUserPartnerShip;
var sendPushNotification = g.sendPushNotification;
var ApiBase = require('cloud/api/api_base.js');

/**
 * ユーザ同士を繋げて
 * 接続先ユーザにプッシュ通知をおくる
 */
var main = function(){
    var promise        = new Parse.Promise();
    var self           = this;
    var userId         = parseInt(self.request.params.userId);
    var partnerId      = parseInt(self.request.params.partnerId);
    var UserPartnerShip = Parse.Object.extend("UserPartnerShip");
    var myUserInfo;
    var partnerUserInfo;
    findUserInfo(userId) // ユーザの検索
    .then(
        function(userInfo){
            myUserInfo = userInfo;
            // パートナーの存在確認  
            return findUserInfo(partnerId);
        }
    )
    .then(
        function(userInfo){
            partnerUserInfo = userInfo;
            // 相手のパートナーシップを検索
            return findUserPartnerShip(partnerId);
        }
    )
    .then(
        function(ret){
            // まだパートナーシップなし
            if (!ret){
                var userPartnerShip = new UserPartnerShip();
                userPartnerShip.set("userId", userId);
                userPartnerShip.set("partnerId", partnerId);
                //return Parse.Promise.as();
                return userPartnerShip.save();
            // 既にパートナーシップあり
            } else {
                var errorMessage = "PartnerShip is Already exists.(" + userId + " → " + partnerId +")";
                var error = new Parse.Error(Parse.Error.DUPLICATE_VALUE, errorMessage);
                return Parse.Promise.error(error);
            }
        }
    )
    .then(
        function(){
            // 相手にプッシュ通知を送る
            var message = myUserInfo.get("userName") + "さんとつながりました";
            var command = "connect_partner";
            var params  = {
                "partnerId" : myUserInfo.get("userId"),
                "partnerName" : myUserInfo.get("userName")
            };
            var data = {
                userId  : partnerId,
                message : message,
                command : command,
                params  : params,
                pushType : g.PUSH.DIALOG_AND_UPDATE
            }
            return sendPushNotification(data);
        }
    )
    .then(
        function(){
            self.result.partnerUserInfo = partnerUserInfo;
            promise.resolve();
        },
        function(error){
            self.apiStatus = -1;
            promise.reject(error);
        }
    )
    return promise;
}
Parse.Cloud.define("connect_partner", function(request, response) {
    var api = new ApiBase({
        request : request,
        response : response,
        main : main
    });
    api.execute();
});
