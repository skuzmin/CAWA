(function() {
    'use strict';

    angular.module('app', [
        'app.core',
        'app.home',
        'app.components',
        'app.login',
        'app.decision',
        'app.decisionMatrix',
    ]);

    $.get({
    	dataType: "json",
        url: 'app.config'
    }).done(function(result) {
    	angular.module('app.core').constant('Config', {
    		authUrl: result.authUrl,
    		endpointUrl: result.endpointUrl,
            mode: result.mode
    	});
    }).always(function() {
        angular.element(function() {
	        angular.bootstrap(document, ['app']);
	    });
    });
})();

(function() {

	'use strict';

	angular.module('app.components', []);

})();
(function() {
	'use strict';

	angular
		.module('app.core', [
			'ui.router',
			'ngResource',
			'ui.bootstrap',
			'ngAnimate',
			'ngStorage',
			'angular-jwt'
		]);

})();
(function() {

    'use strict';

    angular
        .module('app.decision', ['app.core']);

})();

(function() {

    'use strict';

    angular
        .module('app.decisionMatrix', ['app.core']);

})();

(function() {

    'use strict';

    angular
        .module('app.home', ['app.core']);

})();

(function() {
	'use strict';

	angular.module('app.login', ['app.core']);

})();
(function() {
    'use strict';

    angular
        .module('app')
        .run(runBlock);

    runBlock.$inject = ['$rootScope', '$state'];

    function runBlock($rootScope, $state) {

        // Page title
        var pageTitle = 'DecisionWanted';
        $rootScope.pageTitle = pageTitle;

        $rootScope.$on('$stateChangeSuccess', function($state, $stateParams) {
            if (angular.isDefined($stateParams.data)) {
                if ($stateParams.data.pageTitle) {
                    $rootScope.pageTitle = $stateParams.data.pageTitle + ' | ' + pageTitle;
                }
            }
        });
    }

})();
(function() {

    'use strict';

    angular
        .module('app.core')
        .config(configuration);

    configuration.$inject = ['$stateProvider', '$urlRouterProvider', '$compileProvider', 'Config'];

    function configuration($stateProvider, $urlRouterProvider, $compileProvider, Config) {

        $stateProvider
            .state('404', {
                url: '/404',
                templateUrl: 'app/core/404.html',
                data: {
                  pageTitle : 'Error 404 Not Found!'
                }                
            });

        $urlRouterProvider.otherwise('/404');

        $compileProvider.debugInfoEnabled(Config.mode === 'dev');
    }

})();

(function() {

	'use strict';

	angular
		.module('app.decision')
		.factory('DecisionDataService', DecisionDataService);

		DecisionDataService.$inject = ['$resource', 'Config'];

		function DecisionDataService($resource, Config) {
			var
				decisionUrl = Config.endpointUrl + 'decisions/:id',

				decisions = $resource(decisionUrl + '/decisions', {id: '@id'},
				{
					searchDecisionById: {method: 'POST', isArray: false}
				}),

				decisionInfo = $resource(decisionUrl),
				decisionCharacteristics = $resource(decisionUrl + '/decisions/:childId/characteristics', {id: '@id', childId: '@childId'}, {}),
				criteriasGroups = $resource(decisionUrl + '/criteria/groups'),
        characteristictsGroups = $resource(decisionUrl + '/characteristics/groups'),
				criteriaByDecision = $resource(decisionUrl + '/:decisionId/decisions/:criterionId/criteria', {criterionId: '@criterionId', decisionId: '@decisionId'}, {});

			var service = {
				searchDecision: searchDecision,
				getCriteriaGroupsById: getCriteriaGroupsById,
				getCharacteristictsGroupsById: getCharacteristictsGroupsById,
				getDecisionInfo: getDecisionInfo,
				getDecisionCharacteristics: getDecisionCharacteristics,
        getCriteriaByDecision: getCriteriaByDecision
			};

			return service;

			function searchDecision(id, data) {
				return decisions.searchDecisionById({id: id}, data).$promise;
			}

			function getCriteriaGroupsById(id) {
				return criteriasGroups.query({id: id}).$promise;
			}

			function getCharacteristictsGroupsById(id) {
				return characteristictsGroups.query({id: id}).$promise;
			}

			function getDecisionInfo(id) {
				return decisionInfo.get({id: id}).$promise;
			}

			function getDecisionCharacteristics(id, childId) {
				return decisionCharacteristics.query({id: id, childId: childId}).$promise;
			}

      function getCriteriaByDecision(criterionId, decisionId) {
        return criteriaByDecision.query({criterionId: criterionId, decisionId: decisionId}).$promise;
      }
		}
})();
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
            subscribeSelectDecision: subscribeSelectDecision,
            subscribeSelectCharacteristic: subscribeSelectCharacteristic,
            subscribeGetDetailedCharacteristics: subscribeGetDetailedCharacteristics,
            subscribeCharacteristicsGroups: subscribeCharacteristicsGroups,
            subscribePageChanged: subscribePageChanged,
            notifyGetDetailedCharacteristics: notifyGetDetailedCharacteristics,
            notifySelectCriterion: notifySelectCriterion,
            notifySelectDecision: notifySelectDecision,
            notifySelectCharacteristic: notifySelectCharacteristic,
            notifyCharacteristicsGroups: notifyCharacteristicsGroups,
            notifyPageChanged: notifyPageChanged,
            notifyInitSorter: notifyInitSorter
        };

        return service;

        //Basic
        function subscribe(event, callback) {
            if (listeners[event]) {
                listeners[event]();
            }
            listeners[event] = $rootScope.$on(event, callback);
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

        function subscribeSelectDecision(callback) {
            subscribe('selectDecision', callback);
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

        function subscribePageChanged(callback) {
            subscribe('pageChanged', callback);
        }

        //Emitters
        function notifyGetDetailedCharacteristics(data) {
            emit('getDetailedCharacteristics', data);
        }

        function notifySelectCriterion(data) {
            emit('selectCriterion', data);
        }

        function notifySelectDecision(data) {
            emit('selectDecision', data);
        }

        function notifySelectCharacteristic(data) {
            emit('selectCharacteristic', data);
        }

        function notifyCharacteristicsGroups(data) {
            emit('characteristicsGroups', data);
        }

        function notifyPageChanged(data) {
            emit('pageChanged', data);
        }

        function notifyInitSorter(data) {
            broadcast('initSorter', data);
        }

    }
})();

