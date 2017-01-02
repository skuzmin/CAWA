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
				criteriasGroups = $resource(decisionUrl + '/criteria/groups'),
				criterias = $resource(decisionUrl + '/criteria'),
				characteristictsGroups = $resource(decisionUrl + '/characteristics/groups'),
				characteristicts = $resource(decisionUrl + '/characteristics');

			var service = {
				searchDecision: searchDecision,
				getCriteriasById: getCriteriasById,
				getCriteriaGroupsById: getCriteriaGroupsById,
				getCharacteristictsById: getCharacteristictsById,
				getCharacteristictGroupsById: getCharacteristictGroupsById,
				getDecisionInfo: getDecisionInfo
			};

			return service;

			function searchDecision(id) {
				return decisions.searchDecisionById({id: id}, {}).$promise;
			}

			function getCriteriasById(id) {
				return criterias.query({id: id}).$promise;
			}

			function getCriteriaGroupsById(id) {
				return criteriasGroups.query({id: id}).$promise;
			}

			function getCharacteristictsById(id) {
				return characteristicts.query({id: id}).$promise;
			}

			function getCharacteristictGroupsById(id) {
				return characteristictsGroups.query({id: id}).$promise;
			}

			function getDecisionInfo(id) {
				return decisionInfo.get({id: id}).$promise;
			}
		}
})();