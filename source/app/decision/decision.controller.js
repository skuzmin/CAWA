(function() {

    'user strict';

    angular
        .module('app.decision')
        .controller('DecisionController', DecisionController);

    DecisionController.$inject = ['decisionBasicInfo', 'DecisionService', '$stateParams', '$timeout', '$rootScope'];

    function DecisionController(decisionBasicInfo, DecisionService, $stateParams, $timeout, $rootScope) {
        var
            vm = this,
            defaultDecisionCount = 5;

        console.log('Decision controller');

        vm.decisionId = $stateParams.id;
        vm.decisionsList = [];
        vm.decision = decisionBasicInfo || {};
        vm.selectDecision = selectDecision;

        init();

        function selectDecision(decision) {
            console.log(decision);
            //BACKEND CALL...
        }

        function asyncLoading(result) {
            $timeout(function() {
                vm.decisionsList = vm.decisionsList.concat(result.splice(0, defaultDecisionCount));
                if (result.length > 0) {
                    asyncLoading(result);
                }
            }, 0);
        }

        $rootScope.$on('selectSorter', function(event, data) {
            console.log(data);
            //BACKEND CALL...
        });
        $rootScope.$on('selectCriterion', function(event, data) {
            console.log(data);
            //BACKEND CALL...
        });
        $rootScope.$on('selectCharacteristic', function(event, data) {
            console.log(data);
            //BACKEND CALL...
        });

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
