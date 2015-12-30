(function() {
    'use strict';
    angular.module('app')
    .controller('CandidateController', CandidateController);

    function CandidateController(TweetFactory) {
        var vm = this;

        // Pass in candidate based on a future conditional $stateParams we set up. Hardcoded at moment for testing.
        TweetFactory.getCandidateTweets('clinton').then(function(res) {
            vm.tweets = res;
        }, function(err) {
            //
        });

    }
})();
