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
			$http.post('/api/v1/users/login', user).then(function(res) {
				o.setToken(res.data.token);
				q.resolve(res.data);
			});
			console.log(o.status)
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
			o.status.uuid = null;
			o.status.premiumStatus = null;
		};

		o.setUser = function(){
			var token = JSON.parse(atob(o.getToken().split(".")[1]));
			o.status._id = token._id;
			o.status.email = token.email;
			o.status.displayName = token.displayName;
			o.status.uuid = token.uuid;
			o.status.premiumStatus = token.premiumStatus;
		};

		o.postCharge = function(token){
			var q = $q.defer();
			var chargeObject = {};
			chargeObject.uuid = o.status.uuid;
			chargeObject.token = token;
			$http.post('api/v1/users/charge', chargeObject).then(function (res) {
				o.status.premiumStatus = true;
				q.resolve(res.data);
			},function(err) {
				q.reject();
			});
			return q.promise;

		};

		if(o.getToken()) o.setUser();

		return o;
	}
})();
