(function() {
    'use strict';
    angular.module('app')
    .controller('CandidateController', CandidateController);

    function CandidateController($scope, $timeout, $stateParams, TweetFactory, CandidateFactory) {
        var vm = this;
        vm.tweets;
        vm.timeoutHandler;

        CandidateFactory.getCandidateById($stateParams.id).then(function(res) {
            vm.candidate = res;
        }, function(err) {
            //
        });

        // Updating client side every 15 seconds(this function). Pulling from last 15 seconds of data(tweetRoutes.js)
        (function tick() {
            // Pass in candidate based on a future conditional $stateParams we set up. Hardcoded at moment for testing.
            TweetFactory.getCandidateTweets('bernie').then(function(res) {
                vm.tweets = res;
                vm.timeoutHandler = $timeout(tick, 10000);
            }, function(err) {
				//
			});
    	})();

        // Cancel interval on page change
		$scope.$on('$destroy', function(){
    		if (angular.isDefined(vm.timeoutHandler)) {
        		$timeout.cancel(vm.timeoutHandler);
        		vm.timeoutHandler = undefined;
    		}
		});


    }
})();
