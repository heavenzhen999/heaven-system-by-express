/*
 * @Author: chen zhen
 * @Date: 2018-05-28 09:49:44
 * @Last Modified by: chen zhen
 * @Last Modified time: 2018-05-28 11:01:36
 * @Description: 一个用来进行测试用数据新增的类
 */

var mongoose = require('../db.js');
var Schema = mongoose.Schema;

var testSchema = new Schema({
  name:  String,
  author: String,
  body:   String,
  num: Number,
  type: String,
  date: { type: Date, default: Date.now }
});

module.exports = testSchema
