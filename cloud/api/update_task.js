var ApiBase = require('./api_base.js');
var g = require('./globals.js');
var findUserInfo            = g.findUserInfo;
var findTask                = g.findTask;
var findUserPartnerShip     = g.findUserPartnerShip;

var main = function(){
    var self = this;
    var promise = new Parse.Promise();
    var params = self.request.params;
    var userId  = parseInt(params.userId);
    var updatedTask = {};
    updatedTask.id          = parseInt(params.task_id);
    updatedTask.name        = params.task_name;
    updatedTask.image       = params.task_image;
    updatedTask.completed_task = params.task_completed_image;
    updatedTask.can_delete  = parseInt(params.task_can_delete);
    updatedTask.status      = parseInt(params.task_status);
    updatedTask.created_at  = params.task_created_at;
    updatedTask.updated_at  = params.task_updated_at;
    findUserInfo(userId)
    .then(
        function(userInfo){
            return findTask(userId, updatedTask.id);
        }
    )
    .then(
        function(task){
            // なければ作る
            if (!task){
                var Task = Parse.Object.extend("Task");
                var task = new Task();
            }
            task.set('userId', userId);
            task.set('task_id', updatedTask.id);
            task.set('task_name', updatedTask.name);
            task.set('task_image', updatedTask.image);
            task.set('task_completed_image', updatedTask.completed_task);
            task.set('task_can_delete', updatedTask.can_delete);
            task.set('task_status', updatedTask.status);
            task.set('task_created_at', updatedTask.created_at);
            task.set('task_updated_at', updatedTask.updated_at);
            return task.save();
        }
    )
    .then(
        function(){
            promise.resolve();
        },
        function(error){
            self.apiStatus = -1;
            promise.reject(error);
        }
    )
    return promise;
}

Parse.Cloud.define("update_task", function(request, response) {
    var api = new ApiBase({
        request : request,
        response : response,
        main : main
    });
    api.execute();
});


