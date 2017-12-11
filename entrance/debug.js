/*
 * @Author: zhen chen
 * @Date: 2017-12-11 09:56:03
 * @Last Modified by: zhen chen
 * @Last Modified time: 2017-12-11 09:57:05
 * @description 使用debug模块的输出适龄必须在  node debug.js 前边添加 DEBUG=log 才能进行显示debug内容
 */

const testDebugger = require("debug")("log");
testDebugger("this is test");