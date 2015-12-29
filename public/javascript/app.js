(function() {
	'use strict';
	angular.module('app', ['ui.router'])
	.config(Config);

	function Config($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider, $locationProvider) {
		$stateProvider
		.state('Home',{
			url: '/',
			templateUrl: '/templates/home.html',
			controller: 'HomeController as vm'
		})
		.state('About', {
		    url: '/about',
		    templateUrl: '/templates/about.html'
		})
		.state('Candidate', {
		    url: '/candidate/:id',
		    templateUrl: '/templates/candidate.html',
		    controller: 'CandidateController as vm'
		});
		$urlRouterProvider.otherwise('/');
		$urlMatcherFactoryProvider.caseInsensitive(true);
    	$urlMatcherFactoryProvider.strictMode(false);
    	$locationProvider.html5Mode(true);
	}
})();
