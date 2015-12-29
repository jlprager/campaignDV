(function() {
	'use strict';
	angular.module('app', ['ui.router'])
	.config(Config);

	function Config($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider, $locationProvider) {
		$stateProvider.state('Home',{
			url: '/',
			templateUrl: '/templates/home.html',
			controller: 'HomeController as vm'
		}).state("Welcome", {
			url: "/welcome",
			templateUrl: "/templates/welcome.html",
			controller: "WelcomeController as vm"
		});
		$urlRouterProvider.otherwise('/');
		$urlMatcherFactoryProvider.caseInsensitive(true);
    $urlMatcherFactoryProvider.strictMode(false);
    $locationProvider.html5Mode(true);
	}
})();
