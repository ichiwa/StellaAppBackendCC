var UserInfo = Parse.Object.extend("UserInfo");

/**
 * ユーザ同士を繋げて
 * 接続先ユーザにpush通知をおくる
 * @param request
 * @param response
 */
Parse.Cloud.define("connect_user", function(request, response) {
    console.log(request.params.userId);
    response.success("test");
});