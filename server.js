"use strict";
require("dotenv").config({ silent : true });
let express = require('express');
let helmet = require("helmet");
let bodyParser = require('body-parser');
let app = express();
let port = process.env.PORT || 3000;
let mongoose = require("mongoose");
let passport = require("passport");
let session = require('express-session');
require("./models/user");
require('./models/candidate');
require('./models/tweet');
require('./models/comment');
require("./config/passport");
mongoose.connect(process.env.MONGO_URL);

app.set('views', './views');
app.engine('.html', require('ejs').renderFile);
app.use(express.static('./public'));
app.use(express.static('./bower_components'));
app.set('view engine', 'html');
app.set('view options', {
	layout: false
});

app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUnitialized: true
}));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());

let userRoutes = require('./routes/userRoutes');
let candidateRoutes = require('./routes/candidateRoutes');
let commentRoutes = require('./routes/commentRoutes');
let tweetRoutes = require('./routes/tweetRoutes');

app.use('/api/v1/users/', userRoutes);
app.use('/api/v1/candidates/', candidateRoutes);
app.use('/api/v1/comments/', commentRoutes);
app.use('/api/v1/tweets/', tweetRoutes);

app.get('/*', function(req, res) {
	res.render('index');
});


/**
 * @Original Author: Danny Gillies
 */

// List of keywords to be captured
// function startTweets() {
var sentiment = require('sentiment');

//tracked hashtags
var bernieTags = ["#Bernie2016", "#FeelTheBern"];
var clintonTags = ["#Hillary2016", "#Clinton2016"];
var trumpTags = ["#Trump2016", "#WhyISupportTrump"];
var bushTags = ["#Bush2016", "#Jeb2016"];

//localcount storage
var bernieCount;
var clintonCount;
var trumpCount;
var bushCount;

var Twit = require("twit");

// Twitter dev information, using a temporary twitter account for this application. Do not need to change
var T = new Twit({
    consumer_key: "1771lhLof6UPZr41zfG1MIdKm",
    consumer_secret: "LL21BgUf1kBayum52YGYB01MAMgj1JphSqJuQOaNNndoik1KWQ",
    access_token: "4666061954-EcLI5yeDCx9qmfJUxLXvmesub4YdnC7MLyIklbd",
    access_token_secret: "Qbv6B3SUjRZMOgcgVrpuXCkvwub4BujaD7xmXSZ05oX9t"
});

var Tweet = require("./models/tweet.js");
// var mongoose = require("mongoose");

// Connect to database (Make sure this is only called once
// mongoose.connect("mongodb://localhost/campaign-test");
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
    var bernieStream = T.stream("statuses/filter", {
        track: bernieTags,
        language: "en"
    })

    var clintonStream = T.stream("statuses/filter", {
    	track: clintonTags,
    	language: "en"
    })

    var trumpStream = T.stream("statuses/filter", {
        track: trumpTags,
        language: "en"
    });

    var bushStream = T.stream("statuses/filter", {
    	track: bushTags,
    	language: "en"
    })

    // Start the stream, and store the JSON information in data
    console.log("BERNIE on");
    bernieStream.on("tweet", function(data) {
        sentiment(data.text, function(err, result) {
            // Create the tweet object
            var tweet = new Tweet({
            	candidate: "bernie",
                user: data.user.screen_name,
                description: data.text,
                sentiment: result.score,
                created_at: data.created_at
            });

            bernieCount++;

            tweet.save(function(err, tweet) {
                if (err) return console.error(err);
                console.log(tweet.candidate + " (" + tweet.created_at + ") scored " + tweet.sentiment + ": " + tweet.description);
                console.log("");
            });
        });
    })

    console.log("CLINTON on");
    clintonStream.on("tweet", function(data) {
        sentiment(data.text, function(err, result) {
            // Create the tweet object
            var tweet = new Tweet({
            	candidate: "clinton",
                user: data.user.screen_name,
                description: data.text,
                sentiment: result.score,
                created_at: data.created_at
            });

            clintonCount++;

            tweet.save(function(err, tweet) {
                if (err) return console.error(err);
                console.log(tweet.candidate + "(" + tweet.created_at + ") scored " + tweet.sentiment + ": " + tweet.description);
                console.log("");
            });
        });
    })

    console.log("TRUMP on");
    trumpStream.on("tweet", function(data) {
        sentiment(data.text, function(err, result) {
            // Create the tweet object
            var tweet = new Tweet({
                candidate: "trump",
                user: data.user.screen_name,
                description: data.text,
                sentiment: result.score,
                created_at: data.created_at
            });

            trumpCount++;

            // Store the tweet in the database
            tweet.save(function(err, tweet) {
                if (err) return console.error(err);
                console.log(tweet.candidate + "(" + tweet.created_at + ") scored " + tweet.sentiment + ": " + tweet.description);
                console.log("");
            });
        });
    })


    console.log("BUSH on");
    bushStream.on("tweet", function(data) {
        sentiment(data.text, function(err, result) {
            // Create the tweet object
            var tweet = new Tweet({
                candidate: "bush",
                user: data.user.screen_name,
                description: data.text,
                sentiment: result.score,
                created_at: data.created_at
            });

            bushCount++;

            // Store the tweet in the database
            tweet.save(function(err, tweet) {
                if (err) return console.error(err);
                console.log(tweet.candidate + "(" + tweet.created_at + ") scored " + tweet.sentiment + ": " + tweet.description);
                console.log("");
            });
        });
    })
}



app.use((err, req, res, next) => {
	if(process.env.NODE_ENV !== "test") {console.log(err)}
		res.status(500).send(err);
});

module.exports = app.listen(port, () => {
	console.log('Example app listening at http://localhost:' + port);
});
