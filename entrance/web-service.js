/*
 * @Author: zhen chen
 * @Date: 2017-12-11 11:51:19
 * @Last Modified by: zhen chen
 * @Last Modified time: 2017-12-11 12:06:41
 * @description 一个测试链接webservice的接口
 */

var soap = require('soap');
var url = 'http://www.webxml.com.cn/webservices/qqOnlineWebService.asmx?wsdl';
var args = {qqCode: 610145650};

// soap.createClient(url, function(err, client) {
//   client.qqCheckOnline(args, function(err, result) {
//     if (err) {
//       console.log(err)
//     } else {
      
//     }
//   });
// });

soap.createClientAsync(url).then((client) => {
  return client.qqCheckOnline(args);
}).then((result) => {
  result.qqCheckOnlineResult === 'Y' ? console.log('在线') : console.log('离线')
})

