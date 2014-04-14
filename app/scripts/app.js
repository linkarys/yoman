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
      .when('/Agent', {
        templateUrl: 'views/agent.html',
        controller: 'AgentCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
