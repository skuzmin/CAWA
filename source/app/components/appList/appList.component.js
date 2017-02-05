(function() {

    'use strict';

    angular
        .module('app.components')
        .controller('AppListController', AppListController)
        .component('appList', {
            templateUrl: 'app/components/appList/appList.html',
            bindings: {
                decisionId: '=',
                list: '='
            },
            controller: 'AppListController',
            controllerAs: 'vm'
        });

    AppListController.$inject = ['$scope', '$rootScope', '$window', 'DecisionNotificationService', 'DecisionSharedService'];

    function AppListController($scope, $root, $window, DecisionNotificationService, DecisionSharedService) {
        var vm = this;
        vm.showPercentage = false;
        vm.showPercentage = DecisionSharedService.filterObject.selectedCriteria.sortCriteriaIds.length > 0;
        $scope.sorter = 'decisionId';

        $scope.timer = 0;

        $root.currItemIndex = 0;
        var oldList = [],
            reloatItems = [];
        var currentList = [];

        // TODO: oprimize code
        // $scope.$watch('sorter', function() {
        //     $window.clearTimeout($scope.timer);
        //     $scope.timer = $window.setTimeout(rearrangeList, 100);
        // });
        _.each(vm.list, function(value, key) {
            currentList.push(value.decisionId);
        });


        $scope.$watch('vm.list', function(list) {
            $window.clearTimeout($scope.timer);


            currentList = [];
            _.each(list, function(value, key) {
                currentList.push(value.decisionId);
            });
            $scope.timer = $window.setTimeout(function() {
                rearrangeList(currentList);
            }, 10);

            // // Get items that chnage position
            // reloatItems = _.differenceWith(oldList, currentList, _.isEqual);
            // console.log(reloatItems);
            // oldList = currentList;
            // return oldList, reloatItems;
        });

        rearrangeList(currentList);


        function checkPositionUpdate(list, newList) {

        }

        function rearrangeList(currentList) {
            console.log(currentList);
            var OFFSET_Y = 80 + 5; // added margin
            var maxHeight = OFFSET_Y * 10; //$('.list-item-sort').length();
            // Check if current postion changed
            for (var i = 0; i < currentList.length; i++) {
                var $el = $('#decision-' + currentList[i]);
                var newTop = i * OFFSET_Y;
                console.log(newTop);

                if (newTop != parseInt($el.css('top'))) {
                    $el.css({
                        'top': newTop,
                    });
                }
            };
            // $('.list-item-sort').not('.ng-leave').each(function(idx, el) {
            //     var $el = $(el);

            //     var newTop = idx * OFFSET_Y;

            //     if (newTop != parseInt($el.css('top')) && newTop <= maxHeight) {
            //         $el.css({
            //                 'top': newTop
            //             });
            //         console.log(newTop);
            //             // .one('webkitTransitionEnd', function(evt) {
            //             //     $(evt.target).removeClass('moving');
            //             // })
            //             // .addClass('moving');
            //     }
            // });
        }
    }
    // Item
    angular
        .module('app.components')
        .controller('appListItemConrtoller', ['$element', '$rootScope',

            function($el, $root) {
                var OFFSET_Y = 50 + 5; // added margin
                $el.css({
                    'top': $root.currItemIndex * OFFSET_Y
                });
                $root.currItemIndex++;
            }
        ]).directive('appListItem', [
            function() {
                return {
                    restrict: 'EA',
                    controller: 'appListItemConrtoller'
                };
            }
        ]);

})();