(function() {

	'user strict';

	angular
		.module('app.dashboard')
		.controller('DashboardController', DashboardController);

		DashboardController.$inject = ['data', 'DashboardService'];

		function DashboardController(data, DashboardService) {
			var vm = this;

			vm.testData = data;

		}
})();