var express = require('express');
var crypto = require('crypto'),  //引入加密模块
    config = require('../config'),//引入配置文件
    axios = require('axios'),
    Wechat = require('../wechat/wc');
var wechat = new Wechat(),
    util = require('../lib/utils'),//引入配置文件
    xml2js = require('xml2js'),
    path = require('path'),
    ticket_json = require('../wechat/ticket'),
    ticket_file = path.join(__dirname, '../wechat/ticket.json'),
    token_json = require('../wechat/token'),
    msg = require('../wechat/msg'),//引入消息处理模块
    CryptoGraphy = require('../wechat/cryptoGraphy'); //微信消息加解密模块
module.exports = function (router) {
    router.get('/', function(req, res, next) {
        // 加载首页
        res.sendfile('./views/index.html');

        // 1 根据access_token设置公众号测试号的自定义菜单
        function setMenu() {
            var url_menu = config.wechat.urlPrefix + 'menu/create?access_token='+ token_json.access_token;
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
        }
        // setMenu()
    });

    router.post('/', function (req, res) {
        // 2 发送信息
        function sendMsg(req, res) {
            var xml = '';
            // var json = null
            req.on('data',(chunk)=>{
                xml += chunk
                // console.log(xml)
            })
            req.on('end',()=>{
                //将接受到的xml数据转化为json
                xml2js.parseString(xml,  {explicitArray : false}, function(err, json) {

                    var backTime = new Date().getTime();  //创建发送时间，整数
                    console.log(json.xml)
                    if (json.xml.MsgType === 'event') {  //*****************消息为事件类型

                        if (json.xml.EventKey === 'clickEvent') {
                            return res.send(getXml(json, backTime, '你戳我干啥...'))  //回复用户的消息
                        }

                    } else if (json.xml.MsgType === 'text') {  //****************消息为文字类型

                        return res.send(getXml(json, backTime, `你发"${json.xml.Content}"过来干啥？`))  //回复用户的消息
                        // res.send(121)  //回复用户的消息
                    }

                })
            });


            function getXml(json , backTime , word ) {
                var backXML = `
                        <xml>
                            <ToUserName><![CDATA[${json.xml.FromUserName}]]></ToUserName>
                            <FromUserName><![CDATA[${json.xml.ToUserName}]]></FromUserName>
                            <CreateTime>${backTime}</CreateTime>
                            <MsgType><![CDATA[text]]></MsgType>
                            <Content><![CDATA[${word}]]></Content>
                        </xml>
                    `
                return backXML;
            }
        }
        // sendMsg(req, res)

        var handleMsg = function(req, res){
            var buffer = [],that = this;
            //实例微信消息加解密
            // var cryptoGraphy = new CryptoGraphy(req);
            //监听 data 事件 用于接收数据
            req.on('data',function(data){
                buffer.push(data);
            });
            //监听 end 事件 用于处理接收完成的数据
            req.on('end',function(){
                var msgXml = Buffer.concat(buffer).toString('utf-8');
                //解析xml
                xml2js.parseString(msgXml,{explicitArray : false},function(err,result){
                    // console.log(result)
                    if(!err){
                        result = result.xml;
                        //判断消息加解密方式
                        if(req.query.encrypt_type === 'aes'){
                            //对加密数据解密
                            result = cryptoGraphy.decryptMsg(result.Encrypt);
                        }
                        var toUser = result.ToUserName; //接收方微信
                        var fromUser = result.FromUserName;//发送仿微信
                        var reportMsg = ""; //声明回复消息的变量

                        //判断消息类型
                        if(result.MsgType.toLowerCase() === "event"){
                            //判断事件类型
                            switch(result.Event.toLowerCase()){
                                case 'subscribe':
                                    //回复消息
                                    var content = "欢迎关注 tseven 公众号，回复以下数字：\n";
                                    content += "1.你是谁\n";
                                    content += "2.关于Node.js\n";
                                    content += "3.\n";
                                    content += "回复 “文章”  可以得到图文推送哦~\n";
                                    reportMsg = msg.txtMsg(fromUser,toUser,content);
                                    break;
                                case 'click':
                                    var contentArr = [
                                        {Title:"Node.js 微信自定义菜单",Description:"使用Node.js实现自定义微信菜单",PicUrl:"http://img.blog.csdn.net/20170605162832842?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvaHZrQ29kZXI=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast",Url:"http://blog.csdn.net/hvkcoder/article/details/72868520"},
                                        {Title:"Node.js access_token的获取、存储及更新",Description:"Node.js access_token的获取、存储及更新",PicUrl:"http://img.blog.csdn.net/20170528151333883?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvaHZrQ29kZXI=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast",Url:"http://blog.csdn.net/hvkcoder/article/details/72783631"},
                                        {Title:"Node.js 接入微信公众平台开发",Description:"Node.js 接入微信公众平台开发",PicUrl:"http://img.blog.csdn.net/20170605162832842?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvaHZrQ29kZXI=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast",Url:"http://blog.csdn.net/hvkcoder/article/details/72765279"}
                                    ];
                                    //回复图文消息
                                    reportMsg = msg.graphicMsg(fromUser,toUser,contentArr);
                                    break;
                            }
                        }else{
                            //判断消息类型为 文本消息
                            if(result.MsgType.toLowerCase() === "text"){
                                //根据消息内容返回消息信息
                                switch(result.Content){
                                    case '1':
                                        reportMsg = msg.txtMsg(fromUser,toUser,'你猜');
                                        break;
                                    case '2':
                                        reportMsg = msg.txtMsg(fromUser,toUser,'Node.js是一个开放源代码、跨平台的JavaScript语言运行环境，采用Google开发的V8运行代码,使用事件驱动、非阻塞和异步输入输出模型等技术来提高性能，可优化应用程序的传输量和规模。这些技术通常用于数据密集的事实应用程序');
                                        break;
                                    case '3':
                                        var contentText = [
                                            {
                                                Title: '微信公众号开发后台基本搭建', Description: '基于NodeJs的express框架',
                                                PicUrl: '', Url: 'https://blog.csdn.net/kingov/article/details/78343187?locationNum=2&fps=1'
                                            }
                                        ]
                                        reportMsg = msg.graphicMsg(fromUser,toUser,contentText);
                                        break;
                                    case '文章':
                                        var contentArr1 = [
                                            {Title:"Node.js 微信自定义菜单", Description:"使用Node.js实现自定义微信菜单", PicUrl:"http://img.blog.csdn.net/20170605162832842?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvaHZrQ29kZXI=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast", Url:"http://blog.csdn.net/hvkcoder/article/details/72868520"},
                                            {Title:"Node.js access_token的获取、存储及更新",Description:"Node.js access_token的获取、存储及更新",PicUrl:"http://img.blog.csdn.net/20170528151333883?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvaHZrQ29kZXI=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast",Url:"http://blog.csdn.net/hvkcoder/article/details/72783631"},
                                            {Title:"Node.js 接入微信公众平台开发",Description:"Node.js 接入微信公众平台开发",PicUrl:"http://img.blog.csdn.net/20170605162832842?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvaHZrQ29kZXI=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast",Url:"http://blog.csdn.net/hvkcoder/article/details/72765279"}
                                        ];
                                        //回复图文消息
                                        reportMsg = msg.graphicMsg(fromUser,toUser,contentArr1);
                                        break;
                                    default:
                                        reportMsg = msg.txtMsg(fromUser,toUser,'没有这个选项哦');
                                        break;
                                }
                            }
                        }
                        //判断消息加解密方式，如果未加密则使用明文，对明文消息进行加密
                        reportMsg = req.query.encrypt_type === 'aes' ? cryptoGraphy.encryptMsg(reportMsg) : reportMsg ;
                        //返回给微信服务器
                        res.send(reportMsg);

                    }else{
                        //打印错误
                        console.log(err);
                    }
                });
            });
        }

        handleMsg(req, res)
    })


    router.get('/userInfo', function (req, res) {

        function getUserOpenID() {
            // 授权成功之后跳转到dzH5/index.html，携带code. 根据code拿到access_token
            axios.get('https://api.weixin.qq.com/sns/oauth2/access_token',{
                params:{
                    appid: config.wechat.appID,
                    secret: config.wechat.appSecret,
                    code: req.query.code,
                    grant_type: 'authorization_code'
                }
            }).then(function(response){
                // 拿到access_token和openId值
                var access_token = response.data.access_token
                var openId = response.data.openid
                console.log(response.data)

                // 获取用户信息
                axios.get( 'https://api.weixin.qq.com/sns/userinfo' , {
                    params:{
                        access_token:response.data.access_token,
                        openid:response.data.openid,
                        lang:'zh_CN'
                    }
                }).then((userinfo)=>{
                    // userinfo.data.nickname
                    //userinfo.data.sex
                    //userinfo.data.province
                    //userinfo.data.city

                   console.log(userinfo.data)
                    res.send(userinfo.data)
                });

            })
        }
        getUserOpenID()
    })

    router.get('/user', function (req, res, next) {

        // 1 获取关注用户openID
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

        // 2 获取jsapi_ticket jsapi_ticket是公众号用于调用微信JS接口的临时票据 生成JS-SDK权限验证的签名
        function getJsapiTicket() {
            // console.log(123)
            return new Promise(function (resolve, reject) {
                // 获取jsapi_ticket
                var currentTime = new Date().getTime(),//50
                url = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + token_json.access_token + '&type=jsapi';
                if(JSON.stringify(ticket_json) === '{}' || ticket_json.ticket === '' || ticket_json.expires_in < currentTime){
                    axios.get(url).then(function (result) {
                        ticket_json.expires_in = new Date().getTime() + (result.data.expires_in - 20) * 1000; // 200
                        ticket_json.ticket = result.data.ticket ;
                        // console.log(result.data)
                        util.writeFileAsync(ticket_file, JSON.stringify(ticket_json))
                        console.log('ticket过期')
                        resolve(ticket_json.ticket)
                    }).catch(function (err) {
                        reject(err)
                    })
                }else{
                    console.log('ticket已保存')
                    resolve(ticket_json.ticket)
                }
            })
        }

        // 3 发送前台的数据
        getJsapiTicket().then(function (ticket) {
            // console.log(ticket)
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
                    'url=http://tang.ngrok.xiaomiqiu.cn/jssdk.html';
            const hashCode = crypto.createHash('sha1'); //创建加密类型
            obj.signature  = hashCode.update(string,'utf8').digest('hex'); //对传入的字符串进行加密

            res.send(obj)
        })

    })
};
