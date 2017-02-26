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
            });
    }

})();