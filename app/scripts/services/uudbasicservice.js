'use strict';

angular.module('authApp')
.service('UUDBasicService', function UUDBasicService($http) {

	var baseurl = 'http://127.0.0.1:8086/';
	var self = this;
	var PER_PAGE = 20;

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
				suffix = 'at/operate.op?className=userAction&methodName=findById';
				break;
			case 'userGroup':
				suffix = 'at/operate.op?className=userGroupAction&methodName=findById';
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
				$scope.model = {
					name: '用户组*',
					type: '568459226',
					status: '已订购',
					isValid: '1',
					users: ['用户1', '用户3', '用户4', '用户5', '用户6'],
				}
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
				suffix = 'at/operate.op?className=userAction&methodName=saveUser';
				break;
			case 'userGroup':
				suffix = 'at/operate.op?className=userGroupAction&methodName=save';
				break;

			case 'role':
				suffix = 'at/operate.op?className=roleAction&methodName=save';
				break;

			case 'userRole':
				suffix = '';
				break;

			case 'roleGroup':
				suffix = 'at/operate.op?className=roleGroupAction&methodName=save';
				break;

			case 'previlege':
				suffix = 'at/operate.op?className=previlege&methodName=save';
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
				suffix = 'at/operate.op?className=userAction&methodName=delete';
				break;
			case 'userGroup':
				suffix = 'at/operate.op?className=userGroupAction&methodName=delete';
				break;

			case 'role':
				suffix = 'at/operate.op?className=roleAction&methodName=delete';
				break;

			case 'userRole':
				suffix = 'bam/delete_user_role';
				break;

			case 'roleGroup':
				suffix = 'at/operate.op?className=roleGroupAction&methodName=delete';
				break;

			case 'previlege':
				suffix = 'at/operate.op?className=previlege&methodName=delete';
				break;

			default:
				break;

		}

		self.post(baseurl + suffix, {id: id})
			.success(function(data, status) {
				return true;
			})
			.error(function(data, status) {
				console.log('delete ' + type + ' error status:' + status);
				return false;
			})
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
				suffix = 'at/operate.op?className=userAction&methodName=update';
				break;
			case 'userGroup':
				suffix = 'at/operate.op?className=userGroupAction&methodName=update';
				break;

			case 'role':
				suffix = 'at/operate.op?className=roleAction&methodName=update';
				break;

			case 'userRole':
				suffix = 'bam/update_user_role';
				break;

			case 'roleGroup':
				suffix = 'at/operate.op?className=roleGroupAction&methodName=update';
				break;

			default:
				break;

		}

		console.log(model);

		self.post(baseurl + suffix, model)
			.success(function(data, status) {
				return true;
			})
			.error(function(data, status) {
				console.log('update ' + type + ' error status:' + status);
				return false;
			})
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
				suffix = 'at/operate.op?className=userAction&methodName=searchUser';
				break;
			case 'userGroup':
				suffix = 'at/operate.op?className=userGroupAction&methodName=search';
				break;

			case 'role':
				suffix = 'at/operate.op?className=roleAction&methodName=search';
				break;

			case 'userRole':
				suffix = 'bam/search_user_role';
				break;

			case 'roleGroup':
				suffix = 'at/operate.op?className=roleGroupAction&methodName=search';
				break;

			default:
				break;

		}

		$scope.searchModel.pagination = $scope.searchModel.pagination || {toPage: 1, perPage: PER_PAGE}

		console.log($scope.searchModel);

		self.post(baseurl + suffix, $scope.searchModel)
			.success(function(data, status) {
				$scope.result = data;
			})
			.error(function(data, status) {
				console.log('search ' + type + ' error status: ' + status + ' use dummy data');

				// dummy data
				$scope.result = {
					recordsCount: 100,
					records: [
						{id: 1, type: 1, rolename: '财务', groupId: "", name: 'test1', account: "account2", isValid: 1, gender: 1, email: 'testemail@email.com', positions: 'admin'},
						{id: 2, type: 2, rolename: '管理人员', groupId: "", name: 'test2', account: "account6", isValid: 0, gender: 0, email: 'testemdail@email.com', positions: 'admin'},
						{id: 3, type: 2, rolename: '渠道经理', groupId: "", name: 'test3', account: "account34", isValid: 1, gender: 1, email: 'test3@email.com', positions: 'register'},
						{id: 4, type: 1, rolename: '客服', groupId: "", name: 'test4', account: "account6", isValid: 1, gender: 0, email: 'test4@email.com', positions: 'admin'},
						{id: 5, type: 1, rolename: '客服主管', groupId: "", name: 'test45', account: "account4", isValid: 0, gender: 1, email: 'testd4@email.com', positions: 'admin'},
						{id: 6, type: 1, rolename: '发货员', groupId: "", name: '21312', account: "account2", isValid: 1, gender: 0, email: 'test4@email.com', positions: 'admin'}
					]
				}
			})
	}

	this.getGroups = function($scope, type) {

		var suffix;

		switch (type) {
			case 'user':
				suffix = 'at/operate.op?className=userGroupAction&methodName=getGroups';
				break;

			case 'role':
				suffix = 'at/operate.op?className=roleGroupAction&methodName=getGroups';
				break;

			default:
				break;

		}

		self.post(baseurl + suffix)
			.success(function(data, status) {
				$scope.groups = data;
			})
			.error(function(data, status) {
				console.log('getGroups ' + type + ' error status: ' + status + ' use dummy data');

				$scope.groups = [
					{id: 1, name: '财务'},
					{id: 2, name: '管理人员'},
					{id: 3, name: '渠道经理'},
					{id: 4, name: '客服'},
					{id: 5, name: '客服主管'},
					{id: 6, name: '发货员'}
				]

			})

	}

	this.getPrevilegeJSON = function(setting) {

		var suffix = 'at/operate.op?className=Previlege&methodName=load';

		self.post(baseurl + suffix)
			.success(function(data, status) {

			})
			.error(function(data, status) {

				var zNodes =[
					{ id:1, pId:0, name:"页面一", open:true},
					{ id:11, pId:1, name:"用户组1"},
					{ id:12, pId:1, name:"用户组2"},
					{ id:13, pId:1, name:"用户组3"},
					{ id:2, pId:0, name:"页面二", open:true},
					{ id:21, pId:2, name:"用户组1"},
					{ id:22, pId:2, name:"用户组2"},
					{ id:23, pId:2, name:"用户组3"},
					{ id:3, pId:0, name:"页面三", open:true},
					{ id:31, pId:3, name:"用户组1"},
					{ id:32, pId:3, name:"用户组2"},
					{ id:33, pId:3, name:"用户组3"}
				];

				$.fn.zTree.init($("#priv-tree"), setting, zNodes);
			})

	}

	this.updatePrevilege = function(zTree, model) {

		var suffix = 'at/operate.op?className=Previlege&methodName=update';
		self.post(baseurl + suffix, model)
			.success(function(data, status) {
				console.log(data);
			})
			.error(function(data, status) {
				console.log('sendPrevilegeJSON error: ');
			})

	}

});
