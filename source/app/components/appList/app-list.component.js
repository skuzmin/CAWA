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
            currentListWithHeight = generateHeightList(currentList);

            // TODO: maybe remove delay need
            timer = $timeout(function() {
                // rearrangeList(currentList);
                rearrangeListHeight(currentListWithHeight);
            }, 10);
        }

        function generateHeightList(arr) { //save to local storage
            var $el, elHeight, arrHeight = [];
            for (var i = 0; i < arr.length; i++) {
                var obj = {};
                $el = $('#decision-' + arr[i]);
                elHeight = $el.outerHeight(); //not include bottom margin
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

        function rearrangeListHeight(currentList) {
            var $el,
                newTop,
                offset,
                OFFSET_Y_BOTTOM = 10;

            _.forEach(currentList, function(item, i) {
                $el = $('#decision-' + item.id);
                offset = i * OFFSET_Y_BOTTOM;
                newTop = sumArrayIndex(currentList, i) + offset;
                // console.log(newTop);
                if (newTop != parseInt($el.css('top'))) {
                    $el.css({
                        'top': newTop
                    });
                }
            });

            // Store to local storage
            // $window.localStorage.setItem(sortList, currentList);
        }

        // TODO: remove
        function rearrangeList(currentList) {
            var $el, newTop;
            _.forEach(currentList, function(id, i) {
                $el = $('#decision-' + id);
                newTop = i * OFFSET_Y;
                if (newTop != parseInt($el.css('top'))) {
                    $el.css({
                        'top': newTop
                    });
                }
            });
        }


        function updateResizeElement(event) {
            var target = event.target,
                y = (parseFloat(target.getAttribute('data-y')) || 0);

            // update the element's style

            if (event.rect.height > 300 || event.rect.height < 80) return false;
            target.style.height = event.rect.height + 'px';

            // console.log(target.id);
            // TODO: avoid jQuery and move only index from current index
            var elIndex = $('#' + target.id).index();
            currentListWithHeight[elIndex].height = event.rect.height;
            rearrangeListHeight(currentListWithHeight);
        }

        // Resize
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