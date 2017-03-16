(function() {

    'use strict';

    angular
        .module('app.discussions')
        .config(configuration);

    configuration.$inject = ['$stateProvider'];

    function configuration($stateProvider) {
        $stateProvider
            .state('discussions', {
                url: '/discussions',
                templateUrl: 'app/discussions/discussions.html',
                controller: 'DiscussionsController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Discussions'
                }
            }).state('decisions.discussionSingle', {
                url: '/:id/{slug}/{criteria}/discussions/:discussionId/{discussionSlug}/:criterionId/{criterionSlug}',
                templateUrl: 'app/discussions/discussions-single.html',
                controller: 'DiscussionSingle',
                controllerAs: 'vm',
                resolve: {
                    decisionDiscussionBasicInfo: DecisionSingleDiscussionResolver
                },
                params: {
                    slug: {
                        value: null,
                        squash: true
                    },
                    criteria: {
                        value: null,
                        squash: true
                    },
                    discussionId: {
                        value: null,
                        squash: true
                    },
                    discussionSlug: {
                        value: null,
                        squash: true
                    },
                    criterionSlug: {
                        value: null,
                        squash: true
                    }
                }
            });
    }


    // Decision Data
    DecisionSingleDiscussionResolver.$inject = ['DecisionDataService', '$stateParams', '$state', '$rootScope', '$location'];

    function DecisionSingleDiscussionResolver(DecisionDataService, $stateParams, $state, $rootScope, $location) {
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
                    if (toState.name === 'decisions.matrix' || toState.name === 'decisions.list') {
                        // Just added new slug
                        $state.go(currentState, decisionStateParams);
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