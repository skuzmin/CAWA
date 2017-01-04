(function() {

    'use strict';

    angular
        .module('app.components')
        .constant('DecisionCriteriaConstant', {
            coefficientList: [{
                name: 'Low',
                value: 0.5
            }, {
                name: 'Normal',
                value: 1
            }, {
                name: 'Important',
                value: 2
            }, {
                name: 'Significant',
                value: 3
            }, {
                name: 'Critical',
                value: 4
            }, {
                name: 'Custom',
                value: 0
            }],
            coefficientDefault: {
                name: 'Normal',
                value: 1
            }
        });
})();
