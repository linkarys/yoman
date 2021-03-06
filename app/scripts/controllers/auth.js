'use strict';

angular.module('mainApp')
.controller('AuthCtrl', ['$scope', 'Auth', 'md5', '$http', function ($scope, Auth, md5, $http) {

	// init
	$scope.model = {account: '', password: ''};

	$scope.login = function(isValid) {
		$scope.submitted = true;

		if (!isValid) return;

		var errorHandler = function(errorCode, message) {
			switch (errorCode) {
				case 'E_00101':
					$scope.errorMsg = '用户不存在！';
					$scope.inValid = 'account';
					break;

				case 'E_00100':
					$scope.errorMsg = '密码与用户名不匹配！';
					$scope.inValid = 'password';
					break;

				default:
					$scope.errorMsg = '错误！message: ' + message;
					delete $scope.inValid;
					break;
			}
		};

		var criticalErrorHandler = function(msg) {
			$scope.errorMsg = '错误！' ;
			delete $scope.inValid;
		};

		$http.get(config.auth.baseurl + config.auth.login, {
				params: {
					account: $scope.model.account,
					password: md5.createHash($scope.model.password)
				}
			})
			.success(function(res) {
				if (res.legal) {
					// 登录成功
					Auth.login(res, $scope.model.phoneNum);
				} else if (angular.isString(res.message)){
					// 用户名或密码错误
					var errorCode = res.message.split(':')[0];
					errorHandler(errorCode);
					// 未知错误
				} else { criticalErrorHandler(); }
			})
			// 网络连接失败
			.error(criticalErrorHandler);
	};

	$scope.logout = function() {
		$http.get(config.auth.baseurl + config.auth.logout);
		Auth.logout();
	};
}]);
