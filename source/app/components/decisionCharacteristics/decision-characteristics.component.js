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

    DecisionCharacteristicsController.$inject = ['DecisionService', '$rootScope'];

    function DecisionCharacteristicsController(DecisionService, $rootScope) {
        var
            vm = this,
            controls = {
                CHECKBOX: '',
                SLIDER: '',
                SELECT: 'app/components/decisionCharacteristics/decision-characteristics-select-partial.html',
                RADIOGROUP: '',
                YEARPICKER: 'app/components/decisionCharacteristics/decision-characteristics-yearpicker-partial.html'
            };

        vm.characteristicGroups = [];
        vm.sorterList = [];

        vm.getControl = getControl;

        init();

        function getControl(characteristic) {
            return controls[characteristic.visualMode];
        }

        function prepareCharacteristicsToDisplay(data) {
            vm.characteristicGroups = data;
            _.forEach(vm.characteristicGroups, function(group) {
                _.forEachRight(group.characteristics, function(characteristic, index) {
                    if (characteristic.sortable) {
                        vm.sorterList.push(characteristic);
                    }
                    if (!characteristic.filterable) {
                        group.characteristics.splice(index, 1);
                    }
                });
            });
            $rootScope.$broadcast('initSorter', vm.sorterList);
        }

        $rootScope.$on('selectSorter', function(event, data) {
            console.log(data);
        });

        function init() {
            vm.characteristicSpinner = true;
            DecisionService.getCharacteristictsGroupsById(vm.decisionId).then(function(result) {
                prepareCharacteristicsToDisplay(result);
            }).finally(function() {
                if (vm.characteristicGroups.length > 0) {
                    vm.characteristicGroups[0].isOpen = true;
                }
                vm.characteristicSpinner = false;
            });
        }
    }
})();
