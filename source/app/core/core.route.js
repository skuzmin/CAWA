(function () {
	
	'use strict';

	angular
		.module('app.core')
		.config(configuration);

	configuration.$inject = ['$stateProvider'];

	function configuration($stateProvider) {


		$stateProvider
			.state('404', {
				url: '/404',
				templateUrl: 'app/core/404.html'
			});
	}

})();