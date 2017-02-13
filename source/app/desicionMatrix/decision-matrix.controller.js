(function() {

    'user strict';

    angular
        .module('app.decision')
        .controller('DecisionMatrixController', DecisionMatrixController);

    DecisionMatrixController.$inject = [];

    function DecisionMatrixController() {
        var
            vm = this;

        function init() {
            console.log('DecisionMatrixController');
        }

        init();


        // Set table as col depend of table content
        $('.js-matrix-table .matrix-table-content > .matrix-table-item:first() .matrix-table-col').each(function(index, val) {
            var colWidth = $(this).outerWidth() + 'px';
            $('.js-matrix-table .matrix-table-header .matrix-table-col').eq(index).css({
                'width': colWidth
            });

        });

    }
})();