var g = require('cloud/api/globals.js');
// functions 
var PUSH                    = g.PUSH;
var findUserInfo            = g.findUserInfo;
var findUserPartnerShip     = g.findUserPartnerShip;
var findUserScheduledTask   = g.findUserScheduledTask;
var ApiBase = require('cloud/api/api_base.js');
/**
 * ユーザの家事情報を保存する
 * 1日分
 */
var main = function(){
    var self = this;
    var promise = new Parse.Promise();
    var userId         = parseInt(self.request.params.userId);
    var targetDate     = self.request.params.targetDate;
    var tasks     = self.request.params.tasks;
    findUserInfo(userId)
    .then(
        function(userInfo){
            return findUserScheduledTask(userId, targetDate);
        }
    )
    .then(
        function(scheduledTask){
            // insert
            if (!scheduledTask){
                var ScheduledTask = Parse.Object.extend("ScheduledTask");
                scheduledTask = new ScheduledTask();
                scheduledTask.set("userId", userId);
                scheduledTask.set("targetDate", new Date(targetDate));
            }
            scheduledTask.set("tasks", tasks);
            return scheduledTask.save();
        }
    )
    .then(
        function(scheduledTask){
            self.result.userScheduledTask = scheduledTask;
            promise.resolve();
        },
        function(error){
            self.apiStatus = -1;
            promise.reject(error);
        }
    )
    return promise;
}
Parse.Cloud.define("save_scheduled_task_of_a_day", function(request, response) {
    var api = new ApiBase({
        request : request, 
        response : response,
        main : main
    });
    api.execute();
});

