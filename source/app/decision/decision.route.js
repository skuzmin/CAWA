(function() {

    'use strict';

    angular
        .module('app.decision')
        .config(configuration);

    configuration.$inject = ['$stateProvider'];

    function configuration($stateProvider) {
        $stateProvider
            .state('decisions', {
                abstract: true,
                url: '/decisions',
                template: '<ui-view/>'
            })
            .state('decisions.matrix', {
                url: '/:id/{slug}/{criteria}/matrix', //Url rewrites in resolver
                templateUrl: 'app/desicionMatrix/decision-matrix.html',
                controller: 'DecisionMatrixController',
                controllerAs: 'vm',
                resolve: {
                    decisionBasicInfo: DecisionResolver
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
            })
            .state('decisions.view', {
                url: '/:id/{slug}/{criteria}/{view}',
                templateUrl: 'app/decision/decision.html',
                controller: 'DecisionController',
                controllerAs: 'vm',
                resolve: {
                    decisionBasicInfo: DecisionResolver
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

    DecisionResolver.$inject = ['DecisionDataService', '$stateParams', '$state', '$rootScope', '$location'];

    function DecisionResolver(DecisionDataService, $stateParams, $state, $rootScope, $location) {
        return DecisionDataService.getDecisionInfo($stateParams.id).then(function(result) {

            var stateStartListener = $rootScope.$on('$stateChangeStart',
                function() {
                    // console.log('stateChangeStart');
                    var url, lastParam, criteria;
                    url = $location.path().split('/');
                    lastParam = url[url.length - 1];
                    if (lastParam === 'matrix') {

                        // TODO: bug with double call Matrix Controller
                        $state.go('decisions.matrix', {
                            'id': $stateParams.id,
                            'slug': $stateParams.slug,
                            'criteria': $stateParams.criteria,
                            'view': 'matrix'
                        });

                    }
                    stateStartListener();
                });

            var stateListener = $rootScope.$on('$stateChangeSuccess',
                function(event, toState, toParams, fromState, fromParams) {

                    // TODO: share data with Criteria and Characteristics Avoid additional API calls
                    var criteria;

                    //SLUG for Decision page
                    //Always set correct slug from server
                    $stateParams.slug = result.nameSlug;
                    //set criteria ( addtional user parameters)
                    criteria = '';
                    if (toParams.criteria && (!fromParams.id || toParams.id === fromParams.id)) {
                        criteria = '/' + toParams.criteria;
                    }

                    if ($state.current.name === 'decisions.matrix') {
                        $location.path('/decisions/' + toParams.id + '/' + result.nameSlug + criteria + '/matrix').replace();
                    } else {
                        //two behaviors for changing URL
                        if ((fromState.name && toState.name !== fromState.name) ||
                            (fromState.name && toState.name === fromState.name && toParams.id !== fromParams.id)) {
                            // $location.path('/decisions/' + toParams.id + '/' + result.nameSlug + criteria);
                            $state.go('decisions.view', {
                                'id': toParams.id,
                                'slug': result.nameSlug,
                                'criteria': criteria,
                            });
                        } else {
                            // TODO: replace location because it make 2 call for Decision Controller
                            // $location.path('/decisions/' + toParams.id + '/' + result.nameSlug + criteria).replace();
                            $state.go('decisions.view', {
                                'id': toParams.id,
                                'slug': result.nameSlug,
                                'criteria': criteria,
                            });
                        }
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