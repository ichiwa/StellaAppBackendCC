var g = require('./../api/globals.js');
var PUSH                    = g.PUSH;
var findUserPartnerShip     = g.findUserPartnerShip;
var sendPushNotification    = g.sendPushNotification;

Parse.Cloud.afterSave("Task", function(request) {
    // 保存されたObjectを取得
    var task = request.object;
    var userId       = task.get("userId");
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
                // push 
                var data = {
                    "userId"  : targetUserId,
                    "message" : "after save task event",
                    "command" : "update_task",
                    "pushType": PUSH.UPDATE,
                    "params"  : {
                        "task" : task
                    }
                }
                return sendPushNotification(data);
            } else {
                // 何もしない
                return Parse.Promise.as();
            }
        }
    )
    .then(
        function(){
            console.log("completed after Task saving ");
        },
        function(error){
            console.error(error);
        }
    )
    

});