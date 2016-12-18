(function() {

	'use strict';

	angular
		.module('app.core')
		.provider('Settings', Settings);

		function Settings() {
			var 
				config = {},
				configFilePath = '/app/app.config';

			this.$get = getConfig;

			getConfig.$inject = ['$resource'];

			function getConfig($resource) {
				$resource(configFilePath).get().$promise.then(function(result) {
					config = result;
				});
				return provider;
			}

			var provider = {
				getEndpointUrl: getEndpointUrl
			};

			function getEndpointUrl() {
				return config.endpointUrl;
			}

		}
})();