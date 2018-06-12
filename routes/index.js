/*
 * @Author: zhen chen
 * @Date: 2017-12-11 11:33:28
 * @Last Modified by: chen zhen
 * @Last Modified time: 2018-06-12 15:38:15
 * @description 进行路由绑定的文件
 */

var home = require('./home');
var users = require('./users');
var save = require('./save')
var data = require('./data')

module.exports = (app) => {
  app.use('/index', home);
  app.use('/users', users);
  app.use('/save', save)
  app.use('/data', data)
}
