(function() {

    'use strict';

    angular
        .module('app.decision')
        .service('DecisionSharedService', DecisionSharedService);

    DecisionSharedService.$inject = ['$rootScope'];

    function DecisionSharedService($rootScope) {
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
                sortByCriteria: {
                    order: 'DESC'
                },
                sortByCharacteristic: {
                    id: null,
                    order: null
                },
                sortByDecisionProperty: {
                    id: null,
                    order: null
                }
            },
            selectedDecision: {
                decisionsIds: []
            }
        };

        //allias

        service.getFilterObject = function() {
            var _fo = service.filterObject;
            // console.log(_fo);
            // console.log(_fo.pagination.pageNumber);
            return {
                //selected criteria
                sortCriteriaIds: _fo.selectedCriteria.sortCriteriaIds,
                //selected criteria coefficients
                sortCriteriaCoefficients: _fo.selectedCriteria.sortCriteriaCoefficients,
                //pagination
                pageNumber: _fo.pagination.pageNumber - 1,
                pageSize: _fo.pagination.pageSize,
                //sorting by:
                //criteria weight (1st level)
                sortWeightCriteriaDirection: _fo.sorters.sortByCriteria.order,
                //characteristic (2nd level)
                sortCharacteristicId: _fo.sorters.sortByCharacteristic.id,
                sortCharacteristicDirection: _fo.sorters.sortByCharacteristic.order,
                //property (3rd level)
                sortDecisionPropertyName: _fo.sorters.sortByDecisionProperty.id,
                sortDecisionPropertyDirection: _fo.sorters.sortByDecisionProperty.order,

                decisionsIds: _fo.selectedDecision.decisionsIds
            };
        };

        service.setFilterObject = function(obj) {
            if (!obj) return;
            service.filterObject = obj;
            // console.log(obj);
            // console.log(service.filterObject);
        };


    }
})();