(function(){
	"use strict";
	angular.module("app").factory("UserFactory", UserFactory);
	function UserFactory($q, $http, $window){
		var o = {};
		o.status = {};

		o.register = function(user) {
			console.log('factory:');
			console.log(user);
			var q = $q.defer();
			$http.post('/api/v1/users/register', user).then(function(res) {
				o.setToken(res.data.token);
				q.resolve(res.data);
			});
			return q.promise;
		};

		o.login = function(user) {
			var q = $q.defer();
			$http.post('/api/v1/users/register', user).then(function(res) {
				o.setToken(res.data.token);
				q.resolve(res.data);
			});
			return q.promise;
		};

		o.getToken = function(){
			return $window.localStorage.getItem("token");
		};

		o.setToken = function(token){
			$window.localStorage.setItem("token", token);
			o.setUser();
		};

		o.removeToken = function(){
			$window.localStorage.removeItem("token");
			o.status._id = null;
			o.status.steamID = null;
			o.status.displayName = null;
		};

		o.setUser = function(){
			var token = JSON.parse(atob(o.getToken().split(".")[1]));
			o.status._id = token._id;
			o.status.email = token.email;
			o.status.displayName = token.displayName;
		};

		if(o.getToken()) o.setUser();

		return o;
	}
})();
