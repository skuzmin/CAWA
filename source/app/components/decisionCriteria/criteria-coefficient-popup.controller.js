(function() {

    'use strict';

    angular
        .module('app.components')
        .controller('CriteriaCoefficientPopupController', CriteriaCoefficientPopupController);

    CriteriaCoefficientPopupController.$inject = ['$uibModalInstance', 'criteria', 'DecisionCriteriaConstant'];

    function CriteriaCoefficientPopupController($uibModalInstance, criteria, DecisionCriteriaConstant) {
        var vm = this;

        vm.apply = apply;
        vm.close = close;

        init();

        function apply() {
            $uibModalInstance.close(vm.criteria);
        }

        function close() {
            $uibModalInstance.dismiss();
        }

        function init() {
            vm.criteria = angular.copy(criteria);
            vm.coefficientList = DecisionCriteriaConstant.COEFFICIENT_LIST;
        }
    }
})();
