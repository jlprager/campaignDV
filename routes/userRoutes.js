"use strict";
let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");
let passport = require("passport");
let User = mongoose.model("User");
let jwt = require("express-jwt");

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

module.exports = router;
