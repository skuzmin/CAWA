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
                callback: '&',
                sorters: '='
            },
            link: link
        };

        return directive;

        function link(scope, elem, attrs) {
            scope.sortByCriteria = function(criteria) {
                scope.callback({sorter: criteria});
            };
            elem.ready(function() {
                // default sorter value
                //elem.children().first().addClass('active');
                elem.children().on('click', function() {
                   elem.children().removeClass('active');
                   $(this).addClass('active');
                });
            });
        }
    }

})();
