var g = require('cloud/api/globals.js');
// functions 
var findUserInfo = g.findUserInfo;
var findUserPartnerShip = g.findUserPartnerShip;
var sendPushNotification = g.sendPushNotification;
var ApiBase = require('cloud/api/api_base.js');

/**
 * ユーザ同士の接続を解除する
 * @param request
 * @param response
 */
Parse.Cloud.define("disconnect_partner", function(request, response) {
    var api = new ApiBase({
        request : request, 
        response : response,
        run : function(){
            var self           = this;
            var promise        = new Parse.Promise();
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
                    promise.resolve();
                },
                function(error){
                    self.apiStatus = -1;
                    promise.reject(error);
                }
            );
            return promise;
        }
    });
    api.run();
});