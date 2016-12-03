(function() {

	'use strict';

	angular
		.module('app.decision')
		.factory('DecisionService', DecisionService);

		DecisionService.$inject = ['$resource'];

		function DecisionService($resource) {
			var decision = $resource('/app/decision/decision.JSON');
			var decision2 = $resource('/app/decision/new.JSON');

			var service = {
				getTestData: getTestData,
				getTestData2: getTestData2
			};

			return service;

			function getTestData() {
				return decision.query().$promise;
			}

			function getTestData2() {
				return decision2.query().$promise;
			}
		}
})();