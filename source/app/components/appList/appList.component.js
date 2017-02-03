(function() {

    'use strict';

    angular
        .module('app.components')
        .controller('AppListController', AppListController)
        .component('appList', {
            templateUrl: 'app/components/appList/appList.html',
            bindings: {
                decisionId: '=',
                items: '<'
            },
            controller: 'AppListController',
            controllerAs: 'vm'
        });

    AppListController.$inject = ['$scope', '$rootScope', '$window'];

    function AppListController($scope, $root, $window) {
        $scope.sorter = 'id';
        // console.log($scope.items);
        $scope.items = [{
            "id": 1,
            "first_name": "John",
            "last_name": "Doe"
        }, {
            "id": 2,
            "first_name": "Jane",
            "last_name": "Doe"
        }, {
            "id": 3,
            "first_name": "Jon",
            "last_name": "Dobbs"
        }, {
            "id": 4,
            "first_name": "Alice",
            "last_name": "Birdman"
        }, {
            "id": 5,
            "first_name": "Sally",
            "last_name": "Xylophony"
        }, {
            "id": 6,
            "first_name": "Ray",
            "last_name": "Bradbury"
        }, {
            "id": 7,
            "first_name": "Arthur C.",
            "last_name": "Clark"
        }, {
            "id": 8,
            "first_name": "Good King",
            "last_name": "Wensuslausage"
        }, {
            "id": 9,
            "first_name": "Booker T.",
            "last_name": "Washington"
        }, {
            "id": 10,
            "first_name": "Miles",
            "last_name": "Davis"
        }, {
            "id": 11,
            "first_name": "Daniel",
            "last_name": "McDaniels"
        }];

        $scope.timer = 0;

        $root.currItemIndex = 0;

        $scope.$watch('sorter', function() {
            $window.clearTimeout($scope.timer);
            $scope.timer = $window.setTimeout(rearrange, 100);
        });

        function rearrange() {
            $('.item').each(function(idx, el) {
                var $el = $(el);
                var OFFSET_Y = 50;
                var newTop = idx * OFFSET_Y;

                if (newTop != parseInt($el.css('top'))) {
                    $el.css({
                            'top': newTop
                        })
                        .one('webkitTransitionEnd', function(evt) {
                            $(evt.target).removeClass('moving');
                        })
                        .addClass('moving');
                }

            });
        }
    }
    // Item
    angular
        .module('app.components')
        .controller('appListItemConrtoller', ['$element', '$rootScope',

            function($el, $root) {
                var OFFSET_Y = 50;
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