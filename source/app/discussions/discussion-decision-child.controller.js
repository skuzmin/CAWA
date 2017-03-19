(function() {

    'user strict';

    angular
        .module('app.discussions')
        .controller('DiscussionDecisionChildController', DiscussionDecisionChildController);

    DiscussionDecisionChildController.$inject = ['decisionBasicInfo', 'DiscussionsDataService', '$stateParams', '$rootScope'];

    function DiscussionDecisionChildController(decisionBasicInfo, DiscussionsDataService, $stateParams, $rootScope) {
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
            link: 'decisions.single.discussions'
        }, {
            title: 'Discussion Decision Name',
            link: null
        }];

        init();

        function init() {
            console.log('Discussion Decision controller');
            console.log(vm.decision);
        }
    }
})();