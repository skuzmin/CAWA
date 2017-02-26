(function() {

    'user strict';

    angular
        .module('app.discussions')
        .controller('DiscussionsController', DiscussionsController);

        DiscussionsController.$inject = [];

        function DiscussionsController() {
            var vm = this;


            console.log('Discussions controller');

        }
})();