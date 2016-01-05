"use strict";
let mongoose = require('mongoose');
require('./models/candidate');
require('./models/tweet');
let Candidate = mongoose.model("Candidate");
let Tweet = mongoose.model('Tweet');

module.exports = function() {

  function timer() {
      console.log('database reset initiated');
      setTimeout(function() {

        // -------------------------------------------------------
        // ---------------------BERNIE----------------------------
        // -------------------------------------------------------
        Candidate.findOne({ name: "Bernie Sanders" }, { 'dailyRating':1 }, (err, result) => {
          if (err) console.log(err);
          let posTweetsB = result.dailyRating.posTweets;
          let totalTweetsB = result.dailyRating.totalTweets;
          let bernieRating = { percentage : (posTweetsB/totalTweetsB), total : totalTweetsB, date : (new Date().toJSON().slice(0,10))};

            Candidate.update({ name: "Bernie Sanders" }, { $push : { 'favorRatingTotals': bernieRating }}, (err, result) => {
              if (err) console.log(err);
              Candidate.update({ name: "Bernie Sanders" }, { $set : { 'dailyRating.totalTweets': 0 }}, (err, result) => {
                if (err) console.log(err);
              });
              Candidate.update({ name: "Bernie Sanders" }, { $set : { 'dailyRating.posTweets': 0 }}, (err, result) => {
                if (err) console.log(err);
              });
            });
          });

        // -------------------------------------------------------
        // ---------------------CLINTON---------------------------
        // -------------------------------------------------------
        Candidate.findOne({ name: "Hillary Clinton" }, { 'dailyRating':1 }, (err, result) => {
          if (err) console.log(err);
          let posTweetsC = result.dailyRating.posTweets;
          let totalTweetsC = result.dailyRating.totalTweets;
          let clintonRating = { percentage : (posTweetsC/totalTweetsC), total : totalTweetsC, date : (new Date().toJSON().slice(0,10))};

            Candidate.update({ name: "Hillary Clinton" }, { $push : { 'favorRatingTotals': clintonRating }}, (err, result) => {
              if (err) console.log(err);
              Candidate.update({ name: "Hillary Clinton" }, { $set : { 'dailyRating.totalTweets': 0 }}, (err, result) => {
                if (err) console.log(err);
              });
              Candidate.update({ name: "Hillary Clinton" }, { $set : { 'dailyRating.posTweets': 0 }}, (err, result) => {
                if (err) console.log(err);
              });
            });
          });


        // -------------------------------------------------------
        // ----------------------TRUMP----------------------------
        // -------------------------------------------------------
        Candidate.findOne({ name: "Donald Trump" }, { 'dailyRating':1 }, (err, result) => {
          if (err) console.log(err);
          let posTweetsT = result.dailyRating.posTweets;
          let totalTweetsT = result.dailyRating.totalTweets;
          let trumpRating = { percentage : (posTweetsT/totalTweetsT), total : totalTweetsT, date : (new Date().toJSON().slice(0,10))};

            Candidate.update({ name: "Donald Trump" }, { $push : { 'favorRatingTotals': trumpRating }}, (err, result) => {
              if (err) console.log(err);
              Candidate.update({ name: "Donald Trump" }, { $set : { 'dailyRating.totalTweets': 0 }}, (err, result) => {
                if (err) console.log(err);
              });
              Candidate.update({ name: "Donald Trump" }, { $set : { 'dailyRating.posTweets': 0 }}, (err, result) => {
                if (err) console.log(err);
              });
            });
          });


        // -------------------------------------------------------
        // ----------------------TWEETS---------------------------
        // -------------------------------------------------------
        Tweet.remove({}, (err, result) => {
          if(err) console.log(err);
        });


          timer();
      }, 30000);
  }

  timer();

};
