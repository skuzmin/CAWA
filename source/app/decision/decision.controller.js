(function() {

    'user strict';

    angular
        .module('app.decision')
        .controller('DecisionController', DecisionController);

    DecisionController.$inject = ['decisionBasicInfo', 'DecisionService', '$stateParams', '$timeout'];

    function DecisionController(decisionBasicInfo, DecisionService, $stateParams, $timeout) {
        var
            vm = this,
            defaultDecisionCount = 5;

        console.log('Decision controller');

        vm.decisionId = $stateParams.id;
        vm.decisionsList = [];
        vm.decision = decisionBasicInfo || {};

        vm.characteristicGroups= [];
        vm.sorterList = [];

        //TEST DATA
        vm.testClick = testClick;

        function testClick(sorter) {
            console.log('It"s test id: ', sorter);
        }
        // ---------------------------

        init();

        function asyncLoading(result) {
            $timeout(function() {
                vm.decisionsList = vm.decisionsList.concat(result.splice(0, defaultDecisionCount));
                if (result.length > 0) {
                    asyncLoading(result);
                }
            }, 0);
        }

        function prepareCharacteristicsToDisplay(data) {
            vm.characteristicGroups = data;
            _.forEach(vm.characteristicGroups, function(group) {
                _.forEachRight(group.characteristics, function(characteristic, index) {
                    if(characteristic.sortable) {
                        vm.sorterList.push(characteristic);
                    }
                    if(!characteristic.filterable) {
                        group.characteristics.splice(index, 1);
                    }
                });
            });
        }

        function init() {
            if (!_.isEmpty(vm.decision.parentDecisionIds)) {
                vm.parentDecisions = vm.decision.parentDecisionIds;
            }
            vm.decisionsSpinner = true;
            DecisionService.searchDecision(vm.decisionId).then(function(result) {
                asyncLoading(result);
            }).finally(function() {
                vm.decisionsSpinner = false;
            });

            DecisionService.getCharacteristictsGroupsById(vm.decisionId).then(function(result) {
                prepareCharacteristicsToDisplay(result);
            }).finally(function() {
                if (vm.characteristicGroups.length > 0) {
                    vm.characteristicGroups[0].isOpen = true;
                }
            });

        }
    }
})();
