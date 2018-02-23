/*
 * @Author: zhen chen
 * @Date: 2017-12-11 10:23:03
 * @Last Modified by: zhen chen
 * @Last Modified time: 2018-01-25 15:11:03
 * @description 一个使用orm的简单连接案例，如果使用express的时候使用 orm.express模式，在entrance/musql-orm.js内示例
 */

const orm = require('orm');
// const DATABASE_URL = 'mysql://root:password@localhost/test'
const DATABASE_URL = 'mysql://giskf:giskf@172.16.17.3:3306/gis_omp'
orm.connectAsync(DATABASE_URL).then((db) => {
  console.log('连接成功')
  // connected
  // ...
  return ''
})
.catch((err) => {
  console.error('Connection error: ' + err)
});