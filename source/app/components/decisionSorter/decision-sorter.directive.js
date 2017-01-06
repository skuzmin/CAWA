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
            scope: {},
            link: link
        };

        return directive;

        function link(scope, elem, attrs) {
            scope.$on('initSorter', function(event, data) {
                scope.sorters = data;
                elem.ready(function() {
                    // default sorter value
                    //elem.children().first().addClass('selected');
                    elem.children().on('click', function() {
                        var wasSelected = $(this).hasClass('selected');
                        elem.children().removeClass('selected');
                        if(!wasSelected) {
                            $(this).addClass('selected');
                        }
                    });
                });
            });

            scope.selectSorter = function(sorter) {
                sorter.isSelected = !sorter.isSelected;
                scope.$emit('selectSorter', sorter);
            };
        }
    }

})();
