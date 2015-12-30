'use strict';
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let jwt = require("express-jwt");
let Comment = mongoose.model('Comment');
let User = mongoose.model('User');
let Candidate = mongoose.model('Candidate');
let Tweet = mongoose.model('Tweet');
let auth = jwt({
    userProperty: 'payload',
    secret: process.env.JWTsecret
});

//GET /api/v1/tweets
router.get('/', (req, res, next) => {
    let timer = new Date(new Date().getTime() - (5 * 60 * 1000));
    Tweet.find({ created_at: { $gte: timer } }).exec((err, result) => {
        if(err) return next(err);
        if(!result) return('Unable to pull the last 5 minutes of tweets')
        res.send(sentimentByCandidate(result));
    });
});

//GET /api/v1/tweets/bernie
router.get('/:candidate', (req, res, next) => {
    let timer = new Date(new Date().getTime() - (15 * 1000));
    Tweet.find({ $and: [ { created_at: { $gte: timer } }, { candidate: req.params.candidate } ] }).exec((err, result) => {
        if(err) return next(err);
        if(!result) return('Unable to pull the last 15 seconds of tweets')
        res.send(result);
    });
});

function sentimentByCandidate(tweets) {
    let bernie = [];
    let clinton = [];
    let trump = [];
    let bush = [];
    for (var i = 0; i < tweets.length; i++) {
        if (tweets[i].candidate === 'bernie')
            bernie.push(tweets[i].sentiment);
        else if (tweets[i].candidate === 'clinton')
            clinton.push(tweets[i].sentiment);
        else if (tweets[i].candidate === 'trump')
            trump.push(tweets[i].sentiment);
        else if (tweets[i].candidate === 'bush')
            bush.push(tweets[i].sentiment);
    }
    return {
        bernie: averageSentiment(bernie),
        clinton: averageSentiment(clinton),
        trump: averageSentiment(trump),
        bush: averageSentiment(bush)
    }
}

function averageSentiment(arr) {
    if(arr.length === 0)
        return 0;
    let sum = 0;
    for (var i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    let average = sum / arr.length;
    return Number(Math.round(average + 'e2') + 'e-2');
}

module.exports = router;