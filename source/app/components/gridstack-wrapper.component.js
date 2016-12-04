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
                element: '@',
                cellHeight: '=',
                verticalMargin: '='
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
            cellHeight: vm.cellHeight,
            verticalMargin: vm.verticalMargin
        };

        vm.$onChanges = onChanges;

        function onChanges() {
        	gridItems = $(vm.element);
            _.forEach(gridItems, function(item) {
                index = vm.updateList.findIndex(function(data) {
                    return data.id === Number(item.getAttribute('id'));
                });
                if(index !== -1) {
                    vm.gridStack.move(item, 0, index);
                }
            });
        }

        $timeout(function() {
            vm.gridStack.setAnimation(true);
        }, 0);
    }
})();
