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
                    decisionAnalysisInfo: DecisionAanalysisResolver
                },
            });
    }

    // Decision Data
    DecisionResolver.$inject = ['DecisionDataService', '$stateParams', '$state', '$rootScope', '$location'];

    function DecisionResolver(DecisionDataService, $stateParams, $state, $rootScope, $location) {
        return DecisionDataService.getDecisionInfo($stateParams.id).then(function(result) {
            if (result.error && result.error.code === 404) {
                console.log(result.error);
                $state.go('404');
            }
            var stateListener = $rootScope.$on('$stateChangeSuccess',
                function(event, toState, toParams, fromState, fromParams) {
                    // TODO: share data with Criteria and Characteristics Avoid additional API calls
                    var
                        currentState,
                        criteria = '',
                        decisionSlug;

                    currentState = $state.current.name;

                    //SLUG for Decision page
                    //Always set correct slug from server

                    decisionSlug = result.nameSlug ? result.nameSlug : '';

                    $stateParams.slug = result.nameSlug;
                    //set criteria ( addtional user parameters)
                    if (toParams.criteria && (!fromParams.id || toParams.id === fromParams.id)) {
                        criteria = toParams.criteria;
                    }

                    // TODO: remove
                    var decisionStateParams = {
                        'id': toParams.id,
                        'slug': decisionSlug,
                        'criteria': criteria
                    };
                    if (currentState === 'decisions.matrix' || currentState === 'decisions.view') {
                        // Just added new slug
                        $state.transitionTo(currentState, decisionStateParams);
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
    DecisionAanalysisResolver.$inject = ['$state', '$rootScope', '$stateParams'];

    function DecisionAanalysisResolver($state, $rootScope, $stateParams) {
        var stateListener = $rootScope.$on('$stateChangeSuccess', function() {
            var currentState,
                analysisId = '';

            currentState = $state.current.name;

            var decisionAnalysisStateParams = {
                'id': $stateParams.id,
                'slug': $stateParams.slug,
                'criteria': $stateParams.criteria
            };

            if ($stateParams.analysisId) {
                analysisId = $stateParams.analysisId;
                console.log(analysisId);
                // decisionAnalysisStateParams.analysisId = analysisId;
                // console.log(decisionAnalysisStateParams, $stateParams);
            }

            stateListener();
        });

    }


})();