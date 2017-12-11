/*
 * @Author: zhen chen
 * @Date: 2017-12-07 17:53:33
 * @Last Modified by: zhen chen
 * @Last Modified time: 2017-12-11 09:55:59
 * @description 这是一个可以使图片进行简化程svg格式的库，适用于在页面初始化加载的loading过程中的过度图片
 */

const potrace = require('potrace')
const fs = require('fs')

fs.readFileSync('../static/images/potrace.jpg')
potrace.trace('../static/images/potrace.jpg', function (err, svg) {
  if (err) {
    throw err
  };
  fs.writeFileSync('../static/images/potrace.svg', svg);
});
