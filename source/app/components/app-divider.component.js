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
			    	axis: '@'
			    },
			    link: link
        	}

        	return directive;

        	function link(scope, elem, attrs) {
        		elem.draggable({
				    axis: scope.axis, 
				    containment: 'parent',
				    drag: function (event, ui) { 
				        var 
				        	newLeftElementWidth = ui.offset.left, 
				        	leftElementCurrentWidth = elem.prev().width(),
				        	rightElementCurrentWidth = elem.next().width(),
				        	newRightElementWidth = rightElementCurrentWidth + (leftElementCurrentWidth - newLeftElementWidth);
				        	
				        if(newRightElementWidth > 0) {
				        	elem.next().width(newRightElementWidth);
				        	elem.prev().width(newLeftElementWidth);
				        }				        
				    } 
				});
        	}
        }

})();
