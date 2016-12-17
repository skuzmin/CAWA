(function() {

    'use strict';

    angular
        .module('app.login')
        .service('LoginService', LoginService);

    LoginService.$inject = ['jwtHelper', '$localStorage'];

    function LoginService(jwtHelper, $localStorage) {
        var service = this;

        service.user = {};
        service.isLogged = false;
        service.decodeUserData = decodeUserData;
        service.checkLogin = checkLogin;

        function decodeUserData(token) {
            service.user = jwtHelper.decodeToken(token);
        }

        function checkLogin() {
        	var token = $localStorage.token;
        	if(token) {
        		service.isLogged = true;
        		decodeUserData(token);
        	}
        }
    }
})();
