(function() {

    'use strict';

    angular
        .module('app.components')
        .controller('DecisionCriteriaController', DecisionCriteriaController)
        .component('decisionCriteria', {
            templateUrl: 'app/components/decisionCriteria/decision-criteria.html',
            bindings: {
                decisionId: '='
            },
            controller: 'DecisionCriteriaController',
            controllerAs: 'vm'
        });

    DecisionCriteriaController.$inject = ['$uibModal', 'DecisionService'];

    function DecisionCriteriaController($uibModal, DecisionService) {
        var vm = this;

        vm.criteriaGroups = [];

        vm.editCriteriaCoefficient = editCriteriaCoefficient;

        init();

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
                var groupIndex = _.findIndex(vm.criteriaGroups, { criterionGroupId: result.criterionGroupId });
                var criteriaIndex = _.findIndex(vm.criteriaGroups[groupIndex].criteria, { criterionId: result.criterionId });
                vm.criteriaGroups[groupIndex].criteria[criteriaIndex] = result;
            });
        }

        function init() {
            vm.criteriaSpinner = true;
            DecisionService.getCriteriaGroupsById(vm.decisionId).then(function(result) {
                vm.criteriaGroups = result;
            }).finally(function() {
                vm.criteriaSpinner = false;
                if (vm.criteriaGroups.length > 0) {
                    vm.criteriaGroups[0].isOpen = true;
                }
            });
        }
    }
})();
