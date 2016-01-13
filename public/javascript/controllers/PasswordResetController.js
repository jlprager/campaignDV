(function() {
    'use strict';
    angular.module('app')
        .controller('PasswordResetController', PasswordResetController);

    function PasswordResetController(EmailFactory, SMSFactory, UserFactory, $state, $stateParams) {
        var vm = this;
        var registeredPh;
        var registeredEmail;
        vm.user = {};
        vm.data = {};
        vm.code = {};
        vm.sentCode = false;
        vm.sentEmail = false;
        vm.codeValidated = false;
        vm.wrongCode = false;
        vm.unregisteredPhone = false;
        vm.unregisteredEmail = false;
        vm.user.phoneNumber = "";
        vm.user.email = "";
        vm.data.generatedCode = code;
        vm.data.email = vm.user.email;
        // 1st section *******************************************************
        vm.sendCode = function() {
            console.log(vm.user);
            if (vm.user.phoneNumber) {
                SMSFactory.receiveSMSCode(vm.user).then(function(res) {
                    vm.sentCode = true;
                    vm.code.phoneNumber = vm.user.phoneNumber;
                }, function(err) {});
            }

            if (vm.user.email) {
                EmailFactory.receiveEmailCode(vm.user).then(function(res) {
                    vm.sentEmail = true;
                    vm.code.email = vm.user.email;
                }, function(err) {});
            }
        };


        // 2nd section *******************************************************
        vm.validateCode = function() {
            SMSFactory.validateCode(vm.code).then(function(res) {
                $state.go("Home");
            });
        };

        vm.validateEmailCode = function() {
          EmailFactory.validateEmailCode(vm.code).then(function(res) {
            $state.go("Home");
          });
        };
    }
})();
