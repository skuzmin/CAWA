(function() {

    'use strict';

    angular
        .module('app.components')
        .controller('GridstackMovementController', GridstackMovementController)
        .component('gridstackWrapper', {
            templateUrl: 'app/components/gridstack-wrapper.html',
            bindings: {
                initList: '=',
                updateList: '<',
                element: '@'
            },
            controller: 'GridstackMovementController',
            controllerAs: 'vm'
        });

    GridstackMovementController.$inject = ['$timeout'];

    function GridstackMovementController($timeout) {
        var
            vm = this,
            gridItems = [],
            index;

        vm.gridStack = {};
        vm.options = {
            cellHeight: 100,
            verticalMargin: 10
        };

        vm.$onChanges = onChanges;

        function onChanges() {
        	gridItems = $(vm.element);
            _.forEach(gridItems, function(item) {
                index = vm.updateList.findIndex(function(data) {
                    return data.id === Number(item.getAttribute('id'));
                });
                vm.gridStack.move(item, 0, index);
            });
        }

        $timeout(function() {
            vm.gridStack.set_animation(true);
        }, 0);
    }
})();
