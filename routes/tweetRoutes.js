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
    let bernie = []; let posBernie = []; let negBernie = []; let neutBernie = [];
    let clinton = []; let posClinton = []; let negClinton = []; let neutClinton = [];
    let trump = []; let posTrump = []; let negTrump = []; let neutTrump = [];
    let bush = []; let posBush = []; let negBush = []; let neutBush = [];
    let berniePosPercent, bernieNegPercent, bernieNeutPercent, clintonPosPercent, clintonNegPercent, clintonNeutPercent,
        trumpPosPercent, trumpNegPercent, trumpNeutPercent, bushPosPercent, bushNegPercent, bushNeutPercent;

    for (var i = 0; i < tweets.length; i++) {
        if (tweets[i].candidate === 'bernie') {
            bernie.push(tweets[i].sentiment);
            if (tweets[i].sentiment > 0) { posBernie.push(tweets[i].user) }
            else if (tweets[i].sentiment < 0) { negBernie.push(tweets[i].user) }
            else { neutBernie.push(tweets[i].user) }
        }

        else if (tweets[i].candidate === 'clinton') {
            clinton.push(tweets[i].sentiment);
            if (tweets[i].sentiment > 0) { posClinton.push(tweets[i].user) }
            else if (tweets[i].sentiment < 0) { negClinton.push(tweets[i].user) }
            else { neutClinton.push(tweets[i].user) }
        }

        else if (tweets[i].candidate === 'trump') {
            trump.push(tweets[i].sentiment);
            if (tweets[i].sentiment > 0) { posTrump.push(tweets[i].user) }
            else if (tweets[i].sentiment < 0) { negTrump.push(tweets[i].user) }
            else { neutTrump.push(tweets[i].user) }
        }

        else if (tweets[i].candidate === 'bush') {
            bush.push(tweets[i].sentiment);
            if (tweets[i].sentiment > 0) { posBush.push(tweets[i].user) }
            else if (tweets[i].sentiment < 0) { negBush.push(tweets[i].user) }
            else { neutBush.push(tweets[i].user) }
        }

    }

    berniePosPercent = ((posBernie.length) / (posBernie.length + negBernie.length + neutBernie.length));
    bernieNegPercent = ((negBernie.length) / (posBernie.length + negBernie.length + neutBernie.length));
    bernieNeutPercent = ((neutBernie.length) / (posBernie.length + negBernie.length + neutBernie.length));
    clintonPosPercent = ((posClinton.length) / (posClinton.length + negClinton.length + neutClinton.length));
    clintonNegPercent = ((negClinton.length) / (posClinton.length + negClinton.length + neutClinton.length));
    clintonNeutPercent = ((neutClinton.length) / (posClinton.length + negClinton.length + neutClinton.length));
    trumpPosPercent = ((posTrump.length) / (posTrump.length + negTrump.length + neutTrump.length));
    trumpNegPercent = ((negTrump.length) / (posTrump.length + negTrump.length + neutTrump.length));
    trumpNeutPercent = ((neutTrump.length) / (posTrump.length + negTrump.length + neutTrump.length));
    bushPosPercent = ((posBush.length) / (posBush.length + negBush.length + neutBush.length));
    bushNegPercent = ((negBush.length) / (posBush.length + negBush.length + neutBush.length));
    bushNeutPercent = ((neutBush.length) / (posBush.length + negBush.length + neutBush.length));


    return {
        bernie: averageSentiment(bernie),
        clinton: averageSentiment(clinton),
        trump: averageSentiment(trump),
        bush: averageSentiment(bush),
        posBernie: berniePosPercent, negBernie: bernieNegPercent, neutBernie: bernieNeutPercent,
        posClinton: clintonPosPercent, negClinton: clintonNegPercent, neutClinton: clintonNeutPercent,
        posTrump: trumpPosPercent, negTrump: trumpNegPercent, neutTrump: trumpNeutPercent,
        posBush: bushPosPercent, negBush: bushNegPercent, neutBush: bushNeutPercent
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
