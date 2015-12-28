"use strict";
let passport = require("passport");
let LocalStrategy = require("passport-local").Strategy;
let FacebookStrategy = require("passport-facebook").Strategy;
let TwitterStrategy = require("passport-twitter").Strategy;
let GooglePlusStrategy = require("passport-google-plus").Strategy;
let mongoose = require("mongoose");
let request = require("request");

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((obj, done) => {
	done(null, obj);
});

passport.use(new FacebookStrategy({
    clientID: "164683670557913",
    clientSecret: "2a724c8f26c19495d24a4ef26dd9f9f2",
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ["emails", "name", "id"]
    enableProof: false
  },
  (accessToken, refreshToken, profile, done) => {
    User.findOne({ facebookId: profile.id }.exec, (err, user) => {
      if(err) return done(err) 
      if(user){
      	req.user = user;
      	return done(null, user);
      }
      else{
      	let user = new User();
      	user.facebook.id = profile.id,;
      	user.facebook.token = accessToken;
      	user.facebook.email = profile.emails[0].value;
      	user.facebook.name = profile.name
      	user.save((err, user) => {
      		if(err) return done(err);
      		return done(null, user);
      	})


      }
    });
  }
));

passport.use(new TwitterStrategy({
    consumerKey: "VeUfUr7ZJTG2NtEtUX91JywQS",
    consumerSecret: "07PkUHFTwcohOUV4xxZHK1opCuuFnJUO6ZgHKAXlrfBjlggyCg",
    callbackURL: "http://localhost:3000/auth/twitter/callback",
    profileFields: ["name", "screen_name"]
  },
  (token, tokenSecret, profile, done) => {
    User.findOne({ twitterId: profile.id }, (err, user) => {
    	if(err) return done(err);
    	if(user) return done(null, user);
    	else{
    		var user = new User();
    		user.twitter.id = profile.id;
    		user.twitter.token = accessToken;
    		user.twitter.name = name[0] + " " + name[1];
    		user.twitter.displayName = profile.displayName;
    		user.save((err, user) => {
    			if(err) return done(err);
    			return done(null, user);
    		})
    	}
    });
  }
));

passport.use(new GooglePlusStrategy({
    clientId: "619876648270-0pr1jg9a05nhvio1efkmcrvhhe4em47h.apps.googleusercontent.com",
    clientSecret: "EZIW6lpYvWpa9l3sTrLfX1UG"
  },
  function(tokens, profile, done) {
    // Create or update user, call done() when complete...
    done(null, profile, tokens);
  }
));
