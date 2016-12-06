(function() {

    'use strict';

    angular
        .module('app.components')
        .directive('elementReady', elementReady);

    function elementReady() {
        var directive = {
            restrict: 'A',
            scope: {
            	main: '@', //main block 
            	elementToUpdate: '@', //element(s) where need update height
            	elementsToCalculate: '=' //elements (array), what need subtract to calculate height
            },
            link: link
        };

        return directive;

        function link(scope, elem, attrs) {
            var mainHeight, newHeight, currentHeight, counter = 0;

            elem.ready(changeHeight()); // calculate when element ready
            $(window).on('resize', changeHeight()); //calculete when window size was changed
            
            // chech element height every 0.5 sec, stop after 30 sec
            var heightChecker = setInterval(function() {
                currentHeight = $('.' + scope.main).outerHeight();
                if (mainHeight !== currentHeight) {
                	changeHeight();
                } else {
                	counter++;
                }
                if(counter === 60) {
                	clearInterval(heightChecker);
                }
            }, 500);

            //change height function
            function changeHeight() {
            	//basic height (window)
            	newHeight = $(window).height();
            	// windowHeight - all elemets heights (array of elements)
            	_.forEach(scope.elementsToCalculate, function(element) {
            		newHeight -= $('.' + element).outerHeight();
            	});
            	//main block height
                mainHeight = $('.' + scope.main).outerHeight();
                //fix for window resizing
                if (mainHeight > newHeight) {
                    newHeight = mainHeight;
                }
                //update element(s) on page with new height
                $('.' + scope.elementToUpdate).css('min-height', newHeight);
            }
        }

    }
})();
