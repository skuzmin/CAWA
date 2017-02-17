(function() {

    'user strict';

    angular
        .module('app.decision')
        .controller('DecisionMatrixController', DecisionMatrixController);

    DecisionMatrixController.$inject = ['DecisionDataService', 'DecisionSharedService', '$stateParams', 'DecisionNotificationService', 'decisionBasicInfo', '$rootScope', '$compile', '$scope'];

    function DecisionMatrixController(DecisionDataService, DecisionSharedService, $stateParams, DecisionNotificationService, decisionBasicInfo, $rootScope, $compile, $scope) {
        var
            vm = this,
            isInitedSorters = false;

        criteriaIds = [];
        vm.displayMatrix = [];

        vm.decisionId = $stateParams.id;
        vm.decision = decisionBasicInfo || {};
        $rootScope.pageTitle = vm.decision.name + ' Matrix | DecisionWanted';

        vm.orderByDecisionProperty = orderByDecisionProperty;

        init();

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

            //Get data for decision panel (main)
            vm.decisionsSpinner = true;
            searchDecisionMatrix(vm.decisionId);

            //Subscribe to notification events
            DecisionNotificationService.subscribeSelectCriterion(function(event, data) {
                setDecisionMatchPercent(data);
                vm.decisionsList = data;
            });
            DecisionNotificationService.subscribePageChanged(function() {
                vm.decisionsSpinner = true;
                searchDecisionMatrix(vm.decisionId);
            });
            DecisionNotificationService.subscribeGetDetailedCharacteristics(function(event, data) {
                data.detailsSpinner = true;
                DecisionDataService.getDecisionCharacteristics(vm.decisionId, data.decisionId).then(function(result) {
                    data.characteristics = prepareDataToDisplay(result);
                }).finally(function() {
                    data.detailsSpinner = false;
                });
            });
            DecisionNotificationService.subscribeSelectSorter(function(event, data) {
                vm.decisionsSpinner = true;
                DecisionSharedService.filterObject.sorters[data.mode] = data.sort;
                searchDecisionMatrix(vm.decisionId);
            });

        }

        //Init sorters, when directives loaded
        function initSorters() {
            if (!isInitedSorters) {
                DecisionNotificationService.notifyInitSorter({
                    list: [{
                        name: 'Weight',
                        order: 'DESC',
                        isSelected: true
                    }],
                    type: 'sortByCriteria',
                    mode: 'twoStep'
                });
                DecisionNotificationService.notifyInitSorter({
                    list: [{
                        name: 'Create Date',
                        propertyId: 'createDate'
                    }, {
                        name: 'Update Date',
                        propertyId: 'updateDate'
                    }, {
                        name: 'Name',
                        propertyId: 'name'
                    }],
                    type: 'sortByDecisionProperty',
                    mode: 'threeStep'
                });
                isInitedSorters = true;
            }
        }

        function searchDecisionMatrix(id) {
            DecisionDataService.searchDecisionMatrix(id, DecisionSharedService.getFilterObject()).then(function(result) {
                vm.decisionMatrixList = result;
                // console.log(result);
                vm.decisionsSpinner = false;
                setTimeout(function() {
                    prepareDisplayMatrix(vm.decisionMatrixList);
                    initSorters();
                }, 0);
                DecisionSharedService.filterObject.pagination.totalDecisions = result.totalDecisions;
            });
        }

        // TODO: make as in sorter directive
        function orderByDecisionProperty(field, order) {
            if (!field) return;
            order = order || 'DESC';

             sortObj = {
                sort: {id: field, order: order},
                mode: "sortByDecisionProperty"
            };
            $scope.$emit('selectSorter', sortObj);

        }

        // TODO: for test $compile vs pure JS
        function ratingDirective(value, totalVotes) {
            var ratingHtml,
                rating;

            rating = parseFloat(value) / 5 * 100 + '%' || 0;
            ratingHtml = '<div class="app-rating-star-wrapper">' +
                            '<div class="app-rating-star">' +
                                '<span class="bar" style="width: ' + rating + '"></span>' +
                            '</div>' +
                            '<div class="app-rating-votes">' +
                              '<span>' + value + '</span><span>(' + totalVotes + ')</span>' +
                            '</div>' +
                        '</div>';
            return ratingHtml;
        }

        // TODO: find better solution, optimize $compile maybe render whole row in js
        function prepareDisplayMatrix(decisionMatrix) {
            var matrix = decisionMatrix.decisionMatrixs;

            // Criteria insert in table
            _.map(matrix, function(el, index) {
                var criteria = el.criteria;

                var criteriaEl = $('#decision-row-' + el.decision.decisionId);

                _.map(criteria, function(obj, index) {
                    var criteriaStore = obj;

                    // Angular
                    // var html = '<rating-star value="' + obj.weight + '" total-votes="' + obj.totalVotes + '" ng-show="true"></rating-star>';
                    // criteriaEl.find('.matrix-table-col-content[data-criterion-id="' + obj.criterionId + '"]').html(html); //.addClass('color-' + obj.weight);

                    // Pure JS
                    var comments = '<div class="app-item-comments">'+'<span class="glyphicon glyphicon-comment"></span>' + obj.comments + '<div>';
                    var html = ratingDirective(obj.weight, obj.totalVotes) + comments;
                    criteriaEl.find('.matrix-table-col-content[data-criterion-id="' + obj.criterionId + '"]').html(html);

                });

                // $compile(criteriaEl.find('[data-criterion-id]'))($scope);
            });



            // Characteristic insert in table
            _.map(matrix, function(el, index) {
                var characteristics = el.characteristics;

                _.map(characteristics, function(obj, index) {
                    var criteriaStore = obj;
                    var html = obj.value;
                    // console.log(obj);
                    $('#decision-row-' + el.decision.decisionId).find('.matrix-table-col-content[data-characteristic-id="' + obj.characteristicId + '"]').html(html);
                    // $('#decision-row-' + el.decision.decisionId).find('.matrix-table-col-content[data-characteristic-id="' + obj.characteristicId + '"]').html($compile(html)($scope));
                });
            });

        }


        // // Set table as col depend of table content
        // $('.js-matrix-table .matrix-table-content > .matrix-table-item:first() .matrix-table-col').each(function(index, val) {
        //     var colWidth = $(this).outerWidth() + 'px';
        //     $('.js-matrix-table .matrix-table-header .matrix-table-col').eq(index).css({
        //         'width': colWidth
        //     });

        // });

    }
})();