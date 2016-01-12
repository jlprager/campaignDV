(function() {
    'use strict';
      angular.module("app")
        .controller("StripeController", StripeController);

        function StripeController(StripeFactory, $state) {
          var vm = this;
          vm.donationAmount = 20.00;

          vm.stripeCallback = function(status, response) {
            console.log(status);
            console.log(response);
            // alert("Got Stripe token: " + response.id);
            StripeFactory.postCharge(response.id, vm.donationAmount).then(function(res) {
              console.log(res);
              swal("Thank you for your donation!", "You have been upgraded to a premium account!", "success");
            	// $state.go('Thanks');//add some kind of toast here 'Account upgraded to Premium Status'
            });
          };
        }
})();
