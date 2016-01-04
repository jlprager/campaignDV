(function() {
	'use strict';
	angular.module('app')
	.controller('HomeController', HomeController);

	function HomeController($scope, $state, $location, $timeout, UserFactory, TweetFactory, CandidateFactory) {
		var vm = this;
		var url = $location.search();
		var size = 0;
		vm.timeoutHandler;
		vm.bernie = 0;
		vm.clinton = 0;
		vm.trump = 0;
		vm.bush = 0;
		vm.posBernie; vm.negBernie; vm.neutBernie;
		vm.posClinton; vm.negClinton; vm.neutClinton;
		vm.posTrump; vm.negTrump; vm.neutTrump;
		vm.posBush; vm.negBush; vm.neutBush;

		CandidateFactory.getPresidentialCandidates().then(function(res) {
			vm.candidates = res;
		}, function(err) {
			//
		});


		if(url.code){
			UserFactory.setToken(url.code);
			$location.search("code", null);
		}

		// Updating client side every 15 seconds(this function). Pulling from last 5 minutes of data(tweetRoutes.js)
		(function tick() {
			TweetFactory.getRecentTweets().then(function(res) {
				vm.bernie = res.bernie;
				vm.clinton = res.clinton;
				vm.trump = res.trump;
				vm.bush = res.bush;

				vm.posBernie = res.posBernie; vm.negBernie = res.negBernie; vm.neutBernie = res.neutBernie; vm.berniePool = res.berniePool;
				vm.posClinton = res.posClinton; vm.negClinton = res.negClinton; vm.neutClinton = res.neutClinton; vm.clintonPool = res.clintonPool;
				vm.posTrump = res.posTrump; vm.negTrump = res.negTrump; vm.neutTrump = res.neutTrump; vm.trumpPool = res.trumpPool;
				vm.posBush = res.posBush; vm.negBush = res.negBush; vm.neutBush = res.neutBush; vm.bushPool = res.bushPool;


			var bernieImg = 100;
			var hillaryImg = 100;
			var trumpImg = 100;
			var bushImg = 100;
			var bernieResize = res.bernie/5;
			var hillaryResize = res.clinton/5;
			var trumpResize = res.trump/5;
			var bushResize = res.bush/5;
			bernieImg = (bernieImg + (bernieImg * bernieResize));
			hillaryImg = (hillaryImg + (hillaryImg * hillaryResize));
			trumpImg = (trumpImg + (trumpImg * trumpResize));
			bushImg = (bushImg + (bushImg * bushResize));
			document.getElementById("bernie").height = bernieImg;
			document.getElementById("hillary").height = hillaryImg;
			document.getElementById("trump").height = trumpImg;
			document.getElementById("bush").height = bushImg;

				vm.timeoutHandler = $timeout(tick, 15000);

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
