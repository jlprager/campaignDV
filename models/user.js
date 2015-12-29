"use strict";
let mongoose = require("mongoose");
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");

let UserSchema = new mongoose.Schema({
	comments : [{ type : mongoose.Schema.Types.ObjectId, ref: "Comment" }],
	candidate: { type : mongoose.Schema.Types.ObjectId, ref: "Candidate"},
	premiumStatus: { type : boolean, default : false },
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
		firstName: String,
		lastName: String

	},
	//URI : api.tumblr.com/v2/user/info
	//** Maybe not tumblr. API doesn't produce enough info.
	tumblr: {
		displayName: String
	}
});

UserSchema.methods.generateJWT = function(){
	return jwt.sign({
		_id : this._id,
		name: this.name,
		password: this.password,
		email: this.email
	}, process.env.JWTsecret);
};


module.exports = mongoose.model("User", UserSchema);
