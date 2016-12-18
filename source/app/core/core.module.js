(function() {
	'use strict';

	angular
		.module('app.core', ['ui.router',
							 'ngResource',
							 'gridstack-angular',
							 'ui.bootstrap', 
							 'ngAnimate', 
							 'ngStorage',
							 'angular-jwt'])
		.config(configuration);

		configuration.$inject = ['SettingsProvider'];

		function configuration(SettingsProvider) {}

})();