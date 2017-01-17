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
					fistLevel: {},
					secondLevel: {},
					thirdLevel: {}
				}
			};

			service.getFilterObject = function() {
				return {
					sortCriteriaIds: service.filterObject.selectedCriteria.sortCriteriaIds,
					sortCriteriaCoefficients: service.filterObject.selectedCriteria.sortCriteriaCoefficients,
					pageNumber: service.filterObject.pagination.pageNumber - 1,
					pageSize: service.filterObject.pagination.pageSize
				};
			};

		}
})();