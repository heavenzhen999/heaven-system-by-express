/*
 * @Author: chen zhen
 * @Date: 2018-10-26 12:09:12
 * @Last Modified by: chen zhen
 * @Last Modified time: 2018-10-26 15:29:01
 * @Description: 用于获取公交线路类型的类
 */

const cheerio = require('cheerio')
const axios = require('axios')
const log4jsInfo = require("../../logs").logger();

class BuslineType {

  /**
   * 初始化
   * @param {String} webUrl
   */
  constructor(webUrl, res, rej) {
    this.webUrl = webUrl
    this.res = res
    this.rej = rej
    this.init()
  }

  /**
   * 获取类型
   */
  init() {
    this.getHTML().then(this.analysis).then(res => {
      // log4jsInfo.debug('获取类型成功', res)
      this.res(res)
    }).catch(err => {
      log4jsInfo.error('获取类型失败', err)
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
        let info = _$('.bus_classification .bus_layer .bus_layer_content')
        let type = []
        info.each((i, ele) => {
          // log4jsInfo.debug(ele.children)
          // log4jsInfo.debug(ele.children[0].children[0].data)
          if (ele.children.length >= 2 && ele.children[0].children[0].data === '线路分类：') {
            for (let e of ele.children[1].children) {
              // 获取href属性 & innerHtml
              // type[e.children[0].data] = e.attribs['href']
              type.push({
                href: e.attribs['href'],
                name: e.children[0].data
              })
            }
          }
        })
        res(type)
      } catch(e) {
        rej(e)
      }
    })
  }
}


module.exports = BuslineType
