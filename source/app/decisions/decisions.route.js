(function() {

    'use strict';

    angular
        .module('app.decision')
        .config(configuration);

    configuration.$inject = ['$stateProvider'];

    function configuration($stateProvider) {
        $stateProvider
            .state('decisions', {
                url: '/decisions',
                views: {
                    "@": {
                        templateUrl: 'app/decisions/decisions.html',
                        controller: 'DecisionsController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    breadcrumbs: [{
                        title: 'Decisions',
                        link: null
                    }]
                }
            });
    }

})();