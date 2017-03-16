(function() {

    'use strict';

    angular
        .module('app.discussions')
        .factory('DiscussionsDataService', DiscussionsDataService);

    DiscussionsDataService.$inject = ['$resource', 'Config'];

    function DiscussionsDataService($resource, Config) {
        var
            discussionsUrl = Config.endpointUrl + 'discussions',

            discussions = $resource(discussionsUrl, {
                id: '@id'
            }),

            // decisions/35444/commentable/34817

            // votes/forentity/35444/onentity/34817/weighted
            var service = {
                searchDiscussions: searchDiscussions
            };

        return service;

        function searchDiscussions(id, data) {
            return discussions.searchDiscussionsById({
                id: id
            }, data).$promise;
        }
    }
})();