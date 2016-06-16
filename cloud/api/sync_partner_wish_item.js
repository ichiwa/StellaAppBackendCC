var ApiBase = require('./api_base.js');
var g = require('./globals.js');
var findUserInfo            = g.findUserInfo;
var findUserPartnerShip     = g.findUserPartnerShip;
var findUserHousework       = g.findUserHousework;
var findUserWishItem        = g.findUserWishItem;
/**
 * パートナーのほしいものリストを返す
 */
var main = function(){
    var self = this;
    var promise = new Parse.Promise();
    var userId  = parseInt(self.request.params.userId);
    var partnerId  = parseInt(self.request.params.partnerId);
    var partnerUserInfo;
    findUserInfo(userId)
    .then(
        function(userInfo){
            return findUserInfo(partnerId);
        }
    )
    .then(
        function(userInfo){
            partnerUserInfo = userInfo;
            return findUserPartnerShip(userId, partnerId);
        }
    )
    .then(
        function(userPartnerShip){
            if (userPartnerShip){
                return findUserWishItem(partnerId);
            } else {
                var error = new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, "PartnerShip not found.");
                return Parse.Promise.error(error);
            }
        }
    )
    .then(
        function(result){
            self.result.partnerUserInfo   = partnerUserInfo;
            self.result.userWishItemArray = result;
            promise.resolve();
        },
        function(error){
            self.apiStatus = -1;
            promise.reject(error);
        }
    )
    
    return promise;
}
Parse.Cloud.define("sync_partner_wish_item", function(request, response) {
    var api = new ApiBase({
        request : request,
        response : response,
        main : main
    });
    api.execute();
});


