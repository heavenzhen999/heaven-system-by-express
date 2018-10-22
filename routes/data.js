/*
 * @Author: chen zhen
 * @Date: 2018-05-28 10:35:35
 * @Last Modified by: chen zhen
 * @Last Modified time: 2018-06-29 09:26:42
 * @Description: 用来存储mongodb测试数据
 */

var express = require('express');
var router = express.Router();
var insertTestData = require('../entrance/add-test-mongoData')
var tidyUpMongodb = require('../entrance/tidy-up-mongodb')
/* GET users listing. */
router.get('/insert', function(req, res, next) {
  insertTestData()
  res.send('OK!');
});

router.get('/tidyup', function(req, res, next) {
  tidyUpMongodb()
  res.send('OK!');
});

module.exports = router;