(function() {
        'use strict';
        angular.module('app')
            .controller('ContactFormController', ContactFormController)
            // .controller("EmailSweetAlert", EmailSweetAlert)


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
                    contactName: vm.contactName,
                    contactEmail: vm.contactEmail,
                    contactMsg: vm.contactMsg
                });
                EmailFactory.sendMail(data).then(function(res) {
                    $state.go('ContactMessageConfirmation');
                }, function(err) {});
            };

        }

        // function EmailSweetAlert($scope, sweet) {
        //   console.log("FFFFFF");
        //     $scope.sendMailAlert = function() {
        //       console.log("CATS");
        //         sweet.show({
        //             title: 'Confirm',
        //             text: 'Delete this file?',
        //             type: 'warning',
        //             showCancelButton: true,
        //             confirmButtonColor: '#DD6B55',
        //             confirmButtonText: 'Yes, delete it!',
        //             closeOnConfirm: false,
        //             closeOnCancel: false
        //         }, function(isConfirm) {
        //             if (isConfirm) {
        //                 sweet.show('Deleted!', 'The file has been deleted.', 'success');
        //             } else {
        //                 sweet.show('Cancelled', 'Your imaginary file is safe :)', 'error');
        //             }
        //         });
        //     };
        // };
})();
