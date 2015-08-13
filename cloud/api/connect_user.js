var functions = require("cloud/api/functions.js");
/**
 * ユーザ同士を繋げて
 * 接続先ユーザにプッシュ通知をおくる
 * @param request
 * @param response
 */
Parse.Cloud.define("connect_user", function(request, response) {
    var userId         = parseInt(request.params.userId);
    var partnerId      = parseInt(request.params.partnerId);
    var UserPartnerShip = Parse.Object.extend("UserPartnerShip");
    var myUserInfo;
    
    functions
    .findUserInfo(userId) // ユーザの検索
    .then(
        function(userInfo){
            myUserInfo = userInfo;
            // パートナーシップの検索
            return functions.findUserPartnerShip(userId, partnerId);
        }
    )
    .then(
        function(ret){
            // まだパートナーシップなし
            if (!ret){
                var userPartnerShip = new UserPartnerShip();
                userPartnerShip.set("userId", userId);
                userPartnerShip.set("partnerId", partnerId);
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
            var message = myUserInfo.get("userName") + "さんとつながりました。";
            return functions.sendPushNotification(partnerId, message);
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
    )
});

