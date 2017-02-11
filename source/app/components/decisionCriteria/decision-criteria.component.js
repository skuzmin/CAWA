(function() {

    'use strict';

    angular
        .module('app.components')
        .controller('DecisionCriteriaController', DecisionCriteriaController)
        .component('decisionCriteria', {
            templateUrl: 'app/components/decisionCriteria/decision-criteria.html',
            bindings: {
                decisionId: '='
            },
            controller: 'DecisionCriteriaController',
            controllerAs: 'vm'
        });

    DecisionCriteriaController.$inject = ['$uibModal', 'DecisionDataService', 'DecisionNotificationService', 'DecisionSharedService', 'DecisionCriteriaConstant'];

    function DecisionCriteriaController($uibModal, DecisionDataService, DecisionNotificationService, DecisionSharedService, DecisionCriteriaConstant) {
        var
            vm = this,
            criteriaGroupsCurrent = [],
            _fo = DecisionSharedService.filterObject.selectedCriteria;

        vm.criteriaGroups = [];

        vm.showRating = false;

        vm.$onChanges = onChanges;

        vm.editCriteriaCoefficient = editCriteriaCoefficient;
        vm.selectCriterion = selectCriterion;

        init();

        function onChanges() {
            vm.showRating = DecisionSharedService.filterObject.selectedDecision.decisionsIds.length > 0;
        }

        function selectCriterion(criterion, coefCall) {
            if (coefCall && !criterion.isSelected) {
                return;
            }
            if (!coefCall) {
                criterion.isSelected = !criterion.isSelected;
            }
            formDataForSearchRequest(criterion, coefCall);
            DecisionDataService.searchDecision(vm.decisionId, DecisionSharedService.getFilterObject()).then(function(result) {
                DecisionNotificationService.notifySelectCriterion(result.decisions);
            });
        }

        function formDataForSearchRequest(criterion, coefCall) {
            var position = _fo.sortCriteriaIds.indexOf(criterion.criterionId);
            //select criterion
            if (position === -1) {
                _fo.sortCriteriaIds.push(criterion.criterionId);
                //don't add default coefficient
                if (criterion.coefficient.value !== DecisionCriteriaConstant.coefficientDefault.value) {
                    _fo.sortCriteriaCoefficients[criterion.criterionId] = criterion.coefficient.value;
                }
                //add only coefficient (but not default)
            } else if (coefCall && criterion.coefficient.value !== DecisionCriteriaConstant.coefficientDefault.value) {
                _fo.sortCriteriaCoefficients[criterion.criterionId] = criterion.coefficient.value;
                //unselect criterion
            } else {
                _fo.sortCriteriaIds.splice(position, 1);
                delete _fo.sortCriteriaCoefficients[criterion.criterionId];
            }
        }

        function editCriteriaCoefficient(event, criteria) {
            event.preventDefault();
            event.stopPropagation();
            var modalInstance = $uibModal.open({
                templateUrl: 'app/components/decisionCriteria/criteria-coefficient-popup.html',
                controller: 'CriteriaCoefficientPopupController',
                controllerAs: 'vm',
                backdrop: 'static',
                resolve: {
                    criteria: function() {
                        return criteria;
                    }
                }
            });

            modalInstance.result.then(function(result) {
                var groupIndex = _.findIndex(vm.criteriaGroups, {
                    criterionGroupId: result.criterionGroupId
                });
                var criteriaIndex = _.findIndex(vm.criteriaGroups[groupIndex].criteria, {
                    criterionId: result.criterionId
                });
                vm.criteriaGroups[groupIndex].criteria[criteriaIndex] = result;
                selectCriterion(result, true);
            });
        }

        function replacePropertyValue(prevVal, newVal, object) {
            const newObject = _.clone(object);

            _.each(object, (val, key) => {
                if (val === prevVal) {
                    newObject[key] = newVal;
                } else if (typeof(val) === 'object' || typeof(val) === 'array') {
                    newObject[key] = replacePropertyValue(prevVal, newVal, val);
                }
            });

            return newObject;
        }

        function init() {
            vm.criteriaSpinner = true;
            DecisionDataService.getCriteriaGroupsById(vm.decisionId).then(function(result) {
                vm.criteriaGroups = result;
                criteriaGroupsCurrent = result;
            }).finally(function() {
                vm.criteriaSpinner = false;
                if (vm.criteriaGroups.length > 0) {
                    vm.criteriaGroups[0].isOpen = true;
                }
            });


            // TODO: need to refactor
            //Subscribe to notification events
            DecisionNotificationService.subscribeSelectDecision(function(event, data) {
                var criterionId,
                    criteriaGroupsRating;

                vm.showRating = data.length;
                criterionId = data[0];
                console.log(!_.isEmpty(data));

                if (!_.isEmpty(data)) {
                    vm.criteriaSpinner = true;
                    DecisionDataService.getCriteriaByDecision(criterionId, vm.decisionId).then(function(result) {
                        criteriaGroupsRating = result;
                        // console.log(vm.criteriaGroups);
                        // console.log(criteriaGroupsRating);

                        // Clean items
                        

                        vm.criteriaGroups = criteriaGroupsCurrent;
                        // TODO: Optimize find deep and replace
                        _.map(criteriaGroupsRating, function(item, itemIndex) {
                            _.map(vm.criteriaGroups[0].criteria, function(el, index) {//TODO: all els
                                if(item.criterionId === el.criterionId) {
                                    // console.log(vm.criteriaGroups[0].criteria[index]);
                                    console.log(vm.criteriaGroups[0].criteria[index]);
                                   vm.criteriaGroups[0].criteria[index] = criteriaGroupsRating[itemIndex];
                                } else {
                                    vm.criteriaGroups[0].criteria[index].weight = null
                                }
                            });

                        });



                    }).finally(function() {
                        vm.criteriaSpinner = false;
                        if (vm.criteriaGroups.length > 0) {
                            vm.criteriaGroups[0].isOpen = true;
                        }
                    });
                } else {
                    vm.criteriaGroups = criteriaGroupsCurrent;
                }

            });
        }
    }
})();