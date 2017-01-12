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
                if(scope.sortType !== data.type) {
                    return;
                }
                scope.sorters = data.list;
                elem.ready(function() {
                    // default sorter value
                    //elem.children().first().addClass('selected');
                    elem.children().on('click', function() {
                        var wasSelected = $(this).hasClass('selected');
                        elem.children().removeClass('selected');
                        if (!wasSelected) {
                            $(this).addClass('selected');
                        }
                    });
                });
                scope.$on('$destroy', function() {
                    sorterListener();
                });
            });

            scope.selectSorter = function(sorter) {
                sorter.isSelected = !sorter.isSelected;
                scope.$emit('selectSorter', sorter);
            };
        }
    }

})();
