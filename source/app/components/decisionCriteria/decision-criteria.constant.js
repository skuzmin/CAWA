(function() {

    'use strict';

    angular
        .module('app.components')
        .constant('DecisionCriteriaConstant', {
            coefficientList: [{
                name: 'Lower',
                value: 0.1
            },{
                name: 'Low',
                value: 0.5
            }, {
                name: 'Normal',
                value: 1
            }, {
                name: 'High',
                value: 1.5
            }, {
                name: 'Important',
                value: 2.5
            }, {
                name: 'Significant',
                value: 4
            }, {
                name: 'Critical',
                value: 7
            }],
            coefficientDefault: {
                name: 'Normal',
                value: 1
            }
        });
})();
