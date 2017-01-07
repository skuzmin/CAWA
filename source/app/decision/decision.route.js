(function() {

    'use strict';

    angular
        .module('app.decision')
        .config(configuration);

    configuration.$inject = ['$stateProvider'];

    function configuration($stateProvider) {
        $stateProvider
            .state('decision', {
                url: '/decisions/:id/{slug}/{criteria}',
                templateUrl: 'app/decision/decision.html',
                controller: 'DecisionController',
                controllerAs: 'vm',
                resolve: {
                    decisionBasicInfo: DecisionResolver
                },
                params: {
                    slug: { value: null, squash: true },
                    criteria: { value: null, squash: true }
                }
            });
    }

    DecisionResolver.$inject = ['DecisionDataService', '$stateParams', '$state', '$rootScope', '$location'];

    function DecisionResolver(DecisionDataService, $stateParams, $state, $rootScope, $location) {
        return DecisionDataService.getDecisionInfo($stateParams.id).then(function(result) {
            var stateListener = $rootScope.$on('$stateChangeSuccess',
                function(event, toState, toParams, fromState, fromParams) {
                    //SLUG for Decision page
                    //Always set correct slug from server
                    $stateParams.slug = result.nameSlug;
                    //set criteria ( addtional user parameters)
                    var criteria = '';
                    if(toParams.criteria && (!fromParams.id || toParams.id === fromParams.id)) {
                        criteria = '/' + toParams.criteria;
                    }
                    //two behaviors for changing URL
                    if((fromState.name && toState.name !== fromState.name) || 
                        (fromState.name && toState.name === fromState.name && toParams.id !== fromParams.id)) {
                        $location.path('/decisions/' + toParams.id + '/' + result.nameSlug + criteria);
                    } else {
                        $location.path('/decisions/' + toParams.id + '/' + result.nameSlug + criteria).replace();
                    }
                    //unsubscribe event listener
                    stateListener();
                });
            return result;
        }).catch(function() {
            $state.go('404');
        });
    }

})();
