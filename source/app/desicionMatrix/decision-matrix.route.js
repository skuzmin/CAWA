(function() {

    'use strict';

    angular
        .module('app.decisionMatrix')
        .config(configuration);

    configuration.$inject = ['$stateProvider'];

    function configuration($stateProvider) {
        $stateProvider
            .state('decisionMatrix', {
                url: '/matrix/:id', // url: '/decisions/:id/{slug}/{criteria}/matrix',
                templateUrl: 'app/desicionMatrix/decision-matrix.html',
                controller: 'DecisionMatrixController',
                controllerAs: 'vm',
                resolve: {
                    decisionBasicInfo: DecisionMatrixResolver
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

    DecisionMatrixResolver.$inject = ['DecisionDataService', '$stateParams', '$state', '$rootScope', '$location'];

    function DecisionMatrixResolver(DecisionDataService, $stateParams, $state, $rootScope, $location) {
        return DecisionDataService.getDecisionInfo($stateParams.id).then(function(result) {
            var stateListener = $rootScope.$on('$stateChangeSuccess',
                function(event, toState, toParams, fromState, fromParams) {
                    //SLUG for Decision page
                    //Always set correct slug from server
                    $stateParams.slug = result.nameSlug;
                    //set criteria ( addtional user parameters)
                    var criteria = '';
                    if (toParams.criteria && (!fromParams.id || toParams.id === fromParams.id)) {
                        criteria = '/' + toParams.criteria;
                    }

                    $location.path('/matrix/' + toParams.id + '/' + result.nameSlug + criteria + 'matrix');
                    console.log('/matrix/' + toParams.id + '/' + result.nameSlug + criteria + 'matrix');
                    console.log('fromState.name:' + fromState.name, '; toState.name:' + toState.name, 'result.nameSlug:' + result.nameSlug);
                    //two behaviors for changing URL
                    // if ((fromState.name && toState.name !== fromState.name) ||
                    //     (fromState.name && toState.name === fromState.name && toParams.id !== fromParams.id)) {
                    //     $location.path('/decisions/' + toParams.id + '/' + result.nameSlug + criteria + '/matrix');
                    // } else {
                    //     $location.path('/decisions/' + toParams.id + '/' + result.nameSlug + criteria + '/matrix').replace();
                    // }
                    //unsubscribe event listener
                    stateListener();
                });
            return result;
        }).catch(function() {
            // $state.go('404');
        });
    }

})();