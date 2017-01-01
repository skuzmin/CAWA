(function() {
    'use strict';

    angular.module('app', [
        'app.core',
        'app.home',
        'app.components',
        'app.login',
        'app.decision'
    ]);

    $.get({
    	dataType: "json",
        url: 'app.config'
    }).done(function(result) {
    	angular.module('app').constant('Config', {
    		authUrl: result.authUrl,
    		endpointUrl: result.endpointUrl
    	});
    }).always(function() {
        angular.element(function() {
	        angular.bootstrap(document, ['app']);
	    });
    });
})();
