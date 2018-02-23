/*
 * @Author: zhen chen
 * @Date: 2018-01-14 13:01:27
 * @Last Modified by: zhen chen
 * @Last Modified time: 2018-01-14 13:10:45
 * @description 
 */

const fs = require('fs')
const fileName = 'jssx-geojson'
fs.readFile(`../static/data/${fileName}.json`, {encoding:'utf-8'}, (err, params) => {
  if (err) console.log(err)
  // 便利获取类型
  let json = JSON.parse(params)
  let types = []
  for (let feature of json.features) {
    let type = feature.properties.fhdm
    types.indexOf(type) === -1 ? types.push(type) : null
  }
  console.log(JSON.stringify(types))
})
