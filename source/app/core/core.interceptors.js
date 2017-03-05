(function() {
    'use strict';

    angular
        .module('app.core')
        .config(function($httpProvider) {
            $httpProvider.interceptors.push(appInterceptor);
        });

    appInterceptor.$inject = ['$injector'];

    function appInterceptor($injector) {
        var analysisCallsArr = [];
        return {
            request: function(config) {
                // console.log(config);
                return config;
            },
            response: function(resp) {
                // TODO: optimize move to routes
                // check if decisionAnalysis in response
                var $state, $stateParams, currentState;

                $state = $injector.get('$state');
                $stateParams = $injector.get('$stateParams');

                currentState = $state.current.name;
                

                if (currentState === 'decisions.matrix' || currentState === 'decisions.matrix.analysis')
                    if (resp.data && resp.data.decisionMatrixs && resp.data.decisionAnalysisId) {

                        var decisionAnalysisId = resp.data.decisionAnalysisId;
                        if (analysisCallsArr.length !== 0) {
                            
                            var decisionAnalysisStateParams = {
                                'id': $stateParams.id,
                                'slug': $stateParams.slug,
                                'criteria': $stateParams.criteria,
                                'analysisId': decisionAnalysisId
                            };
                            $state.transitionTo('decisions.matrix.analysis', decisionAnalysisStateParams);
                        }

                        // Save only second call to avoid big array
                        if (analysisCallsArr.length === 0) analysisCallsArr.push(decisionAnalysisId);
                    }
                return resp;
            },
            responseError: function(rejection) {
                // console.log(rejection);
                return rejection;
            }
        };
    }

})();