"use strict";
let mongoose = require("mongoose");

let CandidateSchema = new mongoose.Schema({
	name: String,
	sentiment: {
		tweets: [{  type : mongoose.Schema.Types.ObjectId, ref: "Tweet" }],
		score: Number
	},
	dateCreated: { type : Date, default: Date.now },
	user: { type : mongoose.Schema.Types.ObjectId, ref: "User" },
	comments: [{ type : mongoose.Schema.Types.ObjectId, ref: "Comment" }],
	numComments: { type : Number, default: 0 }
});

module.exports = mongoose.model("Candidate", CandidateSchema);
