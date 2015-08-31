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
 * 対象の日付のuserhouseworkを取得する
 * @param userId
 * @param targetDate
 */
exports.findUserHousework = function(userId, targetDate){
    var promise = new Parse.Promise();
    var query = new Parse.Query("UserHousework");
    query.equalTo('userId', parseInt(userId));
    query.equalTo('targetDate', new Date(targetDate));
    query.first()
    .then(
        function(userHousework){
            console.log(userHousework);
            promise.resolve(userHousework);
        },
        function(error){
            promise.reject(error);
        }
    )
    return promise;
}


/**
 * 対象のUserIdにプッシュ通知を送る
 * @param {object} it contains userId, message, command, params and pushType.
 */
exports.sendPushNotification = function(data){
    var promise = new Parse.Promise();
    var query   = new Parse.Query("UserInfo");
    var userId  = data.userId;
    var message = data.message;
    var command = data.command;
    var params  = data.params;
    var pushType = data.pushType;
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
                    pushType     : pushType,
                    alert        : message, 
                    command      : command,
                    params       : params
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
    var query2   = new Parse.Query("UserPartnerShip");
    query1.equalTo("userId", userId);
    query2.equalTo("partnerId", userId);
    // パートナーidあれば
    if (partnerId){
        query1.equalTo("partnerId", partnerId);
        query2.equalTo("userId", partnerId);
    }
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

/**
 * 9桁のユーザIDを作成する、失敗した場合は再帰する
 * Warning:タイムアウトすることがある(Parse.com)
 * @param promise 
 */
exports.createUserId = function(promise) {
    var promise = promise || new Parse.Promise();
    // よくあるユーザID 0 ~ 999,999,999 
    var userId = Math.floor(Math.random() * 999999999);
    var query = new Parse.Query("UserInfo");
    query.equalTo("userId", userId);
    query
    .first()
    .then(
        function(userInfo) {
            if (userInfo) {
                // 既に存在するuserIdなら再帰する
                return createUserId(promise);
            }
            else {
                promise.resolve(userId);
            }
        },
        function(error) {
            promise.error(error);
        }
    )
    return promise;
}
/**
 * PUSH のタイプ
 */
exports.PUSH = {
    NORMAL : 0,
    DIALOG : 1,
    DIALOG_AND_UPDATE : 2,
    UPDATE : 3
}
