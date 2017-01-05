(function() {

    'use strict';

    angular
        .module('app.decision')
        .config(configuration);

    configuration.$inject = ['$stateProvider'];

    function configuration($stateProvider) {
        $stateProvider
            .state('decision', {
                url: '/decision/:id/{slug}/{criteria}',
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

    DecisionResolver.$inject = ['DecisionService', '$stateParams', '$state', '$rootScope'];

    function DecisionResolver(DecisionService, $stateParams, $state, $rootScope) {
        return DecisionService.getDecisionInfo($stateParams.id).then(function(result) {
            // var stateListener = $rootScope.$on('$stateChangeSuccess',
            //     function(event, toState, toParams, fromState, fromParams) {
            //         if (toParams.slug !== result.nameSlug) {
            //             $stateParams.slug = result.nameSlug;
            //             $state.go('decision', $stateParams, {notify: false});
            //         }
            //         stateListener();
            //     });
            return result;
        }).catch(function() {
            $state.go('404');
        });
    }

})();
