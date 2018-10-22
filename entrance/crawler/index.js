/*
 * @Author: chen zhen
 * @Date: 2018-09-12 13:50:22
 * @Last Modified by: chen zhen
 * @Last Modified time: 2018-09-12 13:50:22s
 * @Description 一个对2018年专升本学校的爬虫
 */

/**
 * 连接到页面的信息，使用虚拟进行处理
 */

const fs = require('fs')
const cheerio = require('cheerio')
const axios = require('axios')

if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

let start = () => {
  // 获取信息
  getHTML().then(getInfo).then(getPositions).then(tidyInfo).catch(err => {
    console.error('查询出错', err)
  })
}

let getHTML = () => {
  return new Promise((res, rej) => {
    axios.get('http://m.hbpx.net/zixun/15385.html').then(result => {
      // fs.writeFileSync('./crawler/html.json', result.data)
      res(result.data)
    }).catch(err => {
      rej(err)
    })
  })
}

let getInfo = (html) => {
  return new Promise((res, rej) => {
    try {
      let _$ = cheerio.load(html)
      let info = _$('.main .zixun-nr .ke-zeroborder tbody tr')
      // 遍历
      let arr = []
      info.each((i, ele) => {
        if (i > 0) {

          // 学校报考id
          let schoolId = null
          try {
            schoolId = ele.children[1].children[0].data.trim()
          } catch (error) {
            console.log(`第${i}个学校报考id,查询出错`)
          }

          // 学校名称
          let schoolName = null
          try {
            schoolName = ele.children[3].children[0].data.trim()
          } catch (error) {
            console.log(`第${i}个学校名称,查询出错`)
          }

          // 专业名称
          let majorName = null
          try {
            majorName = ele.children[5].children[0].data.trim()
          } catch (error) {
            console.log(`第${i}个专业名称,查询出错`)
          }

          // 联考专业
          let majorUnitName = null
          try {
            majorUnitName = ele.children[7].children[0].data.trim()
          } catch (error) {
            console.log(`第${i}个联考专业,查询出错`)
          }

          // 计划人数
          let planNum = null
          try {
            planNum = ele.children[9].children[0].data.trim()
          } catch (error) {
            console.log(`第${i}个计划人数,查询出错`)
          }

          // 专业类别
          let majorType = null
          try {
            majorType = ele.children[11].children[0].data.trim()
          } catch (error) {
            console.log(`第${i}个专业类别,查询出错`)
          }

          // 授予学位
          let degree = null
          try {
            degree = ele.children[13].children[0].data.trim()
          } catch (error) {
            console.log(`第${i}个授予学位,查询出错`)
          }

          // 教学地点
          let place = null
          try {
            place = ele.children[15].children[0].data.trim()
          } catch (error) {
            console.log(`第${i}个教学地点,查询出错`)
          }

          let obj = {
            schoolId, schoolName, majorName, majorUnitName, planNum, majorType, degree, place
          }
          arr.push(obj)
          // console.log(schoolId, schoolName, majorName, majorUnitName, planNum, majorType, degree, place)
        }
      })

      // 进行重新整理
      // 将信息1 进行保存
      // fs.writeFileSync('./crawler/base.json', JSON.stringify(arr, null, 2))

      // 对每个学院的专业进行整理，
      let result = {}
      for (let i of arr) {
        if (result[i.schoolId] === undefined) {
          result[i.schoolId] = {
            schoolId: i.schoolId,
            schoolName: i.schoolName,
            schoolPlace: [],
            majors: [ i ],
            majorsLength: 1
          }
          if (i.place !== null)  result[i.schoolId].schoolPlace.push(i.place)

        } else {
          let _i = result[i.schoolId]
          _i.majors.push(i)

          // 如果校区信息不存在，则进行添加
          if (_i.schoolPlace.indexOf(i.place) === -1 && i.place !== null) _i.schoolPlace.push(i.place)

          _i.majorsLength = _i.majors.length

          if (i.schoolName !== _i.schoolName) {
            console.log('错误的学校名称', i.schoolName, _i.schoolName)
          }
        }
      }
      console.log(`共${arr.length}个专业`)

      // 开始从百度地图的数据库内部查询位置信息，并将位置信息进行查询
      fs.writeFileSync('./crawler/tidy-info.json', JSON.stringify(result, null, 2))
      res(result)
    } catch (error) {
      rej(error)
    }
  })
}

let getPositions = (info) => {
  let max = 10000
  let arr = []
  let i = 0
  for (let k in info) {
    if (i < max) {
      for (let place of info[k].schoolPlace) {
        if (place !== null) {
          arr.push(getPosition(info[k].schoolId, info[k].schoolName, place))
        }
      }
    }
    i++
  }
  return Promise.all(arr).then((arrData = []) => {
    return new Promise((res, rej) => {
      res({
        positionArr: arrData,
        baseInfo: info
      })
    })
  })
}

let getPosition = (schoolId, schoolName, place) => {
  return new Promise((res, rej) => {
    let url = 'http://api.map.baidu.com/place/v2/search'
    let params = {
      query: `${schoolName} ${place}`,
      tag: '教育培训',
      region: '石家庄市',
      output: 'json',
      ak: 'bjjCC9CQarhiv6vNYTxddW6U0LF9Rep5'
    }
    axios.get(url, { params }).then(result => {
      if (result.data.status === 0) {
        res({
          schoolId,
          schoolName,
          place,
          info: result.data.results
        })
        console.log(`完成数据请求(${schoolName} ${place})`)
      } else {
        rej(result.data)
      }
    }).catch(err => {
      console.log(`错误数据请求(${schoolName} ${place})`)
      rej(err)
    })
  })
}

let tidyInfo = ({positionArr, baseInfo}) => {
  console.log('开始进行整理数据')
  fs.writeFileSync('./crawler/position-info.json', JSON.stringify(positionArr, null, 2))
  fs.writeFileSync('./crawler/base-info.json', JSON.stringify(baseInfo, null, 2))

  // 将数据保存到对应的数据包内部
  for (let position of positionArr) {
    let school = baseInfo[position.schoolId]
    if (school !== undefined) {
      if (school.schoolPlaceExt === undefined) school.schoolPlaceExt = []
      let index = school.schoolPlace.indexOf(position.place)
      if (index !== -1) {
        school.schoolPlaceExt[index] = position
      } else {
        console.error(`错误的校区名称${position.place}`)
      }

    } else {
      console.error(`${position.schoolId}出错`)
    }
  }
  fs.writeFileSync('./crawler/tidy-info-after.json', JSON.stringify(baseInfo, null, 2))

}

// 自执行
start()