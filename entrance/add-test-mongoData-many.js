/*
 * @Author: chen zhen
 * @Date: 2018-10-09 11:11:38
 * @Last Modified by: chen zhen
 * @Last Modified time: 2018-10-09 12:12:59
 * @Description: 使用mongoose批量注入数据
 * 
 * 使用  https://mongoosejs.com/docs/api.html#model_Model.insertMany 的说明
 */

const UUID = require('uuid')
const Test = require('../database/mongodb/Model/test-Model')

// type为随机数，测试总数为1000 * 3000
const maxType = 1000
const maxNum = 30000
const all = maxType * maxNum
const once = 10000
let times = 0 // 批次
let insertNum = 0
let nowType = UUID.v4() // 类型
let typeNum = 0

let startTime;
const center = () => {
  startTime = new Date()
  insertData()
}

const insertData = () => {
  times ++;
  // 计算当前新增的数据
  let n = 0
  let list = []
  while(n < once && insertNum < all) {
    n ++;
    insertNum ++;

    // 查看是否更换类型
    typeNum ++
    if (typeNum >= maxType) {
      nowType = UUID.v4()
    }

    list.push({
      name: UUID.v4(),
      author: 'heaven',
      body: 'test - heaven',
      num: typeNum,
      type: nowType,
      date: new Date
    })
  }
  if (list.length > 0) {
    Test.insertMany(list, (err, res) => {
      if (err) {
        console.log("Error:" + err);
      }
      else {
        console.log(`存储成功！第${times}批次，共${all/once}批次。time: ${new Date().toLocaleString()}`);
        return (() => {
          insertData()
        })()
      }
    })
  }
}

center()