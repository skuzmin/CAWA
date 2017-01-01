(function() {

	'user strict';

	angular
		.module('app.decision')
		.controller('DecisionController', DecisionController);

		DecisionController.$inject = ['data', '$timeout'];

		function DecisionController(data, $timeout) {
			var vm = this;

			console.log('Decision controller');
			
			vm.testData = data;
			vm.testCriteriaGroup = [1,2,3];	
			
			vm.testClick = testClick;
			vm.test = true;

			init();

			function testClick() {
				console.log('It"s test');
			}

			function init() {
				$timeout(function() {
					vm.test = false;
				}, 0);
			}
 		}
})();