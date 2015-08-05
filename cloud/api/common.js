/**
 * 対象のUserIdにプッシュ通知を送る
 * @param userId
 * @param message
 */
Parse.Cloud.define("sendPushNotification", function(request, response) {
    var query     = new Parse.Query("UserInfo");
    query.equalTo('userId', request.params.userId);
    var pushQuery = new Parse.Query(Parse.Installation);
    //pushQuery.equalTo('deviceType', 'android');
    pushQuery.matchesQuery('UserInfo', query);
    Parse.Push.send(
        {
            where: pushQuery, 
            data: {
                alert: request.params.message
            }
        }, 
        {
            success: function() {
                response.success();
            },
            error: function(error) {
                response.error(error);
            }
        }
    );
});