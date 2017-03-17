(function() {

    'user strict';

    angular
        .module('app.discussions')
        .controller('DiscussionSingle', DiscussionSingle);

    DiscussionSingle.$inject = ['decisionDiscussionInfo', '$rootScope'];

    function DiscussionSingle(decisionDiscussionInfo, $rootScope) {
        var vm = this;

        init();

        vm.discussion = decisionDiscussionInfo || {};

        $rootScope.pageTitle = vm.discussion.name + ' Discussion | DecisionWanted';
        $rootScope.breadcrumbs = [{
            title: 'Discussion',
            link: null
        }, {
            title: vm.discussion.decision.name + ' ' + vm.discussion.childDecision.name + ' ' + vm.discussion.childCriterion.name,
            link: null
        }];

        function init() {
            console.log('Discussion Single controller');
        }

    }
})();