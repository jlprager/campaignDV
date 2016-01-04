(function() {
    'use strict';
    angular.module('app')
    .controller('CandidateController', CandidateController);

    function CandidateController($scope, $timeout, $stateParams, TweetFactory, CandidateFactory) {
        var vm = this;
        vm.tweets;
        vm.timeoutHandler;
        var candidateName;
        // console.log($stateParams.id);
        // if($stateParams.id == '56856d3fb15a9ff859aa0784') vm.tweetStreamName = 'bernie';
        // if($stateParams.id == '56856d3fb15a9ff859aa0785') vm.tweetStreamName = 'clinton';
        // if($stateParams.id == '56856d47b15a9ff859aa0786') vm.tweetStreamName = 'bush';
        // if($stateParams.id == '56856d4fb15a9ff859aa0787') vm.tweetStreamName = 'trump';

        CandidateFactory.getCandidateById($stateParams.id).then(function(res) {
            vm.candidate = res;
            candidateName = res.name;
            console.log(candidateName);
        }, function(err) {
            //
        });

        (function tick() {
            TweetFactory.getCandidateTweets(candidateName).then(function(res) {
                vm.tweets = res;
                vm.timeoutHandler = $timeout(tick, 5000);
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