(function() {

    'use strict';

    angular
        .module('app.decision')
        .service('DecisionSharedService', DecisionSharedService);

    DecisionSharedService.$inject = [];

    function DecisionSharedService() {
        var service = this;

        service.filterObject = {
            selectedCriteria: {
                sortCriteriaIds: [],
                sortCriteriaCoefficients: {}
            },
            pagination: {
                pageNumber: 1,
                pageSize: 10,
                totalDecisions: 0
            },
            selectedCharacteristics: {},
            sorters: {
                sortByCriteria: { order: 'DESC' },
                sortByCharacteristic: { id: null, order: null },
                sortByDecisionProperty: { id: null, order: null }
            },
            selectedDecision: {
                decisionsIds: []
            }
        };

        //allias
        var _fo = service.filterObject;

        service.getFilterObject = function() {
            return {
                //selected criteria
                sortCriteriaIds: _fo.selectedCriteria.sortCriteriaIds,
                //selected criteria coefficients
                sortCriteriaCoefficients: _fo.selectedCriteria.sortCriteriaCoefficients,
                //pagination
                pageNumber: _fo.pagination.pageNumber - 1,
                pageSize: _fo.pagination.pageSize,
                //sorting by:
                //criteria weight (1st level)
                sortWeightCriteriaDirection: _fo.sorters.sortByCriteria.order,
                //characteristic (2nd level)
                sortCharacteristicId: _fo.sorters.sortByCharacteristic.id,
                sortCharacteristicDirection: _fo.sorters.sortByCharacteristic.order,
                //property (3rd level)
                sortDecisionPropertyName: _fo.sorters.sortByDecisionProperty.id,
                sortDecisionPropertyDirection: _fo.sorters.sortByDecisionProperty.order,

                decisionsIds: _fo.selectedDecision.decisionsIds
            };
        };

    }
})();

(function() {

    'user strict';

    angular
        .module('app.decision')
        .controller('DecisionController', DecisionController);

    DecisionController.$inject = ['$rootScope', 'decisionBasicInfo', 'DecisionDataService', '$stateParams', '$timeout', 'DecisionNotificationService', 'DecisionSharedService'];

    function DecisionController($rootScope, decisionBasicInfo, DecisionDataService, $stateParams, $timeout, DecisionNotificationService, DecisionSharedService) {
        var
            vm = this,
            isInitedSorters = false,
            defaultDecisionCount = 10;

        console.log('Decision controller');

        vm.decisionId = $stateParams.id;
        vm.decisionsList = [];
        vm.updateDecisionList = [];
        vm.decision = decisionBasicInfo || {};
        $rootScope.pageTitle = vm.decision.name + ' | DecisionWanted';

        init();

        function asyncLoading(result) {
            //Acync rendering
            // $timeout(function() {
                vm.decisionsList = vm.decisionsList.concat(result.splice(0, defaultDecisionCount));
                if (result.length > 0) {
                    asyncLoading(result);
                }
            // }, 0);
        }

        function prepareDataToDisplay(characteristics) {
            var modifiedCharacteristics = {};
            _.forEach(characteristics, function(item) {
                if (!modifiedCharacteristics[item.characteristicGroupId]) {
                    modifiedCharacteristics[item.characteristicGroupId] = [];
                }
                modifiedCharacteristics[item.characteristicGroupId].push(item);
            });
            return modifiedCharacteristics;
        }

        function searchDecisions() {
            return DecisionDataService.searchDecision(vm.decisionId, DecisionSharedService.getFilterObject()).then(function(result) {
                vm.decisionsList.length = 0;
                setDecisionMatchPercent(result.decisions);
                asyncLoading(result.decisions);
                initSorters();
                DecisionSharedService.filterObject.pagination.totalDecisions = result.totalDecisions;
            }).finally(function() {
                vm.decisionsSpinner = false;
            });
        }

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

        //Init sorters, when directives loaded
        function initSorters() {
            if (!isInitedSorters) {
                DecisionNotificationService.notifyInitSorter({
                    list: [{ name: 'Weight', order: 'DESC', isSelected: true }],
                    type: 'sortByCriteria',
                    mode: 'twoStep'
                });
                DecisionNotificationService.notifyInitSorter({
                    list: [
                        { name: 'Create Date', propertyId: 'createDate' },
                        { name: 'Update Date', propertyId: 'updateDate' },
                        { name: 'Name', propertyId: 'name' }
                    ],
                    type: 'sortByDecisionProperty',
                    mode: 'threeStep'
                });
                isInitedSorters = true;
            }
        }

        function init() {
            //Check if main decision
            if (!_.isEmpty(vm.decision.parentDecisionIds)) {
                vm.parentDecisions = vm.decision.parentDecisionIds;
            }

            //Get data for decision panel (main)
            vm.decisionsSpinner = true;
            searchDecisions();

            //Subscribe to notification events
            DecisionNotificationService.subscribeSelectCriterion(function(event, data) {
                setDecisionMatchPercent(data);
                vm.decisionsList = data;
            });
            DecisionNotificationService.subscribePageChanged(function() {
                vm.decisionsSpinner = true;
                searchDecisions();
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
                searchDecisions();
            });

            // Not implemented yet
            DecisionNotificationService.subscribeSelectCharacteristic(function(event, data) {
                console.log(data);
            });
        }    
    }
})();

(function() {

    'use strict';

    angular
        .module('app.decision')
        .config(configuration);

    configuration.$inject = ['$stateProvider'];

    function configuration($stateProvider) {
        $stateProvider
            .state('decision', {
                url: '/decisions/:id/{slug}/{criteria}',
                templateUrl: 'app/decision/decision.html',
                controller: 'DecisionController',
                controllerAs: 'vm',
                resolve: {
                    decisionBasicInfo: DecisionResolver
                },
                params: {
                    slug: {
                        value: null,
                        squash: true
                    },
                    criteria: {
                        value: null,
                        squash: true
                    }
                }
            });
    }

    DecisionResolver.$inject = ['DecisionDataService', '$stateParams', '$state', '$rootScope', '$location'];

    function DecisionResolver(DecisionDataService, $stateParams, $state, $rootScope, $location) {
        return DecisionDataService.getDecisionInfo($stateParams.id).then(function(result) {
            var stateListener = $rootScope.$on('$stateChangeSuccess',
                function(event, toState, toParams, fromState, fromParams) {
                    //SLUG for Decision page
                    //Always set correct slug from server
                    $stateParams.slug = result.nameSlug;
                    //set criteria ( addtional user parameters)
                    var criteria = '';
                    if (toParams.criteria && (!fromParams.id || toParams.id === fromParams.id)) {
                        criteria = '/' + toParams.criteria;
                    }
                    //two behaviors for changing URL
                    if ((fromState.name && toState.name !== fromState.name) ||
                        (fromState.name && toState.name === fromState.name && toParams.id !== fromParams.id)) {
                        $location.path('/decisions/' + toParams.id + '/' + result.nameSlug + criteria);
                    } else {
                        $location.path('/decisions/' + toParams.id + '/' + result.nameSlug + criteria).replace();
                    }
                    //unsubscribe event listener
                    stateListener();
                });
            return result;
        }).catch(function() {
            $state.go('404');
        });
    }

})();
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
(function() {

    'use strict';

    angular
        .module('app.decisionMatrix')
        .config(configuration);

    configuration.$inject = ['$stateProvider'];

    function configuration($stateProvider) {
        $stateProvider
            .state('decisionMatrix', {
                url: '/matrix',
                templateUrl: 'app/desicionMatrix/decision-matrix.html',
                controller: 'DecisionMatrixController',
                controllerAs: 'vm',
                resolve: {
                    // decisionBasicInfo: DecisionMatrixResolver
                },
                params: {
                    slug: {
                        value: null,
                        squash: true
                    },
                    criteria: {
                        value: null,
                        squash: true
                    }
                }
            });
    }

})();
(function() {

	'user strict';

	angular
		.module('app.home')
		.controller('HomeController', HomeController);

		HomeController.$inject = [];

		function HomeController() {
			var vm = this;

			console.log('Home controller');
			
			vm.search = search;

			function search() {
				vm.showTrigger = true;
			}
 		}
})();
(function() {

    'use strict';

    angular
        .module('app.home')
        .config(configuration);

    configuration.$inject = ['$stateProvider'];

    function configuration($stateProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'app/home/home.html',
                controller: 'HomeController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Home'
                }
            });
    }

})();
(function() {
	'use strict';

	angular
		.module('app.login')
		.controller('AuthController', AuthController);

	AuthController.$inject = ['LoginService', '$stateParams', '$window'];

	function AuthController(LoginService, $stateParams, $window) {
		var vm = this;

		init();

		function init() {		
			if($stateParams.token) {
				var token = $window.location.href.split('access_token=')[1];
				LoginService.saveToken(token);
				$window.close();
			}
		}
	}

})();
(function() {

    'use strict';

    angular
        .module('app.login')
        .controller('LoginController', LoginController)
        .directive('appLogin', appLogin);

    function appLogin() {
        var directive = {
            restrict: 'E',
            replace: 'true',
            templateUrl: 'app/login/login.html',
            controller: 'LoginController',
            controllerAs: 'vm'
        };

        return directive;
    }

    LoginController.$inject = ['$window', 'LoginService', '$scope'];

    function LoginController($window, LoginService, $scope) {
        var vm = this;

        vm.loginService = LoginService;
        vm.loginService.checkLogin();
        vm.user = vm.loginService.getUser();

        vm.logout = logout;

        function logout() {
            vm.loginService.logout();
            $('form').submit();
        }

        $scope.$watch(vm.loginService.getToken, function(newVal, oldVal) {
            if (newVal && oldVal !== newVal) {
               vm.loginService.setLoginStatus(true);
               vm.loginService.setUserFromToken(newVal);
               vm.user = vm.loginService.getUser();
            }
        });
    }

})();

