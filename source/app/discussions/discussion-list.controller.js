(function() {

    'user strict';

    angular
        .module('app.discussions')
        .controller('DiscussionList', DiscussionList);

        DiscussionList.$inject = ['decisionBasicInfo', 'DiscussionsDataService', '$stateParams'];

        function DiscussionList(decisionBasicInfo, DiscussionsDataService, $stateParams) {
            var vm = this;
            vm.decision = decisionBasicInfo || {};

            console.log('Discussion List controller');

        }
})();