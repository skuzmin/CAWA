(function() {

    'user strict';

    angular
        .module('app.decision')
        .controller('DecisionSingleController', DecisionSingleController);

    DecisionSingleController.$inject = ['$rootScope', 'decisionBasicInfo', 'DecisionDataService', '$stateParams', '$timeout', 'DecisionNotificationService', 'DecisionSharedService'];

    function DecisionSingleController($rootScope, decisionBasicInfo, DecisionDataService, $stateParams, $timeout, DecisionNotificationService, DecisionSharedService) {
        var
            vm = this,
            isInitedSorters = false,
            defaultDecisionCount = 10;

        console.log('Decision Single Controller');

        vm.decisionId = $stateParams.id;
        vm.decisionsList = [];
        vm.updateDecisionList = [];
        vm.decision = decisionBasicInfo || {};
        $rootScope.pageTitle = vm.decision.name + ' | DecisionWanted';

        $rootScope.breadcrumbs = [{
            title: 'Decisions',
            link: 'decisions'
        }, {
            title: vm.decision.name,
            link: null
        }];

        init();
        function init() {

        }
        
    }
})();