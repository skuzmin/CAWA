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
            var sorterListener = scope.$on('initSorter', function(event, data) {
                if (scope.sortType !== data.type) {
                    return;
                }
                scope.mode = data.mode;
                scope.sorters = data.list;
                scope.$on('$destroy', function() {
                    sorterListener();
                });
            });

            scope.selectSorter = function(sorter) {
                var 
                    order = sorter.order,
                    sortObj = {sort: {}, mode: ''};

                _.forEach(scope.sorters, function(s) {
                    s.order = '';
                });
                if (order === 'DESC') {
                    sorter.order = 'ASC';
                } else if (order === 'ASC' && scope.mode === 'threeStep') {
                    sorter.order = '';
                } else {
                    sorter.order = 'DESC';
                }
                switch(scope.sortType) {
                    case 'sortCriteriaDirection':
                        sortObj.sort.sortCriteriaDirection = sorter.order;
                        sortObj.mode = scope.sortType;
                        break;
                    case 'sortCharacteristicDirection':
                        sortObj.sort.sortCharacteristicId = sorter.characteristicId;
                        sortObj.sort.sortCharacteristicDirection = sorter.order;
                        sortObj.mode = scope.sortType;
                        break;
                    case 'sortDecisionPropertyDirection':
                        sortObj.sort.sortDecisionPropertyName = sorter.id;
                        sortObj.sort.sortDecisionPropertyDirection = sorter.order;
                        sortObj.mode = scope.sortType;
                        break;
                }
                scope.$emit('selectSorter', sortObj);
            };

        }
    }

})();
