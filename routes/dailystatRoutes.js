'use strict';
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let jwt = require('express-jwt');
let DailyStat = mongoose.model('DailyStat');
let Tweet = mongoose.model('Tweet');
let auth = jwt({
  userProperty: 'payload',
  secret: process.env.JWTsecret
});



module.exports = router;