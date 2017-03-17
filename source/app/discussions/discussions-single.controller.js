(function() {

	'user strict';

	angular
		.module('app.discussions')
		.controller('DiscussionSingle', DiscussionSingle);

	DiscussionSingle.$inject = ['decisionDiscussionInfo', 'DiscussionsDataService', '$rootScope', '$stateParams'];

	function DiscussionSingle(decisionDiscussionInfo, DiscussionsDataService, $rootScope, $stateParams) {
		var vm = this;

		init();

		vm.discussion = decisionDiscussionInfo || {};

		var pageTitle = vm.discussion.decision.name + ' ' + vm.discussion.childDecision.name + ' ' + vm.discussion.childCriterion.name;

		$rootScope.pageTitle = 'Discussion ' + pageTitle + ' | DecisionWanted';
		$rootScope.breadcrumbs = [{
			title: 'Discussion',
			link: null
		}, {
			title: pageTitle,
			link: null
		}];

		// TODO: avoid $stateParams
		DiscussionsDataService.searchCommentableVotesWeight($stateParams.discussionId, $stateParams.critOrCharId)
			.then(function(resp) {
				console.log(resp);

				vm.discussion.votes = resp;
			});

		function init() {
			console.log('Discussion Single controller');
		}

	}
})();