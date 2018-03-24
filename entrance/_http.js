
/*
 * @Author: zhen chen
 * @Date: 2018-02-23 09:43:01
 * @Last Modified by: zhen chen
 * @Last Modified time: 2018-02-27 16:36:54
 * @description 数据请求
 */

const http = require('http'); 
   
const qs = require('querystring'); 

const center = ({host, hostname, port, path, data, success}) => {
  let content = qs.stringify(data)
  let options = {
    path: `${path}?${content}`
  }
  if (host !== undefined) {
    options.host = host
  } else {
    options.hostname = hostname
    options.port = port
  }
  let req = http.request(options, (res) => {
    console.log('STATUS: ' + res.statusCode); 
    console.log('HEADERS: ' + JSON.stringify(res.headers)); 
    res.setEncoding('utf8'); 
    let chunks = ''
    res.on('data', (chunk) => { 
      chunks += chunk
    });
    res.on('end', () => {
      success(chunks)
    });
  }); 
    
  req.on('error', (e) => { 
      console.log('problem with request: ' + e.message);
      console.error !== undefined ? console.error(e) : null      
  }); 
    
  req.end();
}

module.exports = center