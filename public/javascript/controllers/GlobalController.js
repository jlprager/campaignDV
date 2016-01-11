(function() {
    'use strict';
    angular.module('app')
        .controller('GlobalController', GlobalController);

    function GlobalController(UserFactory, $state) {
        var vm = this;
        vm.user = {};
        vm.status = UserFactory.status;

        // vm.registerAlert = function() {
        //     swal({
        //         title: "",
        //         text: '<div class="mainContent"><br><h1 style="text-align: center;margin-top: 5%;">Registration</h1><form id="registration" class="pure-form pure-form-aligned" ng-submit="register();"><fieldset><label>Email</label><div class="pure-control-group"><input id="email" type="email" ng-model="nav.user.email" placeholder="Email Required"></div><label>Password</label><div class="pure-control-group"><input id="password" type="password" ng-model="nav.user.password" placeholder="Password Required"></div><button ui-sref="Reg" type="submit" style="background-color: #82DD51;">Register</button></fieldset></form></div>',
        //         html: true,
        //         showConfirmButton: false
        //     });
        //     // vm.register();
        //     // console.log(vm.user + "AAAAAA")
        // };

        // vm.registerAlert = function() {
        //     swal({
        //         title: 'Input something',
        //         text: '<input style="display:block;" type="text" id="input-field" />',
        //         html: true,
        //         showCancelButton: true,
        //         closeOnConfirm: false
        //         }, function() {
        //         swal({
        //             html: 'You entered: <strong>' + $('#input-field').val() + '</strong>'
        //         });
        //     });
        // }

        

        vm.register = function() {
            UserFactory.register(vm.user).then(function(res) {
                $state.go('Home');
                nav.user.password = null;
                nav.user.email = null;
            });
        };

        vm.login = function() {
            UserFactory.login(vm.user).then(function(res) {
                $state.go('Home');
                vm.user.password = null;
                vm.user.email = null;
            });
        };

        vm.logout = function() {
            UserFactory.removeToken();
            $state.go('Home');
        };
    }
})();
