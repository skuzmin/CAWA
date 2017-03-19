(function() {

    'use strict';

    angular
        .module('app.discussions')
        .config(configuration);

    configuration.$inject = ['$stateProvider'];

    function configuration($stateProvider) {
        $stateProvider
            .state('decisions.single.discussions.single', {
                url: '/:discussionId/:critOrCharId',
                // url: '/:discussionId/{discussionSlug}/:critOrCharId/{critOrCharSlug}',
                views: {
                    "@": {
                        templateUrl: 'app/discussions/discussions-single.html',
                        controller: 'DiscussionSingle',
                        controllerAs: 'vm',
                    }
                },
                resolve: {
                    decisionDiscussionInfo: DecisionSingleDiscussionResolver
                },
                params: {
                    discussionSlug: {
                        value: null,
                        squash: true
                    },
                    critOrCharId: {
                        value: null,
                        squash: true
                    }
                }
            });
    }


    // Decision Data
    DecisionSingleDiscussionResolver.$inject = ['DiscussionsDataService', '$stateParams', '$state', '$rootScope', '$location'];

    function DecisionSingleDiscussionResolver(DiscussionsDataService, $stateParams, $state, $rootScope, $location) {
        return DiscussionsDataService.searchCommentableDiscussion($stateParams.discussionId, $stateParams.critOrCharId)
            .then(function(resp) {
                // console.log(resp);
                return resp;
            })
            .catch(function(err) {
                console.log(err);
            });

    }

})();