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
                elMax = el.attr('resizer-max') || 1900;
                elMin = el.attr('resizer-min') || 100;

                if (event.rect.width <= elMin || event.rect.width >= elMax) {
                    return;
                }

                elW = el.outerWidth();
                elLeft = el.position();

                elNext = $(el.attr('resizer-right'));
                elNextW = elNext.outerWidth();
                elNextLeft = elNext.position();

                totalWidth = elW + elNextW;

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
