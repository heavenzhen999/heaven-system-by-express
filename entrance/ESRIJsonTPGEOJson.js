/*
 * @Author: zhen chen
 * @Date: 2018-01-14 10:49:45
 * @Last Modified by: zhen chen
 * @Last Modified time: 2018-01-25 15:37:18
 * @description ESRIJson To GeoJSON
 * 如果是批量的数据都需要从ESRIJSON 转换到 GeoJSON，可以使用文件夹内部枚举的方式进行此操作
 */
const arcgisToGeoJSON = require('@esri/arcgis-to-geojson-utils').arcgisToGeoJSON

const readWrite = require('./read-write-demo.js')

const fs = require('fs')
// 此文件需要存放再'../static/data/'内部，转换完成的数据也存放在那里
const translateFileName = 'zhgl-综合管廊'

const dispose = (data) => {
  let ESRIJson = JSON.parse(params)
  let GeoJson = {
    type: 'FeatureCollection',
    features: []
  }
  for (let feature of ESRIJson.features) {
    GeoJson.features.push(arcgisToGeoJSON(feature))
  }
  return JSON.stringify(GeoJson)
}

const callback = params => {
  console.log(params)
}

readWrite({
  readFile: '',
  writeFile: '',
  dispose,
  callback
})
