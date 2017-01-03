(function() {

    'use strict';

    angular
        .module('app.components')
        .controller('DecisionCharacteristicsController', DecisionCharacteristicsController)
        .component('decisionCharacteristics', {
            templateUrl: 'app/components/decisionCharacteristics/decision-characteristics.html',
            bindings: {
                characteristicGroups: '='
            },
            controller: 'DecisionCharacteristicsController',
            controllerAs: 'vm'
        });


    DecisionCharacteristicsController.$inject = ['$compile', '$rootScope'];

    function DecisionCharacteristicsController($compile, $rootScope) {
        var
            vm = this,
            controls = {
                CHECKBOX: '',
                SLIDER: '',
                SELECT: 'app/components/decisionCharacteristics/decision-characteristics-select-partial.html',
                RADIOGROUP: '',
                YEARPICKER: 'app/components/decisionCharacteristics/decision-characteristics-yearpicker-partial.html'
            };

        vm.characteristicsFilter = {};

        vm.getControl = getControl;

        function getControl(characteristic) {
        	return controls[characteristic.visualMode];
        }
    }
})();
