(function() {

    'use strict';

    angular
        .module('app.core')
        .config(configuration);

    configuration.$inject = ['$stateProvider', '$urlRouterProvider', '$compileProvider', 'Config'];

    function configuration($stateProvider, $urlRouterProvider, $compileProvider, Config) {

        $stateProvider
            .state('404', {
                url: '/404',
                templateUrl: 'app/core/404.html',
                data: {
                  pageTitle : 'Error 404 Not Found!'
                }                
            });

        $urlRouterProvider.otherwise('/404');

        $compileProvider.debugInfoEnabled(Config.mode === 'dev');
    }

})();
