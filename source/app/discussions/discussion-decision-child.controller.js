(function() {

    'user strict';

    angular
        .module('app.discussions')
        .controller('DiscussionDecisionChildController', DiscussionDecisionChildController);

    DiscussionDecisionChildController.$inject = ['decisionBasicInfo', 'DiscussionsDataService', '$stateParams', '$rootScope', 'DecisionDataService', '$q'];

    function DiscussionDecisionChildController(decisionBasicInfo, DiscussionsDataService, $stateParams, $rootScope, DecisionDataService, $q) {
        var vm = this;
        vm.decision = decisionBasicInfo || {}; //Parent Decision

        init();

        // TODO: move to service
        function getCriteriaGroupsById(decisionId) {
            // Criteria
            return DecisionDataService.getCriteriaGroupsById(decisionId).then(function(result) {
                vm.criteriaGroups = result;
                criteriaIds = _.map(result["0"].criteria, function(el) {
                    return el.criterionId;
                });
            });
        }

        function getCharacteristictsGroupsById(decisionId) {
            // Characteristicts
            return DecisionDataService.getCharacteristictsGroupsById(decisionId).then(function(result) {
                vm.characteristicGroups = result;

                characteristicsIds = _.map(result["0"].characteristics, function(el) {
                    return el.characteristicId;
                });
            });
        }

        function fillRating(decisionMatrixList) {
            // vm.criteriaGroups = 
            _.map(vm.criteriaGroups, function(group) {
                _.map(group.criteria, function(criteria) {

                    var criteriaNew = _.clone(criteria);
                    _.map(decisionMatrixList.criteria, function(criteriaMatrix) {
                        // console.log(criteriaMatrix.criterionId, criteriaNew.criterionId, criteriaMatrix.criterionId === criteriaNew.criterionId);
                        if (criteriaMatrix.criterionId === criteriaNew.criterionId) {
                            criteria.totalDislikes = criteriaMatrix.totalDislikes;
                            criteria.totalLikes = criteriaMatrix.totalLikes;
                            criteria.totalVotes = criteriaMatrix.totalVotes;
                            criteria.weight = criteriaMatrix.weight;
                        }
                    });
                });
            });


            // // console.log(decisionMatrixList);
            // _.map(vm.characteristicGroups, function(group) {
            //     // console.log(group);
            //     _.map(group.characteristics, function(characteristic) {
            //         // console.log(characteristic);

            //         var characteristicNew = _.clone(characteristic);
            //         _.map(decisionMatrixList.characteristics, function(characteristicMatrix) {
            //             // console.log(characteristicMatrix.criterionId, characteristicNew.criterionId, characteristicMatrix.criterionId === characteristicNew.criterionId);
            //             if (characteristicMatrix.characteristicId === characteristicNew.characteristicId) {
            //                 characteristic.totalDislikes = characteristicMatrix.totalDislikes;
            //                 characteristic.totalLikes = characteristicMatrix.totalLikes;
            //                 characteristic.totalVotes = characteristicMatrix.totalVotes;
            //                 characteristic.weight = characteristicMatrix.weight;

            //                 console.log(characteristic);
            //             }
            //         });
            //     });
            // });
        }

        function init() {
            console.log('Discussion Decision controller');

            // Get criteria and characteristic
            $q.all([getCriteriaGroupsById(vm.decision.decisionId),
                    getCharacteristictsGroupsById(vm.decision.decisionId)
                ])
                .then(function(values) {

                    // Get Rating
                    var sendData = {
                        includeChildDecisionIds: []
                    };

                    sendData.includeChildDecisionIds.push($stateParams.discussionId);
                    DecisionDataService.searchDecisionMatrix(vm.decision.decisionId, sendData).then(function(result) {

                        fillRating(result.decisionMatrixs[0]);
                    });
                });

            // Child Decision
            DecisionDataService.getDecisionInfo($stateParams.discussionId).then(function(result) {
                vm.decisionChild = result;

                $rootScope.breadcrumbs = [{
                    title: 'Decisions',
                    link: 'decisions'
                }, {
                    title: vm.decision.name,
                    link: 'decisions.single'
                }, {
                    title: 'Discussions',
                    link: 'decisions.single.discussions'
                }, {
                    title: result.name,
                    link: null
                }];
            });


        }
    }
})();