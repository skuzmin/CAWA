(function() {

    'use strict';

    angular
        .module('app.components')
        .controller('RatingStarController', RatingStarController)
        .component('ratingStar', {
            templateUrl: 'app/components/ratingStar/rating-star.html',
            bindings: {
                value: '<'
            },
            controller: 'RatingStarController',
            controllerAs: 'vm'
        });

    RatingStarController.$inject = ['AppRatingStarConstant'];

    function RatingStarController(AppRatingStarConstant) {
        var vm = this;

            vm.showRating = false;

            vm.$onChanges = onChanges;            

            function onChanges() {
                vm.rating = parseFloat(vm.value) / AppRatingStarConstant.MAX_RATING * 100 + '%' || 0;
                vm.value = vm.value || 0;
                vm.showRating = vm.value > 0;
            }
    }
})();