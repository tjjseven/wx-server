//总路由
var express = require('express'),
    router = express.Router(),
    Wechat = require('../wechat/wc');
var wechat = new Wechat();
    wechat.getToken();  // 获取token


//注册路由
var wech = require("./wechatRouter");
wech(router);


module.exports = router;