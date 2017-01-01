(function() {

	'user strict';

	angular
		.module('app.decision')
		.controller('DecisionController', DecisionController);

		DecisionController.$inject = ['DecisionService', '$stateParams'];

		function DecisionController(DecisionService, $stateParams) {
			var vm = this;

			console.log('Decision controller');
			
			vm.decisionsList = [];
			vm.decisionSectionSpinner = true;

			//TEST DATA
			vm.testCriteriaGroup = [1,2,3];	
			vm.testClick = testClick;
			
			function testClick() {
				console.log('It"s test');
			}
			// ---------------------------

			init();

			function init() {
				DecisionService.searchDecision($stateParams.id).then(function(result) {
					vm.decisionsList = result;
				}).finally(function() {
					vm.decisionSectionSpinner = false;
				});
			}
 		}
})();