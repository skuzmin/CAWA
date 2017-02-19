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
                url: '/:id/{slug}/{criteria}',
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
            })
            .state('decisions.view.analysis', {
                url: '/analysis/:analysisId',
                templateUrl: 'app/decision/decision.html',
                controller: 'DecisionController',
                controllerAs: 'vm',
                resolve: {
                    // decisionAnalysisInfo: DecisionAanalysisResolver
                },
            });
    }

    // Decision Data
    DecisionResolver.$inject = ['DecisionDataService', '$stateParams', '$state', '$rootScope', '$location'];

    function DecisionResolver(DecisionDataService, $stateParams, $state, $rootScope, $location) {
        return DecisionDataService.getDecisionInfo($stateParams.id).then(function(result) {
            var stateListener = $rootScope.$on('$stateChangeSuccess',
                function(event, toState, toParams, fromState, fromParams) {
                    // TODO: share data with Criteria and Characteristics Avoid additional API calls
                    var path,
                        currentState,
                        criteria = '',
                        analysisId = '',
                        analysisSlug = '';

                    currentState = $state.current.name;
                    path = $location.path();

                    //SLUG for Decision page
                    //Always set correct slug from server
                    $stateParams.slug = result.nameSlug;
                    //set criteria ( addtional user parameters)
                    if (toParams.criteria && (!fromParams.id || toParams.id === fromParams.id)) {
                        criteria = toParams.criteria;
                    }

                    // TODO: remove
                    // console.log('path: ' + path);
                    // console.log('State current: ' + $state.current.name);
                    // console.log($stateParams);

                    if (currentState === 'decisions.matrix' || currentState === 'decisions.view') {
                        // Just added new slug
                        var decisionStateParams = {
                            'id': toParams.id,
                            'slug': result.nameSlug,
                            'criteria': criteria
                        };
                        $state.go(currentState, decisionStateParams);
                    } else if (currentState === 'decisions.view.analysis') {
                        console.log(toParams.analysisId);
                    }

                    //unsubscribe event listener
                    stateListener();
                });
            return result;
        }).catch(function() {
            $state.go('404');
        });
    }

    // Analysis
    DecisionAanalysisResolver.$inject = [];

    function DecisionAanalysisResolver() {}


})();