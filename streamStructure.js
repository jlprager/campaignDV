/**
 * @Original Author: Danny Gillies
 */

// List of keywords to be captured
var keywords = ["#FeelTheBern", "#Bernie2016", "#NoBernie", "#ScrewSanders" ];
var keywords2 = ["#Trump2016", "#DumpTrump"];

var Twit = require("twit");

// Twitter dev information, using a temporary twitter account for this application. Do not need to change
var T = new Twit({
    consumer_key: "n37Pkz2GxSTsd9WCalaKLrHhQ",
    consumer_secret: "qYXPpzvzDSzpgqpt0gEF4e4TkmuF3p06I7eofIBIrM6bZJKmpg",
    access_token: "3219700082-ZHK1alLaY1GQPHGYPPlGwFAN9G1Yys6qzQIcRaN",
    access_token_secret: "Wj9eCdaofbO7HhXgocio0KpjAg02pASq1oZ2bEiWThtKD"
});

var Tweet = require("./models/tweet.js");
var mongoose = require("mongoose");

// Connect to database (Make sure this is only called once
mongoose.connect("mongodb://localhost/campaign-test");
//var config = require("./config.js");

// Stores database in a variable
var db = mongoose.connection;

// Error handling for being unable to connect
db.on("error", console.error.bind(console, "connection error:"));

// Opens the database connection to wait for tweets
db.once("open", function() {
    console.log("Connected to database, waiting for tweets...");
    waitForTweets(db)
});

var waitForTweets = function(db) {
    var collection = db.collection("tweets");

    // Track tweets with the keyword "#FeelTheBern"
    var stream = T.stream("statuses/filter", {
        track: keywords,
        language: "en"
    })
    var stream2 = T.stream("statuses/filter", {
        track: keywords2,
        language: "en"
    });

    // Start the stream, and store the JSON information in data
    stream.on("tweet", function(data) {
        // Create the tweet object
        var tweet = new Tweet({
            id: data.id,
            raw: data,
            user: data.user.screen_name,
            description: data.text,
            timestamp: data.timestamp_ms,
            created_at: data.created_at
        });

        // Store the tweet in the database
        tweet.save(function(err, tweet) {
            if (err) return console.error(err);
            console.log("(" + tweet.created_at + ") " + tweet.user + ": " + tweet.description);
            console.log("");
        })
    })

    // Start the stream, and store the JSON information in data
    stream2.on("tweet", function(data) {
        // Create the tweet object
        var tweet = new Tweet({
            id: data.id,
            raw: data,
            user: data.user.screen_name,
            description: data.text,
            timestamp: data.timestamp_ms,
            created_at: data.created_at
        });

        // Store the tweet in the database
        tweet.save(function(err, tweet) {
            if (err) return console.error(err);
            console.log("(" + tweet.created_at + ") " + tweet.user + ": " + tweet.description);
            console.log("");
        })
    })

}
