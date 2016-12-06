(function() {

    'use strict';

    angular
        .module('app.components')
        .directive('decisionFilter', decisionFilter);

    function decisionFilter() {
        var directive = {
            restrict: 'E',
            replace: 'true',
            templateUrl: 'app/components/decision-filter.html',
            scope: {
                callback: '&',
                filters: '='
            },
            link: link
        };

        return directive;

        function link(scope, elem, attrs) {
            elem.ready(function() {
                elem.children().first().addClass('active');
                elem.children().on('click', function() {
                   elem.children().removeClass('active');
                   $(this).addClass('active');
                });
            });
        }
    }

})();
