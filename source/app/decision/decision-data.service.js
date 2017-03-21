(function() {

    'use strict';

    angular
        .module('app.decision')
        .factory('DecisionDataService', DecisionDataService);

    DecisionDataService.$inject = ['$resource', 'Config'];

    function DecisionDataService($resource, Config) {
        var
            decisionUrl = Config.endpointUrl + 'decisions/:id',

            decisions = $resource(decisionUrl + '/decisions/list', {
                id: '@id'
            }, {
                searchDecisionById: {
                    method: 'POST',
                    isArray: false
                }
            }),

            decisionsMatrix = $resource(decisionUrl + '/decisions/matrix', {
                id: '@id'
            }, {
                searchDecisionById: {
                    method: 'POST',
                    isArray: false
                }
            }),

            decisionsAnalysis = $resource(Config.endpointUrl + 'decisions/analysis/:id', {
                id: '@id'
            }, {
                getDecisionAnalysis: {
                    method: 'POST',
                    isArray: false
                }
            }),

            decisionInfo = $resource(decisionUrl),
            decisionCharacteristics = $resource(decisionUrl + '/decisions/:childId/characteristics', {
                id: '@id',
                childId: '@childId'
            }, {}),
            criteriasGroups = $resource(decisionUrl + '/criteriongroups'),
            characteristictsGroups = $resource(decisionUrl + '/characteristicgroups'),
            criteriaByDecision = $resource(decisionUrl + '/:decisionId/decisions/:criterionId/criteria', {
                criterionId: '@criterionId',
                decisionId: '@decisionId'
            }, {});

        var service = {
            searchDecision: searchDecision,
            searchDecisionMatrix: searchDecisionMatrix,
            getCriteriaGroupsById: getCriteriaGroupsById,
            getCharacteristictsGroupsById: getCharacteristictsGroupsById,
            getDecisionInfo: getDecisionInfo,
            getDecisionCharacteristics: getDecisionCharacteristics,
            getCriteriaByDecision: getCriteriaByDecision,
            getDecisionAnalysis: getDecisionAnalysis
        };

        return service;

        function searchDecision(id, data) {
            return decisions.searchDecisionById({
                id: id
            }, data).$promise;
        }

        function searchDecisionMatrix(id, data) {
            return decisionsMatrix.searchDecisionById({
                id: id
            }, data).$promise;
        }

        function getCriteriaGroupsById(id) {
            return criteriasGroups.query({
                id: id
            }).$promise;
        }

        function getCharacteristictsGroupsById(id) {
            return characteristictsGroups.query({
                id: id
            }).$promise;
        }

        function getDecisionInfo(id) {
            return decisionInfo.get({
                id: id
            }).$promise;
        }

        function getDecisionCharacteristics(id, childId) {
            return decisionCharacteristics.query({
                id: id,
                childId: childId
            }).$promise;
        }

        function getDecisionAnalysis(id) {
            return decisionsAnalysis.get({
                id: id
            }).$promise;
        }

        function getCriteriaByDecision(criterionId, decisionId) {
            return criteriaByDecision.query({
                criterionId: criterionId,
                decisionId: decisionId
            }).$promise;
        }
    }
})();