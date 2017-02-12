(function() {

    'use strict';

    angular
        .module('app.decisionMatrix')
        .config(configuration);

    configuration.$inject = ['$stateProvider'];

    function configuration($stateProvider) {
        $stateProvider
            .state('decisionMatrix', {
                url: '/decisions/:id/{slug}/{criteria}/matrix',
                templateUrl: 'app/desicionMatrix/decision-matrix.html',
                controller: 'DecisionController',
                controllerAs: 'vm',
                resolve: {
                    // decisionBasicInfo: DecisionResolver
                },
                params: {
                    slug: {
                        value: null,
                        squash: true
                    },
                    criteria: {
                        value: null,
                        squash: true
                    }
                }
            });
    }


})();