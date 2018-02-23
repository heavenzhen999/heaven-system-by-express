/*
 * @Author: zhen chen
 * @Date: 2018-01-15 21:46:45
 * @Last Modified by: zhen chen
 * @Last Modified time: 2018-01-25 15:57:39
 * @description 用来保存图片
 */
const fs = require('fs')
const log4js = require("../../logs").logger();

const path = './static/source/images/'
let saveIage = (params, callback) => {
  let filePath = `${path}${params.fileName}.${params.type}`
  var base64Data = params.data.replace(/^data:image\/\w+;base64,/, '')
	var dataBuffer = new Buffer(base64Data, 'base64');
  fs.writeFile(filePath, dataBuffer, (err) => {
    if (err) {
      log4js.error(`${filePath}图片保存失败!`)
    } else {
      log4js.info(`${filePath}图片保存成功!`)
    }
    callback(err)
  })
}

module.exports = saveIage
