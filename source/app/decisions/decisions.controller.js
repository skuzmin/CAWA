(function() {

    'user strict';

    angular
        .module('app.decision')
        .controller('DecisionsController', DecisionsController);

    DecisionsController.$inject = [];

    function DecisionsController() {
        var
            vm = this;

        console.log('Decisions controller');

        init();

        function init() {
        }
    }
})();