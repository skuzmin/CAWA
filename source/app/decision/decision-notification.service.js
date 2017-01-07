(function() {

    'use strict';

    angular
        .module('app.decision')
        .factory('DecisionNotificationService', DecisionNotificationService);

    DecisionNotificationService.$inject = ['$rootScope'];

    function DecisionNotificationService($rootScope) {

        var listeners = {};

        var service = {
            subscribeSelectSorter: subscribeSelectSorter,
            subscribeSelectCriterion: subscribeSelectCriterion,
            subscribeSelectCharacteristic: subscribeSelectCharacteristic,
            subscribeGetDetailedCharacteristics: subscribeGetDetailedCharacteristics,
            subscribeCharacteristicsGroups: subscribeCharacteristicsGroups,
            notifyGetDetailedCharacteristics: notifyGetDetailedCharacteristics,
            notifySelectCriterion: notifySelectCriterion,
            notifySelectCharacteristic: notifySelectCharacteristic,
            notifyCharacteristicsGroups: notifyCharacteristicsGroups,
            notifyInitSorter: notifyInitSorter
        };

        return service;

        //Basic
        function subscribe(event, callback) {
            if (!listeners[event]) {
                listeners[event] = $rootScope.$on(event, callback);
            }
        }

        function broadcast(event, data) {
            $rootScope.$broadcast(event, data);
        }

        function emit(event, data) {
            $rootScope.$emit(event, data);
        }

        //Listeners
        function subscribeSelectSorter(callback) {
            subscribe('selectSorter', callback);
        }

        function subscribeSelectCriterion(callback) {
            subscribe('selectCriterion', callback);
        }

        function subscribeSelectCharacteristic(callback) {
            subscribe('selectCharacteristic', callback);
        }

        function subscribeGetDetailedCharacteristics(callback) {
            subscribe('getDetailedCharacteristics', callback);
        }

        function subscribeCharacteristicsGroups(callback) {
            subscribe('characteristicsGroups', callback);
        }

        //Emitters
        function notifyGetDetailedCharacteristics(data) {
            emit('getDetailedCharacteristics', data);
        }

        function notifySelectCriterion(data) {
            emit('selectCriterion', data);
        }

        function notifySelectCharacteristic(data) {
            emit('selectCharacteristic', data);
        }

        function notifyCharacteristicsGroups(data) {
            emit('characteristicsGroups', data);
        }

        function notifyInitSorter(data) {
            broadcast('initSorter', data);
        }

    }
})();
