(function() {

    'use strict';

    angular
        .module('app.components')
        .directive('decisionSorter', decisionSorter);

    function decisionSorter() {
        var directive = {
            restrict: 'E',
            replace: 'true',
            templateUrl: 'app/components/decisionSorter/decision-sorter.html',
            scope: {
                sortType: '@'
            },
            link: link
        };

        return directive;

        function link(scope, elem, attrs) {
            //subscribe on init sorter event
            var
                sorterListener = scope.$on('initSorter', function(event, data) {
                    if (scope.sortType === data.type) {
                        scope.mode = data.mode;
                        scope.sorters = data.list;
                    }
                    scope.$on('$destroy', function() {
                        sorterListener();
                    });
                }),
                order,
                sortObj;

            scope.selectSorter = function(sorter) {
                //clear all sorting orders
                order = sorter.order;
                sortObj = {
                    sort: {id: null, order: null},
                    mode: ''
                };
                _.forEach(scope.sorters, function(s) {
                    s.order = '';
                });
                //set correct sort order for sorter button
                if (order === 'DESC') {
                    sorter.order = 'ASC';
                } else if (order === 'ASC' && scope.mode === 'threeStep') {
                    sorter.order = null;
                } else {
                    sorter.order = 'DESC';
                }
                //set sortObj data for sorting request
                if(sorter.order) {
                    sortObj.sort.id = sorter.characteristicId || sorter.propertyId;
                    sortObj.sort.order = sorter.order;
                }
                sortObj.mode = scope.sortType;

                scope.$emit('selectSorter', sortObj);
            };

        }
    }

})();
