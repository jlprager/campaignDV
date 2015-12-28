"use strict";
let mongoose = require("mongoose");

let TweetSchema = mongoose.Schema({
	id : Number,
	raw : JSON,
    user : String,
    description : String, 
    timestamp : Number,
    created_at : Date
});

module.exports = mongoose.model("Tweet", TweetSchema);