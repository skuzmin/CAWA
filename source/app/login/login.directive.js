(function() {

    'use strict';

    angular
        .module('app.login')
        .controller('LoginBtnController', LoginBtnController)
        .directive('appLoginBtn', appLoginBtn);

    function appLoginBtn() {
        var directive = {
            restrict: 'E',
            replace: 'true',
            templateUrl: 'app/login/login-btn.html',
            controller: 'LoginBtnController',
            controllerAs: 'vm',
            scope: {}
        };

        return directive;
    }

    LoginBtnController.$inject = ['$window', '$localStorage', 'LoginService', '$scope', 'jwtHelper'];

    function LoginBtnController($window, $localStorage, LoginService, $scope, jwtHelper) {
        var vm = this;

        LoginService.checkLogin();

        vm.isLogged = LoginService.isLogged;
        vm.user = LoginService.user;

        vm.login = login;
        vm.logout = logout;

        function login() {
            $window.open('http://decisionwanted.com/api/oauth/authorize?response_type=token&client_id=decisionwanted_client_id&redirect_uri=' + encodeURIComponent('http://localhost:8000/#/login?test'), '_blank', 'width=300, height=300');
        }

        function logout() {
            delete $localStorage.token;
            vm.user = {};
            vm.isLogged = LoginService.isLogged = false;
        }

        $scope.$watch(function() {
            return $localStorage.token;
        }, function(newVal, oldVal) {
            if (oldVal !== newVal && newVal !== undefined) {
               vm.isLogged = LoginService.isLogged = true;
               vm.user = jwtHelper.decodeToken(newVal);
               console.log(vm.user);
            }
        });
    }

})();
