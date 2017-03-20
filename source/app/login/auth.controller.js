(function() {
	'use strict';

	angular
		.module('app.login')
		.controller('AuthController', AuthController);

	AuthController.$inject = ['LoginService', '$stateParams', '$window'];

	function AuthController(LoginService, $stateParams, $window) {
		var vm = this;

		init();

		function init() {
			if($stateParams.token) {
				var token = $window.location.href.split('access_token=')[1];
				LoginService.saveToken(token);
				$window.close();
			}
		}
	}

})();