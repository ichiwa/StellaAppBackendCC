var UserInfo = Parse.Object.extend("UserInfo");
var UserHouseWork = Parse.Object.extend("UserHouseWork");

Parse.Cloud.define("add_user", function(request, response) {
    console.log("called add_user");
    createUserId()
    .then(
        function(userId) {
            var user = new UserInfo();
            user.set("userId", userId);
            user.set("userName", "Anonymous User");
            return user.save();
        }
    )
    .then(
        function(userInfo) {
            response.success(userInfo);
        },
        function() {
            response.error("error");
        }
    )
})

function createUserId(promise) {
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
                promise.error();
            }
        )
    return promise;
}