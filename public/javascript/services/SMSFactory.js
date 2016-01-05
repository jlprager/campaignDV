(function() {
	'use strict';
	angular.module('app')
	.factory('SMSFactory', SMSFactory);

	function SMSFactory($http, $q) {
		var o = {};

		o.receiveSMS = function(sms) {
			var q = $q.defer();
			$http.post('/api/v1/sms/receive', sms).then(function(res) {
				q.resolve(res.data);
			}, function(err) {
				q.reject();
			});
			return q.promise;
		};

		o.sendSMS = function(sms) {
			var q = $q.defer();
			$http.post('/api/v1/sms/send', sms).then(function(res) {
				q.resolve(res.data);
			}, function(err) {
				q.reject();
			});
			return q.promise;
		};

		return o;
	}
})();
