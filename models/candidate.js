"use strict";
let mongoose = require("mongoose");

let CandidateSchema = new mongoose.Schema({
	name: String,
	sentiment: Number,
	favorRatingTotals: [],
	dailyRating: {
		posTweets: Number,
		totalTweets: Number
	}
});

module.exports = mongoose.model("Candidate", CandidateSchema);
