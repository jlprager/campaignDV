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

router.post('/register', (req, res, next) => {
  let user = new User();
  user.emailRegis.userName = req.body.username;
  user.emailRegis.email = req.body.email;
  user.emailRegis.name = req.body.name;
  user.CreateHash(req.body.password, (err, hash)=> {
    if(err) return next(err);
    user.emailRegis.password = hash;
    user.save((err, result) => {
      if(err) return next(err);
      if(!result) return next('Error creating user');
      res.send({ token : result.generateJWT() });
    });
  });
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if(err) return next(err);
    res.send({ token : user.generateJWT() });
  })(req, res, next);
});



module.exports = router;
