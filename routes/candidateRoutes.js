'use strict';
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let jwt = require("express-jwt");
let Candidate = mongoose.model('Candidate');
let Comment = mongoose.model('Comment');
let Tweet = mongoose.model('Tweet');
let User = mongoose.model('User');
let auth = jwt({
  userProperty: 'payload',
  secret: process.env.JWTsecret
});

router.get('/', (req, res, next) => {
  Candidate.find({})
  .populate('name', 'sentiment', 'dateCreated')
  .exec((err, result) => {
    if (err) return next(err);
    res.send(result);
  });
});

router.post('/', auth, (req, res, next) => {
  let candidate = new Candidate(req.body);
})

module.exports = router;
