(function() {

	'user strict';

	angular
		.module('app.decision')
		.controller('DecisionController', DecisionController);

		DecisionController.$inject = ['DecisionService', '$stateParams'];

		function DecisionController(DecisionService, $stateParams) {
			var 
				vm = this,
				decisionId = $stateParams.id,
				generalCriteria = 0;

			console.log('Decision controller');
			
			vm.decisionsList = [];
			vm.decision = {};
			vm.pageSpinners = {
				decisions: true,
				criterias: true
				//characteristics: true
			};
			vm.criteriaGroups = [{
				name: 'General',
				criterias: []
			}];


			//TEST DATA
			vm.testCriteriaGroup = [1,2,3];	
			vm.testClick = testClick;

			function testClick() {
				console.log('It"s test');
			}
			// ---------------------------


			init();

			function init() {
				DecisionService.getDecisionInfo(decisionId).then(function(result) {
					vm.decision = result;
				});

				DecisionService.searchDecision(decisionId).then(function(result) {
					vm.decisionsList = result;
				}).finally(function() {
					vm.pageSpinners.decisions = false;
				});

				DecisionService.getDecisionCriteriaGroupsById(decisionId).then(function(result) {
					vm.criteriaGroups = vm.criteriaGroups.concat(result);
					return DecisionService.getDecisionCriteriasById(decisionId);
				}).then(function(result) {
					_.forEach(result, function(criteria) {
						if(criteria.criterionGroupId) {
							_.forEach(vm.criteriaGroups, function(group) {
								if(!group.criterias) {
									group.criterias = [];
								}
								if(group.criterionGroupId === criteria.criterionGroupId) {
									group.criterias.push(criteria);
								}
							});
						} else {
							vm.criteriaGroups[generalCriteria].criterias.push(criteria);
						}
					});
					console.log(vm.criteriaGroups);
				}).finally(function() {
					vm.pageSpinners.criterias = false;
					vm.criteriaGroups[generalCriteria].isOpen = true;
				});
			}
 		}
})();