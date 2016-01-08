(function() {
    'use strict';
      angular.module("app")
        .controller("StripeController", StripeController);

        function StripeController(StripeFactory, $state) {
          var vm = this;

          vm.stripeCallback = function(status, response) {
            // alert("Got Stripe token: " + response.id);
            StripeFactory.postCharge(response.id).then(function(res) {
            	$state.go('Home');//add some kind of toast here 'Account upgraded to Premium Status'
            });
          };
        }
})();