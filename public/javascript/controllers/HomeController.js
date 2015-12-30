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

			var x = 300;
			var y = res.bernie;
			x = (x + (x * y));
			document.getElementById("this").height = x;

		}, function(err) {
			//
		});

	}
})();
