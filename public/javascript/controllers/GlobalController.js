(function() {
    'use strict';
    angular.module('app')
    .controller('GlobalController', GlobalController);

    function GlobalController(UserFactory, $state) {
        var vm = this;
        vm.user = {};
        vm.status = UserFactory.status;


    }
})();
