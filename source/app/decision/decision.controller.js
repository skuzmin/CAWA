(function() {

	'user strict';

	angular
		.module('app.decision')
		.controller('DecisionController', DecisionController);

		DecisionController.$inject = ['data', 'DecisionService', '$scope'];

		function DecisionController(data, DecisionService, $scope) {
			var vm = this;
	
			vm.sort = sort;
			vm.testData = data;
			vm.elements = ['app-header', 'app-footer', 'top-panel'];

            function sort() {
            	DecisionService.getTestData2().then(function(result) {
            		vm.updateList = result;
            	});
            }
 		}
})();