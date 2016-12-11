(function() {

    'use strict';

    angular
        .module('app.decision')
        .config(configuration);

    configuration.$inject = ['$stateProvider'];

    function configuration($stateProvider) {
        $stateProvider
            .state('decision', {
                url: '/',
                templateUrl: 'app/decision/decision.html',
                controller: 'DecisionController',
                controllerAs: 'vm',
                resolve: {
                    data: DecisionControllerResolver
                }
            });
    }

    DecisionControllerResolver.$inject = ['DecisionService'];

    function DecisionControllerResolver(DecisionService) {
        return DecisionService.getTestData();
    }

})();
