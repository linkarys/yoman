'use strict';

angular.module('authApp')
.service('UUDBasicService', ['$http', function UUDBasicService($http) {

	var baseurl = config.baseurl;
	var self = this;

	this.getBreadcrumb = function(route) {

		var breadcrumb = {
			'root' : {href: '', label: '首页'},
			'root.login' : {href: 'login', label: 'login'},
			'root.user' : {href: 'user', label: '用户管理'},
			'root.ugroup' : {href: 'user-group', label: '用户组管理'},
			'root.ugroup.show' : {href: '', label: '用户组查看'},
			'root.role' : {href: 'role', label: '角色管理'},
			'root.rgroup' : {href: 'role-group', label: '角色组管理'},
			'root.rgroup.show' : {href: '', label: '角色查看'},
			'root.privilege' : {href: 'privilege', label: '权限管理'}
		}

		return breadcrumb[route];
	}


	this.post = function(url, data) {

		var serialize = function(obj, prefix) {
			var str = [];
			for(var p in obj) {
				var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
				str.push(typeof v == "object" ?
					serialize(v, k) :
					encodeURIComponent(k) + "=" + encodeURIComponent(v));
			}
			return str.join("&");
		}

		return $http({
			url: url,
			method: 'POST',
			data: serialize(data),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		})
	}


	this.login = function(user) {
		var suffix = 'operate.op?className=loginAction&methodName=login&';

		return $http.get(baseurl + suffix + user);
	}

	this.logout = function(user) {
		var suffix = 'operate.op?className=loginAction&methodName=logout';

		return $http.get(baseurl + suffix);
	}

	/**
	 * 载入对象
	 *
	 * @param  string id
	 * @return object
	 */
	this.loadById = function($scope, id, type) {

		var suffix;

		switch (type) {
			case 'user':
				suffix = 'operate.op?className=userAction&methodName=findById';
				break;
			case 'userGroup':
				suffix = 'operate.op?className=userGroupAction&methodName=findById';
				break;

			case 'role':
				suffix = 'bam/load_role';
				break;

			case 'userRole':
				suffix = 'bam/load_user_role';
				break;

			case 'roleGroup':
				suffix = 'bam/load_role_group';
				break;

			default:
				break;

		}


		self.post(baseurl + suffix, {id: id})
			.success(function(data, status) {

			})
			.error(function(data, status) {
				console.log('load ' + type + ' error status:' + status);
			})

	}

	/**
	 * 添加对象
	 *
	 * @param  object model
	 * @param  string type
	 * @return bool
	 */
	this.add = function(model, type) {

		var suffix;

		switch (type) {
			case 'user':
				suffix = 'operate.op?className=userAction&methodName=saveUser';
				break;
			case 'userGroup':
				suffix = 'operate.op?className=userGroupAction&methodName=save';
				break;

			case 'role':
				suffix = 'operate.op?className=roleAction&methodName=save';
				break;

			case 'userRole':
				suffix = '';
				break;

			case 'roleGroup':
				suffix = 'operate.op?className=roleGroupAction&methodName=save';
				break;

			case 'privilege':
				suffix = 'operate.op?className=privilege&methodName=save';
				break;

			default:
				break;

		}
		return self.post(baseurl + suffix, model);
	}


	/**
	 * 删除对象
	 *
	 * @param  string id
	 * @param  string type
	 * @return bool
	 */
	this.delete = function(id, type) {

		var suffix;

		switch (type) {
			case 'user':
				suffix = 'operate.op?className=userAction&methodName=delete';
				break;
			case 'userGroup':
				suffix = 'operate.op?className=userGroupAction&methodName=delete';
				break;

			case 'role':
				suffix = 'operate.op?className=roleAction&methodName=delete';
				break;

			case 'userRole':
				suffix = 'bam/delete_user_role';
				break;

			case 'roleGroup':
				suffix = 'operate.op?className=roleGroupAction&methodName=delete';
				break;

			case 'privilege':
				suffix = 'operate.op?className=privilege&methodName=delete';
				break;

			default:
				break;

		}
		return self.post(baseurl + suffix, {id: id});
	}


	/**
	 * 更新对象
	 *
	 * @param  object model
	 * @param  string type
	 * @return bool
	 */
	this.update = function(model, type) {

		var suffix;

		switch (type) {
			case 'user':
				suffix = 'operate.op?className=userAction&methodName=update';
				break;

			case 'userRoles':
				suffix = 'operate.op?className=userAction&methodName=saveRoles';
				break;

			case 'userGroup':
				suffix = 'operate.op?className=userGroupAction&methodName=update';
				break;

			case 'userGroupRoles':
				suffix = 'operate.op?className=userGroupAction&methodName=saveRoles';
				break;

			case 'role':
				suffix = 'operate.op?className=roleAction&methodName=update';
				break;

			case 'rolePrivileges':
				suffix = 'operate.op?className=roleAction&methodName=savePrivileges';
				break;

			case 'roleGroup':
				suffix = 'operate.op?className=roleGroupAction&methodName=update';
				break;

			case 'roleGroupPrivileges':
				suffix = 'operate.op?className=roleGroupAction&methodName=savePrivileges';
				break;

			case 'privilege':
				suffix = 'operate.op?className=privilege&methodName=update';
				break;

			default:
				break;

		}

		return self.post(baseurl + suffix, model);
	}


	/**
	 * 对象查询
	 *
	 * @param  object search
	 * @param  string type
	 * @return none
	 */

	this.search = function($scope, type) {

		var suffix;

		switch (type) {
			case 'user':
				suffix = 'operate.op?className=userAction&methodName=searchUser';
				break;
			case 'userGroup':
				suffix = 'operate.op?className=userGroupAction&methodName=search';
				break;

			case 'role':
				suffix = 'operate.op?className=roleAction&methodName=search';
				break;

			case 'userRole':
				suffix = 'bam/search_user_role';
				break;

			case 'roleGroup':
				suffix = 'operate.op?className=roleGroupAction&methodName=search';
				break;

			default:
				break;

		}

		$scope.searchModel.pagination = $scope.searchModel.pagination || {toPage: 1, perPage: config.perPage}

		self.post(baseurl + suffix, $scope.searchModel)
			.success(function(data, status) {
				$scope.result = data;
			})
			.error(function(data, status) {
				console.log('search ' + type + ' error status: ' + status + ' use dummy data');
			})
	}

	// 获取用户对应的角色
	this.getRoles = function($scope, model, type) {
		var suffix;

		switch (type) {
			case 'user':
		 		suffix = "operate.op?className=userAction&methodName=getRoles";
		 		break;

		 	case 'userGroup':
		 		suffix = "operate.op?className=userGroupAction&methodName=getRoles";
		 		break;

		 	default:
		 		break;

		}

		// 假如model不存在， 不执行操作
		if (!model) {
			return;
		}

		self.post(baseurl + suffix, {id: model.id})
			.success(function(data, status) {
				$scope.roles = data ? data : [];
			})
			.error(function(data, status) {
				console.log('get role error, status: ' + status);
			})

	}
	　

	// get all roles
	this.getAllRoles = function($scope) {

		var suffix = "operate.op?className=roleAction&methodName=getAllRoles"

		self.post(baseurl + suffix)
			.success(function(data, status) {
				$scope.allRoles = data;
			})
			.error(function(data, status) {
			})

	}
	　

	// get all groups
	this.getGroups = function($scope, type) {

		var suffix;

		switch (type) {
			case 'user':
				suffix = 'operate.op?className=userGroupAction&methodName=getGroups';
				break;

			case 'role':
				suffix = 'operate.op?className=roleGroupAction&methodName=getGroups';
				break;

			default:
				break;

		}

		self.post(baseurl + suffix)
			.success(function(data, status) {
				$scope.groups = data;
			})
			.error(function(data, status) {
			})

	}

	this.getPrivileges = function(model, type) {

		var suffix;

		switch (type) {
			case 'role':
				suffix = "operate.op?className=roleAction&methodName=getPrivilege";
				break;

			case 'roleGroup':
				suffix = "operate.op?className=roleGroupAction&methodName=getPrivilege";
				break;

			default: break;
		}

		// 假如user不存在， 不执行操作
		if (!model) {
			return;
		}

		return self.post(baseurl + suffix, {id: model.id})
			.error(function(data, status) {
				console.log('getPrivileges error status: ' + status + ' use dummy data');
			});

	}

	this.getAllPrivileges = function() {

		var suffix = 'operate.op?className=privilege&methodName=load';

		return self.post(baseurl + suffix)
			.error(function(data, status) {
				console.log('getAllPrivilege error status: ' + status + ' use dummy data');
			});

	}

	this.rebuildTree = function(allPrivileges, privileges, setting) {
		var result = [];

		for (var i in allPrivileges) {
			for (var j in privileges) {
				if (allPrivileges[i].id == privileges[j].id) {
					allPrivileges[i].checked = true;
				}
			}
		}

		$.fn.zTree.init($("#priv-tree"), setting, allPrivileges);
	}
　
	this.buildPrivilegeTree = function(setting) {

		var suffix = 'operate.op?className=privilege&methodName=load';

		self.post(baseurl + suffix)
			.success(function(data, status) {
				$.fn.zTree.init($("#priv-tree"), setting, data);
			});
	}

}]);
