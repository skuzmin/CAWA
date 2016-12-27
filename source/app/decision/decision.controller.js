(function() {

	'user strict';

	angular
		.module('app.decision')
		.controller('DecisionController', DecisionController);

		DecisionController.$inject = ['data', 'DecisionService', '$stateParams'];

		function DecisionController(data, DecisionService, $stateParams) {
			var vm = this;

			console.log('Decision controller');
			
			vm.testData = data;
			vm.testCriteriaGroup = [1,2,3];
			vm.elements = ['app-header', 'app-footer', 'top-panel'];	
			vm.decisionId = $stateParams.id;


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