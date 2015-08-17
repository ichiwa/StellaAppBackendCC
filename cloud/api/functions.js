/**
 * 対象のユーザを取得する
 * @param userId 
*/
exports.findUserInfo = function(userId) {
    var promise = new Parse.Promise();
    var query = new Parse.Query("UserInfo");
    query.equalTo('userId', parseInt(userId));
    query
    .first()
    .then(
        function(userInfo){
            if (userInfo){
                promise.resolve(userInfo);
            } else {
                var error = new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, "User not found.");
                promise.reject(error);
            }
        },
        function(error){
            promise.reject(error);
        }
    )
    return promise;
}

/**
 * 対象のUserIdにプッシュ通知を送る
 * @param userId
 * @param title
 * @param message
 */
exports.sendPushNotification = function(userId, title, message){
    var promise = new Parse.Promise();
    var query   = new Parse.Query("UserInfo");
    // user id 
    query.equalTo('userId', parseInt(userId));
    query
    .first()
    .then(
        function(userInfo) {
            // success
            if (userInfo) {
                return Parse.Promise.as(userInfo);
            // error
            } else {
                var error = new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, "User not found.");
                return Parse.Promise.error(error);
            }
        }
    )
    .then(
        function(userInfo){
            var pushQuery = new Parse.Query(Parse.Installation);
            pushQuery.equalTo("installationId", userInfo.get("installationId"));
            return Parse.Push.send({
                where: pushQuery, 
                data : {
                    title   : title,
                    message : message 
                }
            });
        }
    )
    .then(
        function(){
            promise.resolve();
        },
        function(error){
            promise.reject(error);
        }
    );
    return promise;
}

/**
 * 既に関係が存在するか
 * @param userId
 * @param partnerId
 */
exports.findUserPartnerShip = function(userId, partnerId){
    var promise = new Parse.Promise();
    var query1   = new Parse.Query("UserPartnerShip");
    query1.equalTo("userId", userId);
    query1.equalTo("partnerId", partnerId);
    var query2   = new Parse.Query("UserPartnerShip");
    query2.equalTo("userId", partnerId);
    query2.equalTo("partnerId", userId);
    // OR
    var multipleQuery = Parse.Query.or(query1, query2);
    multipleQuery
    .first()
    .then(
        function(userPartnerShip){
            promise.resolve(userPartnerShip);
        },
        function(error){
            promise.reject(error); 
        }
    )
    return promise;
}