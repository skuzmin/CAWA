(function() {

    'use strict';

    angular
        .module('app.components')
        .directive('popOver', popOverDirective);

    function popOverDirective($window, $uibPosition) {
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

            var el = $el,
                elParent = el.parents('.matrix-table-title-wrapper'),
                elH = elParent.outerHeight();

            $el.on('click', function(event) {
                var elContent = $('[data-pop-over-content-id="' + $scope.contentId + '"]');

                $('.matrix-table-group .app-control').toggleClass('selected', false);
                $('.app-pop-over-content').toggleClass('hide', true);

                // console.log($uibPosition.position(el));
                // console.log($uibPosition.position(elParent));
                // console.log($uibPosition.viewportOffset(elParent));
                
                var parentViewportOffset = $uibPosition.viewportOffset(elParent);
                $(this).toggleClass('selected');
                elContent.toggleClass('hide').css({
                    top: parentViewportOffset.top + elH + 'px',
                    right: parentViewportOffset.right + 'px'
                        // left: parentViewportOffset.left + 'px'
                });

                event.preventDefault();
            });


        }
    }

})();