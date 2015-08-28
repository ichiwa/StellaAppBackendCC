var g = require('cloud/api/globals.js');
// functions 
var findUserInfo = g.findUserInfo;
var findUserPartnerShip = g.findUserPartnerShip;
var sendPushNotification = g.sendPushNotification;
/**
 * ユーザ同士の接続を解除する
 * @param request
 * @param response
 */
Parse.Cloud.define("disconnect_partner", function(request, response) {
    var userId         = parseInt(request.params.userId);
    var partnerId      = parseInt(request.params.partnerId);
    var myUserInfo;
    findUserInfo(userId) // ユーザの検索
    .then(
        function(userInfo){
            myUserInfo = userInfo;
            // パートナーシップの検索
            return findUserPartnerShip(userId, partnerId);
        }
    )
    .then(
        function(ret){
            // パートナーシップなし
            if (!ret){
                var errorMessage = "PartnerShip is Not Found. (called " + userId + " - "+ partnerId+ ")";
                var error        = new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, errorMessage);
                return Parse.Promise.error(error);
            // パートナーシップあり
            } else {
                return ret.destroy();
            }
        }
    )
    .then(
        function(deleted){
            var message = "パートナーが解除されました。";
            var command = "disconnect_partner";
            var params  = {
                "partnerId" : myUserInfo.get("userId")
            };
            return sendPushNotification(partnerId, message, command, params);
        }
    )
    .then(
        function(){
            response.success({
                status:0
            })
        },
        function(error){
            response.error({
                status:-1,
                error: error.message
            })
        }
    );

});