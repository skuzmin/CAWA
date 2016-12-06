(function() {

	'user strict';

	angular
		.module('app.decision')
		.controller('DecisionController', DecisionController);

		DecisionController.$inject = ['data', 'DecisionService', '$scope'];

		function DecisionController(data, DecisionService, $scope) {
			var vm = this;

			
			vm.testData = data;
			vm.testCriteriaGroup = [1,2,3];
			vm.elements = ['app-header', 'app-footer', 'top-panel'];	

			vm.sort = sort;
			vm.testClick = testClick;

			function testClick() {
				console.log('It"s test');
			}

            function sort() {
            	DecisionService.getTestData2().then(function(result) {
            		vm.updateList = result;
            	});
            }
 		}
})();