(function() {

    'use strict';

    angular
        .module('app.core')
        .config(configuration);

    configuration.$inject = ['$stateProvider', '$urlRouterProvider'];

    function configuration($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('404', {
                url: '/404',
                templateUrl: 'app/core/404.html'
            });

        $urlRouterProvider.otherwise('/404');
    }

})();
