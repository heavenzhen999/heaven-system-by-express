/*
 * @Author: zhen chen
 * @Date: 2017-12-11 11:33:28
 * @Last Modified by: zhen chen
 * @Last Modified time: 2017-12-11 11:34:25
 * @description 进行路由绑定的文件
 */

var index = require('./index');
var users = require('./users');

module.exports = (app) => {
  app.use('/', index);
  app.use('/users', users);
}