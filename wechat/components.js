// 微信服务器验证
var crypto = require('crypto'); //引入加密模块
var config = require('../config'); //引入配置文件
var xml2js = require('xml2js');
module.exports = function () {
    // console.log(123)
    return function (req, res, next) {
        //1.获取微信服务器Get请求的参数 signature、timestamp、nonce、echostr
        var signature = req.query.signature,//微信加密签名
            timestamp = req.query.timestamp,//时间戳
            nonce = req.query.nonce,//随机数
            echostr = req.query.echostr;//随机字符串
        console.log('验证签名')
        // req.session.arg = 1
        // console.log(req.session.signature)
        // console.log(req.session)

        //2.将token、timestamp、nonce三个参数进行字典序排序
        var array = [config.wechat.token,timestamp,nonce];
        array.sort();
        // console.log(array)

        //3.将三个参数字符串拼接成一个字符串进行sha1加密
        var tempStr = array.join('');
        const hashCode = crypto.createHash('sha1'); //创建加密类型
        // console.log(hashCode)
        var resultCode = hashCode.update(tempStr,'utf8').digest('hex'); //对传入的字符串进行加密
        // console.log('加密:' + resultCode)

        //4.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
        if(resultCode === signature){
            console.log('连接')
            // res.send(echostr);
        }else{
            console.log('未连接')
            // res.send('mismatch')
        }

















        next()
    }
}