var mongoose = require('mongoose');
var Schema=mongoose.Schema;

var entitySchema = new Schema({});

module.exports = mongoose.model('Entity', entitySchema);