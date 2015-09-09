var g = require('cloud/api/globals.js');
//var moment = require('cloud/libs/moment.js');
var PUSH                    = g.PUSH;
var findUserPartnerShip     = g.findUserPartnerShip;
var sendPushNotification    = g.sendPushNotification;
/**
 * UserHousework が保存されたあとに呼ばれる
 * @param request
 */
Parse.Cloud.afterSave("UserHousework", function(request) {
    // 保存されたObjectを取得
    var userHousework = request.object;
    var userId        = userHousework.get("userId");
    findUserPartnerShip(userId)
    .then(
        function(userPartnerShip){
            // パートナーにデータ更新通知をする
            if (userPartnerShip){
                var targetUserId = 0;
                if (userPartnerShip.get("userId") == userId){
                    targetUserId = userPartnerShip.get("partnerId");
                } else {
                    targetUserId = userPartnerShip.get("userId");
                }
                //console.log("ps:"+JSON.stringify(userPartnerShip));
                var data = {
                    "userId"  : targetUserId,
                    "message" : "after save userHousework event",
                    "command" : "update_partner_housework",
                    "pushType": PUSH.UPDATE,
                    "params"  : {
                        "partnerId" : userId,
                        "houseworks": userHousework.get("houseworks"),
                        "targetDate": userHousework.get("targetDate")
                    }
                }
                //console.log("data:"+JSON.stringify(data));
                return sendPushNotification(data);
            } else {
                return Parse.Promise.as();
            }
        }
    )
    .then(
        function(){
            console.log("completed after userHousework saving. ");
        },
        function(error){
            console.error(error);
        }
    )
});