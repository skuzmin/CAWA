(function() {

    'user strict';

    angular
        .module('app.discussions')
        .controller('DiscussionDecisionChildOptionController', DiscussionDecisionChildOptionController);

    DiscussionDecisionChildOptionController.$inject = ['decisionDiscussionInfo', 'DiscussionsDataService', '$rootScope', '$stateParams', 'DecisionDataService', '$state'];

    function DiscussionDecisionChildOptionController(decisionDiscussionInfo, DiscussionsDataService, $rootScope, $stateParams, DecisionDataService, $state) {
        var vm = this;

        var params = {
            'id': parseInt($stateParams.id),
            'slug': $stateParams.slug,
            'criteria': $stateParams.criteria,
        };

        vm.params = params;

        vm.discussion = decisionDiscussionInfo || {};

        var pageTitle = vm.discussion.childDecision.name;
        var critOrCharTitle = '';
        if (vm.discussion.childCharacteristic) {
            pageTitle += ' ' + vm.discussion.childCharacteristic.name;
            critOrCharTitle = vm.discussion.childCharacteristic.name;
        } else if (vm.discussion.childCriterion) {
            pageTitle += ' ' + vm.discussion.childCriterion.name;
            critOrCharTitle = vm.discussion.childCriterion.name;
        }

        $rootScope.pageTitle = 'Discussion ' + pageTitle + ' | DecisionWanted';

        init();

        function searchCommentableVotesWeight(discussionId, critOrCharId) {
            if (!discussionId || !critOrCharId) return;
            DiscussionsDataService.searchCommentableVotesWeight(discussionId, critOrCharId)
                .then(function(resp) {
                    // console.log(resp);
                    vm.discussion.votes = resp;
                }).catch(function(err) {
                    console.log(err);
                });
        }

        function init() {
            console.log('Discussion Child Option Controller');

            vm.title = pageTitle;

            // getCriteriaGroupsById(vm.discussion.decision.decisionId);
            // getCharacteristictsGroupsById(vm.discussion.decision.decisionId);

            // TODO: avoid $stateParams
            if (vm.discussion.childCriterion) searchCommentableVotesWeight($stateParams.discussionId, $stateParams.critOrCharId);

            // TODO: optimize, in resolver some bugs with state
            // // Add slug for child decision
            if (vm.discussion.childCriterion && vm.discussion.childCriterion.nameSlug) {
                $state.go('decisions.single.discussions.child.option', {critOrCharId: $stateParams.critOrCharId, critOrCharSlug: vm.discussion.childCriterion.nameSlug}, {notify:false, reload:false});
            } else if (vm.discussion.childCharacteristic && vm.discussion.childCharacteristic.nameSlug) {
                $state.go('decisions.single.discussions.child.option', {critOrCharId: $stateParams.critOrCharId, critOrCharSlug: vm.discussion.childCharacteristic.nameSlug}, {notify:false, reload:false});
            }

            $rootScope.breadcrumbs = [{
                title: 'Decisions',
                link: 'decisions'
            }, {
                title: vm.discussion.decision.name,
                link: 'decisions.single'
            }, {
                title: 'Discussions',
                link: 'decisions.single.discussions'
            }, {
                title: vm.discussion.childDecision.name,
                link: 'decisions.single.discussions.child'
            }, {
                title: critOrCharTitle,
                link: null
            }];
        }

        vm.goToDiscussion = goToDiscussion;

        function goToDiscussion(discussionId, critOrCharId) {
            params.discussionId = discussionId;
            params.critOrCharId = critOrCharId;
            $state.go('decisions.single.discussions.child.option', params);
        }

    }
})();