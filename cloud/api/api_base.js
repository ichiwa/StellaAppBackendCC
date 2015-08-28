/**
 * Api Base
 */
var ApiBase = function(params){
    this.request = params.request;
    this.response = params.response;
    this.result  = {};
    this.apiStatus  = 0;
    this._run = params.run || 
        function(){ console.log("there's no Run function."); return Parse.Promise.as(); }
}

/**
 * 本処理
 */
ApiBase.prototype.run = function(){
    var promise = new Parse.Promise();
    var self = this;
    this
    ._run()
    .then(
        function(){
            self.finish();
        },
        function(e){
            self.error(e);
        }
    );
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

