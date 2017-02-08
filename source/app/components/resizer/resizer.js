(function() {

    'use strict';
    angular
        .module('app.components')
        .directive('resizer', function($document) {

            return function($scope, $el, $attrs) {

                var totalWidth,
                    $el,
                    $elW,
                    $elPos,
                    rightEl,
                    rightElPos,
                    elW,
                    rightElW;


                // $el = $($attrs.resizerLeft);
                elW = $el.outerWidth();
                $elW = $el.outerWidth();
                $elPos = $el.position();

                rightEl = $($attrs.resizerRight);
                rightElPos = rightEl.position();
                rightElW = rightEl.outerWidth();

                totalWidth = $elW + rightElW;

                // Resize Change to pure JS
                function updateResizeElement(event) {
                    var target = event.target,
                        x = (parseFloat(target.getAttribute('data-x')) || 0);

                    console.log(x);
                    // console.log($elPos);

                    var changeW = $el.outerWidth();
                    $el.css({
                        width: event.rect.width + 'px'
                    });

                    $(rightEl).css({
                        left: event.rect.width + 'px',
                        width: totalWidth - event.rect.width + 'px'
                    });
                }
                console.log()
                interact($el)
                    .resizable({
                        preserveAspectRatio: true,
                        edges: {
                            left: false,
                            right: true,
                            bottom: false,
                            top: true
                        }
                    })
                    .on('resizemove', updateResizeElement)

            };
        });
})();