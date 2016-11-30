(function() {

	'use strict';

	angular
		.module('app.dashboard')
		.factory('DashboardService', DashboardService);

		DashboardService.$inject = ['$resource'];

		function DashboardService($resource) {
			var dashboard = $resource('/app/dashboard/dashboard.JSON');
			var dashboard2 = $resource('/app/dashboard/new.JSON');

			var service = {
				getTestData: getTestData,
				getTestData2: getTestData2
			};

			return service;

			function getTestData() {
				return dashboard.query().$promise;
			}

			function getTestData2() {
				return dashboard2.query().$promise;
			}
		}
})();