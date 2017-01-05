(function() {

    'use strict';

    angular
        .module('app.components')
        .controller('DecisionCriteriaController', DecisionCriteriaController)
        .component('decisionCriteria', {
            templateUrl: 'app/components/decisionCriteria/decision-criteria.html',
            bindings: {
                criteriaGroups: '='
            },
            controller: 'DecisionCriteriaController',
            controllerAs: 'vm'
        });


    DecisionCriteriaController.$inject = ['$uibModal'];

    function DecisionCriteriaController($uibModal) {
        var vm = this;

        vm.editCriteriaCoefficient = editCriteriaCoefficient;

        function editCriteriaCoefficient(criteria) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/components/decisionCriteria/criteria-coefficient-popup.html',
                controller: 'CriteriaCoefficientPopupController',
                controllerAs: 'vm',
                backdrop: 'static',
                resolve: {
                    criteria: function() {
                        return criteria;
                    }
                }
            });

            modalInstance.result.then(function(result) {
                var groupIndex = _.findIndex(vm.criteriaGroups, {criterionGroupId: result.criterionGroupId});
                var criteriaIndex = _.findIndex(vm.criteriaGroups[groupIndex].criteria, {criterionId: result.criterionId});
                vm.criteriaGroups[groupIndex].criteria[criteriaIndex] = result;
            });
        }
    }
})();
