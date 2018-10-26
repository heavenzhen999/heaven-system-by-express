/*
 * @Author: zhen chen
 * @Date: 2017-12-07 16:46:33
 * @Last Modified by: chen zhen
 * @Last Modified time: 2018-10-26 13:24:00
 * @description "mongodb"数据库链接
 */

const mongoose = require('mongoose')
const DB_URL = 'mongodb://localhost:27017/test'

/**
 * 连接
 */

console.error('未连接mongodb')
// mongoose.connect(DB_URL, {useMongoClient: true}, err => {
//     if(err){
//         console.log(`${DB_URL}数据库连接失败！`);
//     }else{
//         console.log(`${DB_URL}数据库连接成功！`);
//     }
// });

module.exports = mongoose