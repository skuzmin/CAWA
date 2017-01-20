(function() {

	'use strict';

	angular
		.module('app.decision')
		.service('DecisionSharedService', DecisionSharedService);

		DecisionSharedService.$inject = [];

		function DecisionSharedService() {
			var service = this;

			service.filterObject = {
				selectedCriteria: {
					sortCriteriaIds: [],
                	sortCriteriaCoefficients: {}
				},
				pagination: {
					pageNumber: 1, 
                	pageSize: 10,
                	totalDecisions: 0
				},
				selectedCharacteristics: {},
				sorters: {
					sortCriteriaDirection: {},
					sortCharacteristicDirection: {},
					sortDecisionPropertyDirection: {}
				}
			};

			service.getFilterObject = function() {
				return {
					sortCriteriaIds: service.filterObject.selectedCriteria.sortCriteriaIds,
					sortCriteriaCoefficients: service.filterObject.selectedCriteria.sortCriteriaCoefficients,
					pageNumber: service.filterObject.pagination.pageNumber - 1,
					pageSize: service.filterObject.pagination.pageSize,
					sortCriteriaDirection: service.filterObject.sorters.sortCriteriaDirection.sortCriteriaDirection,
					sortCharacteristicId: service.filterObject.sorters.sortCharacteristicDirection.sortCharacteristicId || null,
					sortCharacteristicDirection: service.filterObject.sorters.sortCharacteristicDirection.sortCharacteristicDirection || null,
					sortDecisionPropertyName: service.filterObject.sorters.sortDecisionPropertyDirection.sortDecisionPropertyName || null,
					sortDecisionPropertyDirection: service.filterObject.sorters.sortDecisionPropertyDirection.sortDecisionPropertyDirection || null
				};
			};

		}
})();