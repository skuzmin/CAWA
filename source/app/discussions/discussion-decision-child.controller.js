(function() {

    'user strict';

    angular
        .module('app.discussions')
        .controller('DiscussionDecisionChildController', DiscussionDecisionChildController);

    DiscussionDecisionChildController.$inject = ['decisionBasicInfo', 'DiscussionsDataService', '$stateParams', '$rootScope', 'DecisionDataService'];

    function DiscussionDecisionChildController(decisionBasicInfo, DiscussionsDataService, $stateParams, $rootScope, DecisionDataService) {
        var vm = this;
        vm.decision = decisionBasicInfo || {}; //Parent Decision

        init();

        // TODO: move to service
        function getCriteriaGroupsById(decisionId) {
            // Criteria
            return DecisionDataService.getCriteriaGroupsById(decisionId).then(function(result) {
                vm.criteriaGroups = result;
                criteriaIds = _.map(result["0"].criteria, function(el) {
                    return el.criterionId;
                });
            });
        }

        function getCharacteristictsGroupsById(decisionId) {
            // Characteristicts
            return DecisionDataService.getCharacteristictsGroupsById(decisionId).then(function(result) {
                vm.characteristicGroups = result;

                characteristicsIds = _.map(result["0"].characteristics, function(el) {
                    return el.characteristicId;
                });
            });
        }

        function init() {
            console.log('Discussion Decision controller');
            getCriteriaGroupsById(vm.decision.decisionId);
            getCharacteristictsGroupsById(vm.decision.decisionId);

            // Child Decision
            DecisionDataService.getDecisionInfo($stateParams.discussionId).then(function(result) {
                vm.decisionChild = result;

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
                    title: result.name,
                    link: null
                }];
            });

        }
    }
})();