(function() {
	'use strict';
	angular.module('app')
	.controller('HomeController', HomeController);

	function HomeController($state, $location, UserFactory) {
		var vm = this;
		var url = $location.search();
		var size = 0;
		
		if(url.code){
			UserFactory.setToken(url.code);
			$location.search("code", null);
		}
	}
})();
