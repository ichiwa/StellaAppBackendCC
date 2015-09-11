var g = require('cloud/api/globals.js');
var PUSH                    = g.PUSH;
var findUserPartnerShip     = g.findUserPartnerShip;
var sendPushNotification    = g.sendPushNotification;

/**
 * UserWishItem が保存されたあとに呼ばれる
 * @param request
 */
Parse.Cloud.afterSave("UserWishItem", function(request) {
    // 保存されたObjectを取得
    var userWishItem = request.object;
    var userId       = userWishItem.get("userId");
    findUserPartnerShip(userId)
    .then(
        function(userPartnerShip){
            // パートナーにデータ更新通知をする
            if (userPartnerShip){
                // push 
                var data = {
                    "userId"  : userWishItem.get('userId'),
                    "message" : "after save userWishItem event",
                    "command" : "update_user_wish_item",
                    "pushType": PUSH.UPDATE,
                    "params"  : {
                        "partnerId"     : userId,
                        "itemCode"      : userWishItem.get('itemCode'),
                        "itemTitle"     : userWishItem.get('itemTitle'),
                        "itemUrl"       : userWishItem.get('itemUrl'),
                        "itemPrice"     : userWishItem.get('itemPrice'),
                        "itemImageUrl"  : userWishItem.get('itemImageUrl'),
                        "itemStatus"    : userWishItem.get('itemStatus')
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
            console.log("completed after userWishItem saving ");
        },
        function(error){
            console.error(error);
        }
    )
});