/*
 * @Author: zhen chen
 * @Date: 2017-12-07 17:53:33
 * @Last Modified by: zhen chen
 * @Last Modified time: 2017-12-07 18:12:39
 * @description 对图片进行简化
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
