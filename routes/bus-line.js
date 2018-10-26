/*
 * @Author: chen zhen
 * @Date: 2018-10-26 13:43:37
 * @Last Modified by: chen zhen
 * @Last Modified time: 2018-10-26 14:18:38
 * @Description: 用来进行处理公交线路模块
 */

const express = require('express');
const router = express.Router();
const log4jsInfo = require("../logs").logger();
const BusLine = require('../server/bus-line');

const busLine = new BusLine();

/* GET users listing. */
router.get('/addTask', function(req, res, next) {
  setTimeout(() => {
    // 开始一个
    busLine.addTask(req.query.city)
  }, 0)
  res.send('OK!');
});

router.get('/stopTask', function(req, res, next) {
  res.send('OK!');
});

module.exports = router;