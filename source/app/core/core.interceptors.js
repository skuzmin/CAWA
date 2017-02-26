(function() {
    'use strict';

    angular
        .module('app.core')
        .config(function($httpProvider) {
            $httpProvider.interceptors.push(appInterceptor);
        });

    appInterceptor.$inject = ['$injector'];

    function appInterceptor($injector) {
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
                    if (resp.data && resp.data.decisionAnalysisId) {
                        var decisionAnalysisId = resp.data.decisionAnalysisId;

                        var decisionAnalysisStateParams = {
                            'id': $stateParams.id,
                            'slug': $stateParams.slug,
                            'criteria': $stateParams.criteria,
                            analysisId: decisionAnalysisId
                        };
                        // console.log(decisionAnalysisId);
                        $state.transitionTo('decisions.matrix.analysis', decisionAnalysisStateParams);
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