(function() {
	'use strict';

	angular
		.module('app.login')
		.config(configuration);

	configuration.$inject = ['$stateProvider'];

	function configuration($stateProvider) {
		$stateProvider
			.state('login', {
				url: '/login:token',
				controller: 'AuthController'
			});
	}

})();
(function() {

    'use strict';

    angular
        .module('app.login')
        .factory('LoginService', LoginService);

    LoginService.$inject = ['jwtHelper', '$localStorage', '$window', 'Config', '$location', '$sce'];

    function LoginService(jwtHelper, $localStorage, $window, Config, $location, $sce) {
    	var
    		user = {},
    		isLogged = false;

        var service = {
        	getUser: getUser,
        	setUserFromToken: setUserFromToken,
        	getLoginStatus: getLoginStatus,
        	setLoginStatus: setLoginStatus,
        	saveToken: saveToken,
        	logout: logout,
        	login: login,
        	getToken: getToken,
        	checkLogin: checkLogin,
            getLogoutUrl: getLogoutUrl
        };

        return service;

        function logout() {
        	delete $localStorage.token;
            setUser({});
            setLoginStatus(false);
        }

        function login() {
        	//TODO extract to config or constants
        	var 
        		loginUrl = 'oauth/authorize?response_type=token&client_id=decisionwanted_client_id&redirect_uri=',
        		returnUrl = $location.absUrl().split('#')[0] + '#/login';

            $window.open(Config.authUrl +
            			 loginUrl + 
            			 encodeURIComponent(returnUrl), 
            			 '_blank', 
            			 'width=600, height=300');
        }

        function saveToken(token) {
        	$localStorage.token = token;
        }

        function getToken() {
        	return $localStorage.token;
        }

        function getUser() {
        	return user;
        }

        function setUser(info) {
        	user = info;
        }

        function setUserFromToken(token) {
        	user = jwtHelper.decodeToken(token);
        }

        function getLoginStatus() {
        	return isLogged;
        }

        function setLoginStatus(status) {
        	isLogged = status;
        }

        function getLogoutUrl() {
            return $sce.trustAsResourceUrl(Config.authUrl + 'logout');
        }

        //TODO add check request
        function checkLogin() {
        	var token = $localStorage.token;
        	if(token) {
        		isLogged = true;
        		setUserFromToken(token);
        	}
        }
    }
})();

(function() {

    'use strict';

    angular
        .module('app.components')
        .component('appFooter', {
            templateUrl: 'app/components/appFooter/app-footer.html'
        });

})();

(function() {

    'use strict';

    angular
        .module('app.components')
        .component('appHeader', {
            templateUrl: 'app/components/appHeader/app-header.html'
        });

})();

(function() {

    'use strict';

    angular
        .module('app.components')
        .controller('PaginatorController', PaginatorController)
        .component('appPaginator', {
            templateUrl: 'app/components/appPaginator/app-paginator.html',
            controller: 'PaginatorController',
            controllerAs: 'vm'
        });

    PaginatorController.$inject = ['DecisionSharedService', 'DecisionNotificationService'];

    function PaginatorController(DecisionSharedService, DecisionNotificationService) {
        var vm = this;

        vm.pagination = DecisionSharedService.filterObject.pagination;
        vm.itemsPerPage = [5, 10, 20, 50, 100];

        vm.changePage = changePage;
        vm.changePageSize = changePageSize;

        function changePage() {
            DecisionNotificationService.notifyPageChanged();
        }

        function changePageSize() {
            DecisionSharedService.filterObject.pagination.pageNumber = 1;
            DecisionNotificationService.notifyPageChanged();
        }
    }

})();

