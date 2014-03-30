'use strict';

angular.module('mainApp')
.controller('InfoCtrl', function ($scope, sideBarService, actionService, $http) {
	$scope.sideBarItems = sideBarService.highlight(0);
	$scope.actions = actionService.actions('info');
	$scope.date = new Date()
	$scope.exNumber = '0012';

	$scope.summit = function() {
		console.log($scope.model);
		$http.post('http://bam.uudragon.net/bam/consumer_saved', $scope.model)
		.success(function(data, status) {
			console.log(data);
		})
		.error(function(data, status) {
			console.log('error status:' + status);
		})
	}
})
.controller('CustomerCtrl', function ($scope, sideBarService, actionService) {
	$scope.sideBarItems = sideBarService.highlight(1);
	$scope.actions = actionService.actions('customer');
	$scope.date = new Date()
})
.controller('FinancialCtrl', function ($scope, sideBarService) {
	$scope.sideBarItems = sideBarService.highlight(2);
	$scope.date = new Date()
})
.controller('AgentsCtrl', function ($scope, sideBarService) {
	$scope.sideBarItems = sideBarService.highlight(3);
	$scope.date = new Date()
})
.controller('ShipCtrl', function ($scope, sideBarService) {
	$scope.sideBarItems = sideBarService.highlight(4);
	$scope.date = new Date()
})
.controller('ProductionCtrl', function ($scope, sideBarService) {
	$scope.sideBarItems = sideBarService.highlight(5);
	$scope.date = new Date()
})
.controller('LawCtrl', function ($scope, sideBarService) {
	$scope.sideBarItems = sideBarService.highlight(6);
	$scope.date = new Date()
})

