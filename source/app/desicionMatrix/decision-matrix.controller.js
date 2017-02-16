(function() {

    'user strict';

    angular
        .module('app.decision')
        .controller('DecisionMatrixController', DecisionMatrixController);

    DecisionMatrixController.$inject = ['DecisionDataService', '$stateParams', 'DecisionSharedService', 'decisionBasicInfo', '$rootScope', '$compile', '$scope'];

    function DecisionMatrixController(DecisionDataService, $stateParams, DecisionSharedService, decisionBasicInfo, $rootScope, $compile, $scope) {
        var
            vm = this;

        criteriaIds = [];
        vm.displayMatrix = [];
        // vm.decisionId = 2512;
        vm.decisionId = $stateParams.id;
        vm.decision = decisionBasicInfo || {};

        $rootScope.pageTitle = vm.decision.name + ' Matrix | DecisionWanted';

        function init() {
            console.log('Decision Matrix Controller');

            // TODO: merge to one array with titles
            // Criteria
            DecisionDataService.getCriteriaGroupsById(vm.decisionId).then(function(result) {
                vm.criteriaGroups = result;
                criteriaIds = _.map(result["0"].criteria, function(el) {
                    return el.name;
                });
            });

            // Characteristicts
            DecisionDataService.getCharacteristictsGroupsById(vm.decisionId).then(function(result) {
                vm.characteristicGroups = result;
            });

            searchDecisionMatrix(vm.decisionId);
        }

        function searchDecisionMatrix(id) {
            DecisionDataService.searchDecisionMatrix(id, DecisionSharedService.getFilterObject()).then(function(result) {
                vm.decisionMatrixList = result;
                console.log(result);
                setTimeout(function() {
                    prepareDisplayMatrix(vm.decisionMatrixList);
                }, 0);
            });
        }

        // TODO: find better solution, optimize $compile maybe render whole row in js
        function prepareDisplayMatrix(decisionMatrix) {
            var matrix = decisionMatrix.decisionMatrixs;

            // Criteria insert in table
            _.map(matrix, function(el, index) {
                var criteria = el.criteria;

                _.map(criteria, function(obj, index) {
                    var criteriaStore = obj;
                    var html = '<rating-star value="' + obj.weight + '" total-votes="' + obj.totalVotes + '" ng-show="true"></rating-star>';
                    $('#decision-row-' + el.decision.decisionId).find('.matrix-table-col-content[data-criterion-id="' + obj.criterionId + '"]').html($compile(html)($scope)); //.addClass('color-' + obj.weight);
                });
            });


            // Characteristic insert in table
            _.map(matrix, function(el, index) {
                var characteristics = el.characteristics;

                _.map(characteristics, function(obj, index) {
                    var criteriaStore = obj;
                    var html = obj.value;
                    $('#decision-row-' + el.decision.decisionId).find('.matrix-table-col-content[data-characteristic-id="' + obj.characteristicId + '"]').html($compile(html)($scope)); //.addClass('color-' + obj.weight);
                });
            });

        }

        init();


        // // Set table as col depend of table content
        // $('.js-matrix-table .matrix-table-content > .matrix-table-item:first() .matrix-table-col').each(function(index, val) {
        //     var colWidth = $(this).outerWidth() + 'px';
        //     $('.js-matrix-table .matrix-table-header .matrix-table-col').eq(index).css({
        //         'width': colWidth
        //     });

        // });

    }
})();