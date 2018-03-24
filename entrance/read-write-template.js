/*
 * @Author: zhen chen
 * @Date: 2018-01-25 15:12:39
 * @Last Modified by: zhen chen
 * @Last Modified time: 2018-01-25 15:31:30
 * @description 一个读取文件进行处理后并进行保存的方法
 */
const fs = require('fs')

let readFile = (readFile) => {
  return new Promise((res, rej) => {
    fs.readFile(readFile, {encoding:'utf-8'}, (err, params) => err == null ? rej(err) : res(params))
  })
}

let writeFile = (info, writeFile) => {
  return new Promise((res, rej) => {
    fs.writeFile(writeFile, info, (err) => err == null ? rej(err) : res(true))
  })
}

let center = ({
  readFile,
  writeFile,
  dispose,
  callback
}) => {
  readFile(readFile)
  .then(dispose)
  .then(writeFile.bind(undefined, writeFile))
  .then(callback)
  .catch(err => console.log(err))
}

module.exports = center
