(function() {

    'use strict';

    angular
        .module('app.components')
        .controller('IsotopeWrapperController', IsotopeWrapperController)
        .component('isotopeWrapper', {
            templateUrl: 'app/components/isotopeWrapper/isotope-wrapper.html',
            bindings: {
                list: '<'
            },
            controller: 'IsotopeWrapperController',
            controllerAs: 'vm'
        });

    IsotopeWrapperController.$inject = ['$timeout'];

    function IsotopeWrapperController($timeout) {
        var vm = this,
            $grid;

        vm.displayList = [];

        vm.$onChanges = onChanges;

        init();

        function onChanges() {
            var gridItems = $('.isotope-item'),
                displayItem, index;
            _.forEach(vm.list, function(newItem, i) {
                newItem.position = i;
            });
            if (vm.displayList.length === 0) {
                vm.displayList = angular.copy(vm.list);
            } else {
                _.forEach(vm.list, function(newItem) {
                    displayItem = _.find(vm.displayList, function(item) {
                        return item.decisionId === newItem.decisionId;
                    });
                    if(displayItem) {
                        newItem.isInited = true;
                        _.find(vm.displayList, function(item) {
                            return item.position === newItem.position;
                        }).position = displayItem.position;
                        displayItem.position = newItem.position;
                    }
                });
                _.forEach(vm.list, function(newItem) {
                    if(!newItem.isInited) {
                        index = _.findIndex(vm.displayList, function(item) {
                            return item.position === newItem.position;
                        });
                        vm.displayList[index] = newItem;
                    }
                });
                $timeout(function() {
                    $grid.isotope('updateSortData').isotope();
                    $grid.isotope({ sortBy: 'position' });
                }, 0);
            }
        }

        function init() {
            $timeout(function() {
                $grid = $('.isotope').isotope({
                    itemSelector: '.isotope-item',
                    layoutMode: 'vertical',
                    getSortData: {
                        position: '[data-position]'
                    }
                });
            }, 500);
        }
    }
})();
