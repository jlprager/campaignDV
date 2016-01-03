"use strict";
let mongoose = require('mongoose');

let DailyStatSchema = new mongoose.Schema({
  candidate: String,
  positive: [],
  negative: [],
  neutral: []
});

module.exports = mongoose.model('DailyStat', DailyStatSchema);
