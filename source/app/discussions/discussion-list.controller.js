(function() {

    'user strict';

    angular
        .module('app.discussions')
        .controller('DiscussionList', DiscussionList);

        DiscussionList.$inject = ['decisionBasicInfo'];

        function DiscussionList(decisionBasicInfo) {
            var vm = this;
            vm.decision = decisionBasicInfo || {};

            console.log('Discussion List controller');

        }
})();