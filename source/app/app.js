(function() {
    'use strict';

    angular.module('app', [
        'app.core',
        'app.home',
        'app.components',
        'app.login',
        'app.decision',
        'app.decisionMatrix',
        'app.discussions'
    ]);

    $.get({
    	dataType: "json",
        url: 'app.config'
    }).done(function(result) {
    	angular.module('app.core').constant('Config', {
            baseUrl: result.baseUrl,
    		authUrl: result.authUrl,
    		endpointUrl: result.endpointUrl,
            mode: result.mode
    	});
    }).always(function() {
        angular.element(function() {
	        angular.bootstrap(document, ['app']);
	    });
    });
})();
