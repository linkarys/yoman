'use strict';

angular.module('d3App', [
  'ngRoute',
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/agent', {
        templateUrl: 'views/agent.html',
        controller: 'AgentCtrl'
      })
      .when('/customer', {
        templateUrl: 'views/customer.html',
        controller: 'CustomerCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
