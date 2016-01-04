(function() {
    'use strict';
    angular.module('app')
    .controller('GlobalController', GlobalController);

    function GlobalController(UserFactory, CandidateFactory, $state, $timeout) {
        var vm = this;
        vm.user = {};
        vm.status = UserFactory.status;
        vm.timeoutHandler;

        (function dailyClear() {
          CandidateFactory.dailyClear().then(function(res) {
            console.log('returned to controller');
            console.log(res);
          });

          // USE THIS FOR TESTING:
          vm.timeoutHandler = $timeout(dailyClear, 10000);

          // USE THIS FOR 24 HOUR TIMER:
          // vm.timeoutHandler = $timeout(dailyClear, (1000 * 60 * 60 * 24));

        })()

        vm.register = function() {
          UserFactory.register(vm.user).then(function(res) {
            $state.go('Home');
          });
        };

        vm.login = function() {
          UserFactory.login(vm.user).then(function(res) {
            $state.go('Home');
          });
        };

        vm.logout = function() {
          UserFactory.removeToken;
          $state.go('Home');
        };

    }
})();
