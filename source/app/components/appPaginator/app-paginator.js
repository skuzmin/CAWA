(function() {

    'use strict';

    angular
        .module('app.components')
        .controller('PaginatorController', PaginatorController)
        .component('appPaginator', {
            templateUrl: 'app/components/appPaginator/app-paginator.html',
            controller: 'PaginatorController',
            controllerAs: 'vm'
        });

    PaginatorController.$inject = ['DecisionSharedService', 'DecisionNotificationService'];

    function PaginatorController(DecisionSharedService, DecisionNotificationService) {
        var vm = this;

        vm.pagination = DecisionSharedService.filterObject.pagination;
        vm.itemsPerPage = [5, 10, 20, 50, 100];

        vm.changePage = changePage;
        vm.changePageSize = changePageSize;

        function changePage() {
            DecisionNotificationService.notifyPageChanged();
        }

        function changePageSize() {
            DecisionSharedService.filterObject.pagination.pageNumber = 1;
            DecisionNotificationService.notifyPageChanged();
        }
    }

})();
