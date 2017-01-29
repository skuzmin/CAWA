(function() {

    'use strict';

    angular
        .module('app.components')
        .controller('GridstackMovementController', GridstackMovementController)
        .component('gridstackWrapper', {
            templateUrl: 'app/components/gridstackWrapper/gridstack-wrapper.html',
            bindings: {
                list: '<',
                element: '@',
                cellHeight: '=',
                verticalMargin: '=',
                template: '@',
                callback: '&'
            },
            controller: 'GridstackMovementController',
            controllerAs: 'vm'
        });

    GridstackMovementController.$inject = ['$timeout', '$state', 'DecisionNotificationService', 'DecisionSharedService'];

    function GridstackMovementController($timeout, $state, DecisionNotificationService, DecisionSharedService) {
        var
            vm = this,
            gridItems = [],
            index,
            content = {
                decision: 'app/components/gridstackWrapper/decision-partial.html'
            },
            characteristicGroupNames = [];

        vm.displayList = [];
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
            gridItems = $('.' + vm.element);
            var
                plank, elIndex, oldItem, plankHeight, planSizeMap = {};
            //init list if it's empty or if changed page size 
            if (vm.displayList.length === 0 || vm.displayList.length !== vm.list.length) {
                vm.displayList = angular.copy(vm.list);
                //init start positions for new items (position === index)
                _.forEach(vm.displayList, function(item, i) {
                    item.position = i;
                });
            } else {
                _.forEach(vm.list, function(newItem, index) {
                    //finding element(plank) in decision list
                    plank = _.find(gridItems, function(item) {
                        return newItem.decisionId === Number(item.getAttribute('id'));
                    });
                    //if element already exist
                    if (plank) {
                        plankHeight = Number(plank.getAttribute('data-gs-height'));
                        //fix for gridstack movement bug
                        oldItem = _.find(vm.displayList, function(prevItem) {
                            return prevItem.decisionId === newItem.decisionId;
                        });
                        if (oldItem.position < index) { index++; }
                        if (oldItem.characteristics) { newItem.characteristics = oldItem.characteristics; }
                        if (plankHeight > 1) { planSizeMap[newItem.decisionId] = plankHeight; }
                        //resize to default size
                        vm.gridStack.resize(plank, 12, 1);
                        //move element to the correct position and set correct position number
                        vm.gridStack.move(plank, 0, index);
                        newItem.position = index;
                    }
                });
                //set data for new items, when movement animation ended
                $timeout(function() {
                    _.forEach(vm.list, function(newItem, i) {
                        elIndex = _.findIndex(vm.displayList, function(item) {
                            return item.position === i;
                        });
                        newItem.position = i;
                        vm.displayList[elIndex] = newItem;
                    });
                    //restore size of correct plank
                    _.forEach(gridItems, function(plank) {
                        vm.gridStack.resize(plank, 12, 1);
                    });
                    _.forIn(planSizeMap, function(value, key) {
                        plank = _.find(gridItems, function(item) {
                            return key === item.getAttribute('id');
                        });
                        vm.gridStack.resize(plank, 12, value);
                    });
                }, 0);

            }

            //Show percent
            vm.showPercentage = DecisionSharedService.filterObject.selectedCriteria.sortCriteriaIds.length > 0;
        }

        function init() {
            DecisionNotificationService.subscribeCharacteristicsGroups(function(event, data) {
                characteristicGroupNames = data;
            });
            //Activate animation when gridstack object created
            $timeout(function() {
                vm.gridStack.setAnimation(true);
            }, 0);
        }
    }
})();
