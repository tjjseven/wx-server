var express = require('express');
var crypto = require('crypto'),  //引入加密模块
    config = require('../config');//引入配置文件
    axios = require('axios')
    util = require('../lib/utils');//引入配置文件
var path = require('path')
var token_file = path.join(__dirname, '../wechat/token.txt')
var ticket_file = path.join(__dirname, '../wechat/ticket.txt')
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendfile('./views/index.html');

    // 读取token
    util.readFileAsync(token_file).then(function (data) {
        console.log('t:' + data)
        // 根据access_token设置公众号测试号的自定义菜单
        var url_menu = config.wechat.urlPrefix + 'menu/create?access_token='+ data;
        var menu =  {
            "button":[
                {
                    "name":"菜单",
                    "sub_button":[  //二级菜单
                        {
                            "type":"view",
                            "name":"测试",
                            // "url":"http://127.0.0.1:8080/mobile/wechat/home.html"
                            "url":"http://tang.ngrok.xiaomiqiu.cn"
                        },
                        {
                            "type":"click",
                            "name":"赞一下",
                            "key":"V1001_GOOD"
                        }
                    ]
                },
                {
                    "type":"view",  //view表示跳转
                    "name":"tseven",
                    "url":"http://www.tseven.top"
                },
                {
                    "type":"click",   //表示事件
                    "name":"关于",
                    "key":"clickEvent"   //事件的key可自定义,微信服务器会发送到指定的服务器用于识别事件做出相应回应
                }
            ]
        }

        // 创建菜单,发送http请求
        axios.post(url_menu, menu, {
            headers:{
                'content-type':'application/x-www-form-urlencoded'
            }
        }).then(function(dt){
            console.log( '创建菜单请求已发出' , dt.data )
        }).catch(function () {
            console.log('创建失败')
        })
    })
    // next()
});


router.get('/user', function (req, res, next) {
    // var signature = req.query.signature,//微信加密签名
    //     timestamp = req.query.timestamp,//时间戳
    //     nonce = req.query.nonce;//随机数
    console.log('签名1：'+ req.session.arg)

    // res.sendfile('./public/user.html');
    // 获取关注用户openID
    function getOpenID() {
        util.readFileAsync(token_file).then(function (ACCESS_TOKEN) {
            // console.log('已保存:' + ACCESS_TOKEN)
            var url = config.wechat.urlPrefix + 'user/get?access_token=' + ACCESS_TOKEN + '&next_openid';
            axios.get(url).then(function (data) {
                // console.log(data.data)
                console.log('用户OpenID' + data.data.data.openid)
            }).catch(function (err) {

            })
        })
    }
    // getOpenID()

    // 获取jsapi_ticket jsapi_ticket是公众号用于调用微信JS接口的临时票据 生成JS-SDK权限验证的签名
    var ticket_timer = ''
    function getJsapiTicket() {
        return new Promise(function (resolve, reject) {
            util.readFileAsync(token_file).then(function (ACCESS_TOKEN) {
                console.log('已保存:' + ACCESS_TOKEN)
                var url = config.wechat.urlPrefix + 'ticket/getticket'
                url = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + ACCESS_TOKEN + '&type=jsapi'
                axios.get(url).then(function (data) {
                    // res.send(JSON.stringify(data.data))
                    // console.log(data.data)
                    ticket_timer = new Date().getTime() + (data.data.expires_in - 20) * 1000;
                    console.log('用户JsapiTicket：' + data.data.ticket)
                    resolve(data.data)
                }).catch(function (err) {
                    reject(err)
                    // res.send(JSON.stringify(err))
                })
            })

        })
    }
    // getJsapiTicket()
    if(!util.isValidAccessToken(ticket_timer)){
        console.log('ticket过期')
        // getJsapiTicket().then(function (result) {
        //     console.log('t重新获取'+ result)
        //     util.writeFileAsync(ticket_file, result.ticket)
        //
        // })
        var ticket = 'LIKLckvwlJT9cWIhEQTwfGHmKmtXaiuED5_BltrZZYN6Fye2xSicl73RxJ2e5eEp4ybZeEwyjIL6iwtEjw2PNg';

    }else{
        console.log('ticket未过期')
    }

    var obj = {
        // signature: '', // '微信加密签名',
        timestamp: Math.floor((new Date().getTime())/1000) || '时间戳',
        nonceStr: 'tseven9527str' || '随机字符串',
        // openID: data.data,
        appID: config.wechat.appID
    },
    string ='jsapi_ticket='+ ticket+ '&' +
        'noncestr='+ obj.nonceStr + '&' +
        'timestamp='+ obj.timestamp + '&' +
        // 'url=http://127.0.0.1/user.html';
        'url=http://tang.ngrok.xiaomiqiu.cn/user.html';
    const hashCode = crypto.createHash('sha1'); //创建加密类型
    obj.signature  = hashCode.update(string,'utf8').digest('hex'); //对传入的字符串进行加密

    res.send(obj)
})
// 安装  supervisor 热加载
// 运行  supervisor bin/www


module.exports = router;
