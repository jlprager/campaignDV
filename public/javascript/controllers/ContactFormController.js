(function() {
    'use strict';
    angular.module('app')
    .controller('ContactFormController', ContactFormController);

    function ContactFormController(EmailFactory, $state, $stateParams) {
        var vm = this;
        vm.sendMail = function() {
          var data = ({
              contactName :   vm.contactName,
              contactEmail :  vm.contactEmail,
              contactMsg :    vm.contactMsg
          });
          EmailFactory.sendMail(data).then(function(res) {
              $state.go('Contact');
          }, function(err) {
          });
        };
    }
})();
