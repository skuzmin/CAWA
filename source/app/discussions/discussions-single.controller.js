(function() {

    'user strict';

    angular
        .module('app.discussions')
        .controller('DiscussionSingle', DiscussionSingle);

        DiscussionSingle.$inject = ['DiscussionsDataService'];

        function DiscussionSingle(DiscussionsDataService) {
            var vm = this;

            init();

            function init() {
            	console.log('Discussion Single controller');
            }

        }
})();