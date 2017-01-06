(function() {

    'use strict';

    angular
        .module('app.components')
        .controller('GridstackMovementController', GridstackMovementController)
        .component('gridstackWrapper', {
            templateUrl: 'app/components/gridstackWrapper/gridstack-wrapper.html',
            bindings: {
                initList: '=',
                updateList: '<',
                element: '@',
                cellHeight: '=',
                verticalMargin: '=',
                template: '@',
                callback: '&'
            },
            controller: 'GridstackMovementController',
            controllerAs: 'vm'
        });

    GridstackMovementController.$inject = ['$timeout', '$state', '$rootScope'];

    function GridstackMovementController($timeout, $state, $rootScope) {
        var
            vm = this,
            gridItems = [],
            index,
            content = {
                decision: 'app/components/gridstackWrapper/decision-partial.html'
            };

        vm.gridStack = {};
        vm.innerTemplate = content[vm.template]; 
        vm.options = {
            cellHeight: vm.cellHeight,
            verticalMargin: vm.verticalMargin,
            draggable: {
                handle: '.panel-drag-handler',
            }
        };

        vm.selectDecision = selectDecision;
        vm.stopEvent = stopEvent;
        vm.$onChanges = onChanges;
        vm.goToDecision = goToDecision;
        vm.getDetails = getDetails;

        function getDetails(event, decision) {
            stopEvent(event);
            if(!decision.characteristics) {
                $rootScope.$broadcast('getDetailedCharacteristics', decision);
            }
        }

        function goToDecision(event, decisionId) {
            stopEvent(event);
            $state.go('decision', {id: decisionId});
        }

        function stopEvent(event) {
            event.stopPropagation();
            event.preventDefault();
        }

        function selectDecision(d) {
            d.isSelected = !d.isSelected;
            vm.callback({decision: d});
        }

        function onChanges() {
        	gridItems = $('.' + vm.element);
            _.forEach(gridItems, function(item) {
                index = vm.updateList.findIndex(function(data) {
                    return data.decisionId === Number(item.getAttribute('id'));
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
