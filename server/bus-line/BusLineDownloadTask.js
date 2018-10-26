/*
 * @Author: chen zhen
 * @Date: 2018-10-26 11:58:09
 * @Last Modified by: chen zhen
 * @Last Modified time: 2018-10-26 17:33:29
 * @Description: 公交线路下载任务
 */
const BuslineType = require('./BuslineType')
const BusLineLine = require('./BusLineLine')
const BusLineLine2 = require('./BusLineLine2')
const axios = require('axios')
const log4jsInfo = require("../../logs").logger();

class BusLineDownloadTask {
  constructor(city, endCallback) {
    this.city = city // 需要进行下载的城市名称

    this.webUrl = `http://${this.city}.8684.cn/`

    this.endCallback = endCallback
  }

  /**
   * 开始下载
   */
  start() {
    /**
     * Step 1:获取线路分类
     * 从获取到的页面访问内容
     */
    log4jsInfo.info(`${this.city} 城市，公交线路下载工作 启动！`)
    this.getBusType().then(this.getBusLineLine.bind(this)).then(this.getBusLinePositions.bind(this)).then(res => {
      log4jsInfo.info(`${this.city} 城市，公交线路下载工作 完成`)
      this.endCallback()
    }).catch(err => {
      log4jsInfo.error(`${this.city} 城市，公交线路下载工作 异常！`, err)
      this.endCallback()
    })
    // log4jsInfo.debug(`开始${this.city}城市，公交线路下载工作`)
    // let buslineType = new BuslineType(this.webUrl, busType => {
    //   if (busType === null) {
    //     // TODO 书写错误逻辑
    //   } else {
    //     this.buslineType = busType
    //   }
    // })
    // buslineType.getType()
  }

  /**
   * 执行下载停止事件
   */
  stop() {}

  /**
   * 执行销毁事件
   */
  destory() {}

  /**
   * 获取线路
   */
  getBusType() {
    log4jsInfo.info(`${this.city} 城市，公交线路下载工作 获取公交线路类型`)
    return new Promise((res, rej) => {
      new BuslineType(this.webUrl, res, rej)
    })
  }
  /**
   * 遍历获取各个线路的数据信息
   */
  getBusLineLine(busType) {
    log4jsInfo.info(`${this.city} 城市，公交线路下载工作 获取公交线路名称`)
    let arr = busType.map(i => {
      return new Promise((res, rej) => {
        // 不太好的命名方式，用于每个车辆类型对应的数据
        new BusLineLine(i, this.webUrl, res, rej)
      })
    })
    return Promise.all(arr)
  }

  /**
   * 整合左右的公交线路信息
   * @param {Array} busLineArr
   */
  getBusLinePositions(busLineArr) {
    log4jsInfo.info(`${this.city} 城市，公交线路下载工作 获取公交线路路线`)
    return new Promise((res, rej) => {
      try {
        let busLineTotal = 0
        let arr = new Set()
        for (let _arr of busLineArr) {
          busLineTotal += _arr.length
          // arr = arr.concat(_arr)
          for (let l of _arr) {
            arr.add(l)
          }
        }
        log4jsInfo.info(`共查询到公交线路${busLineTotal}条，实际${arr.size}条，重复${busLineTotal - arr.size}条`)

        // 以once的数字，单次运行的数量进行执行
        this.circulationGetBusLineLine2([...arr], arr.size, 0, res, rej)
      } catch (error) {
        rej(error)
      }
    })
  }

  /**
   * 循环获取下路信息
   */
  circulationGetBusLineLine2(busLine, allSize, times, _res, _rej) {
    try {
      const once = 10 // 单次执行的公交线路数据说明
      let arr = []
      while(arr.length < once && busLine.length > 0) {
        arr.push(busLine.shift())
      }
      if (arr.length === 0) {
        _res()
      } else {
        times++
        log4jsInfo.info(`正在分批次查询线路数据，共${Math.round(allSize / once)}批次，当前第${times}次`)
        Promise.all(arr.map(line => new Promise((res, rej) => {
          new BusLineLine2(line, this.webUrl, this.city, res, rej)
        }))).then(res => {
          // 批次获取数据成功
          // 进行下一次获取数据
          return (() => {
            this.circulationGetBusLineLine2(busLine, allSize, times, _res, _rej)
          })()
        }).catch(err => {
          _rej(err)
        })
      }
    } catch (error) {
      _rej(error)
    }
  }
}

module.exports = BusLineDownloadTask
