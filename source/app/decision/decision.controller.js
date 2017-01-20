(function() {

    'user strict';

    angular
        .module('app.decision')
        .controller('DecisionController', DecisionController);

    DecisionController.$inject = ['decisionBasicInfo', 'DecisionDataService', '$stateParams', '$timeout', 'DecisionNotificationService', 'DecisionSharedService'];

    function DecisionController(decisionBasicInfo, DecisionDataService, $stateParams, $timeout, DecisionNotificationService, DecisionSharedService) {
        var
            vm = this,
            defaultDecisionCount = 10;

        console.log('Decision controller');

        vm.decisionId = $stateParams.id;
        vm.decisionsList = [];
        vm.updateDecisionList = [];
        vm.decision = decisionBasicInfo || {};

        vm.selectDecision = selectDecision;

        init();

        function selectDecision(decision) {
            console.log(decision);
            //BACKEND CALL...
        }

        function asyncLoading(result) {
            //Acync rendering
            $timeout(function() {
                vm.decisionsList = vm.decisionsList.concat(result.splice(0, defaultDecisionCount));
                if (result.length > 0) {
                    asyncLoading(result);
                }
            }, 0);
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

        function searchDecisions() {
            DecisionDataService.searchDecision(vm.decisionId, DecisionSharedService.getFilterObject()).then(function(result) {
                vm.decisionsList.length = 0;
                asyncLoading(result.decisions);
                DecisionSharedService.filterObject.pagination.totalDecisions = result.totalDecisions;
            }).finally(function() {
                vm.decisionsSpinner = false;
            });
        }

        function init() {
            //Check if main decision
            if (!_.isEmpty(vm.decision.parentDecisionIds)) {
                vm.parentDecisions = vm.decision.parentDecisionIds;
            }
            //Get data for decision panel (main)
            vm.decisionsSpinner = true;
            searchDecisions();
            //Init sorters, when directives loaded
            $timeout(function() {
                DecisionNotificationService.notifyInitSorter({ list: [{ name: 'Weight', order: 'DESC', isSelected: true }], type: 'sortCriteriaDirection', mode: 'twoStep' });
                DecisionNotificationService.notifyInitSorter({ list: [{ name: 'Create Date', id: 'createDate' }, { name: 'Update Date', id: 'updateDate' }, { name: 'Name', id: 'name' }], type: 'sortDecisionPropertyDirection', mode: 'threeStep' });
            }, 0);
            //Subscribe to notification events
            DecisionNotificationService.subscribeSelectCriterion(function(event, data) {
                vm.updateDecisionList = data;
            });
            DecisionNotificationService.subscribePageChanged(function() {
                vm.decisionsSpinner = true;
                searchDecisions();
            });
            DecisionNotificationService.subscribeGetDetailedCharacteristics(function(event, data) {
                data.detailsSpinner = true;
                DecisionDataService.getDecisionCharacteristics(vm.decisionId, data.decisionId).then(function(result) {
                    data.characteristics = prepareDataToDisplay(result);
                }).finally(function() {
                    data.detailsSpinner = false;
                });
            });
            DecisionNotificationService.subscribeSelectSorter(function(event, data) {
                vm.decisionsSpinner = true;
                DecisionSharedService.filterObject.sorters[data.mode] = data.sort;
                searchDecisions();
            });

            // Not implemented yet
            DecisionNotificationService.subscribeSelectCharacteristic(function(event, data) {
                console.log(data);
            });
        }
    }
})();
