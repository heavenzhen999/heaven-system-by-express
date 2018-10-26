/*
 * @Author: chen zhen
 * @Date: 2018-10-26 10:53:35
 * @Last Modified by: chen zhen
 * @Last Modified time: 2018-10-26 17:40:48
 * @Description: 公交线路抓取服务
 * 
 * 首先在系统初始化的时候，
 * 获取本地/或数据库已经存储的公交线路数据内容
 * 
 * 数据有几个纬度
 * 首先获取公交线路网支持的城市的列表，存放在 city.json文件内，进行读写操作
 * 
 * 在可控页面公交线路网上，世界地图，中国地图 添加所有支持的公交线路城市的标记点
 * 同时可以查看各个城市的公交线路收集情况，存放在city-bus-collection.json内部
 * state  uncomplete download complete
 * 
 * 对每个城市，都获取全部的公交线路
 * 并对所有的公交线路的 站点进行收藏汇总
 * 
 * 对状态的获取可以进行手动的开启
 */
// 8684 公交网 http://www.8684.cn/
const BusLineDownloadTask = require('./BusLineDownloadTask')
const BUSLINE_WEBSITE = 'http://www.8684.cn/'

class BusLine {
  constructor() {
    // 初始化构造
    
  
    this.downloadQueue = [] // 当前需要进行下载数据的城市（等待队列）
  
    this.isDownloading = false // 是否正在执行下载任务
    
  }

  // 当前获取数据的排序队列

  /**
   * 添加任务
   * @param {String} city 城市英文名称 eg:  'beijing' 'tianjin'
   */
  addTask(city) {
    // 存入数据下载等待队列
    this.downloadQueue.push(city)

    // 调用消费的钩子
    this.consumerHandle()
  }


  /**
   * 执行从等待下载队列内部获取数据的钩子
   */
  consumerHandle() {
    if (!this.isDownloading) {
      let city = this.downloadQueue.shift()
      if (city !== undefined) {
        // 开始下载工作
        this.startTask(city) 
      }
    }
  }


  /**
   * 开始下载任务
   * @param {String} city 需要进行下载的城市
   */
  startTask(city) {
    this.isDownloading = true
    // 初始化一个公交线路下载任务
    this.downloadTask = new BusLineDownloadTask(city, () => {
      this.downloadTask.stop()
      this.downloadTask.destory()
      this.downloadTack = null
      this.isDownloading = false
    })
    this.downloadTask.start()
  }

  /**
   * 强制终止当前的下载任务
   */
  stopTask() {
    this.downloadTask.stop()
    this.downloadTask.destroy()
    this.downloadTack = null
    this.isDownloading = false
  }
}


module.exports = BusLine
