(function() {

    'use strict';

    angular
        .module('app.decisionMatrix')
        .config(configuration);

    configuration.$inject = ['$stateProvider'];

    function configuration($stateProvider) {
        $stateProvider
            .state('decisionMatrix', {
                url: '/matrix',
                templateUrl: 'app/desicionMatrix/decision-matrix.html',
                controller: 'DecisionMatrixController',
                controllerAs: 'vm',
                resolve: {
                    // decisionBasicInfo: DecisionMatrixResolver
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