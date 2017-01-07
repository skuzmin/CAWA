(function() {

    'user strict';

    angular
        .module('app.decision')
        .controller('DecisionController', DecisionController);

    DecisionController.$inject = ['decisionBasicInfo', 'DecisionDataService', '$stateParams', '$timeout', 'DecisionNotificationService'];

    function DecisionController(decisionBasicInfo, DecisionDataService, $stateParams, $timeout, DecisionNotificationService) {
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

        DecisionNotificationService.subscribeSelectSorter(function(event, data) {
            console.log(data);
        });

        function init() {
            //Check if main decision
            if (!_.isEmpty(vm.decision.parentDecisionIds)) {
                vm.parentDecisions = vm.decision.parentDecisionIds;
            }
            //Get data for decision panel (main)
            vm.decisionsSpinner = true;
            DecisionDataService.searchDecision(vm.decisionId).then(function(result) {
                asyncLoading(result);
            }).finally(function() {
                vm.decisionsSpinner = false;
            });
            //Subscribe to notification events
            DecisionNotificationService.subscribeSelectSorter(function(event, data) {
                console.log(data);
            });
            DecisionNotificationService.subscribeSelectCriterion(function(event, data) {
                console.log(data);
            });
            DecisionNotificationService.subscribeSelectCharacteristic(function(event, data) {
                console.log(data);
            });
            DecisionNotificationService.subscribeGetDetailedCharacteristics(function(event, data) {
                data.detailsSpinner = true;
                DecisionDataService.getdecisionCharacteristics(vm.decisionId, data.decisionId).then(function(result) {
                    var obj = {};
                    _.forEach(result, function(item) {
                        if(!obj[item.characteristicGroupId]) {
                            obj[item.characteristicGroupId] = [];
                        }
                        obj[item.characteristicGroupId].push(item);
                    });
                    data.characteristics = obj;
                }).finally(function() {
                    data.detailsSpinner = false;
                });
            });
        }
    }
})();
