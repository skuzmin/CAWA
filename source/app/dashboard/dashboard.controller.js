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
            	_.forEach(items, function(item) {
            		vm.gridStack.move(item, 0, Math.floor((Math.random() * 10)));
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