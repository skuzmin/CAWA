/* Required jQuery(full) and jQueryUI */
(function() {

    'use strict';

    angular
        .module('app.components')
        .directive('appDivider', appDivider);

        function appDivider() {
        	var directive = {
        		restrict: 'E',
			    replace: 'true',
			    template: '<div class="divider"></div>',
			    scope: {
			    	axis: '@',
			    	side: '@'
			    },
			    link: link
        	};

        	return directive;

        	function link(scope, elem, attrs) {
        		elem.draggable({
				    axis: scope.axis, 
				    containment: 'parent',
				    drag: function (event, ui) {
				    	var
				     		leftElementCurrentWidth = elem.prev().width(),
				        	rightElementCurrentWidth = elem.next().width(),
				        	newLeftElementWidth,
				        	newRightElementWidth;
				    	if(scope.side === 'right') {
				    		newRightElementWidth = $(window).width() - (ui.offset.left + elem.outerWidth());
				    		newLeftElementWidth = leftElementCurrentWidth + (rightElementCurrentWidth - newRightElementWidth);
				    	} else {
				    		newLeftElementWidth = ui.offset.left; 
				        	newRightElementWidth = rightElementCurrentWidth + (leftElementCurrentWidth - newLeftElementWidth);
				    	} 				        
				        if(newRightElementWidth > 0 && newLeftElementWidth > 0) {
				        	elem.next().width(newRightElementWidth);
				        	elem.prev().width(newLeftElementWidth);
				        }				        
				    } 
				});
        	}
        }

})();
