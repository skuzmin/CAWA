(function() {

    'use strict';

    angular
        .module('app.components')
        .directive('popOver', popOverDirective);

    function popOverDirective() {
        var directive = {
            restrict: 'A',
            scope: {
                contentId: '='
            },
            link: link
        };

        return directive;

        function link($scope, $el, $attrs) {

            // debugger

        }
    }

})();