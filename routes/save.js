/*
 * @Author: zhen chen
 * @Date: 2018-01-15 21:29:53
 * @Last Modified by: chen zhen
 * @Last Modified time: 2018-06-12 15:31:38
 * @description 专门用于储存各种资源
 */

var express = require('express');
var router = express.Router();
var saveImage = require('../server/save/save-image')


/**
 * 用来对  前端canvas 进行截取的图片的操作
 */
router.post('/image', function(req, res, next) {
  saveImage(req.body.params, (err) => {
    if (err) {
      res.send('save to nothing!');
    } else {
      res.send('save success!');
    }
  })
});

module.exports = router;
