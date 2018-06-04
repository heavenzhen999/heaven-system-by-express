var PositionEx = require('../Schema/PositionEx');
var mongoose = require('../../../database/mongodb/db.js');

module.exports = (date) => {
  return mongoose.model('PositionEx',PositionEx(date))
}