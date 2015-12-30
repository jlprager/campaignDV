(function() {
	'use strict';
	angular.module('app')
	.controller('HomeController', HomeController);

	function HomeController($scope, $state, $location, $timeout, UserFactory, TweetFactory) {
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

				vm.posBernie = res.posBernie; vm.negBernie = res.negBernie; vm.neutBernie = res.neutBernie;
				vm.posClinton = res.posClinton; vm.negClinton = res.negClinton; vm.neutClinton =  res.neutClinton;
				vm.posTrump = res.posTrump; vm.negTrump = res.negTrump; vm.neutTrump = res.neutTrump;
				vm.posBush = res.posBush; vm.negBush = res.negBush; vm.neutBush = res.neutBush;

				//////////////////////////////////////////////////////////////////////////////////
				// Do percentage calculations on server side and pass the end result to the client
				//////////////////////////////////////////////////////////////////////////////////

				/*vm.berniePosRating = ((vm.posBernie.length) / (vm.posBernie.length + vm.negBernie.length + vm.neutBernie.length));
				vm.trumpPosRating = ((vm.posTrump.length) / (vm.posTrump.length + vm.negTrump.length + vm.neutTrump.length));

				console.log(vm.berniePosRating);
				console.log(vm.trumpPosRating);*/

				var x = 300;
				var y = res.bernie;
				x = (x + (x * y));
				document.getElementById("this").height = x;

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
