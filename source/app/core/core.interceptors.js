(function() {
    'use strict';

    angular
        .module('app.core')
        .config(function($httpProvider) {
            $httpProvider.interceptors.push(appInterceptor);
        });

    appInterceptor.$inject = ['$injector'];

    function appInterceptor($injector) {
        return {
            request: function(config) {
                // console.log(config);
                return config;
            },
            responseError: function(rejection) {
                // console.log(rejection);
                return rejection;
            }
        };
    }

})();