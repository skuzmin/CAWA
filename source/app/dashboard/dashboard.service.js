(function() {

	'use strict';

	angular
		.module('app.dashboard')
		.factory('DashboardService', DashboardService);

		DashboardService.$inject = ['$resource'];

		function DashboardService($resource) {
			var dashboard = $resource('/app/dashboard/dashboard.JSON');

			var service = {
				getTestData: getTestData
			};

			return service;

			function getTestData() {
				return dashboard.query().$promise;
			}
		}
})();