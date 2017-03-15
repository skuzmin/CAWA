(function() {

    'user strict';

    angular
        .module('app.discussions')
        .controller('DiscussionSingle', DiscussionSingle);

        DiscussionSingle.$inject = [];

        function DiscussionSingle() {
            var vm = this;


            console.log('Discussion Single controller');

        }
})();