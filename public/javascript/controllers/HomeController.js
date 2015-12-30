(function() {
	'use strict';
	angular.module('app')
	.controller('HomeController', HomeController);

	function HomeController($state, $location, $timeout, UserFactory, TweetFactory) {
		var vm = this;
		var url = $location.search();
		var size = 0;

		if(url.code){
			UserFactory.setToken(url.code);
			$location.search("code", null);
		}

		TweetFactory.getRecentTweets().then(function(res) {
			vm.bernie = res.bernie;
			vm.clinton = res.clinton;
			vm.trump = res.trump;
			vm.bush = res.bush;
			vm.posBernie = res.posBernie; vm.negBernie = res.negBernie; vm.neutBernie = res.neutBernie;
			vm.posClinton = res.posClinton; vm.negClinton = res.negClinton; vm.neutClinton =  res.neutClinton;
			vm.posTrump = res.posTrump; vm.negTrump = res.negTrump; vm.neutTrump = res.neutTrump;
			vm.posBush = res.posBush; vm.negBush = res.negBush; vm.neutBush = res.neutBush;

			vm.berniePosRating = ((vm.posBernie.length) / (vm.posBernie.length + vm.negBernie.length + vm.neutBernie.length));
			vm.trumpPosRating = ((vm.posTrump.length) / (vm.posTrump.length + vm.negTrump.length + vm.neutTrump.length));

			console.log(vm.berniePosRating);
			console.log(vm.trumpPosRating);

			var x = 300;
			var y = res.bernie;
			x = (x + (x * y));
			document.getElementById("this").height = x;

		}, function(err) {
			//
		});

	}
})();
