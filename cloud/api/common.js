/**
 * 対象のinstallationIdにプッシュ通知を送る
 * @param installationId
 * @param message
 */
Parse.Cloud.define("sendPushNotification", function(request, response) {
    var pushQuery = new Parse.Query(Parse.Installation);
    pushQuery.equalTo('deviceType', 'android');
    pushQuery.equalTo('installationId', request.params.installationId);
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