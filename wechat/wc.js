var crypto = require('crypto'),  //引入加密模块
    config = require('../config'), //引入配置文件
    util = require('../lib/utils'), //引入
    path = require('path'),
    axios = require('axios'),
    token_file = path.join(__dirname, './token.json'),
    token_json = require('./token');
    // session = require('express-session');
    // console.log('中间件加载')
    var Wechat = function () {

    }
    // 根据appID 和 appSecret 获取开发者token
    Wechat.prototype.getToken = function () {
        return new Promise (function (resolve, reject){
            // 获取access_token
            var currentTime = new Date().getTime(),//50
                url = config.wechat.urlPrefix + 'token';
            // console.log(JSON.stringify(token_json) === '{}' || token_json.access_token === '' || token_json.expires_in < currentTime)
            if(JSON.stringify(token_json) === '{}' || token_json.access_token === '' || token_json.expires_in < currentTime){
                axios.get(url, {
                    params:{
                        grant_type:'client_credential',
                        appid:config.wechat.appID,
                        secret:config.wechat.appSecret
                    }
                }).then(function (result) {
                    token_json.expires_in = new Date().getTime() + (result.data.expires_in - 20) * 1000; // 200
                    token_json.access_token = result.data.access_token ;
                    // console.log(token_json)
                    util.writeFileAsync(token_file, JSON.stringify(token_json))
                    console.log('token过期')
                    resolve(token_json.access_token)
                }).catch(function (err) {
                    reject(err)
                })
            }else{
                console.log('token已保存')
                resolve(token_json.access_token)
            }

        })
    }

    Wechat.prototype.verify = function (req, res, next) {

    }


// 用户向公众号发送消息时，公众号方收到的消息发送者是一个OpenID，是使用用户微信号加密后的结果，每个用户对每个公众号有一个唯一的OpenID
module.exports = Wechat