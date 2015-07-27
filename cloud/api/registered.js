
Parse.Cloud.beforeSave(Parse.User, function(request, response) {
    var user = request.object;
    createUserId(request, function(error){
        if (error){
            response.error("Error createUserId に失敗しました");
        } else {
            response.success();
        }
    });
});

function createUserId(request, callback){
    // よくある0~999,999,999のIDを作成する
    var userId = Math.floor(Math.random()*999999999); 
    var query = new Parse.Query(Parse.User);
    query.equalTo("userId", userId);
    query.find({
        success: function(user) {
            // 既に存在するUserId
            if (user){
                // 再帰
                // ※再帰が連続するとタイムアウトする可能性あり
                // 実践値として４０回(3秒)
                createUserId(request, callback);
            }
            // 成功
            request.object.set('userId', userId);
            callback();
        },
        error: function(error) {
            // 異常
            callback(error);
        }
    });
}
