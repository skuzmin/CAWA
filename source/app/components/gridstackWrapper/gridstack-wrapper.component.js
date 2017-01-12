(function() {

    'use strict';

    angular
        .module('app.components')
        .controller('GridstackMovementController', GridstackMovementController)
        .component('gridstackWrapper', {
            templateUrl: 'app/components/gridstackWrapper/gridstack-wrapper.html',
            bindings: {
                initList: '=',
                updateList: '<',
                element: '@',
                cellHeight: '=',
                verticalMargin: '=',
                template: '@',
                callback: '&'
            },
            controller: 'GridstackMovementController',
            controllerAs: 'vm'
        });

    GridstackMovementController.$inject = ['$timeout', '$state', 'DecisionNotificationService'];

    function GridstackMovementController($timeout, $state, DecisionNotificationService) {
        var
            vm = this,
            gridItems = [],
            index,
            content = {
                decision: 'app/components/gridstackWrapper/decision-partial.html'
            },
            characteristicGroupNames = [];

        vm.showPercentage = false;
        vm.gridStack = {};
        vm.innerTemplate = content[vm.template];
        vm.options = {
            cellHeight: vm.cellHeight,
            verticalMargin: vm.verticalMargin,
            draggable: {
                handle: '.panel-drag-handler',
            }
        };

        vm.selectDecision = selectDecision;
        vm.$onChanges = onChanges;
        vm.goToDecision = goToDecision;
        vm.getDetails = getDetails;
        vm.getGroupNameById = getGroupNameById;

        init();

        function getGroupNameById(id) {
            var group = _.find(characteristicGroupNames, function(group) {
                return group.characteristicGroupId.toString() === id;
            });
            return group ? group.name : 'Group';
        }

        function getDetails(decision) {
            if (!decision.characteristics && !decision.detailsSpinner) {
                DecisionNotificationService.notifyGetDetailedCharacteristics(decision);
            }
        }

        function goToDecision(event, decisionId) {
            event.stopPropagation();
            event.preventDefault();
            $state.go('decision', { id: decisionId });
        }

        function selectDecision(currentDecision) {
            var prevDecision = _.find(vm.initList, function(decision) {
                return decision.isSelected;
            });
            if (!prevDecision) {
                currentDecision.isSelected = true;
            } else if (prevDecision.decisionId === currentDecision.decisionId) {
                currentDecision.isSelected = false;
            } else {
                prevDecision.isSelected = false;
                currentDecision.isSelected = true;
            }
            vm.callback({ decision: currentDecision });
        }

        function onChanges() {
            //Move elements(decisions) in main column (animation)
            gridItems = $('.' + vm.element);
            _.forEach(gridItems, function(item) {
                index = vm.updateList.findIndex(function(data) {
                    return data.decisionId === Number(item.getAttribute('id'));
                });
                if (index !== -1) {
                    vm.gridStack.move(item, 0, index);
                }
            });
            //Set decions percent(% criterion match)
            var newItem;
            _.forEach(vm.initList, function(initItem) {
                newItem = _.find(vm.updateList, function(updateItem) {
                    return updateItem.decisionId === initItem.decisionId;
                });
                if (newItem) {
                    setDecisionMatchPercent(newItem, initItem);
                }
            });
            //Show percent
            vm.showPercentage = _.find(vm.updateList, function(item) {
                return item.criteriaCompliancePercentage !== null;
            });
        }

        function setDecisionMatchPercent(newItem, initItem) {
            var percent = parseFloat(newItem.criteriaCompliancePercentage);
            if (_.isNaN(percent)) {
                percent = 0;
            } else if (!_.isInteger(percent)) {
                percent = percent.toFixed(2);
            }
            initItem.criteriaCompliancePercentage = percent + '%';
        }

        function init() {
            DecisionNotificationService.subscribeCharacteristicsGroups(function(event, data) {
                characteristicGroupNames = data;
            });

            $timeout(function() {
                vm.gridStack.setAnimation(true);
            }, 0);
        }


    }
})();
