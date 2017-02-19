(function() {

    'use strict';

    angular
        .module('app.components')
        .controller('AppListController', AppListController)
        .component('appList', {
            templateUrl: 'app/components/appList/app-list.html',
            bindings: {
                list: '<',
                template: '@'
            },
            controller: 'AppListController',
            controllerAs: 'vm'
        });

    AppListController.$inject = ['DecisionNotificationService', 'DecisionSharedService', 'AppListConstant', '$state'];

    function AppListController(DecisionNotificationService, DecisionSharedService, AppListConstant, $state) {
        var
            vm = this,
            currentList = [],
            currentListWithHeight = [];


        //TODO: create hashmap for saving resized items
        //TODO: refactor later skuzmin
        vm.showPercentage = false;

        vm.$onChanges = onChanges;

        function onChanges() {
            currentList = _.map(vm.list, function(item) {
                return item.decisionId;
            });
            // Create obj with id and el height
            currentListWithHeight = generateList(currentList);
            reRangeList(currentListWithHeight, 0);
            vm.showPercentage = DecisionSharedService.filterObject.selectedCriteria.sortCriteriaIds.length > 0;
        }

        function generateList(arr) {
            var
                el, elHeight,
                arrHeight = [],
                obj = {};

            _.forEach(arr, function(item) {
                el = document.getElementById('decision-' + item);
                elHeight = el.offsetHeight; //not include bottom margin
                obj = {
                    id: item,
                    height: elHeight
                };
                arrHeight.push(obj);
            });

            return arrHeight;
        }

        function sumArrayIndex(arr, index) {
            var sum = 0;
            for (var i = 0; i < index; i++) {
                sum += parseInt(arr[i].height);
            }
            return sum;
        }

        // Move elements under resizeble el
        function reRangeList(currentList, index) {
            var elStyle, newTop, currentTop, offset;

            for (var i = 0; i < currentList.length; i++) {
                var el = document.getElementById('decision-' + currentList[i].id);

                if (!el) return;

                offset = i * AppListConstant.OFFSET_Y_BOTTOM;
                newTop = sumArrayIndex(currentList, i) + offset + 'px';
                elStyle = window.getComputedStyle(el, null);

                if (elStyle) {
                    currentTop = elStyle.getPropertyValue('top');
                    if (newTop !== currentTop) el.style.top = newTop;
                }
            }
        }

        // Resize
        function updateResizeElement(event) {
            var
                target = event.target,
                y;

            target = event.target
            if (event.rect.height <= AppListConstant.ELEMENT_HEIGHT) return;

            y = (parseFloat(target.getAttribute('data-y')) || 0);
            target.style.height = event.rect.height + 'px';

            // TODO: avoid jQuery and move only index from current index
            var elIndex = $('#' + target.id).index();

            $('.list-item-sort').addClass('app-stop-animation');

            currentListWithHeight[elIndex].height = event.rect.height;
            reRangeList(currentListWithHeight, elIndex);
        }

        interact('.app-resize-h')
            .resizable({
                preserveAspectRatio: true,
                edges: {
                    left: false,
                    right: false,
                    bottom: true,
                    top: false
                }
            })
            .on('resizemove', updateResizeElement)
            .on('resizeend', function() {
                $('.list-item-sort').removeClass('app-stop-animation');
            });


        // TODO: refactor it, maybe make as new component
        var content = {
                decision: 'app/components/appList/decision-partial.html'
            },
            characteristicGroupNames = [];

        vm.innerTemplate = content.decision; //content[vm.template];

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

        // TODO: save loaded data push to vm.displayList?!
        function getDetails(decision) {
            if (!decision.characteristics && !decision.detailsSpinner) {
                DecisionNotificationService.notifyGetDetailedCharacteristics(decision);
            }
        }

        function goToDecision(event, decisionId) {
            event.stopPropagation();
            event.preventDefault();
            $state.go('decision', {
                id: decisionId
            });
        }

        function selectDecision(currentDecision) {
            var prevDecision = _.find(vm.list, function(decision) {
                return decision.isSelected;
            });
            if (!prevDecision) {
                currentDecision.isSelected = true;
                DecisionSharedService.filterObject.selectedDecision.decisionsIds.push(currentDecision.decisionId);
            } else if (prevDecision.decisionId === currentDecision.decisionId) {
                DecisionSharedService.filterObject.selectedDecision.decisionsIds = []; //TODO: use splice
                currentDecision.isSelected = false;
            } else {
                prevDecision.isSelected = false;
                currentDecision.isSelected = true;

                DecisionSharedService.filterObject.selectedDecision.decisionsIds = []; //TODO: use splice
                DecisionSharedService.filterObject.selectedDecision.decisionsIds.push(currentDecision.decisionId);
            }

            DecisionNotificationService.notifySelectDecision(DecisionSharedService.filterObject.selectedDecision.decisionsIds);
            // console.log(DecisionSharedService.filterObject.selectedDecision.decisionsIds);
            // console.log(DecisionSharedService.filterObject);
        }


        function init() {
            DecisionNotificationService.subscribeCharacteristicsGroups(function(event, data) {
                characteristicGroupNames = data;
            });
        }

    }


})();