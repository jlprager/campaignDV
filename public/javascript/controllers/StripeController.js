(function() {
    'use strict';
      angular.module("app")
        .controller("StripeController", StripeController);

        function StripeController(UserFactory) {
          var vm = this;

          vm.stripeCallback = function(status, response) {
            alert("Got Stripe token: " + response.id);
            UserFactory.postCharge(response.id);
          };
        };
})();