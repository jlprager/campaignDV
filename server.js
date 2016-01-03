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
require('./models/dailyStats');
require("./config/passport");
let DailyStat = mongoose.model('DailyStat');
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
let emailRoutes = require('./routes/emailRoutes');
let dailyStatRoutes = require('./routes/dailyStatRoutes');

app.use('/api/v1/users/', userRoutes);
app.use('/api/v1/candidates/', candidateRoutes);
app.use('/api/v1/comments/', commentRoutes);
app.use('/api/v1/tweets/', tweetRoutes);
app.use('/api/v1/contact/', emailRoutes);
app.use('/api/v1/dailystats', dailyStatRoutes);

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
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_TOKEN_SECRET
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
								if(tweet.sentiment > 0) {
									console.log('bernie positive push');
									DailyStat.update({ candidate: "Bernie Sanders"},
										{ $push: { positive: { user: tweet.user, date: tweet.created_at }}}, (err, result) => {
											if (err) console.log(err);
									});
								}
								else if (tweet.sentiment < 0) {
									DailyStat.update({ candidate: "Bernie Sanders"},
										{ $push: { negative: { user: tweet.user, date: tweet.created_at }}}, (err, result) => {
											if (err) console.log(err);
									});
								}
								else DailyStat.update({ candidate: "Bernie Sanders"},
									{ $push: { neutral: { user: tweet.user, date: tweet.created_at }}}, (err, result) => {
										if (err) console.log(err);
								});
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
								if(tweet.sentiment > 0) {
								console.log('clinton positive');
								DailyStat.update({ candidate: "Hillary Clinton"},
									{ $push: { positive: { user: tweet.user, date: tweet.created_at }}}, (err, result) => {
										if (err) console.log(err);
								});
							}
							else if (tweet.sentiment < 0) {
								DailyStat.update({ candidate: "Hillary Clinton"},
									{ $push: { negative: { user: tweet.user, date: tweet.created_at }}}, (err, result) => {
										if (err) console.log(err);
								});
							}
							else DailyStat.update({ candidate: "Hillary Clinton"},
								{ $push: { neutral: { user: tweet.user, date: tweet.created_at }}}, (err, result) => {
									if (err) console.log(err);
							});
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
								if(tweet.sentiment > 0) {
									DailyStat.update({ candidate: "Donald Trump"},
										{ $push: { positive: { user: tweet.user, date: tweet.created_at }}}, (err, result) => {
											if (err) console.log(err);
									});
								}
								else if (tweet.sentiment < 0) {
									DailyStat.update({ candidate: "Donald Trump"},
										{ $push: { negative: { user: tweet.user, date: tweet.created_at }}}, (err, result) => {
											if (err) console.log(err);
									});
								}
								else DailyStat.update({ candidate: "Donald Trump"},
									{ $push: { neutral: { user: tweet.user, date: tweet.created_at }}}, (err, result) => {
										if (err) console.log(err);
								});
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
								if(tweet.sentiment > 0) {
									DailyStat.update({ candidate: "Jeb Bush"},
										{ $push: { positive: { user: tweet.user, date: tweet.created_at }}}, (err, result) => {
											if (err) console.log(err);
									});
								}
								else if (tweet.sentiment < 0) {
									DailyStat.update({ candidate: "Jeb Bush"},
										{ $push: { negative: { user: tweet.user, date: tweet.created_at }}}, (err, result) => {
											if (err) console.log(err);
									});
								}
								else DailyStat.update({ candidate: "Jeb Bush"},
									{ $push: { neutral: { user: tweet.user, date: tweet.created_at }}}, (err, result) => {
										if (err) console.log(err);
								});
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
