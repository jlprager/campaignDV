(function() {
    'use strict';
      angular.module("app", ['stripe.checkout'])
        .controller("StripeController", StripeController);

        function StripeController() {
          
          this.doCheckout = function(token) {
            alert("Got Stripe token: " + token.id);
          };
        };
})();