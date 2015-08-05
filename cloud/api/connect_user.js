/**
 * ユーザ同士を繋げて
 * 接続先ユーザにプッシュ通知をおくる
 * @param request
 * @param response
 */
Parse.Cloud.define("connect_user", function(request, response) {
    var userId         = request.params.userId;
    var partnerId      = request.params.partnerId;
    var installationId = request.params.installationId;
    var message        = 'パートナーとつながりました';
    
    Parse.Cloud.run('sendPushNotification', { 
        userId : partnerId, 
        message : message 
    }, {
        success: function() {
            response.success(
                {
                    status:0
                }
            );
        },
        error: function(error) {
            response.error(
                {
                    status:1, 
                    error:error
                }
            );
        }
    });
});

