(function() {

    'user strict';

    angular
        .module('app.decision')
        .controller('DecisionMatrixController', DecisionMatrixController);

    DecisionMatrixController.$inject = ['DecisionDataService', 'DecisionSharedService'];

    function DecisionMatrixController(DecisionDataService, DecisionSharedService) {
        var
            vm = this;
        // vm.criteriaTitles,
        // characteristicTitles;
        criteriaIds = [];
        vm.displayMatrix = [];
        vm.decisionId = 2512;

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
                }, 200);
            });
        }

        function prepareDisplayMatrix(decisionMatrix) {
            var matrix = decisionMatrix.decisionMatrixs;
            _.map(matrix, function(el, index) {
                var ctiteria = el.criteria;

                _.map(ctiteria, function(obj, index) {
                    var criteriaStore = obj;
                    // obj = 
                    // obj.criterionId
                    $('#decision-row-' + el.decision.decisionId).find('.matrix-table-col-content[data-criterion-id="'+ obj.criterionId +'"]').html(obj.criterionId + ' | ' + obj.weight);
                    console.log($('#decision-row-' + el.decision.decisionId).find('.matrix-table-col-content[data-criterion-id="'+ obj.criterionId +'"]'));
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