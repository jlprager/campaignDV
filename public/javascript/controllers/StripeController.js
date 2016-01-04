(function() {
    'use strict';
      angular.module("app")
        .controller("StripeController", StripeController);

        function StripeController(UserFactory, $state) {
          var vm = this;

          vm.stripeCallback = function(status, response) {
            alert("Got Stripe token: " + response.id);
            UserFactory.postCharge(response.id).then(function(res) {
              console.log(res);
            	$state.go('Home');//add some kind of toast here 'Account upgraded to Premium Status'
            });
          };
        }
})();