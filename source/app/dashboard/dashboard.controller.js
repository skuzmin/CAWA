(function() {

	'user strict';

	angular
		.module('app.dashboard')
		.controller('DashboardController', DashboardController);

		DashboardController.$inject = ['data', 'DashboardService'];

		function DashboardController(data, DashboardService) {
			var vm = this;

			vm.testData = data;

			vm.removeWidget = removeWidget;

			function removeWidget(w) {
                var index = vm.testData.indexOf(w);
                vm.testData.splice(index, 1);
            };

            vm.options = {
                cellHeight: 200,
                verticalMargin: 10
            };

 		}
})();