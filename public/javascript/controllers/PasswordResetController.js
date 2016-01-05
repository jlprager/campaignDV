(function() {
    'use strict';
    angular.module('app')
    .controller('PasswordResetController', PasswordResetController);

    function PasswordResetController(EmailFactory, SMSFactory, $state, $stateParams) {
        var vm = this;

        vm.sms.code = Math.random().toFixed(5)*10000;
        // let hello = Math.random().toFixed(5)*10000;

        console.log("Inside PasswordResetController vm.sms.code = ", vm.sms.code);
        vm.codeValidated = "";

        vm.validateCode() = function() {
          if (vm.sms.code = vm.code) {
            vm.codeValidated = "true";
            console.log("Inside PasswordResetController vm.codeValidated = ", vm.codeValidated);
          }
          else {
            vm.codeValidated = "false";
            console.log("Inside PasswordResetController vm.codeValidated = ", vm.codeValidated);
          }
        }

        vm.resetPassword() = function(){
          console.log("Inside PasswordResetController:resetPassword()");
        }


        vm.sendCode = function() {

          if (vm.sendCodeMethod=="sms") {
            vm.receiveSMS = function() {
                SMSFactory.receiveSMS(vm.sms).then(function(res) {
                  $state.go('PasswordResetConfirmation');
                }, function(err) {
                });
            };
          }

          if (vm.sendCodeMethod=="email") {
            vm.sendMail = function() {
              var data = ({
                  contactName :   vm.contactName,
                  contactEmail :  vm.contactEmail,
                  contactMsg :    vm.contactMsg
              });
              EmailFactory.sendMail(data).then(function(res) {
                $state.go('PasswordResetConfirmation');
              }, function(err) {
              });
            };
          }
        } // End sendCode() function

    }
})();
