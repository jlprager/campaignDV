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

			var bernieImg = 100;
			var hillaryImg = 100;
			var trumpImg = 100;
			var bushImg = 100;
			var bernieResize = res.bernie;
			var hillaryResize = res.clinton;
			var trumpResize = res.trump;
			var bushResize = res.bush;
			bernieImg = (bernieImg + (bernieImg * bernieResize));
			hillaryImg = (hillaryImg + (hillaryImg * hillaryResize));
			trumpImg = (trumpImg + (trumpImg * trumpResize));
			bushImg = (bushImg + (bushImg * bushResize));
			document.getElementById("bernie").height = bernieImg;
			document.getElementById("hillary").height = hillaryImg;
			document.getElementById("trump").height = trumpImg;
			document.getElementById("bush").height = bushImg;

		}, function(err) {
			//
		});

	}
})();
