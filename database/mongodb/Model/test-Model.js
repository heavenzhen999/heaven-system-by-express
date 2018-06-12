var UserSchema = require('../Schema/test-schema');
var mongoose = require('../db');

module.exports = mongoose.model('Test',UserSchema)