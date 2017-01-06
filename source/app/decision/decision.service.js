(function() {

	'use strict';

	angular
		.module('app.decision')
		.factory('DecisionService', DecisionService);

		DecisionService.$inject = ['$resource', 'Config'];

		function DecisionService($resource, Config) {
			var 
				decisionUrl = Config.endpointUrl + 'decisions/:id',

				decisions = $resource(decisionUrl + '/decisions', {id: '@id'},
				{
					searchDecisionById: {method: 'POST', isArray: true} 
				}),

				decisionInfo = $resource(decisionUrl),
				decisionCharacteristics = $resource(decisionUrl + '/decisions/:childId/characteristics', {id: '@id', childId: '@childId'}, {}),
				criteriasGroups = $resource(decisionUrl + '/criteria/groups'),
				characteristictsGroups = $resource(decisionUrl + '/characteristics/groups');

			var service = {
				searchDecision: searchDecision,
				getCriteriaGroupsById: getCriteriaGroupsById,
				getCharacteristictsGroupsById: getCharacteristictsGroupsById,
				getDecisionInfo: getDecisionInfo,
				getdecisionCharacteristics: getdecisionCharacteristics
			};

			return service;

			function searchDecision(id) {
				return decisions.searchDecisionById({id: id}, {}).$promise;
			}

			function getCriteriaGroupsById(id) {
				return criteriasGroups.query({id: id}).$promise;
			}

			function getCharacteristictsGroupsById(id) {
				return characteristictsGroups.query({id: id}).$promise;
			}

			function getDecisionInfo(id) {
				return decisionInfo.get({id: id}).$promise;
			}

			function getdecisionCharacteristics(id, childId) {
				return decisionCharacteristics.query({id: id, childId: childId}).$promise;
			}
		}
})();