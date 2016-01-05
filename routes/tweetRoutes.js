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

//GET /api/v1/tweets/:candidate
router.get('/:candidate', (req, res, next) => {
    let timer = new Date(new Date().getTime() - (15 * 1000));
    Tweet.find({ $and: [ { created_at: { $gte: timer } }, { candidate: req.params.candidate } ] }).exec((err, result) => {
        if(err) return next(err);
        if(!result) return('Unable to pull the last 15 seconds of tweets');
        res.send(result);
    });
});

function sentimentByCandidate(tweets) {
    let bernie = []; let posBernie = []; let negBernie = []; let neutBernie = [];
    let clinton = []; let posClinton = []; let negClinton = []; let neutClinton = [];
    let trump = []; let posTrump = []; let negTrump = []; let neutTrump = [];
    let bush = []; let posBush = []; let negBush = []; let neutBush = [];
    let poolSizeBernie, berniePosPercent, bernieNegPercent, bernieNeutPercent,
        poolSizeClinton, clintonPosPercent, clintonNegPercent, clintonNeutPercent,
        poolSizeTrump, trumpPosPercent, trumpNegPercent, trumpNeutPercent,
        poolSizeBush, bushPosPercent, bushNegPercent, bushNeutPercent;

    for (var i = 0; i < tweets.length; i++) {
        if (tweets[i].candidate === 'Bernie Sanders') {
            bernie.push(tweets[i].sentiment);
            if (tweets[i].sentiment > 0) { posBernie.push(tweets[i].user) }
            else if (tweets[i].sentiment < 0) { negBernie.push(tweets[i].user) }
            else { neutBernie.push(tweets[i].user) }
        }

        else if (tweets[i].candidate === 'Hillary Clinton') {
            clinton.push(tweets[i].sentiment);
            if (tweets[i].sentiment > 0) { posClinton.push(tweets[i].user) }
            else if (tweets[i].sentiment < 0) { negClinton.push(tweets[i].user) }
            else { neutClinton.push(tweets[i].user) }
        }

        else if (tweets[i].candidate === 'Donald Trump') {
            trump.push(tweets[i].sentiment);
            if (tweets[i].sentiment > 0) { posTrump.push(tweets[i].user) }
            else if (tweets[i].sentiment < 0) { negTrump.push(tweets[i].user) }
            else { neutTrump.push(tweets[i].user) }
        }
    }

    poolSizeBernie = (posBernie.length + negBernie.length + neutBernie.length);
    berniePosPercent = ((posBernie.length) / (poolSizeBernie));
    bernieNegPercent = ((negBernie.length) / (poolSizeBernie));
    bernieNeutPercent = ((neutBernie.length) / (poolSizeBernie));
    poolSizeClinton = (posClinton.length + negClinton.length + neutClinton.length);
    clintonPosPercent = ((posClinton.length) / (poolSizeClinton));
    clintonNegPercent = ((negClinton.length) / (poolSizeClinton));
    clintonNeutPercent = ((neutClinton.length) / (poolSizeClinton));
    poolSizeTrump = (posTrump.length + negTrump.length + neutTrump.length);
    trumpPosPercent = ((posTrump.length) / (poolSizeTrump));
    trumpNegPercent = ((negTrump.length) / (poolSizeTrump));
    trumpNeutPercent = ((neutTrump.length) / (poolSizeTrump));
    poolSizeBush = (posBush.length + negBush.length + neutBush.length);
    bushPosPercent = ((posBush.length) / (poolSizeBush));
    bushNegPercent = ((negBush.length) / (poolSizeBush));
    bushNeutPercent = ((neutBush.length) / (poolSizeBush));

    return {
        bernie: averageSentiment(bernie),
        clinton: averageSentiment(clinton),
        trump: averageSentiment(trump),
        bush: averageSentiment(bush),
        posBernie: berniePosPercent, negBernie: bernieNegPercent, neutBernie: bernieNeutPercent, berniePool: poolSizeBernie,
        posClinton: clintonPosPercent, negClinton: clintonNegPercent, neutClinton: clintonNeutPercent, clintonPool: poolSizeClinton,
        posTrump: trumpPosPercent, negTrump: trumpNegPercent, neutTrump: trumpNeutPercent, trumpPool: poolSizeTrump,
        posBush: bushPosPercent, negBush: bushNegPercent, neutBush: bushNeutPercent, bushPool: poolSizeBush
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
