(function() {
    'use strict';

    angular
        .module('app')
        .run(runBlock);

    runBlock.$inject = ['$rootScope', '$state'];

    function runBlock($rootScope, $state) {

        // Page title
        var pageTitle = 'DecisionWanted';
        $rootScope.pageTitle = pageTitle;

        $rootScope.$on('$stateChangeSuccess', function($state, $stateParams) {
            if (angular.isDefined($stateParams.data)) {
                if ($stateParams.data.pageTitle) {
                    $rootScope.pageTitle = $stateParams.data.pageTitle + ' | ' + pageTitle;
                }
            }
        });

    }

})();