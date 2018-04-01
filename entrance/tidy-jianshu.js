/*
 * @Author: chen zhen 
 * @Date: 2018-03-25 11:38:47 
 * @Last Modified by: chen zhen
 * @Last Modified time: 2018-03-25 13:35:28
 * @Description 
 */

const fs = require('fs')
const cheerio = require('cheerio')
const axios = require('axios')

let t
let $
let bookMarks = []
let i = 0
let _realBookMarks = {}
let noList = {}
let repeatNum = 0
const start = () => {
  t = new Date()
  fs.readFile('../static/tidy-jianshu/bookmarks.html', {encoding:'utf-8'}, (err, params) => {
    if (err) {
      console.log('出错！！')
      console.log(err)
    } else {
      // 处理
      $ = cheerio.load(params);
      bookMarks = Object.keys($('A')).map(k => {
        let a = $('A')[k]
        if (a.attribs) {
          return {
            href: a.attribs.href,
            text: null
          }
        } else {
          return null
        }
      }).filter(f => {
        if (f === null) return false
        return true
      })
      console.log('正常获取收藏数据')

      // 开始根据处理所有的数据请求
      startGetInfo()
    }
  })
}

const startGetInfo = () => {
  return ((bookMark) => {
    i++
    getHtml(bookMark.href, data => {
      // console.log(data)
      let _$ = cheerio.load(data)
      let as = _$('p a')
      if (Object.keys(as).length === 0) {
        console.log(`当前为第${i}次查询，共${bookMarks.length}次。`)
        console.log(`此次查询结果为空，已经进行特殊保存`)
        if (noList[bookMarks[i - 1].href] === undefined) {
          noList[bookMarks[i - 1].href] = bookMarks[i - 1]
        }
        setTimeout( () => {
          return startGetInfo()
        }, 100)
      }
      Object.keys(as).forEach(_a => {
        let a = as[_a]
        if (a.attribs) {
          if (!_realBookMarks[a.attribs.href]) {
            _realBookMarks[a.attribs.href] = {
              href: a.attribs.href,
              parentHref: bookMark.href
            }
          } else {
            repeatNum += 1
          }
        }
      })
      // 成功呢
      if (i < bookMarks.length) {
        console.log(`当前为第${i}次查询，共${bookMarks.length}次。`)
        console.log(`已收藏${Object.keys(_realBookMarks).length},重复收藏点为${repeatNum}`)
        setTimeout( () => {
          return startGetInfo()
        }, 100)
      } else {
        // 结束
        console.log('结束')
        console.log(`空闲查询次${Object.keys(noList).length}`)
        console.log(`当前为第${i}次查询，共${bookMarks.length}次。现在已经结束。`)
        console.log(`共收藏${Object.keys(_realBookMarks).length},重复收藏点为${repeatNum}`)
        try {
          let a = fs.writeFileSync('../static/tidy-jianshu/bookMarks.json', JSON.stringify(bookMarks, null, 2))
          let b = fs.writeFileSync('../static/tidy-jianshu/realBookMarks.json', JSON.stringify(_realBookMarks, null, 2))
          let c = fs.writeFileSync('../static/tidy-jianshu/noList.json', JSON.stringify(noList, null, 2))
          console.log('数据保存成功！！！')
        } catch (error) {
          console.log('数据保存失败！！！')
        }
        console.log(`共${(new Date().getTime() - t.getTime()) / 1000}s`)
      }
    }, err => {
      console.log(err)
    })
  })(bookMarks[i])
}

const getHtml = (url, callback, errCallback) => {
  axios.get(url).then(res=> {
    callback(res.data)
  }).catch(err => {
    errCallback !== undefined ? errCallback(err) : null
  })
}


start()