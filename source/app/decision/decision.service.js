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

				decisionInfos = $resource(decisionUrl),
				decisionCriteriasGroups = $resource(decisionUrl + '/criteria/groups'),
				decisionCriterias = $resource(decisionUrl + '/criteria');

			var service = {
				searchDecision: searchDecision,
				getDecisionCriteriasById: getDecisionCriteriasById,
				getDecisionCriteriaGroupsById: getDecisionCriteriaGroupsById,
				getDecisionInfo: getDecisionInfo
			};

			return service;

			function searchDecision(id) {
				return decisions.searchDecisionById({id: id}, {}).$promise;
			}

			function getDecisionCriteriasById(id) {
				return decisionCriterias.query({id: id}).$promise;
			}

			function getDecisionCriteriaGroupsById(id) {
				return decisionCriteriasGroups.query({id: id}).$promise;
			}

			function getDecisionInfo(id) {
				return decisionInfos.get({id: id}).$promise;
			}
		}
})();