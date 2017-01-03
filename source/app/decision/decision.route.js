(function() {

    'use strict';

    angular
        .module('app.decision')
        .config(configuration);

    configuration.$inject = ['$stateProvider'];

    function configuration($stateProvider) {
        $stateProvider
            .state('decision', {
                url: '/decisions/:id',
                templateUrl: 'app/decision/decision.html',
                controller: 'DecisionController',
                controllerAs: 'vm',
                resolve: {
                    decisionBasicInfo: DecisionResolver
                }
            });
    }

    DecisionResolver.$inject = ['DecisionService', '$stateParams'];

    function DecisionResolver(DecisionService, $stateParams) {
        return DecisionService.getDecisionInfo($stateParams.id);
    }

})();
