"use strict";
let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");
let passport = require("passport");
let User = mongoose.model("User");
let jwt = require("express-jwt");
let GOOGLE_SCOPES = ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'];
let stripe = require('stripe')(process.env.STRIPE_TEST_SECRET_KEY);

router.post('/charge', (req, res, next) => {
  stripe.charges.create({
    amount: 2000,
    currency: 'usd',
    source: req.body.token,
    description: 'One time account upgrade for user # ' + req.body.uuid,
  }, function(err, charge) {
    if (err) return next(err);
      User.findOneAndUpdate({uuid: req.body.uuid}, {premiumStatus: true}, function(err, user) {
        if (err) throw err;
        res.end();
      });    
  })
});

router.get("/auth/facebook", passport.authenticate("facebook", {
  scope: ['email']
}));

router.get("/auth/facebook/callback",
    passport.authenticate("facebook"), (req, res) => {
        if (req.newAccount) {
            return res.redirect(`/welcome?code=${req.user.generateJWT()}`);
        }
        res.redirect(`/?code=${req.user.generateJWT()}`);
    });

router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback',
	passport.authenticate('twitter', {
  failureRedirect: '/Login'
}), (req, res) => {
    res.redirect('/?code=' + req.user.generateJWT());
});

router.get('/auth/google',
  passport.authenticate('google', { scope: GOOGLE_SCOPES.join(" ") }
));

router.get("/auth/google/callback",
  passport.authenticate("google"), (req, res) => {
    if(req.newAccount) {
      return res.redirect(`/welcome?code=${req.user.generateJWT()}`);
    }
    res.redirect(`/?code=${req.user.generateJWT()}`);
  });

router.post('/register', (req, res, next) => {
  console.log('req:');
  console.log(req.body);
  let user = new User();
  // user.email = req.body.email;
  user.emailRegis.userName = req.body.username;
  user.emailRegis.email = req.body.email;
  user.emailRegis.name = req.body.name;
  user.CreateHash(req.body.password, (err, hash)=> {
    if(err) return next(err);
    user.emailRegis.password = hash;
    user.save((err, result) => {
      console.log('result:');
      console.log(result);
      if(err) return next(err);
      if(!result) return next('Error creating user');
      res.send({ token : result.generateJWT() });
    });
  });
});

router.post('/login', (req, res, next) => {
  console.log('hitting login route')
  passport.authenticate('local', (err, user) => {
    if(err) return next(err);
    res.send({ token : user.generateJWT() });
  })(req, res, next);
});


module.exports = router;
