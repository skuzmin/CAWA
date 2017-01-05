(function() {

    'use strict';

    angular
        .module('app.components')
        .controller('DecisionCharacteristicsController', DecisionCharacteristicsController)
        .component('decisionCharacteristics', {
            templateUrl: 'app/components/decisionCharacteristics/decision-characteristics.html',
            bindings: {
                decisionId: '='
            },
            controller: 'DecisionCharacteristicsController',
            controllerAs: 'vm'
        });

    DecisionCharacteristicsController.$inject = ['DecisionService'];

    function DecisionCharacteristicsController(DecisionService) {
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
        vm.characteristicGroups = [];

        vm.getControl = getControl;

        init();

        function getControl(characteristic) {
            return controls[characteristic.visualMode];
        }

        function init() {
            vm.characteristicsSpinner = true;
            DecisionService.getCharacteristictsGroupsById(vm.decisionId).then(function(result) {
                vm.characteristicGroups = result;
            }).finally(function() {
                if (vm.characteristicGroups.length > 0) {
                    vm.characteristicGroups[0].isOpen = true;
                }
                vm.characteristicsSpinner = false;
            });
        }
    }
})();
