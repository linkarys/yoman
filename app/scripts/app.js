'use strict';

var uud = angular.module('mainApp', [
	'ivpusic.cookie',
	'restangular',
	'ui.router',
	'ui.select',
	'angular-loading-bar',
	'angular-md5'
])

.config([
	'$stateProvider',
	'$urlRouterProvider',
	'$httpProvider',
	'cfpLoadingBarProvider',
	'RestangularProvider',
function($stateProvider, $urlRouterProvider, $httpProvider, cfpLoadingBarProvider, RestangularProvider) {

	/////////////////////////////
	// Redirects and Otherwise //
	/////////////////////////////

	$urlRouterProvider

	// The `when` method says if the url is ever the 1st param, then redirect to the 2nd param
	// Here we are just setting up some convenience urls.
	.when('/', '/home')
	.when('/customer', '/customer/checkorder')
	.when('/service', '/service/ordermanager')
	.when('/financial', '/financial/deposit')
	// .when('/agents', '/agents/list')

	.otherwise('/');

	$httpProvider.defaults.headers.common['Requested-By'] = 'uu-dragon-app';

	// 拦截器
	$httpProvider.interceptors.push(['$q', '$location', '$rootScope', '$injector', '$timeout', function($q, $location, $rootScope, $injector, $timeout) {
		return {
			'request': function(config) {
				return config;
			},
			'response': function(resp) {
				// try {
				// 	var errorCode = resp.data.split(':')[0];
				// 	if (errorCode == 'E_00201') {
				// 		$rootScope.$broadcast('auth:invalid', res);
				// 		return $q.reject(res);
				// 	}
				// } catch(e) {}

				// token过期信息
				if (resp.config.url === (config.auth.baseurl + config.auth.resource) && resp.status === 204) {
					$timeout(function(){
						$rootScope.$broadcast('auth:invalid', resp);
					}, 100);
					return $q.reject(resp);
				} else {
					return resp;
				}

			},
			'responseError': function(response) {
				if(response.status === 401 || response.status === 403) {
					// token is outdate or request for resource beyond the privilege of current user.
					$rootScope.$broadcast('auth:invalid', response);
				}
				return $q.reject(response);
			}
		};
	}]);


	////////////////////////////////
	// Restangular Configurations //
	////////////////////////////////

	RestangularProvider.setBaseUrl(config.basews);

	RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
		var extractedData;
		// to look for getList operations
		if (operation === 'getList' && !angular.isArray(data)) {
			// handle the data and meta data
			extractedData = data.records;
			extractedData.meta = {
				pageSize: data.pageSize,
				pageNo: data.pageNo ? data.pageNo : 1,
				recordsCount: data.recordsCount,
				pageNumber: data.pageNumber
			};
		} else {
			extractedData = data;
		}

		if (extractedData instanceof Object) extractedData.finished = true;

		// console.log(extractedData);
		return extractedData;
	});


	//////////////////////////
	// State Configurations //
	//////////////////////////

	$stateProvider

	.state('root', {
		url: '/',
		templateUrl: 'views/layout.html',
		controller: 'MainCtrl'
	})

	.state('login', {
		url: '/login',
		templateUrl: 'views/login.html',
		controller: 'AuthCtrl'
	})

	.state('root.home', {
		url: 'home',
		templateUrl: 'views/home.html',
		controller: 'HomeCtrl'
	})


	/////////////
	// 客户服务 //
	/////////////

	.state('root.customer', {
		url: 'customer',
		templateUrl: 'views/customer/layout.html',
		controller: 'CustomerServiceCtrl'
	})
	.state('root.customer.checkorder', {
		url: '/checkorder',
		templateUrl: 'views/customer/checkorder.html',
		controller: 'CheckOrder'
	})
	// .state('root.customer.shipment', {
	// 	url: '/shipment',
	// 	templateUrl: 'views/customer/shipment.html',
	// 	controller: 'Shipment'
	// })
	.state('root.customer.splitorder', {
		url: '/splitorder',
		templateUrl: 'views/customer/splitorder.html',
		controller: 'SplitOrder'
	})
	.state('root.customer.firstbuy', {
		url: '/firstbuy',
		templateUrl: 'views/customer/firstbuy.html',
		controller: 'Firstbuy'
	})
	.state('root.customer.complaints', {
		url: '/complaints',
		templateUrl: 'views/customer/complaints.html',
		controller: 'Complains'
	})
	.state('root.customer.return', {
		url: '/return',
		templateUrl: 'views/customer/return.html',
		controller: 'Return'
	})
	.state('root.customer.exchange', {
		url: '/exchange',
		templateUrl: 'views/customer/exchange.html',
		controller: 'Exchange'
	})
	.state('root.customer.customers', {
		url: '/customer-pool',
		templateUrl: 'views/customer/customerpool.html',
		controller: 'CustomerPool'
	})


	/////////////
	// 客户管理 //
	/////////////

	.state('root.customerManager', {
		url: 'manager',
		templateUrl: 'views/manager/layout.html',
		controller: 'CustomerManagerCtrl'
	})
	.state('root.customerManager.employee', {
		url: '/employee',
		templateUrl: 'views/manager/employee.html',
		controller: 'Employee'
	})
	.state('root.customerManager.online', {
		url: '/online',
		templateUrl: 'views/manager/online.html',
		controller: 'Online'
	})
	.state('root.customerManager.phone', {
		url: '/phone',
		templateUrl: 'views/manager/phone.html',
		controller: 'Phone'
	})
	.state('root.customerManager.info', {
		url: '/info',
		templateUrl: 'views/manager/info.html',
		controller: 'Info'
	})


	/////////////
	// 数据管理 //
	/////////////

	.state('root.data', {
		url: 'data',
		templateUrl: 'views/data/layout.html',
		controller: 'DataCtrl'
	})
	.state('root.data.ordermanager', {
		url: '/ordermanager',
		templateUrl: 'views/data/ordermanager.html',
		controller: 'OrderManag'
	})
	.state('root.data.work', {
		url: '/work',
		templateUrl: 'views/data/work.html',
		controller: 'Work'
	})
	.state('root.data.inventory', {
		url: '/inventory',
		templateUrl: 'views/data/inventory.html',
		controller: 'Inventory'
	})
	.state('root.data.statistics', {
		url: '/statistics',
		templateUrl: 'views/data/statistics.html',
		controller: 'Statistics'
	})


	///////////
	// 知识库 //
	///////////

	.state('root.knowledge', {
		url: 'knowledge',
		templateUrl: 'views/knowledge/layout.html',
		controller: 'KnowledgeCtrl'
	})
	.state('root.knowledge.presale', {
		url: '/presale',
		templateUrl: 'views/knowledge/presale.html',
		controller: 'Presale'
	})
	.state('root.knowledge.aftersale', {
		url: '/aftersale',
		templateUrl: 'views/knowledge/aftersale.html',
		controller: 'Aftersale'
	})
	.state('root.knowledge.qa', {
		url: '/qa',
		templateUrl: 'views/knowledge/qa.html',
		controller: 'QA'
	})


	/////////////
	// 隐藏页面 //
	/////////////

	.state('root.utils', {
		url: 'utils',
		templateUrl: 'views/utils/layout.html',
		controller: 'UtilsCtrl'
	})
	.state('root.utils.neworder', {
		url: '/neworder',
		templateUrl: 'views/utils/neworder.html',
		controller: 'NewOrder'
	})
	.state('root.utils.search', {
		url: '/search',
		templateUrl: 'views/utils/search.html',
		controller: 'Search'
	})
	.state('root.utils.message', {
		url: '/notes',
		templateUrl: 'views/utils/notes.html',
		controller: 'Notes'
	})
	.state('root.utils.batchmsg', {
		url: '/batchmsg',
		templateUrl: 'views/utils/batchmsg.html',
		controller: 'Batchmsg'
	})


	/////////////
	// 业务信息 //
	/////////////

	.state('root.product', {
		url: 'product',
		templateUrl: 'views/product/layout.html',
		controller: 'ProductCtrl'
	})
	.state('root.product.commodity', {
		url: '/commodity',
		templateUrl: 'views/product/commodity.html',
		controller: 'Commodity'
	})
	.state('root.product.goods', {
		url: '/goods',
		templateUrl: 'views/product/goods.html',
		controller: 'Goods'
	})
	.state('root.product.suit', {
		url: '/suit',
		templateUrl: 'views/product/suit.html',
		controller: 'Suit'
	})


	/////////////
	// 入库管理 //
	/////////////

	.state('root.commodity', {
		url: 'commodity',
		templateUrl: 'views/commodity/layout.html',
		controller: 'CommodityCtrl'
	})
	.state('root.commodity.stockin', {
		url: '/stockin',
		templateUrl: 'views/commodity/stockin.html',
		controller: 'StockIn'
	})
	.state('root.commodity.storage', {
		url: '/storage',
		templateUrl: 'views/commodity/storage.html',
		controller: 'Storage'
	})
	.state('root.commodity.adjust', {
		url: '/adjust',
		templateUrl: 'views/commodity/adjust.html',
		controller: 'Adjust'
	})


	/////////////
	// 出库管理 //
	/////////////

	.state('root.outbound', {
		url: 'outbound',
		templateUrl: 'views/outbound/layout.html',
		controller: 'OutboundCtrl'
	})
	.state('root.outbound.distrib', {
		url: '/distrib',
		templateUrl: 'views/outbound/distrib.html',
		controller: 'Distrib'
	})
	.state('root.outbound.pick', {
		url: '/pick',
		templateUrl: 'views/outbound/pick.html',
		controller: 'Pick'
	})
	.state('root.outbound.port', {
		url: '/port',
		templateUrl: 'views/outbound/port.html',
		controller: 'Port'
	})


	/////////////
	// 库房管理 //
	/////////////

	.state('root.storehouse', {
		url: 'storehouse',
		templateUrl: 'views/storehouse/layout.html',
		controller: 'StorehouseCtrl'
	})
	.state('root.storehouse.define', {
		url: '/define',
		templateUrl: 'views/storehouse/define.html',
		controller: 'Define'
	})
	.state('root.storehouse.allocate', {
		url: '/allocate',
		templateUrl: 'views/storehouse/allocate.html',
		controller: 'Allocate'
	})
	.state('root.storehouse.audit', {
		url: '/audit',
		templateUrl: 'views/storehouse/audit.html',
		controller: 'Audit'
	})
	.state('root.storehouse.remain', {
		url: '/remain',
		templateUrl: 'views/storehouse/remain.html',
		controller: 'Remain'
	})

	//////////////
	// 代理商管理 //
	//////////////

	.state('root.agents', {
		url: 'agents',
		templateUrl: 'views/agents/layout.html',
		controller: 'AgentsCtrl'
	})
	.state('root.agents.manage', {
		url: '/manage',
		templateUrl: 'views/agents/manage.html',
		controller: 'Manage'
	})
	.state('root.agents.channel', {
		url: '/channel',
		templateUrl: 'views/agents/channel.html',
		controller: 'Channel'
	})
	.state('root.agents.contract', {
		url: '/contract',
		templateUrl: 'views/agents/contract.html',
		controller: 'Contract'
	})
	.state('root.agents.overview', {
		url: '/overview',
		templateUrl: 'views/agents/overview.html',
		controller: 'Overview'
	})
	.state('root.agents.rebates', {
		url: '/rebates',
		templateUrl: 'views/agents/rebates.html',
		controller: 'Rebates'
	})


	/////////////
	// 财务管理 //
	/////////////

	.state('root.rebates', {
		url: 'rebates',
		templateUrl: 'views/rebates/layout.html',
		controller: 'RebatesCtrl'
	})
	.state('root.rebates.manager', {
		url: '/manager',
		templateUrl: 'views/rebates/manager.html',
		controller: 'Manager'
	})
	.state('root.rebates.invoice', {
		url: '/invoice',
		templateUrl: 'views/rebates/invoice.html',
		controller: 'Invoice'
	})


	/////////////
	// 参数维护 //
	/////////////

	.state('root.params', {
		url: 'params',
		templateUrl: 'views/params/layout.html',
		controller: 'ParamsCtrl'
	})
	.state('root.params.system', {
		url: '/system',
		templateUrl: 'views/params/system.html',
		controller: 'System'
	});
}])

.run(['$rootScope', '$state', 'Auth', '$location', '$q', 'cfpLoadingBar', function ($rootScope, $state, Auth, $location, $q, cfpLoadingBar) {

	Auth.setHeader();

	$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
		// 顶部进度条
		cfpLoadingBar.start();

		if (!Auth.isLoggedIn()) {
			$location.path('/' + config.auth.login);
		} else {
			// 因为负责业务的后端服务不保存状态, 所以这里需要不断的通过负责权限的后台检查登陆是否超时
			// Auth.checkTimeout();
		}
	});

	$rootScope.$on('$viewContentLoaded', function() {
		cfpLoadingBar.complete();
	});
}]);

