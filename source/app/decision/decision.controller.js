(function() {

    'user strict';

    angular
        .module('app.decision')
        .controller('DecisionController', DecisionController);

    DecisionController.$inject = ['DecisionService', '$stateParams'];

    function DecisionController(DecisionService, $stateParams) {
        var
            vm = this,
            decisionId = $stateParams.id,
            generalAccordion = 0;

        console.log('Decision controller');

        vm.decisionsList = [];
        vm.decision = {};
        vm.pageSpinners = {
            decisions: true,
            criterias: true,
            characteristics: true
        };
        vm.criteriaGroups = [{
            name: 'General',
            criterias: []
        }];
        vm.characteristicGroups = [{
            name: 'General',
            characteristics: []
        }];

        //TEST DATA
        vm.testCriteriaGroup = [1, 2, 3];
        vm.testClick = testClick;

        function testClick() {
            console.log('It"s test');
        }
        // ---------------------------


        init();

        function prepareDataToDisplay(data, groups, type, typeId) {
            _.forEach(data, function(item) {
                if (item[typeId]) {
                    _.forEach(groups, function(group) {
                        if (!group[type]) {
                            group[type] = [];
                        }
                        if (group[typeId] === item[typeId]) {
                            group[type].push(item);
                        }
                    });
                } else {
                    groups[generalAccordion][type].push(item);
                }
            });
        }

        function init() {
            DecisionService.getDecisionInfo(decisionId).then(function(result) {
                vm.decision = result;
            });

            DecisionService.searchDecision(decisionId).then(function(result) {
                vm.decisionsList = result;
            }).finally(function() {
                vm.pageSpinners.decisions = false;
            });

            DecisionService.getCriteriaGroupsById(decisionId).then(function(result) {
                vm.criteriaGroups = vm.criteriaGroups.concat(result);
                return DecisionService.getCriteriasById(decisionId);
            }).then(function(result) {
            	prepareDataToDisplay(result, vm.criteriaGroups, 'criterias', 'criterionGroupId');
            }).finally(function() {
                vm.pageSpinners.criterias = false;
                vm.criteriaGroups[generalAccordion].isOpen = true;
            });

            DecisionService.getCharacteristictGroupsById(decisionId).then(function(result) {
                vm.characteristicGroups = vm.characteristicGroups.concat(result);
                return DecisionService.getCharacteristictsById(decisionId);
            }).then(function(result) {
            	prepareDataToDisplay(result, vm.characteristicGroups, 'characteristics', 'characteristicGroupId');
            }).finally(function() {
                vm.pageSpinners.characteristics = false;
                vm.characteristicGroups[generalAccordion].isOpen = true;
            });
        }
    }
})();
