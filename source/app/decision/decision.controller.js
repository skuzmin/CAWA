(function() {

    'user strict';

    angular
        .module('app.decision')
        .controller('DecisionController', DecisionController);

    DecisionController.$inject = ['decisionBasicInfo', 'DecisionService', '$stateParams'];

    function DecisionController(decisionBasicInfo, DecisionService, $stateParams) {
        var
            vm = this,
            decisionId = $stateParams.id,
            defaultAccordion = 0;

        console.log('Decision controller');

        vm.decisionsList = [];
        vm.decision = decisionBasicInfo || {};
        vm.pageSpinners = {
            decisions: true,
            criteria: true,
            characteristics: true
        };
        vm.criteriaGroups = [];
        vm.characteristicGroups = [];

        //TEST DATA
        vm.testCriteriaGroup = [1, 2, 3];
        vm.testClick = testClick;

        function testClick() {
            console.log('It"s test');
        }
        // ---------------------------


        init();

        function init() {
            DecisionService.searchDecision(decisionId).then(function(result) {
                vm.decisionsList = result;
            }).finally(function() {
                vm.pageSpinners.decisions = false;
            });

            DecisionService.getCriteriaGroupsById(decisionId).then(function(result) {
                vm.criteriaGroups = result;
            }).finally(function() {
            	if(vm.criteriaGroups.length > 0) {
            		vm.criteriaGroups[defaultAccordion].isOpen = true;
            	}
                vm.pageSpinners.criteria = false;
            });

            DecisionService.getCharacteristictsGroupsById(decisionId).then(function(result) {
                vm.characteristicGroups = result;
            }).finally(function() {
            	if(vm.characteristicGroups.length > 0) {
            		vm.characteristicGroups[defaultAccordion].isOpen = true;
            	}
                vm.pageSpinners.characteristics = false;
            });
        }
    }
})();
