/*
 * @Author: zhen chen
 * @Date: 2017-12-11 10:56:19
 * @Last Modified by: zhen chen
 * @Last Modified time: 2017-12-11 11:37:53
 * @description 一个socket.io的连接示例，socket.io支持传输信息的事件类型
 *              在 www 内被直接引用，一个项目只能启动一个socket.io模块
 */

const _io = require('socket.io');
let io = null

let init = (http) => {
  io = _io(http)
  // 对socket进行初始化
  initSocket()
  console.log('Socket.io初始化成功')
}
let initSocket = () => {
  io.on('connection', (socket) => {
    console.log('a user connected')
    socket.on('hi', (res) => {
      console.log(res)
    })
    socket.on('disconnect', () => {
      console.log('user disconnected')
    });
  });
}

module.exports = {
  init
}
