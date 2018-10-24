var crypto = require('crypto'),  //引入加密模块
    config = require('../config'),//引入配置文件
    util = require('../lib/utils'),//引入
    path = require('path'),
    token_file = path.join(__dirname, './token.txt');
var session = require('express-session');
module.exports = function () {
    console.log('中间件')
    var token_timer = ''
    // 根据appID 和 appSecret 获取开发者token
    function getToken() {
        return new Promise (function (resolve, reject){
            // 获取access_token
            var url = config.wechat.urlPrefix + 'token';
            axios.get(url, {
                params:{
                    grant_type:'client_credential',
                    appid:config.wechat.appID,
                    secret:config.wechat.appSecret
                }
            }).then(function (userinfo) {
                // var access_token = userinfo.data.access_token ;
                var now = new Date().getTime();
                token_timer = now + (userinfo.data.expires_in - 20) * 1000;
                // localStorage.setItem('token_timer', exp)
                // userinfo.data.expires_in = exp;
                console.log('actoken:' + userinfo.data.access_token)
                resolve(userinfo.data)
            }).catch(function (err) {
                reject(err)
            })
        })
    }



    // 用户向公众号发送消息时，公众号方收到的消息发送者是一个OpenID，是使用用户微信号加密后的结果，每个用户对每个公众号有一个唯一的OpenID

    return function (req, res, next) {
        // req.session.token_timer = token_timer
        // console.log('存储'+ req.session.token_timer)

        if(!util.isValidAccessToken(token_timer)){
            console.log('token过期')
            // getToken().then(function (result) {
            //     console.log('重新获取'+ result.access_token)
            //     // window.localStorage.setItem('token', result.access_token)
            //     util.writeFileAsync(token_file, result.access_token)
            // })
// var tokenText = '14_81B1kZt7ns3YrgXGiZIUIrD03XLVK-gGB8QZ72DOl5PfRr00KHIDY4jnXrNteGc0rjsg60OHqDHXpALWCEkIcfo9pHINkXkVvh81LQXsieEFP1Xw4e2C7gZ9_BpNxktCkXJYrrlU181S2m-_SYFfACAOUB'
        }else{
            console.log('token未过期')
        }

        //1.获取微信服务器Get请求的参数 signature、timestamp、nonce、echostr
         var signature = req.query.signature,//微信加密签名
             timestamp = req.query.timestamp,//时间戳
             nonce = req.query.nonce,//随机数
             echostr = req.query.echostr;//随机字符串
        console.log('签名：'+ signature)
        req.session.arg = 1



         // console.log(req.session.signature)
         console.log(req.session)
         //2.将token、timestamp、nonce三个参数进行字典序排序
         var array = [config.wechat.token,timestamp,nonce];
         array.sort();
         console.log(array)
         //3.将三个参数字符串拼接成一个字符串进行sha1加密
         var tempStr = array.join('');
         const hashCode = crypto.createHash('sha1'); //创建加密类型
         // console.log(hashCode)
         var resultCode = hashCode.update(tempStr,'utf8').digest('hex'); //对传入的字符串进行加密
         // console.log('加密:' + resultCode)

         //4.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
         if(resultCode === signature){
             res.send(echostr);
             console.log('连接')
         }else{
             // res.send('mismatch')
             // res.sendfile('./views/index.html');
             console.log('未连接')
         }
         next()
    }
}