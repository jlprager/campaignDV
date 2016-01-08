(function() {
    'use strict';
    angular.module('app')
        .controller('ContactFormController', ContactFormController);


    function ContactFormController(EmailFactory, SMSFactory, $state, $stateParams) {
        var vm = this;
        vm.sms = {};

        vm.emailConfirm = function() {
            swal({
                title: "Confirmation:",
                text: "Please confirm that you want to send this message",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#82DD51",
                confirmButtonText: "Yes, send it!",
                cancelButtonColor: "#DD6B55",
                cancelButtonText: "Nevermind!",
                closeOnConfirm: false,
                closeOnCancel: false
            }, function(isConfirm) {
                if (isConfirm) {
                    swal("Sent!", "Thank you for your email!", "success");
                    vm.sendMail();
                    vm.contactName = "";
                    vm.contactEmail = "";
                    vm.contactMsg = "";
                } else {
                    swal("Cancelled!", "Your message has not been sent", "error");
                }
            });
        }

        vm.smsConfirm = function() {
            swal({
                title: "Confirmation:",
                text: "Please confirm that you want to send this text",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#82DD51",
                confirmButtonText: "Yes, send it!",
                cancelButtonColor: "#DD6B55",
                cancelButtonText: "Nevermind!",
                closeOnConfirm: false,
                closeOnCancel: false
            }, function(isConfirm) {
                if (isConfirm) {
                    swal("Sent!", "Thank you for your text!", "success");
                    vm.sendSMS();
                    vm.sms.firstName = "";
                    vm.sms.phoneNumber = "";
                    vm.sms.message = "";
                } else {
                    swal("Cancelled!", "Your text has not been sent", "error");
                }
            });
        }


        vm.sendSMS = function() {
            console.log(vm.sms)
            SMSFactory.sendSMS(vm.sms).then(function(res) {}, function(err) {
                //
            });
        };

        vm.sendMail = function() {
            var data = ({
                contactName: vm.contactName,
                contactEmail: vm.contactEmail,
                contactMsg: vm.contactMsg
            });
            EmailFactory.sendMail(data).then(function(res) {}, function(err) {});
        };
    }
})();
