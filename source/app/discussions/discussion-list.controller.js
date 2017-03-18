(function() {

    'user strict';

    angular
        .module('app.discussions')
        .controller('DiscussionList', DiscussionList);

    DiscussionList.$inject = ['decisionBasicInfo', 'DiscussionsDataService', '$stateParams', '$rootScope'];

    function DiscussionList(decisionBasicInfo, DiscussionsDataService, $stateParams, $rootScope) {
        var vm = this;
        vm.decision = decisionBasicInfo || {};

        console.log('Discussion List controller');


        $rootScope.breadcrumbs = [{
            title: 'Decisions',
            link: 'decisions'
        }, {
            title: vm.decision.name,
            link: 'decisions.matrix({id: ' + vm.decision.decisionId + '})'
        }, {
            title: 'Discussions',
            link: null
        }];
    }
})();