/*
 * @Author: chen zhen
 * @Date: 2018-05-30 08:54:13
 * @Last Modified by: chen zhen
 * @Last Modified time: 2018-05-30 09:16:29
 * @Description: test 数据库内部  PositionEx数据
 */

var mongoose = require('../../../database/mongodb/db.js');
var Schema = mongoose.Schema;

const option = require('./option')

// var testSchema = new Schema(option, { collection: 'PositionEx'});

module.exports = (date) => {
  if (date === undefined) {
    return new Schema(option, { collection: 'PositionEx'});
  } else {
    return new Schema(option, { collection: `PositionEx${date}`});
  }
}

