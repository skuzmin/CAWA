(function() {

	'user strict';

	angular
		.module('app.decision')
		.controller('DecisionController', DecisionController);

		DecisionController.$inject = ['data', 'DecisionService'];

		function DecisionController(data, DecisionService) {
			var vm = this;

			vm.testData = data;
			vm.sort = sort;

$('.divider').draggable({
			    axis: 'x', 
			    containment: 'parent',
			    drag: function (event, ui) { 
			        var 
			        	newWidth = ui.offset.left, 
			        	criteriaWidth = $(this).prev().width(),
			        	dicisionWidth = $(this).next().width();
			        	
			        $(this).next().width(dicisionWidth + (criteriaWidth - newWidth));
			        $(this).prev().width(newWidth);
			    } 
			});

            function sort() {
            	DecisionService.getTestData2().then(function(result) {
            		vm.updateList = result;
            	});
            }
 		}
})();