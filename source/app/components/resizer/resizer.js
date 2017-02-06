(function() {

    'use strict';
    angular
        .module('app.components')
        .directive('resizer', function($document) {

            return function($scope, $element, $attrs) {

                $element.on('mousedown', function(event) {
                    event.preventDefault();

                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);
                });


                var rightW = $($attrs.resizerRight).width();
                var leftW = $($attrs.resizerLeft).width();
                var totalW = rightW + leftW;
                console.log(rightW);

                function mousemove(event) {

                    if ($attrs.resizer == 'vertical') {
                        // Handle vertical resizer
                        var x = event.pageX;

                        if ($attrs.resizerMax && x > $attrs.resizerMax) {
                            x = parseInt($attrs.resizerMax);
                        } else if ($attrs.resizerMin && x < $attrs.resizerMin) {
                            x = parseInt($attrs.resizerMin);
                        }

                        $element.css({
                            left: x + 'px'
                        });

                        $($attrs.resizerLeft).css({
                            width: x + 'px'
                        });
                        $($attrs.resizerRight).css({
                            left: (x + parseInt($attrs.resizerWidth)) + 'px',
                            width: totalW - parseInt(x) + parseInt($attrs.resizerWidth)
                        });

                    } else {
                        // Handle horizontal resizer
                        var y = window.innerHeight - event.pageY;

                        $element.css({
                            bottom: y + 'px'
                        });

                        $($attrs.resizerTop).css({
                            bottom: (y + parseInt($attrs.resizerHeight)) + 'px'
                        });
                        $($attrs.resizerBottom).css({
                            height: y + 'px'
                        });
                    }
                }

                function mouseup() {
                    $document.unbind('mousemove', mousemove);
                    $document.unbind('mouseup', mouseup);
                }
            };
        });
})();