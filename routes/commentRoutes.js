'use strict';
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Comment = mongoose.model('Comment');
let User = mongoose.model('User');
let Candidate = mongoose.model('Candidate');
let Tweet = mongoose.model('Tweet');
let auth = jwt({
  userProperty: 'payload',
  secret: process.env.JWTsecret
});

module.exports = router;
