(function() {

    'use strict';

    angular
        .module('app.components')
        .controller('AppListController', AppListController)
        .component('appList', {
            templateUrl: 'app/components/appList/app-list.html',
            bindings: {
                list: '<'
            },
            controller: 'AppListController',
            controllerAs: 'vm'
        });

    AppListController.$inject = ['$timeout', 'DecisionNotificationService', 'DecisionSharedService', '$window'];

    function AppListController($timeout, DecisionNotificationService, DecisionSharedService, $window) {
        var
            vm = this,
            currentList = [],
            timer,
            OFFSET_Y = 80 + 10, // refactor
            maxHeight = OFFSET_Y * 10, // refactor
            currentListWithHeight = [];


        // TODO: save all list elements with height to localstorage
        // if ($window.localStorage.getItem(sortList).length > 0) {
        //     currentList = JSON.parse($window.localStorage.getItem(sortList))
        // }

        //TODO: refactor later skuzmin
        vm.showPercentage = false;
        vm.showPercentage = DecisionSharedService.filterObject.selectedCriteria.sortCriteriaIds.length > 0;

        vm.$onChanges = onChanges;

        function onChanges() {
            $timeout.cancel(timer);
            currentList = _.map(vm.list, function(item) {
                return item.decisionId;
            });

            // Create obj with id and el height
            currentListWithHeight = generateList(currentList);

            // TODO: maybe remove delay
            // timer = $timeout(function() {
            // reRangeList(currentList);
            reRangeList(currentListWithHeight, 0);
            // }, 10);
        }

        function generateList(arr) { //save to local storage
            var el,
                elHeight,
                arrHeight = [],
                obj = {};

            for (var i = 0; i < arr.length; i++) {
                el = document.getElementById('decision-' + arr[i]);
                elHeight = el.offsetHeight; //not include bottom margin
                obj = {
                    id: arr[i],
                    height: elHeight
                };
                arrHeight[i] = obj;
            }

            return arrHeight;
        }

        // TODO: Find better solution
        function sumArrayIndex(arr, index) {
            var sum = 0;
            for (var i = 0; i < index; i++) {
                sum += parseInt(arr[i].height);
            }
            return sum;
        }

        // Just move elements under resizeble el
        function reRangeList(currentList, index) {
            var el,
                elStyle,
                newTop,
                currentTop,
                offset,
                OFFSET_Y_BOTTOM = 10;

            for (var i = 0; i < arr.length; i++) {
                el = document.getElementById('decision-' + arr[i]);
                offset = i * OFFSET_Y_BOTTOM;
                newTop = sumArrayIndex(currentList, i) + offset;

                elStyle = window.getComputedStyle(element);
                currentTop = style.getPropertyValue('top');

                if (newTop != currentTop) {
                    el.style.top = currentTop;
                }
            }
        }

        // Resize
        function updateResizeElement(event) {
            if (event.rect.height > 300 || event.rect.height < 80) return false;

            var target = event.target,
                y = (parseFloat(target.getAttribute('data-y')) || 0);
            target.style.height = event.rect.height + 'px';

            // TODO: avoid jQuery and move only index from current index
            var elIndex = $('#' + target.id).index();

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
                    top: true
                }
            })
            .on('resizemove', updateResizeElement); //TODO: check performance


    }


})();