(function() {

    'use strict';

    angular
        .module('app.components')
        .controller('AppListController', AppListController)
        .component('appList', {
            templateUrl: 'app/components/appList/app-list.html',
            bindings: {
                list: '<',
                template: '@'
            },
            controller: 'AppListController',
            controllerAs: 'vm'
        });

    AppListController.$inject = ['DecisionNotificationService', 'DecisionSharedService', 'AppListConstant', '$state'];

    function AppListController(DecisionNotificationService, DecisionSharedService, AppListConstant, $state) {
        var
            vm = this,
            currentList = [],
            currentListWithHeight = [];


        //TODO: create hashmap for saving resized items
        //TODO: refactor later skuzmin
        vm.showPercentage = false;

        vm.$onChanges = onChanges;

        function onChanges() {
            currentList = _.map(vm.list, function(item) {
                return item.decisionId;
            });
            // Create obj with id and el height
            currentListWithHeight = generateList(currentList);
            reRangeList(currentListWithHeight, 0);
            vm.showPercentage = DecisionSharedService.filterObject.selectedCriteria.sortCriteriaIds.length > 0;
        }

        function generateList(arr) {
            var
                el, elHeight,
                arrHeight = [],
                obj = {};

            _.forEach(arr, function(item) {
                el = document.getElementById('decision-' + item);
                elHeight = el.offsetHeight; //not include bottom margin
                obj = {
                    id: item,
                    height: elHeight
                };
                arrHeight.push(obj);
            });

            return arrHeight;
        }

        function sumArrayIndex(arr, index) {
            var sum = 0;
            for (var i = 0; i < index; i++) {
                sum += parseInt(arr[i].height);
            }
            return sum;
        }

        // Move elements under resizeble el
        function reRangeList(currentList, index) {
            var el, elStyle, newTop, currentTop, offset;

            for (var i = 0; i < currentList.length; i++) {
                el = document.getElementById('decision-' + currentList[i].id);
                offset = i * AppListConstant.OFFSET_Y_BOTTOM;
                newTop = sumArrayIndex(currentList, i) + offset + 'px';

                elStyle = window.getComputedStyle(el);
                currentTop = elStyle.getPropertyValue('top');
                if (newTop !== currentTop) {
                    el.style.top = newTop;
                }
            }
        }

        // Resize
        function updateResizeElement(event) {
            if (event.rect.height <= AppListConstant.ELEMENT_HEIGHT) {
                return false;
            }

            var
                target = event.target,
                y = (parseFloat(target.getAttribute('data-y')) || 0);

            target.style.height = event.rect.height + 'px';

            // TODO: avoid jQuery and move only index from current index
            var elIndex = $('#' + target.id).index();

            $('.list-item-sort').addClass('app-stop-animation');

            currentListWithHeight[elIndex].height = event.rect.height;
            reRangeList(currentListWithHeight, elIndex);
        }

        interact('.app-resize-h')
            .resizable({
                preserveAspectRatio: true,
                edges: {
                    left: false,
                    right: false,
                    bottom: true,
                    top: true
                }
            })
            .on('resizemove', updateResizeElement)
            .on('resizeend', function() {
                $('.list-item-sort').removeClass('app-stop-animation');
            });


        // TODO: refactor it, maybe make as new component
        var content = {
                decision: 'app/components/appList/decision-partial.html'
            },
            characteristicGroupNames = [];

        vm.innerTemplate = content.decision; //content[vm.template];

        vm.selectDecision = selectDecision;
        vm.$onChanges = onChanges;
        vm.goToDecision = goToDecision;
        vm.getDetails = getDetails;
        vm.getGroupNameById = getGroupNameById;

        init();


        function getGroupNameById(id) {
            var group = _.find(characteristicGroupNames, function(group) {
                return group.characteristicGroupId.toString() === id;
            });
            return group ? group.name : 'Group';
        }

        // TODO: save loaded data push to vm.displayList?!
        function getDetails(decision) {
            if (!decision.characteristics && !decision.detailsSpinner) {
                DecisionNotificationService.notifyGetDetailedCharacteristics(decision);
            }
        }

        function goToDecision(event, decisionId) {
            event.stopPropagation();
            event.preventDefault();
            $state.go('decision', {
                id: decisionId
            });
        }

        function selectDecision(currentDecision) {
            var prevDecision = _.find(vm.list, function(decision) {
                return decision.isSelected;
            });
            if (!prevDecision) {
                currentDecision.isSelected = true;
                DecisionSharedService.filterObject.selectedDecision.decisionsIds.push(currentDecision.decisionId);
            } else if (prevDecision.decisionId === currentDecision.decisionId) {
                DecisionSharedService.filterObject.selectedDecision.decisionsIds = []; //TODO: use splice
                currentDecision.isSelected = false;
            } else {
                prevDecision.isSelected = false;
                currentDecision.isSelected = true;

                DecisionSharedService.filterObject.selectedDecision.decisionsIds = []; //TODO: use splice
                DecisionSharedService.filterObject.selectedDecision.decisionsIds.push(currentDecision.decisionId);
            }

            DecisionNotificationService.notifySelectDecision(DecisionSharedService.filterObject.selectedDecision.decisionsIds);
            // console.log(DecisionSharedService.filterObject.selectedDecision.decisionsIds);
            // console.log(DecisionSharedService.filterObject);
        }


        function init() {
            DecisionNotificationService.subscribeCharacteristicsGroups(function(event, data) {
                characteristicGroupNames = data;
            });
        }

    }


})();
(function() {

    'use strict';

    angular
        .module('app.components')
        .constant('AppListConstant', {
            OFFSET_Y_BOTTOM : 10,
            ELEMENT_HEIGHT : 80
        });
})();
(function() {

    'use strict';

    angular
        .module('app.components')
        .controller('CriteriaCoefficientIndicatorController', CriteriaCoefficientIndicatorController)
        .component('criteriaCoefficientIndicator', {
            templateUrl: 'app/components/criteriaCoefficientIndicator/criteria-coefficient-indicator.html',
            bindings: {
                coefficient: '='
            },
            controller: 'CriteriaCoefficientIndicatorController',
            controllerAs: 'vm'
        });


    CriteriaCoefficientIndicatorController.$inject = ['DecisionCriteriaConstant'];

    function CriteriaCoefficientIndicatorController(DecisionCriteriaConstant) {
        var vm = this;

        vm.$doCheck = doCheck;

        init();

        function setCoefficientIndicator(coefficient) {
            if (!coefficient) return;
            // set color of indicator
            _.forEach(vm.coefficientList, function(c) {
                c.class = '';
                if(c.value <= coefficient.value) {
                    c.class = coefficient.name.toLowerCase();
                }
            });
        }

        function init() {
            if(!vm.coefficient) {
                vm.coefficient = DecisionCriteriaConstant.coefficientDefault;
            }
            vm.coefficientList = angular.copy(DecisionCriteriaConstant.coefficientList);
        }

        function doCheck() {
            setCoefficientIndicator(vm.coefficient);
        }
    }
})();

(function() {

    'use strict';

    angular
        .module('app.components')
        .controller('DecisionCharacteristicsController', DecisionCharacteristicsController)
        .component('decisionCharacteristics', {
            templateUrl: 'app/components/decisionCharacteristics/decision-characteristics.html',
            bindings: {
                decisionId: '='
            },
            controller: 'DecisionCharacteristicsController',
            controllerAs: 'vm'
        });

    DecisionCharacteristicsController.$inject = ['DecisionDataService', 'DecisionNotificationService'];

    function DecisionCharacteristicsController(DecisionDataService, DecisionNotificationService) {
        var
            vm = this,
            controls = {
                CHECKBOX: '',
                SLIDER: '',
                SELECT: 'app/components/decisionCharacteristics/decision-characteristics-select-partial.html',
                RADIOGROUP: '',
                YEARPICKER: 'app/components/decisionCharacteristics/decision-characteristics-yearpicker-partial.html'
            };

        vm.characteristicGroups = [];
        vm.sorterList = [];

        vm.getControl = getControl;
        vm.selectCharacteristic = selectCharacteristic;

        init();

        function selectCharacteristic(characteristic) {
            DecisionNotificationService.notifySelectCharacteristic(characteristic);
        }

        function getControl(characteristic) {
            return controls[characteristic.visualMode];
        }

        function prepareCharacteristicsToDisplay(data) {
            vm.characteristicGroups = data;
            _.forEach(vm.characteristicGroups, function(group) {
                _.forEachRight(group.characteristics, function(characteristic, index) {
                    if (characteristic.sortable) {
                        vm.sorterList.push(characteristic);
                    }
                    if (!characteristic.filterable) {
                        group.characteristics.splice(index, 1);
                    }
                });
            });
            DecisionNotificationService.notifyInitSorter({
                list: vm.sorterList,
                type: 'sortByCharacteristic',
                mode: 'threeStep'
            });
        }

        function init() {
            vm.characteristicSpinner = true;
            DecisionDataService.getCharacteristictsGroupsById(vm.decisionId).then(function(result) {
                var temp;
                var characteristicGroupNames = _.map(result, function(group) {
                    return {
                        characteristicGroupId: group.characteristicGroupId,
                        name: group.name
                    };
                });
                DecisionNotificationService.notifyCharacteristicsGroups(characteristicGroupNames);
                prepareCharacteristicsToDisplay(result);
            }).finally(function() {
                if (vm.characteristicGroups.length > 0) {
                    vm.characteristicGroups[0].isOpen = true;
                }
                vm.characteristicSpinner = false;
            });
        }
    }
})();

