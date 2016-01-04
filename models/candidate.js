"use strict";
let mongoose = require("mongoose");

let CandidateSchema = new mongoose.Schema({
	name: String,
	sentiment: Number,
	favorRating: Number
});

module.exports = mongoose.model("Candidate", CandidateSchema);
