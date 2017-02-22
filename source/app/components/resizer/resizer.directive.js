(function() {

    'use strict';

    angular
        .module('app.components')
        .directive('resizer', resizer);

    function resizer() {
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
                    x = (parseInt(target.getAttribute('data-x')) || 0),
                    el, elMax, elMin,
                    elW, elLeft, elReactWidth,
                    elNext, elNextW, elNextLeft,
                    totalWidth;

                el = $(target);

                // Limit
                elMax = el.attr('resizer-max') || 1900;
                elMin = el.attr('resizer-min') || 220; //Min width for panel

                if (event.rect.width <= elMin || event.rect.width >= elMax) {
                    return;
                }

                elW = el.outerWidth();
                elReactWidth = parseInt(event.rect.width);
                elLeft = el.position();

                elNext = $(el.attr('resizer-right'));
                elNextW = elNext.outerWidth();
                elNextLeft = elNext.position();

                totalWidth =  elW + elNextW;

                if(totalWidth - event.rect.width - 220 < 0) return;

                // Current element
                el.css({
                    left: parseInt(elLeft.left),
                    width: elReactWidth + 'px'
                });

                // Next element
                elNext.css({
                    left: parseInt(elLeft.left) + elReactWidth + 'px',
                    width: totalWidth - elReactWidth + 'px'
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