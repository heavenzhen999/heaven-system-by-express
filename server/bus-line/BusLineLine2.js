/*
 * @Author: chen zhen
 * @Date: 2018-10-26 16:29:13
 * @Last Modified by: chen zhen
 * @Last Modified time: 2018-10-26 17:38:09
 * @Description: 获取某个公交线路内部的线路图
 */
const fs = require('fs')
const cheerio = require('cheerio')
const axios = require('axios')
const log4jsInfo = require("../../logs").logger();

class BusLineLine2 {

  constructor(type, baseUrl, city, res, rej) {
    this.city = city
    this.type = type
    this.webUrl = `${baseUrl}${type.href.substr(1)}`
    this.res = res
    this.rej = rej
    this.init()
  }

  // 初始化
  init() {
    this.getHTML().then(this.analysis.bind(this)).then(res => {
      // log4jsInfo.debug(`获取${this.type.name}线路成功`)
      if (!fs.existsSync(`./static/bus-line/${this.city}/`)) {
        fs.mkdirSync(`./static/bus-line/${this.city}/`)
      }
      fs.writeFile(`./static/bus-line/${this.city}/${this.type.name}.json`, JSON.stringify(res), err => {
        if (err == null) {
          this.res()
        } else {
          this.rej(err)
        }
      })
      // 写入文件
    }).catch(err => {
      log4jsInfo.error(`获取${this.type.name}线路失败！`, err)
      this.rej(err)
    })
  }

  /**
   * 获取对应的html
   */
  getHTML() {
    return new Promise((res, rej) => {
      axios.get(this.webUrl).then(result => {
        res(result.data)
      }).catch(err => {
        rej(err)
      })
    })
  }

   /**
   * 获取公交线路类型
   * @param {String} html
   */
  analysis(html) {
    return new Promise((res, rej) => {
      try{
        let _$ = cheerio.load(html)
        let lineTop = _$('.bus_line_top')
        let lineSite = _$('.bus_line_site')
        let busLine = []
        let _lineTop = []
        let _lineSite = []
        lineSite.each((i, ele) => { _lineSite.push(ele) })

        lineTop.each((i, ele) => {
          let pointArr= []
          if (_lineSite.length > i) {
            let lineSiteItem = _lineSite[i]
            for (let points of lineSiteItem.children) {
              for (let point of points.children) {
                pointArr.push({
                  href: point.children[1].attribs['href'],
                  name: point.children[1].children[0].data
                })
              }
            }
          }

          let lineInfo = {
            name: ele.children[0].children[0].children[0].data,
            line: pointArr
          }
          busLine.push(lineInfo)
        })
        res({
          name: this.type.name,
          busLine
        })
      } catch(e) {
        rej(e)
      }
    })
  }
}

module.exports = BusLineLine2
