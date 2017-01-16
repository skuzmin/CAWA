(function() {

    'user strict';

    angular
    .module('app.decision')
    .controller('DecisionController', DecisionController);

    DecisionController.$inject = ['decisionBasicInfo', 'DecisionDataService', '$stateParams', '$timeout', 'DecisionNotificationService'];

    function DecisionController(decisionBasicInfo, DecisionDataService, $stateParams, $timeout, DecisionNotificationService) {
        var
        vm = this,
        defaultDecisionCount = 10;

        console.log('Decision controller');

        vm.decisionId = $stateParams.id;
        vm.decisionsList = [];
        vm.updateDecisionList = [];
        vm.decision = decisionBasicInfo || {};
        vm.totalDecisions = 0;

        vm.selectDecision = selectDecision;
        vm.changePage = changePage;

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

        function changePage(page) {
            DecisionDataService.searchDecision(vm.decisionId, {pageNumber: page - 1, pageSize: 10}).then(function(result) {
                vm.decisionsList = result.decisions;
                vm.totalDecisions = result.totalDecisions;
            }).finally(function() {
                vm.decisionsSpinner = false;
            });
        }

        function prepareDataToDisplay(characteristics) {
            var modifiedCharacteristics = {};
            _.forEach(characteristics, function(item) {
                if (!modifiedCharacteristics[item.characteristicGroupId]) {
                    modifiedCharacteristics[item.characteristicGroupId] = [];
                }
                modifiedCharacteristics[item.characteristicGroupId].push(item);
            });
            return modifiedCharacteristics;
        }

        function init() {
            //Check if main decision
            if (!_.isEmpty(vm.decision.parentDecisionIds)) {
                vm.parentDecisions = vm.decision.parentDecisionIds;
            }
            //Get data for decision panel (main)
            vm.decisionsSpinner = true;
            DecisionDataService.searchDecision(vm.decisionId, {pageNumber: 0, pageSize: 10}).then(function(result) {
                asyncLoading(result.decisions);
                vm.totalDecisions = result.totalDecisions;
                DecisionNotificationService.notifyInitSorter({ list: [{name:'Weight'}], type: 'firstLevelSort' });
                DecisionNotificationService.notifyInitSorter({ list: [{name:'Create Date'}, {name: 'Update Date'}, {name: 'Name'}], type: 'thirdLevelSort' });
            }).finally(function() {
                vm.decisionsSpinner = false;
            });
            //Subscribe to notification events
            DecisionNotificationService.subscribeSelectSorter(function(event, data) {
                console.log(data);
            });
            DecisionNotificationService.subscribeSelectCharacteristic(function(event, data) {
                console.log(data);
            });
            DecisionNotificationService.subscribeSelectCriterion(function(event, data) {
                vm.updateDecisionList = data;
            });
            DecisionNotificationService.subscribeGetDetailedCharacteristics(function(event, data) {
                data.detailsSpinner = true;
                DecisionDataService.getDecisionCharacteristics(vm.decisionId, data.decisionId).then(function(result) {
                    data.characteristics = prepareDataToDisplay(result);
                }).finally(function() {
                    data.detailsSpinner = false;
                });
            });
        }
    }
})();
