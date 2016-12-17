(function() {
	'use strict';

	angular
		.module('app.login')
		.controller('LoginController', LoginController);

	LoginController.$inject = ['$localStorage', '$stateParams', '$window'];

	function LoginController($localStorage, $stateParams, $window) {
		var vm = this;

		init();

		function init() {
			console.log('Login controller');
			if($stateParams.access_token) {
				$localStorage.token = $stateParams.access_token;
				$window.close();
			}
		}
	}

})();