(function() {

    'use strict';

    angular
        .module('app.components')
        .controller('CriteriaCoefficientPopupController', CriteriaCoefficientPopupController);

    CriteriaCoefficientPopupController.$inject = ['$uibModalInstance', 'criteria', 'DecisionCriteriaConstant'];

    function CriteriaCoefficientPopupController($uibModalInstance, criteria, DecisionCriteriaConstant) {
        var vm = this;

        vm.apply = apply;
        vm.close = close;

        init();

        function apply() {
            $uibModalInstance.close(vm.criteria);
        }

        function close() {
            $uibModalInstance.dismiss();
        }

        function init() {
            vm.criteria = angular.copy(criteria);
            vm.coefficientList = DecisionCriteriaConstant.coefficientList;
        }
    }
})();

(function() {

    'use strict';

    angular
        .module('app.components')
        .controller('DecisionCriteriaController', DecisionCriteriaController)
        .component('decisionCriteria', {
            templateUrl: 'app/components/decisionCriteria/decision-criteria.html',
            bindings: {
                decisionId: '='
            },
            controller: 'DecisionCriteriaController',
            controllerAs: 'vm'
        });

    DecisionCriteriaController.$inject = ['$uibModal', 'DecisionDataService', 'DecisionNotificationService', 'DecisionSharedService', 'DecisionCriteriaConstant'];

    function DecisionCriteriaController($uibModal, DecisionDataService, DecisionNotificationService, DecisionSharedService, DecisionCriteriaConstant) {
        var
            vm = this,
            _fo = DecisionSharedService.filterObject.selectedCriteria;

        vm.criteriaGroups = [];

        vm.showRating = false;

        vm.$onChanges = onChanges;

        vm.editCriteriaCoefficient = editCriteriaCoefficient;
        vm.selectCriterion = selectCriterion;

        init();

        function onChanges() {
            vm.showRating = DecisionSharedService.filterObject.selectedDecision.decisionsIds.length > 0;
        }

        function selectCriterion(criterion, coefCall) {
            if (coefCall && !criterion.isSelected) {
                return;
            }
            if (!coefCall) {
                criterion.isSelected = !criterion.isSelected;
            }
            formDataForSearchRequest(criterion, coefCall);
            DecisionDataService.searchDecision(vm.decisionId, DecisionSharedService.getFilterObject()).then(function(result) {
                DecisionNotificationService.notifySelectCriterion(result.decisions);
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

        function editCriteriaCoefficient(event, criteria) {
            event.preventDefault();
            event.stopPropagation();
            var modalInstance = $uibModal.open({
                templateUrl: 'app/components/decisionCriteria/criteria-coefficient-popup.html',
                controller: 'CriteriaCoefficientPopupController',
                controllerAs: 'vm',
                backdrop: 'static',
                resolve: {
                    criteria: function() {
                        return criteria;
                    }
                }
            });

            modalInstance.result.then(function(result) {
                var groupIndex = _.findIndex(vm.criteriaGroups, {
                    criterionGroupId: result.criterionGroupId
                });
                var criteriaIndex = _.findIndex(vm.criteriaGroups[groupIndex].criteria, {
                    criterionId: result.criterionId
                });
                vm.criteriaGroups[groupIndex].criteria[criteriaIndex] = result;
                selectCriterion(result, true);
            });
        }

        function init() {
            var criteriaGroupsCopy = [];
            vm.criteriaSpinner = true;
            DecisionDataService.getCriteriaGroupsById(vm.decisionId).then(function(result) {
                vm.criteriaGroups = result;
                criteriaGroupsCopy = angular.copy(vm.criteriaGroups);
            }).finally(function() {
                vm.criteriaSpinner = false;
                if (vm.criteriaGroups.length > 0) {
                    vm.criteriaGroups[0].isOpen = true;
                }
            });


            // TODO: need to refactor
            //Subscribe to notification events
            DecisionNotificationService.subscribeSelectDecision(function(event, data) {
                var criterionId,
                    criteriaGroupsRating = [];

                vm.showRating = data.length;
                criterionId = data[0];


                if (!_.isEmpty(data)) {
                    DecisionDataService.getCriteriaByDecision(criterionId, vm.decisionId).then(function(result) {
                        criteriaGroupsRating = result;
                        if(!criteriaGroupsRating || _.isEmpty(result)) return;

                        // TODO: Optimize find deep and replace, make for all criteria groups!

                        // Set null rating
                        _.map(vm.criteriaGroups[0].criteria, function(criteria, index) {
                            vm.criteriaGroups[0].criteria[index].weight = null;
                            vm.criteriaGroups[0].criteria[index].totalVotes = null;
                        });

                        // Update rating
                        _.map(criteriaGroupsRating, function(criteriaRating, itemIndex) {
                            _.map(vm.criteriaGroups[0].criteria, function(criteria, index) { //Include all group
                                if (criteriaRating.criterionId === criteria.criterionId) {
                                    vm.criteriaGroups[0].criteria[index].weight = criteriaRating.weight; //Set only rating weight
                                    vm.criteriaGroups[0].criteria[index].totalVotes = criteriaRating.totalVotes;
                                }
                            });
                        });



                    }).finally(function() {
                        if (vm.criteriaGroups.length > 0) {
                            vm.criteriaGroups[0].isOpen = true;
                        }
                    });
                } else {
                    // vm.criteriaGroups = criteriaGroupsCopy;
                }

            });
        }
    }
})();
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

(function() {

    'use strict';

    angular
        .module('app.components')
        .directive('decisionSorter', decisionSorter);

    function decisionSorter() {
        var directive = {
            restrict: 'E',
            replace: 'true',
            templateUrl: 'app/components/decisionSorter/decision-sorter.html',
            scope: {
                sortType: '@'
            },
            link: link
        };

        return directive;

        function link(scope, elem, attrs) {
            //subscribe on init sorter event
            var
                sorterListener = scope.$on('initSorter', function(event, data) {
                    if (scope.sortType === data.type) {
                        scope.mode = data.mode;
                        scope.sorters = data.list;
                    }
                    scope.$on('$destroy', function() {
                        sorterListener();
                    });
                }),
                order,
                sortObj;

            scope.selectSorter = function(sorter) {
                //clear all sorting orders
                order = sorter.order;
                sortObj = {
                    sort: {id: null, order: null},
                    mode: ''
                };
                _.forEach(scope.sorters, function(s) {
                    s.order = '';
                });
                //set correct sort order for sorter button
                if (order === 'DESC') {
                    sorter.order = 'ASC';
                } else if (order === 'ASC' && scope.mode === 'threeStep') {
                    sorter.order = null;
                } else {
                    sorter.order = 'DESC';
                }
                //set sortObj data for sorting request
                if(sorter.order) {
                    sortObj.sort.id = sorter.characteristicId || sorter.propertyId;
                    sortObj.sort.order = sorter.order;
                }
                sortObj.mode = scope.sortType;

                scope.$emit('selectSorter', sortObj);
            };

        }
    }

})();

(function() {

    'use strict';

    angular
        .module('app.components')
        .controller('RatingStarController', RatingStarController)
        .component('ratingStar', {
            templateUrl: 'app/components/ratingStar/rating-star.html',
            bindings: {
                value: '<',
                totalVotes: '<'
            },
            controller: 'RatingStarController',
            controllerAs: 'vm'
        });

    RatingStarController.$inject = ['AppRatingStarConstant'];

    function RatingStarController(AppRatingStarConstant) {
        var
            vm = this,
            value;

        vm.$onChanges = onChanges;
        vm.showRating = true;

        function onChanges() {
            if (vm.value) value = vm.value.toString();
            vm.rating = value;

            // calc default rating widthout %
            if (value && value.indexOf('%') === -1) {
                vm.rating = parseFloat(vm.value) / AppRatingStarConstant.MAX_RATING * 100 + '%' || 0;
                vm.value = vm.value || 0;
                vm.showRating = parseInt(vm.value) > 0;
            }
        }

        init();

        function init() {

        }
    }
})();
(function() {

    'use strict';

    angular
        .module('app.components')
        .constant('AppRatingStarConstant', {
            MAX_RATING : 5,
        });
})();
(function() {

    'use strict';

    angular
        .module('app.components')
        .directive('resizer', resizer);

    function resizer() {
        var directive = {
            restrict: 'A',
            link: link
        };

        return directive;

        function link($scope, $el, $attrs) {

            // TODO: fix horizontal resize limit
            function updateResizeElement(event) {
                var
                    target = event.target,
                    x = (parseFloat(target.getAttribute('data-x')) || 0),
                    el, elMax, elMin,
                    elW, elLeft,
                    elNext, elNextW, elNextLeft,
                    totalWidth;

                el = $(target);

                // Limit
                elMax = el.attr('resizer-max') || 1900;
                elMin = el.attr('resizer-min') || 220; //Min width for panel

                if (event.rect.width <= elMin || event.rect.width >= elMax) {
                    return;
                }

                elW = el.outerWidth();
                elLeft = el.position();

                elNext = $(el.attr('resizer-right'));
                elNextW = elNext.outerWidth();
                elNextLeft = elNext.position();

                totalWidth = elW + elNextW;

                if(totalWidth - event.rect.width - 220 < 0) return;

                // Current element
                el.css({
                    left: elLeft.left,
                    width: event.rect.width + 'px'
                });

                // Next element
                elNext.css({
                    left: elLeft.left + event.rect.width + 'px',
                    width: totalWidth - event.rect.width + 'px'
                });
            }

            interact('.app-resizer-horizontal')
                .resizable({
                    preserveAspectRatio: true,
                    edges: {
                        left: false,
                        right: true,
                        bottom: false,
                        top: true
                    }
                })
                .on('resizemove', updateResizeElement);
        }
    }

})();

angular.module('app.core').run(['$templateCache', function($templateCache) {$templateCache.put('app/core/404.html','<div class=container><div class=app-content><div class=header-text><h1>Error 404</h1><h3>Page Not Found!</h3><a ui-sref=home>Home</a></div></div></div>');
$templateCache.put('app/decision/decision.html','<div class=decision><div class="row top-panel"><div class="col-md-4 col-sm-4"><h4 class=app-header-sub-title>{{vm.decision.name}}</h4></div><div class="col-md-5 col-sm-5"><div class=row ng-show=vm.parentDecisions><div class="col-sm-3 col-md-2"><div class=top-panel-label><label for=decision-parent class=control-label>Parents:</label></div></div><div class="col-sm-5 col-md-6"><div class="input-group top-panel-title"><select id=decision-parent ng-model=vm.parentId class="form-control input-sm" ng-options="parent for parent in vm.parentDecisions"><option value selected>Select parentId</option></select><span class=input-group-btn><a href class="btn btn-default btn-sm" ui-sref="decision({id: vm.parentId})" ng-disabled=!vm.parentId>Go</a></span></div></div></div></div><div class="col-md-3 col-sm-3"><input class="form-control search-input" type=text> <span class="glyphicon glyphicon-search search-input-icon"></span></div></div><div class="app-main-panel main-panel"><div id=panel-left class="app-panel-left app-resizer-horizontal" resizer-right=#panel-center resizer><decision-criteria decision-id=vm.decisionId></decision-criteria><span class=app-resizer></span></div><div id=panel-center class="app-panel-center app-resizer-horizontal" resizer-right=#panel-right resizer><div class="decisions-header scroll-wrapper-header"><div class=col-md-2><h4>Decisions</h4></div><div class="col-md-8 col-sm-padding"><decision-sorter sort-type=sortByCriteria></decision-sorter><decision-sorter sort-type=sortByCharacteristic></decision-sorter><decision-sorter sort-type=sortByDecisionProperty></decision-sorter></div><div class="col-md-2 col-sm-padding"><a href class="btn add-createria-btn"><span class="glyphicon glyphicon-plus" aria-hidden=true></span>Add decision</a></div></div><div class=scroll-wrapper><h1 ng-show=vm.decisionsSpinner class=app-loader-small><span class="glyphicon glyphicon-refresh app-loader-animation"></span>LOADING...</h1><app-paginator></app-paginator><app-list list=vm.decisionsList></app-list></div><span class=app-resizer></span></div><div id=panel-right class=app-panel-right><decision-characteristics decision-id=vm.decisionId></decision-characteristics></div></div></div>');
$templateCache.put('app/desicionMatrix/decision-matrix.html','<div class="decision matrix"><div class="main-panel matrix-table js-matrix-table"><div id=panel class=app-panel><div class="decisions-header scroll-wrapper-header"><div class=matrix-table-header><div class=matrix-table-row><div class=matrix-table-col><div class=matrix-table-title>ID</div></div><div class=matrix-table-col><div class=matrix-table-title>Title</div></div><div class=matrix-table-col><div class=matrix-table-title>Company</div></div><div class=matrix-table-col><div class=matrix-table-title>Original author/s</div></div><div class=matrix-table-col><div class=matrix-table-title>OPSWAT</div></div><div class=matrix-table-col><div class=matrix-table-title>Price</div></div><div class=matrix-table-col><div class=matrix-table-title>License</div></div><div class=matrix-table-col><div class=matrix-table-title>First release</div></div><div class=matrix-table-col><div class=matrix-table-title>Country</div></div><div class=matrix-table-col><div class=matrix-table-title>Notes</div></div></div></div></div><div class=scroll-wrapper><div ng-show=vm.decisionsSpinner class=app-loader-small><span class="glyphicon glyphicon-refresh app-loader-animation"></span>LOADING...</div><div class><div class=matrix-table-content><div class=matrix-table-item><div class="matrix-table-row with-border"><div class=matrix-table-col>4487</div><div class=matrix-table-col>Zemana Antilogger and Antimalware</div><div class=matrix-table-col>Zemana</div><div class=matrix-table-col>Not set</div><div class=matrix-table-col>Not set</div><div class=matrix-table-col>Trialware</div><div class=matrix-table-col>Proprietary</div><div class=matrix-table-col>Not set</div><div class=matrix-table-col>Turkey</div><div class=matrix-table-col>Not set</div></div></div><div class=matrix-table-item><div class="matrix-table-row with-border"><div class=matrix-table-col>4487</div><div class=matrix-table-col>Zemana Antilogger and Antimalware</div><div class=matrix-table-col>Zemana</div><div class=matrix-table-col>Not set</div><div class=matrix-table-col>Not set</div><div class=matrix-table-col>Trialware</div><div class=matrix-table-col>Proprietary</div><div class=matrix-table-col>Not set</div><div class=matrix-table-col>Turkey</div><div class=matrix-table-col>Not set</div></div></div><div class=matrix-table-item><div class=matrix-table-row><div class=matrix-table-col>4487</div><div class=matrix-table-col>Zemana Antilogger and Antimalware</div><div class=matrix-table-col>Zemana</div><div class=matrix-table-col>Not set</div><div class=matrix-table-col>Not set</div><div class=matrix-table-col>Trialware</div><div class=matrix-table-col>Proprietary</div><div class=matrix-table-col>Not set</div><div class=matrix-table-col>Turkey</div><div class=matrix-table-col>Not set</div></div></div><div class=matrix-table-item><div class=matrix-table-row><div class=matrix-table-col>4487</div><div class=matrix-table-col>Zemana Antilogger and Antimalware</div><div class=matrix-table-col>Zemana</div><div class=matrix-table-col>Not set</div><div class=matrix-table-col>Not set</div><div class=matrix-table-col>Trialware</div><div class=matrix-table-col>Proprietary</div><div class=matrix-table-col>Not set</div><div class=matrix-table-col>Turkey</div><div class=matrix-table-col>Not set</div></div></div><div class=matrix-table-item><div class=matrix-table-row><div class=matrix-table-col>4487</div><div class=matrix-table-col>Zemana Antilogger and Antimalware</div><div class=matrix-table-col>Zemana</div><div class=matrix-table-col>Not set</div><div class=matrix-table-col>Not set</div><div class=matrix-table-col>Trialware</div><div class=matrix-table-col>Proprietary</div><div class=matrix-table-col>Not set</div><div class=matrix-table-col>Turkey</div><div class=matrix-table-col>Not set</div></div></div><div class=matrix-table-item><div class=matrix-table-row><div class=matrix-table-col>4487</div><div class=matrix-table-col>Zemana Antilogger and Antimalware</div><div class=matrix-table-col>Zemana</div><div class=matrix-table-col>Not set</div><div class=matrix-table-col>Not set</div><div class=matrix-table-col>Trialware</div><div class=matrix-table-col>Proprietary</div><div class=matrix-table-col>Not set</div><div class=matrix-table-col>Turkey</div><div class=matrix-table-col>Not set</div></div></div><div class=matrix-table-item><div class=matrix-table-row><div class=matrix-table-col>4487</div><div class=matrix-table-col>Zemana Antilogger and Antimalware</div><div class=matrix-table-col>Zemana</div><div class=matrix-table-col>Not set</div><div class=matrix-table-col>Not set</div><div class=matrix-table-col>Trialware</div><div class=matrix-table-col>Proprietary</div><div class=matrix-table-col>Not set</div><div class=matrix-table-col>Turkey</div><div class=matrix-table-col>Not set</div></div></div><div class=matrix-table-item><div class=matrix-table-row><div class=matrix-table-col>4487</div><div class=matrix-table-col>Zemana Antilogger and Antimalware</div><div class=matrix-table-col>Zemana</div><div class=matrix-table-col>Not set</div><div class=matrix-table-col>Not set</div><div class=matrix-table-col>Trialware</div><div class=matrix-table-col>Proprietary</div><div class=matrix-table-col>Not set</div><div class=matrix-table-col>Turkey</div><div class=matrix-table-col>Not set</div></div></div></div></div></div></div></div></div>');
$templateCache.put('app/home/home.html','<div class=home><div class="row search-box"><div class="col-md-offset-2 col-md-6"><input class=form-control type=text ng-model=vm.searchText></div><div class=col-md-4><a href class="btn btn-default" ng-click=vm.search()>Search</a></div></div><div class="row search-results" ng-show=vm.showTrigger><div class="col-md-offset-2 col-md-8 col-md-offset-2">RESULTS for {{vm.searchText}}</div><div class="col-md-offset-2 col-md-8 col-md-offset-2"><a href ui-sref="decision({id: vm.searchText || 2512})">DECISION</a></div></div></div>');
$templateCache.put('app/login/login.html','<div class="login-btn pull-right"><div ng-if=vm.loginService.getLoginStatus()><label>Username:</label> <span>{{vm.user.user_name}}</span></div><ul class="nav navbar-nav"><li><a ng-if=!vm.loginService.getLoginStatus() ng-click=vm.loginService.login()>Login</a></li><li><form ng-if=vm.loginService.getLoginStatus() name=logoutForm action={{vm.loginService.getLogoutUrl()}} method=POST novalidate><a href class="btn btn-default" ng-click=vm.logout()>Logout</a></form></li></ul></div>');
$templateCache.put('app/components/appFooter/app-footer.html','<footer class=app-footer><div class="app-footer-info text-center">&copy; DecisionWanted - 2017</div></footer>');
$templateCache.put('app/components/appHeader/app-header.html','<header class=app-header><div class=row><div class="col-md-3 header-menu-btn"><div class=navbar-brand><a ui-sref=home>DecisionWanted</a></div></div><div class="col-md-6 text-center"><span class=header-text>Millions of lemmings can\'t be wrong!</span></div><div class="col-md-3 header-login"><app-login></app-login></div></div></header>');
$templateCache.put('app/components/appList/app-list.html','<div class=app-list-wrapper><div class=app-list-container><div id="decision-{{ item.decisionId }}" ng-repeat="item in vm.list track by item.decisionId" class="list-item-sort app-resize-h" ng-class="{\'selected\' : item.isSelected, \'item-loading\' : data.detailsSpinner}" ng-mouseover="vm.getDetails(item, $event)"><div class=list-item-sort-content ng-click=vm.selectDecision(item)><strong>{{ item.decisionId }}</strong><div class="pull-right text-right" ng-show=vm.showPercentage><h5>Criteria compliance:<rating-star class=text-left value=item.criteriaCompliancePercentage total-votes=item.totalVotes ng-show=item.criteriaCompliancePercentage></rating-star></h5></div><h4 class=list-item-sort-title><a href ng-click="vm.goToDecision($event, item.decisionId)">{{item.name}}</a></h4><div class=list-item-sort-detail-wrapper><div class=app-loader-small ng-show=item.detailsSpinner><span class="glyphicon glyphicon-refresh app-loader-animation"></span>LOADING...</div><ng-include src=vm.innerTemplate></ng-include></div></div></div></div></div>');
$templateCache.put('app/components/appList/decision-partial.html','<div class=list-item-sort-details><div class=decision-detailed-chars><div ng-if=item.characteristics><h4>Characteristics</h4><div ng-repeat="(key, value) in item.characteristics track by key"><div class=chars-group-name><label>{{vm.getGroupNameById(key)}}</label></div><div class=app-row-content ng-repeat="characteristic in value track by $index"><div class=app-row-content-label>{{characteristic.name}}:</div><span ng-show=characteristic.value>{{characteristic.value}}</span> <span ng-show=!characteristic.value class=not-set>Not set</span></div></div></div></div></div>');
$templateCache.put('app/components/appPaginator/app-paginator.html','<div class="row app-pagination"><div class="col-md-10 col-sm-10 paginator"><div uib-pagination ng-model=vm.pagination.pageNumber boundary-links=true boundary-link-numbers=true total-items=vm.pagination.totalDecisions items-per-page=vm.pagination.pageSize ng-change=vm.changePage() class=pagination-sm previous-text=&lsaquo; next-text=&rsaquo; first-text=&laquo; last-text=&raquo;></div></div><div class="col-md-2 col-sm-2 counter"><select class="pagination form-control input-sm" ng-model=vm.pagination.pageSize ng-options="item for item in vm.itemsPerPage" ng-change=vm.changePageSize()></select></div></div>');
$templateCache.put('app/components/criteriaCoefficientIndicator/criteria-coefficient-indicator.html','<div class=criteria-coefficient-indicator><div class=criteria-coefficient-item ng-repeat="coefficient in vm.coefficientList | orderBy: \'value\' : true" ng-class=coefficient.class></div></div>');
$templateCache.put('app/components/decisionCharacteristics/decision-characteristics-select-partial.html','<select class="decision-select form-control" ng-model=characteristic.filterValue ng-options="item as item.name for item in characteristic.options" ng-change=vm.selectCharacteristic(characteristic.filterValue)><option value selected>Select all</option></select>');
$templateCache.put('app/components/decisionCharacteristics/decision-characteristics-yearpicker-partial.html','<div class="input-group decision-yearpicker"><input type=text class=form-control uib-datepicker-popup=yyyy is-open=characteristic.isOpen ng-model=characteristic.filterValue datepicker-mode=year datepicker-options="{minMode: \'year\'}" placeholder=YEAR ng-change=vm.selectCharacteristic(characteristic.filterValue)> <span class=input-group-btn><button type=button class="btn btn-default" ng-click="characteristic.isOpen = true"><i class="glyphicon glyphicon-calendar"></i></button></span></div>');
$templateCache.put('app/components/decisionCharacteristics/decision-characteristics.html','<div class=decision-characteristics><div class="char-header scroll-wrapper-header"><div class="col-md-6 col-sm-6"><h4>Characteristics</h4></div><div class="col-md-6 col-sm-6"><a href class="btn add-createria-btn"><span class="glyphicon glyphicon-plus" aria-hidden=true></span>Add characteristic</a></div></div><div class=scroll-wrapper><div class=app-loader-small ng-show=vm.characteristicSpinner>LOADING...</div><uib-accordion close-others=false><div uib-accordion-group class=panel-default ng-repeat="group in vm.characteristicGroups track by $index" is-open=group.isOpen><uib-accordion-heading>{{group.name}} <i class="pull-right glyphicon glyphicon-chevron-right"></i></uib-accordion-heading><div class="row criteria-item" ng-repeat="characteristic in group.characteristics track by $index"><div class=col-md-6>{{characteristic.name}}</div><div class=col-md-6><ng-include src=vm.getControl(characteristic)></ng-include></div></div></div></uib-accordion></div></div>');
$templateCache.put('app/components/decisionCriteria/criteria-coefficient-popup.html','<div class=criteria-coefficient-popup><div class=modal-header><h4>Choose Criterion Factor of Importance</h4><button type=button class=close data-dismiss=modal aria-hidden=true ng-click=vm.close()>\xD7</button></div><div class=modal-body><form class=form-horizontal name=criteriaCoefficientForm ng-submit=vm.apply()><div class="row form-group"><div class="col-md-6 col-sm-6"><label class=control-label>Criterion name:</label></div><div class="col-md-6 col-sm-6">{{vm.criteria.name}}</div></div><div class="row form-group"><div class="col-md-6 col-sm-6"><label class=control-label>Factor of Importance:</label></div><div class="col-md-6 col-sm-6"><select class=form-control ng-model=vm.criteria.coefficient ng-options="coefficient as coefficient.name for coefficient in vm.coefficientList track by coefficient.value"></select></div></div><div class="form-group row"><div class=col-sm-12><button class="btn btn-default btn-primary pull-right" type=submit>Apply</button></div></div></form></div></div>');
$templateCache.put('app/components/decisionCriteria/decision-criteria.html','<div class=decision-criteria><div class="criteria-header scroll-wrapper-header"><div class="col-md-6 col-sm-6"><h4>Criteria</h4></div><div class="col-md-6 col-sm-6"><a href class="btn add-createria-btn"><span class="glyphicon glyphicon-plus" aria-hidden=true></span>Add criterion</a></div></div><div class=scroll-wrapper><div class=app-loader-small ng-show=vm.criteriaSpinner><span class="glyphicon glyphicon-refresh app-loader-animation"></span>LOADING...</div><uib-accordion close-others=false><div uib-accordion-group class="panel-default criteria-panel" ng-repeat="group in vm.criteriaGroups track by $index" is-open=group.isOpen><uib-accordion-heading>{{group.name}} <i class="pull-right glyphicon glyphicon-chevron-right"></i></uib-accordion-heading><div class=criteria-item ng-repeat="criterion in group.criteria track by $index" ng-click=vm.selectCriterion(criterion) ng-class="{\'selected\' : criterion.isSelected}"><div class=criteria-item-left>{{criterion.criterionId}} {{criterion.name}}<rating-star value=criterion.weight total-votes=criterion.totalVotes ng-show=criterion.weight></rating-star></div><div class=criteria-item-right><button class="btn btn-default pull-right" ng-click="vm.editCriteriaCoefficient($event, criterion)"><criteria-coefficient-indicator coefficient=criterion.coefficient></criteria-coefficient-indicator></button></div></div></div></uib-accordion></div></div>');
$templateCache.put('app/components/decisionSorter/decision-sorter.html','<ul class="btn-group btn-group-sm decision-sorter"><li class="btn btn-default" ng-repeat="sorter in sorters track by $index" ng-click=selectSorter(sorter) ng-class="{\'selected btn-primary\': sorter.order}"><span>{{sorter.name}}</span> <span ng-show="sorter.order === \'DESC\'" class="glyphicon glyphicon-sort-by-attributes-alt" aria-hidden=true></span> <span ng-show="sorter.order === \'ASC\'" class="glyphicon glyphicon-sort-by-attributes" aria-hidden=true></span></li></ul>');
$templateCache.put('app/components/ratingStar/rating-star.html','<div class=app-rating-star-wrapper ng-if=vm.showRating><div class=app-rating-star><span class=bar style="width: {{vm.rating}}"></span></div><span>{{vm.value}}</span><span ng-if=vm.totalVotes>({{vm.totalVotes}})</span> <a ng-if=!vm.totalVotes href>Rate it first</a></div>');}]);