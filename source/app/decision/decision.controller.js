(function() {

	'user strict';

	angular
		.module('app.decision')
		.controller('DecisionController', DecisionController);

		DecisionController.$inject = ['data', 'DecisionService'];

		function DecisionController(data, DecisionService) {
			var vm = this;

			vm.testData = data;
			vm.sort = sort;

			$(window).on('resize', function(){
				var a = $(window).height() - $('.app-header').outerHeight() - $('.app-footer').outerHeight() - $('.top-panel').outerHeight();
				var mainH = $('.main-panel').outerHeight();

				if(mainH > a) {
					a = mainH;
				}
				$('.js-full-height').css('min-height', a);
			 });

			var a = $(window).height() - $('.app-header').height() - $('.app-footer').height() - $('.top-panel').height();
			var mainH = $('.main-panel').outerHeight();

				if(mainH > a) {
					a = mainH;
				}
			$('.js-full-height').css('min-height', a);

            function sort() {
            	DecisionService.getTestData2().then(function(result) {
            		vm.updateList = result;
            	});
            }
 		}
})();