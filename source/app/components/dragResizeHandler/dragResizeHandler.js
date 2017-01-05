(function() {

    'use strict';

    angular
        .module('app.components')
        .directive('dragResizeHandler', dragResizeHandler);

    function dragResizeHandler() {
        var directive = {
            restrict: 'A',
            scope: { },
            link: link
        };

        return directive;

        function link(scope, elem, attrs) {
            var resizableMaxValue = 300;
            elem.ready(function() {
                $('.modal-dialog').draggable({
                    handle: '.modal-drag-handler'
                });
                $('.modal-content').resizable({
                    minHeight: elem.outerHeight(),
                    minWidth: elem.outerWidth(),
                    maxHeight: elem.outerHeight() + resizableMaxValue,
                    maxWidth: elem.outerWidth()+ resizableMaxValue
                });
            });
        }
    }

})();
