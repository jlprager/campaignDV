(function() {
	'use strict';
	angular.module('app')
	.factory('SMSFactory', SMSFactory);

	function SMSFactory($http, $q) {
		var o = {};

		o.receiveSMSCode = function(sms) {
			var q = $q.defer();
			$http.post('/api/v1/sms/receiveCode', sms).then(function(res) {
				q.resolve();
			}, function(err) {
				q.reject();
			});
			return q.promise;
		};

		o.sendSMS = function(sms) {
			var q = $q.defer();
			$http.post('/api/v1/sms/send', sms).then(function(res) {
				q.resolve();
			}, function(err) {
				q.reject();
			});
			return q.promise;
		};

		return o;
	}
})();
