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

			setPosition();

			function removeWidget(w) {
                var index = vm.testData.indexOf(w);
                vm.testData.splice(index, 1);
            };

            function sort() {
            	vm.testData = _.sortBy(vm.testData, 'id');
            	setPosition();
            }

            function setPosition() {
            	_.forEach(vm.testData, function(item, i) {
            		item.position = i;
            	});
            }

            vm.options = {
                cellHeight: 200,
                verticalMargin: 10
            };

            setTimeout(function(){
                vm.gridStack.set_animation(true);
            },0);

 		}
})();