/*
 * @Author: zhen chen
 * @Date: 2018-01-15 21:29:53
 * @Last Modified by: zhen chen
 * @Last Modified time: 2018-01-15 21:43:11
 * @description 专门用于储存各种资源
 */

var express = require('express');
var router = express.Router();
var saveImage = require('../server/save/save-image')

/* GET users listing. */
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
