'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionModel = new Schema({
  user_id: {type: String, require: true}, 
  expired: {
    type:Date,
	  default: Date.now
  },
  created: {
	  type:Date,
	  default: Date.now
  },
});

module.exports = mongoose.model('Session', sessionModel);
