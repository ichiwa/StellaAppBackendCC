/**
 * Api Base
 */
var ApiBase = function(params){
    this.request = params.request;
    this.response = params.response;
    this.result  = {};
    this.apiStatus  = 0;
    // It's to return the Promise Object
    this.main = params.main || 
        function(){ console.log("there's no Main function."); return Parse.Promise.as(); }
}

/**
 * 本処理
 */
ApiBase.prototype.execute = function(){
    var promise = new Parse.Promise();
    var self = this;
    this
    .main.apply(this)
    .then(
        function(){
            self.finish();
            promise.resolve();
        },
        function(e){
            self.error(e);
            promise.reject(e);
        }
    );
    return promise;
}

/**
 * 正常レスポンス
 */
ApiBase.prototype.finish = function(){
    this.result.apiStatus = this.apiStatus;
    this.response.success(this.result);
}

/**
 * 異常レスポンス
 */
ApiBase.prototype.error = function(error){
    this.response.error({
        apiStatus : this.apiStatus,
        error : error
    });
}

module.exports = ApiBase;

