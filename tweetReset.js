"use strict";
let mongoose = require('mongoose');
require('./models/tweet');
let Tweet = mongoose.model('Tweet');

module.exports = function() {

  function timer() {
      setTimeout(function() {

        // -------------------------------------------------------
        // ----------------------TWEETS---------------------------
        // -------------------------------------------------------
        Tweet.remove({}, (err, result) => {
          if(err) console.log(err);
        });

        console.log('Tweet collection deleted');


          timer();
      }, 3600000);
  }

  timer();

};
