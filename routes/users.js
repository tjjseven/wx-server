var express = require('express');
var router = express.Router(),
config = require('../config');//引入配置文件
axios = require('axios')
util = require('../lib/utils');//引入配置文件
var path = require('path')
var wechat_file = path.join(__dirname, '../wechat/wechat.txt')

/* GET users listing. */
router.get('/user', function(req, res, next) {
    res.send('123');
});

module.exports = router;
