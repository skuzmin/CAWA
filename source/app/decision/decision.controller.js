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

        //TEST DATA
        vm.testCriteriaGroup = [1, 2, 3];
        vm.testClick = testClick;

        function testClick() {
            console.log('It"s test');
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

        }
    }
})();
