(function() {

    'user strict';

    angular
        .module('app.decision')
        .controller('DecisionMatrixController', DecisionMatrixController);

    DecisionMatrixController.$inject = ['DecisionDataService', 'DecisionSharedService', '$stateParams', 'DecisionNotificationService', 'decisionBasicInfo', '$rootScope', '$compile', '$scope', '$q', 'DecisionCriteriaConstant'];

    function DecisionMatrixController(DecisionDataService, DecisionSharedService, $stateParams, DecisionNotificationService, decisionBasicInfo, $rootScope, $compile, $scope, $q, DecisionCriteriaConstant) {
        var
            vm = this,
            isInitedSorters = false,
            defaultDecisionCount = 10;

        criteriaIds = [];
        vm.displayMatrix = [];

        vm.decisionId = $stateParams.id;
        vm.decision = decisionBasicInfo || {};
        $rootScope.pageTitle = vm.decision.name + ' Matrix | DecisionWanted';

        vm.toggleTargetHover = toggleTargetHover;

        vm.toggleTargetHoverFlag = false;

        // TODO: move to utils
        function isDate(date) {
            var isValueDate = (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
            return isValueDate;
        }

        function toggleTargetHover() {
            // Hover for vertical lines
            vm.toggleTargetHoverFlag = !vm.toggleTargetHoverFlag;
            if (vm.toggleTargetHoverFlag) {
                $('.matrix-table-col').on({
                    mouseenter: function() {
                        var colId = $(this).data('col-id');
                        if (!colId) return;
                        $('.matrix-table-col[data-col-id="' + colId + '"]').addClass('matrix-col-selected');
                    },
                    mouseleave: function() {
                        $('.matrix-table-col.matrix-col-selected').removeClass('matrix-col-selected');
                    }
                });
                $('body').addClass('target-hover');

            } else {
                $('.matrix-table-col').unbind('mouseenter').unbind('mouseleave');
                $('body').removeClass('target-hover');
            }
        }

        vm.orderByDecisionProperty = orderByDecisionProperty;

        init();

        function getCriteriaGroupsById() {
            // Criteria
            return DecisionDataService.getCriteriaGroupsById(vm.decisionId).then(function(result) {
                vm.criteriaGroups = result;
                criteriaIds = _.map(result["0"].criteria, function(el) {
                    return el.name;
                });
            });
        }

        function getCharacteristictsGroupsById() {
            // Characteristicts
            return DecisionDataService.getCharacteristictsGroupsById(vm.decisionId).then(function(result) {
                vm.characteristicGroups = result;
            });
        }


        function init() {
            console.log('Decision Matrix Controller');

            // TODO: merge to one array with titles



            //Get data for decision panel (main)
            vm.decisionsSpinner = true;


            // Get criteria and characteristic
            $q.all([getCriteriaGroupsById(), getCharacteristictsGroupsById()])
                .then(function(values) {
                    setMatrixTableWidth();
                    searchDecisionMatrix(vm.decisionId);
                });


            //Subscribe to notification events
            DecisionNotificationService.subscribeSelectCriterion(function(event, data) {
                setDecisionMatchPercent(data);
                vm.decisionMatrixList = data;
                renderMatrix(vm.decisionMatrixList);

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

        function calcMatrixRowHeight() {
            // TODO: optimize | Set Aside row height
            // JS version
            var matrixAside = document.getElementsByClassName('matrix-table-aside');
            var matrixCols = document.getElementsByClassName('matrix-table-item-content');
            for (var i = 0; i < matrixCols.length; i++) {
                var el = matrixCols[i],
                    elH = parseFloat(el.clientHeight) + 'px';

                el.style.height = elH;
                $('.matrix-table-aside .matrix-table-item').eq(i).css({
                    'height': elH
                });
            }
        }

        // TODO: drop settimeout
        function renderMatrix(decisionMatrixList) {
            // vm.decisionsSpinner = true;

            setTimeout(function() {
                prepareDisplayMatrix(decisionMatrixList);
                reinitMatrixScroller();
                calcMatrixRowHeight();
                $scope.$apply(function() {
                    vm.decisionsSpinner = false;
                });
            }, 0);


        }

        function searchDecisionMatrix(id) {
            vm.decisionsSpinner = true;
            DecisionDataService.searchDecisionMatrix(id, DecisionSharedService.getFilterObject()).then(function(result) {
                vm.decisionMatrixList = result.decisionMatrixs;
                // initSorters();

                renderMatrix(vm.decisionMatrixList);

                DecisionSharedService.filterObject.pagination.totalDecisions = result.totalDecisionMatrixs;
            });
        }

        // TODO: make as in sorter directive
        function orderByDecisionProperty(field, order) {
            if (!field) return;
            order = order || 'DESC';

            sortObj = {
                sort: {
                    id: field,
                    order: order
                },
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
                '</div>' +
                '<div class="app-rating-votes">' +
                '<span><span class="glyphicon glyphicon-thumbs-up"></span> ' + totalVotes + '</span>' +
                '</div>';
            return ratingHtml;
        }

        // TODO: find better solution, optimize $compile maybe render whole row in js
        function prepareDisplayMatrix(decisionMatrix) {
            var matrix = decisionMatrix;

            // Criteria insert in table
            _.map(matrix, function(el, index) {
                var criteria = el.criteria;

                var criteriaEl = $('#decision-row-' + el.decision.decisionId);

                _.map(criteria, function(obj, index) {

                    // Angular
                    // var html = '<rating-star value="' + obj.weight + '" total-votes="' + obj.totalVotes + '" ng-show="true"></rating-star>';
                    // criteriaEl.find('.matrix-table-col-content[data-criterion-id="' + obj.criterionId + '"]').html(html); //.addClass('color-' + obj.weight);

                    // Pure JS
                    var comments = '<div class="app-item-additional-wrapper"><div class="app-item-comments">' + '<span class="glyphicon glyphicon-comment"></span> 0' + '</div></div>';
                    html = ratingDirective(obj.weight, obj.totalVotes) + comments;

                    var elCol = criteriaEl.find('.matrix-table-col-content[data-criterion-id="' + obj.criterionId + '"]');
                    elCol.html(html);
                    elCol.parent().removeClass('empty');

                });

            });


            // Characteristic insert in table
            _.map(matrix, function(el, index) {
                var characteristics = el.characteristics;

                _.map(characteristics, function(obj, index) {
                    var comments = '<div class="app-item-additional-wrapper"><div class="app-item-comments">' + '<span class="glyphicon glyphicon-comment"></span> 0' + '</div></div>';

                    var displayValue = obj.value;

                    // TODO: format date
                    // if (isDate(displayValue)) displayValue = new Date(displayValue);
                    var html = displayValue + comments;



                    var elCol = $('#decision-row-' + el.decision.decisionId).find('.matrix-table-col-content[data-characteristic-id="' + obj.characteristicId + '"]');
                    elCol.html(html);
                    elCol.parent().removeClass('empty');
                    // $('#decision-row-' + el.decision.decisionId).find('.matrix-table-col-content[data-characteristic-id="' + obj.characteristicId + '"]').html($compile(html)($scope));
                });
            });

        }

        function updatePosition() {
            var _this = this;
            scrollHandler(_this.y, _this.x);
        }


        // TODO: Mozilla FF has warning about scroll event
        // Table scroll
        var
            tableBody,
            tableHeader,
            tableAside;

        tableAside = $('#matrix-table .matrix-table-aside');
        tableHeader = $('#matrix-table .matrix-table-header .scroll-group');

        function scrollHandler(scrollTop, scrollLeft) {
            $(tableAside).css({
                'top': scrollTop,
            });
            $(tableHeader).css({
                'left': scrollLeft
            });
        }

        // Custom scroll
        var wrapper = document.getElementById('matrix-table-body');
        var martrixScroll = new IScroll(wrapper, {
            scrollbars: true,
            scrollX: true,
            scrollY: true,
            mouseWheel: true,
            interactiveScrollbars: true,
            shrinkScrollbars: 'scale',
            fadeScrollbars: false,
            probeType: 3,
            useTransition: true,
            disablePointer: true,
            disableTouch: false,
            disableMouse: false
        });

        function reinitMatrixScroller() {
            martrixScroll.refresh();
            martrixScroll.on('scroll', updatePosition);
        }

        function setMatrixTableWidth() {
            var criteriaGroupsCount,
                characteristicGroupsCount;

            criteriaGroupsCount = vm.criteriaGroups[0].criteria.length || 0;
            characteristicGroupsCount = vm.characteristicGroups[0].characteristics.length || 0;
            vm.tableWidth = (criteriaGroupsCount + characteristicGroupsCount) * 120 + 'px';
        }

        // TODO: make as separeted component

        var _fo = DecisionSharedService.filterObject.selectedCriteria;
        vm.selectCriterion = selectCriterion;
        //Set decions percent(% criterion match)
        function setDecisionMatchPercent(list) {
            var percent;
            _.forEach(list, function(initItem) {
                percent = parseFloat(initItem.criteriaCompliancePercentage);
                if (_.isNaN(percent)) {
                    percent = 0;
                } else if (!_.isInteger(percent)) {
                    percent = percent.toFixed(2);
                }
                initItem.criteriaCompliancePercentage = percent + '%';
            });
        }

        function selectCriterion(criterion, coefCall) {
            vm.decisionsSpinner = true;
            if (coefCall && !criterion.isSelected) {
                return;
            }
            if (!coefCall) {
                criterion.isSelected = !criterion.isSelected;
            }
            formDataForSearchRequest(criterion, coefCall);
            // console.log(criterion);
            // console.log(DecisionSharedService.getFilterObject());
            DecisionDataService.searchDecisionMatrix(vm.decisionId, DecisionSharedService.getFilterObject()).then(function(result) {
                DecisionNotificationService.notifySelectCriterion(result.decisionMatrixs);
            });
        }

        function formDataForSearchRequest(criterion, coefCall) {
            var position = _fo.sortCriteriaIds.indexOf(criterion.criterionId);
            //select criterion
            if (position === -1) {
                _fo.sortCriteriaIds.push(criterion.criterionId);
                //don't add default coefficient
                if (criterion.coefficient && criterion.coefficient.value !== DecisionCriteriaConstant.coefficientDefault.value) {
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

    }
})();