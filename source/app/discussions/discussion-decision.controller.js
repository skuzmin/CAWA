(function() {

    'user strict';

    angular
        .module('app.discussions')
        .controller('DiscussionDecisionController', DiscussionDecisionController);

    DiscussionDecisionController.$inject = ['decisionBasicInfo', 'DiscussionsDataService', '$stateParams', '$rootScope'];

    function DiscussionDecisionController(decisionBasicInfo, DiscussionsDataService, $stateParams, $rootScope) {
        var vm = this;
        vm.decision = decisionBasicInfo || {};

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

        init();

        function init() {
            console.log('Discussion Decision controller');
        }
    }
})();