var ApiBase = require('cloud/api/api_base.js');
var g = require('cloud/api/globals.js');
var findUserInfo = g.findUserInfo;
var findUseWishItem = g.findUseWishItem;
var ITEM_STATUS = g.ITEM_STATUS;

/**
 * User wish Item 周りは全てここを呼ぶ
 */
var main = function(){
    var self = this;
    var promise = new Parse.Promise();
    var userId       = parseInt(self.request.params.userId);
    var itemTItle    = self.request.params.itemTitle;
    var itemUrl      = self.request.params.itemUrl;
    var itemImageUrl = self.request.params.itemImageUrl;
    var itemCode     = self.request.params.itemCode;
    var itemPrice    = self.request.params.itemPrice;
    var itemStatus   = self.request.params.itemStatus;
    var UserWishItem = Parse.Object.extend("UserWishItem");
    var myUserInfo;
    findUserInfo(userId) // ユーザの検索
    .then(
        function(userInfo){
            myUserInfo = userInfo;
            // 存在確認
            return findUseWishItem(userId, itemCode);
        }
    )
    .then(
        function(userWishItem){
            // なければ新規作成
            if (!userWishItem){
                userWishItem = new UserWishItem();
            }
            userWishItem.set('userId', userId);
            userWishItem.set('itemUrl', itemUrl);
            userWishItem.set('itemTitle', itemTItle);
            userWishItem.set('itemImageUrl', itemImageUrl);
            userWishItem.set('itemCode', itemCode);
            userWishItem.set('itemPrice', itemPrice);
            userWishItem.set('itemStatus', itemStatus);
            return userWishItem.save();
        }
    )
    .then(
        function(userWishItem){
            self.result.userWishItem = userWishItem;
            promise.resolve();
        },
        function(error){
            self.apiStatus = -1;
            promise.reject(error);
        }
    )
    return promise;
}

Parse.Cloud.define("update_user_wish_item", function(request, response) {
    var api = new ApiBase({
        request : request,
        response : response,
        main : main
    });
    api.execute();
});
