'use strict'
var sha1 = require('sha1');
var Promise = require('bluebird');//导入这个模块来调用Promise，来实现数据继续往下传
var request = Promise.promisify(require('request'));//因为我们用到了Promise，所以在调用request的时候需要这样导入
var prefix = 'https://api.weixin.qq.com/cgi-bin/';//因为这一部分API是固定的，所以我们单独拿出来
var api = {
    accessToken:prefix+'token?grant_type=client_credential'
}
function Wechat(opts) { //这里面的值就是从中间件传过来的
    var that = this;
    this.appID = opts.appID;
    this.appSecret = opts.appSecret;
    this.getAccessToken = opts.getAccessToken;
    this.saveAccessToken = opts.saveAccessToken;
    //按照上面我们讲的逻辑来实现getAccessToken
    this.getAccessToken()
        .then(function (data) {
            try {
                data = JOSN.parse(data);
            }
            catch(e) {
                return that.updateAccessToken();
            }
            if (that.isValidAccessToken(data)) {
                Promise.resolve(data);
            }
            else {
                return that.updateAccessToken();
            }
        })
        .then(function (data) {
            that.access_token = data.access_token;
            that.expires_in = data.expires_in;
            that.saveAccessToken(data);
        })
}
//为这个对象添加我们需要的函数
Wechat.prototype.isValidAccessToken = function (data) {
    if (!data || !data.access_token || !data.expires_in) {
        return false;
    }
    var access_token = data.access_token;
    var expires_in = data.expires_in;
    var now = (new Date().getTime())

    if (now < expires_in) {
        return true;
    }else {
        return false;
    }
}
Wechat.prototype.updateAccessToken = function () {
    var appID = this.appID;
    var appSecret = this.appSecret;
    var url = api.accessToken + '&appid=' + appID + '&secret=' + appSecret;
    return new Promise(function (resolve, reject) {
        request({url: url, json: true}, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var data = body;
                var now = (new Date().getTime());
                var expires_in = now + (data.expires_in - 20) * 1000;
                data.expires_in = expires_in;
                resolve(data);
                console.log(data);
            } else {
                reject()
            }
        });
    })
}
module.exports = function (opts) {
    var wechat = new Wechat(opts);//我们实例化一下Wechat，就可以在中间件中直接调用了
    return function *(next) {
        console.log(this.query)
        var token = opts.token;
        var signature = this.query.signature;
        var nonce = this.query.nonce;
        var timestamp = this.query.timestamp;
        var echostr = this.query.echostr;
        var str = [token, timestamp, nonce].sort().join('');
        var sha = sha1(str);
        if (sha === signature) {
            this.body = echostr + '';
        }
        else {
            this.body = 'wrong';
        }
    }
}