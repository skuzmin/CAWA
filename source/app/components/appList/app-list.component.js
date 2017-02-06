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

    AppListController.$inject = ['$timeout', 'DecisionNotificationService', 'DecisionSharedService'];

    function AppListController($timeout, DecisionNotificationService, DecisionSharedService) {
        var
            vm = this,
            currentList = [],
            timer,
            OFFSET_Y = 80 + 10, // refactor
            maxHeight = OFFSET_Y * 10; // refactor

        //TODO: refactor later skuzmin
        vm.showPercentage = false;
        vm.showPercentage = DecisionSharedService.filterObject.selectedCriteria.sortCriteriaIds.length > 0;

        vm.$onChanges = onChanges;

        function onChanges() {
            $timeout.cancel(timer);
            currentList = _.map(vm.list, function(item) {
                return item.decisionId;
            });
            timer = $timeout(function() {
                rearrangeList(currentList);
            }, 0);
        }

        function rearrangeList(currentList) {
            var $el, newTop;
            console.log(currentList);
            // Check if current postion changed
            _.forEach(currentList, function(id, i) {
                $el = $('#decision-' + id);
                newTop = i * OFFSET_Y;
                console.log(newTop);
                if (newTop != parseInt($el.css('top'))) {
                    $el.css({ 'top': newTop });
                }
            });
        }
    }


})();
