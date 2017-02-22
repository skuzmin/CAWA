(function() {

    'use strict';

    angular
        .module('app.core')
        .config(configuration);

    configuration.$inject = ['$animateProvider'];

    function configuration($animateProvider) {
        // Enable ngAnimation for specific class
        $animateProvider.classNameFilter(/angular-animate/);
    }

})();
