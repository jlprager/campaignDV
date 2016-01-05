(function() {
    'use strict';
    angular.module('app')
    .controller('CandidateController', CandidateController);

    function CandidateController($scope, $timeout, $stateParams, TweetFactory, CandidateFactory) {
        var vm = this;
        vm.tweets;
        vm.timeoutHandler;
        var candidateName;

        CandidateFactory.getCandidateById($stateParams.id).then(function(res) {
            vm.candidate = res;
            candidateName = res.name;
        }, function(err) {
            //
        });

        (function tick() {
            TweetFactory.getCandidateTweets(candidateName).then(function(res) {
                vm.tweets = res;
                vm.timeoutHandler = $timeout(tick, 1000);
            }, function(err) {
                //
            });
        })();

        // Cancel interval on page change
        $scope.$on('$destroy', function(){
            if (angular.isDefined(vm.timeoutHandler)) {
                $timeout.cancel(vm.timeoutHandler);
                vm.timeoutHandler = undefined;
            }
        });
    }
})();
