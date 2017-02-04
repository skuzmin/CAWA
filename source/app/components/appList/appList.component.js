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

    AppListController.$inject = ['$scope', '$rootScope', '$window'];

    function AppListController($scope, $root, $window) {
        $scope.sorter = 'decisionId';

        $scope.timer = 0;

        $root.currItemIndex = 0;
        var oldList =[],
            reloatItems = [];

        // TODO: oprimize code
        $scope.$watch('sorter', function() {
            $window.clearTimeout($scope.timer);
            $scope.timer = $window.setTimeout(rearrange, 100);
        });

        $scope.$watch('vm.list', function(list) {
            $window.clearTimeout($scope.timer);
            $scope.timer = $window.setTimeout(rearrange, 100);

            var currentList = [];
            _.each(list, function(value, key) {
                currentList.push(value.decisionId);
            })

            // Get items that chnage position
            reloatItems = _.differenceWith(oldList, currentList, _.isEqual);
            console.log(reloatItems);
            oldList = currentList;
            return oldList, reloatItems;
        });

        rearrange();


        function checkPositionUpdate(list, newList) {

        }

        function rearrange() {
            // Check if current postion changed
            $('.list-item-sort').each(function(idx, el) {
                var $el = $(el);
                var OFFSET_Y = 50 + 5; // added margin
                var newTop = idx * OFFSET_Y;

                // if (newTop != parseInt($el.css('top'))) {
                //     $el.css({
                //             'top': newTop
                //         })
                //         .one('webkitTransitionEnd', function(evt) {
                //             $(evt.target).removeClass('moving');
                //         })
                //         // .addClass('moving');
                // }
            });
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