"use strict";
let mongoose = require("mongoose");
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
let uuid = require('node-uuid');

let UserSchema = new mongoose.Schema({
	uuid : { type : String, default : uuid.v4() },
	//email : String,
	comments : [{ type : mongoose.Schema.Types.ObjectId, ref: "Comment" }],
	candidates: { type : mongoose.Schema.Types.ObjectId, ref: "Candidate"},
	premiumStatus: { type : Boolean, default : false },
	politicalLeaning: String,
	UScitizen: Boolean,
	bio: String,
	profilePic: String,
	age: Number,
	gender: String,
	emailRegis: {
		name: String,
		userName: String,
		password: String,
		email: String
	},
	facebook: {
		id: String,
		token: String,
		email: String,
		name: String
	},
	twitter: {
		id: String,
		token: String,
		email: String,
		name: String,
		displayName: String
	},
	google: {
		id: String,
		token: String,
		email: String,
		name: String
	},
	//URI : api.tumblr.com/v2/user/info
	//** Maybe not tumblr. API doesn't produce enough info.
	tumblr: {
		displayName: String
	}
});

UserSchema.methods.CreateHash = function(password, cb){
  let SALT_ROUNDS = 10;
  if(process.env.NODE_ENV === 'test') SALT_ROUNDS = 1;
  bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
    if(err) return cb(err);
    bcrypt.hash(password, salt, (err, hash) => {
      if(err) return cb(err);
      cb(null, hash);
    });
  });
};

UserSchema.methods.validatePassword = function(password, hash, cb){
  bcrypt.compare(password, hash, (err, res) => {
    if(err) return cb(err);
    cb(null, res);
  });
};

UserSchema.methods.generateJWT = function() {
    return jwt.sign({
        _id: this._id,
        name: this.name,
        password: this.password,
        email: this.email
    }, "weSecretlyLoveBernie");
};


module.exports = mongoose.model("User", UserSchema);
