(function() {
    'use strict';
    angular.module('app')
    .controller('ContactFormController', ContactFormController);

    function ContactFormController(EmailFactory, SMSFactory, $state, $stateParams) {
        var vm = this;
        vm.sms = {};

        vm.sendSMS = function() {
          SMSFactory.sendSMS(vm.sms).then(function(res) {
            $state.go('ContactMessageConfirmation');
          }, function(err) {
        //
        });
      };

        vm.sendMail = function() {
          var data = ({
              contactName :   vm.contactName,
              contactEmail :  vm.contactEmail,
              contactMsg :    vm.contactMsg
          });
          EmailFactory.sendMail(data).then(function(res) {
              $state.go('ContactMessageConfirmation');
          }, function(err) {
          });
        };

    }
})();
