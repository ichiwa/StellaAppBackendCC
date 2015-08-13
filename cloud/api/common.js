/**
 * 対象のUserIdにプッシュ通知を送る
 * @param userId
 * @param message
 */
Parse.Cloud.define("sendPushNotification", function(request, response) {
    var query = new Parse.Query("UserInfo");
    // user id 
    query.equalTo('userId', parseInt(request.params.userId));
    query
    .first()
    .then(
        function(userInfo) {
            if (userInfo) {
                return Parse.Promise.as(userInfo);
            } else {
                // fail
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
                    alert : request.params.message
                }
            });
        }
    )
    .then(
        function(){
            response.success("sendPushNotification completed.");
        },
        function(error){
            response.error(error.message);
        }
    );
})