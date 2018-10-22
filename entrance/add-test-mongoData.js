/*
 * @Author: chen zhen
 * @Date: 2018-05-28 10:07:24
 * @Last Modified by: chen zhen
 * @Last Modified time: 2018-10-09 11:11:19
 * @Description: 用来新增测试数据
 */
const UUID = require('uuid')
const Test = require('../database/mongodb/Model/test-Model')

// type为随机数，测试总数为1000 * 3000
const max = 1000
const maxNum = 3000
const all = max * maxNum

let startTime;
const center = () => {
  startTime = new Date()
  createTest()
}


function createTest(title = 0, num = 0, type=UUID.v4(), callback) {
  if (num === maxNum && title === max) {
    let endTime = new Date()
    console.log(`共花费时间：${endTime.getTime() - startTime.getTime()}ms`)
  }
  if (num === maxNum) {
    num = 0
    type = UUID.v4()
    title ++
  }
  if (title < max) {
    setTimeout(() => {
      let test = new Test({
        name: UUID.v4(),
        author: 'heaven',
        body: 'test - heaven',
        num: num,
        type: type,
        date: new Date
      })
      test.save((err, res) => {
        if (err) {
          console.log("Error:" + err);
        }
        else {
          let nowNum = (title * maxNum + num) + 1
          console.log(`存储成功！第${nowNum}个，共${all}个。name: ${res.name}, type: ${res.type}, time: ${new Date().toLocaleString()}`);
          return (() => {
            num++
            createTest(title, num, type)
          })()
        }
      })
    }, 0)
  }

}

center()

module.exports = center

