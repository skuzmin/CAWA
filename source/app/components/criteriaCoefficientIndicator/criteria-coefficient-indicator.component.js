(function() {

    'use strict';

    angular
        .module('app.components')
        .controller('CriteriaCoefficientIndicatorController', CriteriaCoefficientIndicatorController)
        .component('criteriaCoefficientIndicator', {
            templateUrl: 'app/components/criteriaCoefficientIndicator/criteria-coefficient-indicator.html',
            bindings: {
                coefficient: '='
            },
            controller: 'CriteriaCoefficientIndicatorController',
            controllerAs: 'vm'
        });


    CriteriaCoefficientIndicatorController.$inject = ['DecisionCriteriaConstant'];

    function CriteriaCoefficientIndicatorController(DecisionCriteriaConstant) {
        var vm = this;

        vm.$doCheck = doCheck;

        init();

        function setCoefficientIndicator(coefficient) {
            if(!coefficient.value) {
                _.forEach(vm.coefficientList, function(c) { 
                    c.class = coefficient.name.toLowerCase();
                });
                return;
            }
            _.forEach(vm.coefficientList, function(c) {
                c.class = '';
                if(c.value <= coefficient.value) {
                    c.class = coefficient.name.toLowerCase();
                }
            });
        }

        function init() {
            if(!vm.coefficient) {
                vm.coefficient = DecisionCriteriaConstant.coefficientDefault;
            }
            vm.coefficientList = angular.copy(DecisionCriteriaConstant.coefficientList);
        }

        function doCheck() {
            setCoefficientIndicator(vm.coefficient);
        }
    }
})();
