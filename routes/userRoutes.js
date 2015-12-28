'use strict';
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');
let User = mongoose.model('User');
let jwt = require('express-jwt');
let auth = jwt({
  userProperty: 'payload',
  secret: process.env.JWTsecret
});





module.exports = router;
