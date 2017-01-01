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
                    data: DecisionControllerResolver
                }
            });
    }

    DecisionControllerResolver.$inject = ['DecisionService', '$stateParams'];

    function DecisionControllerResolver(DecisionService, $stateParams) {
        return DecisionService.searchDecision($stateParams.id);
    }

})();
