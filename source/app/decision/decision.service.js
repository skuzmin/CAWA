(function() {

	'use strict';

	angular
		.module('app.decision')
		.factory('DecisionService', DecisionService);

		DecisionService.$inject = ['$resource', 'Settings'];

		function DecisionService($resource, Settings) {
			var decisions = $resource(Settings.endpointUrl + 'decisions/:id/decisions', {id: '@id'},
				{
					searchDecisionById: {method: 'POST', isArray: true} 
				});

			var service = {
				searchDecision: searchDecision
			};

			return service;

			function searchDecision(id) {
				return decisions.searchDecisionById({id: id}, {}).$promise;
			}
		}
})();