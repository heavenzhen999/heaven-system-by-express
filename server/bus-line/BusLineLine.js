/*
 * @Author: chen zhen
 * @Date: 2018-10-26 15:21:42
 * @Last Modified by: chen zhen
 * @Last Modified time: 2018-10-26 15:45:20
 * @Description: 公交线路获取
 */

const cheerio = require('cheerio')
const axios = require('axios')
const log4jsInfo = require("../../logs").logger();

class BusLineLine {
  
  /**
   * 初始化公交线路路程
   * @param {Array} type 车辆类型
   * @param {*} baseUrl 网站基础地质
   * @param {*} res 
   * @param {*} rej 
   */
  constructor(type, baseUrl, res, rej) {
    this.type = type
    this.webUrl = `${baseUrl}${type.href.substr(1)}`
    this.res = res
    this.rej = rej
    this.init()
  }

  // 初始化
  init() {
    this.getHTML().then(this.analysis).then(res => {
      // log4jsInfo.debug('获取类型成功', res)
      this.res(res)
    }).catch(err => {
      log4jsInfo.error('获取对应的公交线路失败', err)
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
        let info = _$('#con_site_1 a')
        let busLine = []
        info.each((i, ele) => {
          busLine.push({
            name: ele.children[0].data,
            href: ele.attribs['href'],
            title: ele.attribs['title']
          })
        })
        res(busLine)
      } catch(e) {
        rej(e)
      }
    })
  }
}

module.exports = BusLineLine
