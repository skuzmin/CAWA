(function() {

	'user strict';

	angular
		.module('app.dashboard')
		.controller('DashboardController', DashboardController);

		DashboardController.$inject = ['data', 'DashboardService'];

		function DashboardController(data, DashboardService) {
			var vm = this;

			vm.testData = data;

			vm.removeWidget = removeWidget;
			vm.sort = sort;
            vm.gridStack = {};

			function removeWidget(w) {
                var index = vm.testData.indexOf(w);
                vm.testData.splice(index, 1);
            };

            function sort() {
            	var items = $('.grid-stack-item');
            	DashboardService.getTestData2().then(function(result) {
            		var index;
            		_.forEach(items, function(item) {
	            		index = result.findIndex(function(data) {
							return data.id === Number(item.getAttribute('id'));
	            		});
	            		console.log(index);
	            		vm.gridStack.move(item, 0, index);
	            	});
	            	//vm.testData = result;
            	});
            }

            vm.options = {
                cellHeight: 100,
                verticalMargin: 10
            };

            setTimeout(function(){
                vm.gridStack.set_animation(true);
            },0);

 		}
})();