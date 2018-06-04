/*
 * @Author: zhen chen
 * @Date: 2017-12-11 11:33:28
 * @Last Modified by: chen zhen
 * @Last Modified time: 2018-05-28 10:38:22
 * @description 进行路由绑定的文件
 */

var index2 = require('./index2');
var users = require('./users');
var save = require('./save')
var data = require('./data')

module.exports = (app) => {
  app.use('/index', index2);
  app.use('/users', users);
  app.use('/save', save)
  app.use('/data', data)
}
