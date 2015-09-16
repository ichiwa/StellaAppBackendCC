var g = require('cloud/api/globals.js');
//var moment = require('cloud/libs/moment.js');
var PUSH                    = g.PUSH;
var findUserPartnerShip     = g.findUserPartnerShip;
var sendPushNotification    = g.sendPushNotification;
/**
 * ScheduledTask が保存されたあとに呼ばれる
 * @param request
 */
Parse.Cloud.afterSave("ScheduledTask", function(request) {
    // 保存されたObjectを取得
    var scheduledTask = request.object;
    var userId        = scheduledTask.get("userId");
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
                    "message" : "after save ScheduledTask event",
                    "command" : "update_partner_task",
                    "pushType": PUSH.UPDATE,
                    "params"  : {
                        "partnerId" : userId,
                        "tasks": scheduledTask.get("tasks"),
                        "targetDate": scheduledTask.get("targetDate")
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
            console.log("completed after scheduledTask saving. ");
        },
        function(error){
            console.error(error);
        }
    )
});