/*
 * @Author: zhen chen
 * @Date: 2017-12-07 16:46:33
 * @Last Modified by: chen zhen
 * @Last Modified time: 2018-05-28 11:09:14
 * @description "mongodb"数据库链接
 */

const mongoose = require('mongoose')
const DB_URL = 'mongodb://localhost:27017/test'
/**
 * 连接
 */
mongoose.connect(DB_URL)

/**
  * 连接成功
  */
mongoose.connection.on('connected', () => {
  console.log('Mongoose connection open to ' + DB_URL)
})

/**
 * 连接异常
 */
mongoose.connection.on('error', (err) => {
  console.log('Mongoose connection error: ' + err)
})

/**
 * 连接断开
 */
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection disconnected')
})

module.exports = mongoose