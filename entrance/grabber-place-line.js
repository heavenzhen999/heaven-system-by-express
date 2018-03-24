/*
 * @Author: zhen chen
 * @Date: 2018-02-23 09:04:30
 * @Last Modified by: zhen chen
 * @Last Modified time: 2018-02-23 15:07:52
 * @description 从高德地图上获取中国社区的边界线，最小为县级别
 * 数据从
 * http://lbs.amap.com/api/javascript-api/example/district-search/city-drop-down-list/
 * http://lbs.amap.com/api/webservice/guide/api/district/
 * 上边进行获取
 */
const fs = require('fs')
const _http = require('./_http.js')
/**
 * 示例数据请求
 * http://restapi.amap.com/v3/config/district?keywords=中国&subdistrict=1&key=5da09d0b9eed5c703fde3fe0997031c1&extensions=all
 */

/**
 * 整个功能分为多个步骤
 * 第一步：确定当前时间，创建对应的文件夹（如果已经存在，则进行获取已经存在的文件名称）
 * 第二步：获取中国的地图边界，遍历中国的内部 1 级地区（省、直辖市、特别行政区名称）
 * 第三步：遍历获取所有的 1 级地区的地图边界，并遍历获取对应的 2 级地区名称
 * 第三步：遍历获取所有的 2 级地区的地图边界，并遍历获取对应的 3 级地区名称
 * 第四步：遍历获取所有的 3 及地区的地图边界
 */

const DATASOURCE= '../static/source/place-line/'

const HTTPOBJ = {
  host: 'restapi.amap.com',
  path: '/v3/config/district',
  key: '5da09d0b9eed5c703fde3fe0997031c1',
}

let fileNameMap = {}                      // 存放文件名称的地方

let distribution = []

const china = '中国'

let first_getTime = () => {
  return new Promise((res, rej) => {
    let time = new Date()
    time = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`
    // 获取对应的文件夹
    fs.readdir(`${DATASOURCE}/${time}`, (err, content) => {
      if (err) {
        // 报错(如果不存在对应文件夹，则进行创建)
        if (err.errno === -4058) {
          // 创建对应的文件夹
          fs.mkdir(`${DATASOURCE}/${time}/`, (err) => {
            if (err) {
              rej(err)
            }
            console.log(`创建${DATASOURCE}/${time}文件夹成功`)
            res()
          })
        } else {
          rej(err)
        }
      } 
      // 存在对应文件夹，获取内部全部的文件名称
      for(let fileName of content) {
        fileNameMap.fileName = true
      }
      res()
    })
  })
}

let second_getChina = () => {
  // 查看是否存在 '中国' 文件夹
  let　exist = false
  let httpObj = {
    host: HTTPOBJ.host,
    path: HTTPOBJ.path,
    data: {
      key: HTTPOBJ.key,
      keywords: '中华人民共和国',
      extensions: 'all',
      subdistrict: 1
    },
    success: (params) => {
      // 把对应的数据进行保存
      savePlaceLine(JSON.parse(params))
      // 存储政区信息
      saveDistribution(JSON.parse(params))
      res()
    },
    error: (err) => {
      rej(err)
    }
  }
  if (fileNameMap['100000' + fileName]) {
    httpObj.data.extensions = 'base'
    httpObj.success = () => {
      // 存储政区信息
      saveDistribution(JSON.parse(params))
      res()
    }
  }
  _http(httpObj)
}


let savePlaceLine = (data) => {
  for (let district of data.districts) {
    let fileName= district.adcode + district.name
    if (fileNameMap[fileName]) {
      // 文件存在，进行跳过
      console.log(`${fileName}已经进行保存，不进行重复保存`)
    } else {

    }
  }
}

first_getTime()
  .then(second_getChina)
  .catch((err) => {
    console.log('报错了')
    console.log(err)
  })

// _http({
//   host: 'restapi.amap.com',
//   path: '/v3/config/district',
//   data: {
//     key: '5da09d0b9eed5c703fde3fe0997031c1',
//     keywords: '中国',
//     extensions: 'base',
//     subdistrict: 1
//   },
//   success: (params) => {
//     // console.log('成功的数据请求!')
//     console.log(params)
//   },
//   error: (err) => {
//     console.log('失败的数据请求！')
//     console.log(err)
//   }
// })

/**
 * 延迟运行方法
 */
