/*
 * @Author: zhen chen
 * @Date: 2017-12-11 11:33:28
 * @Last Modified by: zhen chen
 * @Last Modified time: 2018-01-18 09:43:50
 * @description 进行路由绑定的文件
 */

var index2 = require('./index2');
var users = require('./users');
var save = require('./save')
module.exports = (app) => {
  app.use('/index', index2);
  app.use('/users', users);
  app.use('/save', save)
}