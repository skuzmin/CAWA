(function() {
	'use strict';

	angular
		.module('app.login')
		.controller('LoginController', LoginController);

	LoginController.$inject = [];

	function LoginController() {
		var vm = this;

		init();

		function init() {
			console.log('Login controller');
		}
	}

})();