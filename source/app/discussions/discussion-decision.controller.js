(function() {

    'user strict';

    angular
        .module('app.discussions')
        .controller('DiscussionDecisionController', DiscussionDecisionController);

    DiscussionDecisionController.$inject = ['decisionBasicInfo', 'DiscussionsDataService', '$stateParams', '$rootScope'];

    function DiscussionDecisionController(decisionBasicInfo, DiscussionsDataService, $stateParams, $rootScope) {
        var vm = this;
        vm.decision = decisionBasicInfo || {};

        console.log('Discussion Decision controller');


        $rootScope.breadcrumbs = [{
            title: 'Decisions',
            link: 'decisions'
        }, {
            title: vm.decision.name,
            link: 'decisions.single'
        }, {
            title: 'Discussions',
            link: null
        }];
    }
})();