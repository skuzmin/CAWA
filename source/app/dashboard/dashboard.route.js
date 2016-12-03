(function() {

    'use strict';

    angular
        .module('app.dashboard')
        .config(configuration);

    configuration.$inject = ['$stateProvider'];

    function configuration($stateProvider) {
        $stateProvider
            .state('dashboard', {
                url: '/',
                templateUrl: 'app/dashboard/dashboard.html',
                controller: 'DashboardController',
                controllerAs: 'vm',
                resolve: {
                    data: function(DashboardService) {
                        return DashboardService.getTestData();
                    }
                }
            });
    }

})();
