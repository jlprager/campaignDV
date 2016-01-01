(function() {
    'use strict';
    angular.module('app')
    .factory('EmailFactory', EmailFactory);

    function EmailFactory($http, $q, $timeout) {
        var o = {};
        o.sendMail = function(data) {
            var q = $q.defer();
            $http.post('/api/v1/contact/send', data).then(function(res) {
                q.resolve(res.data);
            }, function(err) {
                q.reject();
            });
            return q.promise;
        };
        return o;
    }
})();
