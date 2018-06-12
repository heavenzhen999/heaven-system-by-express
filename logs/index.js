/*
 * @Author: zhen chen
 * @Date: 2017-12-11 14:01:35
 * @Last Modified by: zhen chen
 * @Last Modified time: 2017-12-11 14:31:27
 * @description log4js 配置模块(适用于单进程的文件，多继承会有不同)
 */

const path = require("path");
const log4js = require("log4js");

/**
 * 日志配置
 */
let configure = () => {
    log4js.configure(path.join(__dirname, "log4js.json"));    
}

/**
 * 暴露到应用的日志接口，调用该方法前必须确保已经configure过
 * @param name 指定log4js配置文件中的category。依此找到对应的appender。
 *              如果appender没有写上category，则为默认的category。可以有多个
 * @returns {Logger}
 */
let logger = (name) => {
    var dateFileLog = log4js.getLogger(name);
    return dateFileLog;
}

/**
 * 用于express中间件，调用该方法前必须确保已经configure过
 * @returns {Function|*}
 */
let useLog = () => {
    return log4js.connectLogger(log4js.getLogger("app"), {level: log4js.levels.INFO});
} 

module.exports = {
  configure,
  logger,
  useLog
}