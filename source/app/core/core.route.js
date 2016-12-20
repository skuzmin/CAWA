(function() {

    'use strict';

    angular
        .module('app.core')
        .config(configuration);

    configuration.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

    function configuration($stateProvider, $urlRouterProvider, $locationProvider) {


        $stateProvider
            .state('404', {
                url: '/404',
                templateUrl: 'app/core/404.html'
            });

        //$urlRouterProvider.otherwise('/404');

        // $locationProvider.html5Mode({
        //     enabled: true,
        //     requireBase: false
        // });
    }

})();
