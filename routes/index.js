/*
 * @Author: zhen chen
 * @Date: 2017-12-11 11:33:28
 * @Last Modified by: chen zhen
 * @Last Modified time: 2018-10-26 13:45:28
 * @description 进行路由绑定的文件
 */

const home = require('./home');
const users = require('./users');
const save = require('./save')
// const data = require('./data')
const busLine = require('./bus-line')

module.exports = (app) => {
  app.use('/index', home);
  app.use('/users', users);
  app.use('/save', save)
  // app.use('/data', data)
  app.use('/bus-line', busLine)
}
