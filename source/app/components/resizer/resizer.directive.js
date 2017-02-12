(function() {

    'use strict';

    angular
        .module('app.components')
        .directive('resizer', resizer);

    resizer.$inject = ['ResizerConstant'];

    function resizer(ResizerConstant) {
        var directive = {
            restrict: 'A',
            link: link
        };

        return directive;

        function link($scope, $el, $attrs) {

            // TODO: fix horizontal resize limit
            function updateResizeElement(event) {
                var
                    target = event.target,
                    x = (parseFloat(target.getAttribute('data-x')) || 0),
                    el, elMax, elMin,
                    elW, elLeft,
                    elNext, elNextW, elNextLeft,
                    totalWidth;

                el = $(target);

                // Limit
                elMax = el.attr('resizer-max') || ResizerConstant.MAX_PANEL_WIDTH;
                elMin = el.attr('resizer-min') || ResizerConstant.MIN_PANEL_WIDTH;

                if (event.rect.width <= elMin || event.rect.width >= elMax) {
                    return;
                }

                elW = el.outerWidth();
                elLeft = el.position();

                elNext = $(el.attr('resizer-right'));
                elNextW = elNext.outerWidth();
                elNextLeft = elNext.position();

                totalWidth = elW + elNextW;

                if (totalWidth - event.rect.width - ResizerConstant.MIN_PANEL_WIDTH < 0) {
                    return;
                }

                // Current element
                el.css({
                    left: elLeft.left,
                    width: event.rect.width + 'px'
                });

                // Next element
                elNext.css({
                    left: elLeft.left + event.rect.width + 'px',
                    width: totalWidth - event.rect.width + 'px'
                });
            }

            interact('.app-resizer-horizontal')
                .resizable({
                    preserveAspectRatio: true,
                    edges: {
                        left: false,
                        right: true,
                        bottom: false,
                        top: true
                    }
                })
                .on('resizemove', updateResizeElement);
        }
    }

})();
