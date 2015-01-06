'use strict';

angular.module('authApp')

.controller('MainCtrl', ['$scope', '$state', 'UUDBasicService', '$q', function ($scope, $state, UUDBasicService, $q) {

	$scope.$state = $state;

	var success = function ($scope, successMsg, warningMsg, callback) {
		return function(data, status) {
			if( data.result ){
				$scope.alertMsg = successMsg;
				$scope.alertLevel = 'success';

				// fire callback
				if (angular.isFunction(callback)) {
					callback();
				}
			} else {
				$scope.alertLevel = 'warning';
				$scope.alertMsg = warningMsg + ' ';
				$scope.alertMsg += data.message ? data.message : '';
			}
		}
	}

	var error = function($scope, errorMsg) {
		return function(msg) {
			$scope.alertLevel = 'danger';
			$scope.alertMsg = errorMsg;
			if (msg) {
				$scope.alertMsg += ' ' + msg;
			}
		}
	}

	$scope.reloadSearch = function() {
		// reset result
		$scope.result = {};
		$scope.page = 1;

		// init serchModel
		$scope.searchModel = $scope.searchModel || {};

		// reset pagination
		if ($scope.searchModel.pagination) {
			$scope.searchModel.pagination.toPage = 1;
		}

		this.search();
	}

	$scope.search = function() {
		UUDBasicService.search($scope, $scope.objType)
	}

	$scope.new = function(form) {
		$scope.modalType = "add";
		$scope.model = {};
		form.$setPristine();
		$scope.submitted = false;

		switch ($scope.objType) {
			case 'user':
				$scope.modalTitle = '添加用户';
				break;

			case 'role':
				$scope.modalTitle = '添加角色';
				break;

			case 'userGroup':
				$scope.modalTitle = '添加用户组';
				break;

			case 'roleGroup':
				$scope.modalTitle = '添加角色组';
				break;

			default: break;
		}

		if ($scope.objType === 'user' || $scope.objType === 'role') {
			UUDBasicService.getGroups($scope, $scope.objType);
		}
	}

	$scope.add = function(model, isValid) {
		$scope.submitted = true;
		$scope.alertMsg = "";
		if (isValid) {

			UUDBasicService.add(model, $scope.objType)
				.success(success($scope, '添加成功!', '添加失败!'))
				.error(error($scope, '网络出错, 添加失败! '))

			$('#uumodal').modal('hide');
		}
	}


	$scope.save = function(newModel, isValid) {

		$scope.submitted = true;
		var callback = function() {
			$scope.result.records.map(function(model, index) {
				if (model.id == newModel.id) {
					$scope.result.records[index] = newModel;
				}
			})
		}

		if (isValid) {
			UUDBasicService.update(newModel, $scope.objType)
				.success( success($scope, '更新成功！', '更新失败！', callback) )
				.error( error($scope, '网络出错, 更新失败!'))

			$('#uumodal').modal('hide')
		}
	}

	$scope.modify = function(model) {
		$scope.modalType = "edit";
		$scope.model = angular.copy(model);
		$scope.submitted = false;
		$scope.alertMsg = "";
		switch ($scope.objType) {
			case 'user':
				$scope.modalTitle = '编辑用户';
				break;
			case 'role':
				$scope.modalTitle = '编辑角色';
				break;
			case 'userGroup':
				$scope.modalTitle = '编辑组';
				break;

			default: break;
		}

		if ($scope.objType === 'user' || $scope.objType === 'role') {
			UUDBasicService.getGroups($scope, $scope.objType);
		}
	}


	$scope.delete = function(model, index) {
		$scope.alertMsg = "";

		UUDBasicService.delete(model.id, $scope.objType)
			.success(function(data) {
				if( data.result ){
					$scope.alertMsg = '删除成功!';
					$scope.alertLevel = 'success';
					$scope.result.records.splice(index, 1);
				} else {
					$scope.alertLevel = 'warning';
					$scope.alertMsg = '删除失败! ';
					$scope.alertMsg += data.message ? data.message : '';
				}

			})
			.error( error($scope, '网络出错, 删除失败! ') );
	}



	$scope.editRole = function(newModel) {

		$scope.roleModalTitle = "修改角色";
		$scope.currentModel = newModel;

		UUDBasicService.getRoles($scope, newModel, $scope.objType);
		UUDBasicService.getAllRoles($scope);
	}

	$scope.saveRoles = function() {
		var roles = [];
		for (var i in $scope.roles) {
			roles.push($scope.roles[i].id);
		}
		var model = {
			id: $scope.currentModel.id,
			roles: roles.join(',')
		}

		UUDBasicService.update(model, $scope.objType === 'user' ? 'userRoles' : 'userGroupRoles')
			.success(success($scope, '更新成功!', '更新失败!'))
			.error(error($scope, '网络出错, 更新失败! '))

		$('#rolemodal').modal('hide');
	}

	$scope.assignRole = function(role) {
		var role = role || findSelectedRole($scope.allRoles);
		if (role) {
			$scope.roles.push(role);
		}
	}

	function findSelectedRole(roles) {
		for (var i in roles) {
			if (roles[i].actived) {
				return roles[i];
			}
		}
	}

	function removeRole(roles, role) {
		for (var i in roles) {
			if (roles[i].id == role.id) {
				roles.splice(i, 1);
			}
		}
	}

	$scope.unsignRole = function(role) {
		var role = role || findSelectedRole($scope.roles);

		if (role) {
			removeRole($scope.roles, role);
		}
	}

	$scope.editPrivilege = function(model) {
		var setting = {
			view: {
				selectedMulti: false
			},
			check: {
				enable: true,
				chkboxType: { "Y" : "", "N" : "" }
			},
			edit: {
				enable: false,
				showRemoveBtn: false,
				showRenameBtn: false
			},
			data: {
				simpleData: {
					enable: true,
					idKey: "id",
					pIdKey: "pId",
					rootPId: 0
				}
			}
		};

		$scope.privilegeModalTitle = "修改权限";
		$scope.currentModel = model;

		var privilegesDefer = UUDBasicService.getPrivileges(model, $scope.objType);
		var allPrivilegesDefer = UUDBasicService.getAllPrivileges();

		$q.all([allPrivilegesDefer, privilegesDefer])
			.then(function(data) {
				UUDBasicService.rebuildTree(data[0].data, data[1].data, setting);
			});
	}

	$scope.savePrivilege = function() {
		var result = [];
		var zTree = $.fn.zTree.getZTreeObj("priv-tree");

		if (!zTree || !$scope.currentModel) {
			$('#rolePrivilege').modal('hide');
			return;
		}

		var checkedNodes = zTree.getCheckedNodes();

		for (var i in checkedNodes) {
			result.push(checkedNodes[i].id);
		}

		var model = {
			id: $scope.currentModel.id,
			privileges: result.join(',')
		}

		UUDBasicService.update(model,  $scope.objType === 'role' ? 'rolePrivileges' : 'roleGroupPrivileges')
			.success(success($scope, '更新成功!', '更新失败!'))
			.error(error($scope, '网络出错, 更新失败! '))

		$('#rolePrivilege').modal('hide');
	}
}])

	/*
	 * Sub Controllers
	 * ----------------------------------------------------------------------
	 */

	.controller('LoginCtrl', ['$scope', 'UUDBasicService', function ($scope, UUDBasicService) {

		$scope.logout = function() {
			UUDBasicService.logout();
		}
	}])

	.controller('UserCtrl', ['$scope', 'UUDBasicService', '$controller', function ($scope, UUDBasicService, $controller) {

		$scope.objType = 'user';
		$controller('MainCtrl', {$scope: $scope});
	}])

	.controller('UgroupCtrl', ['$scope', '$controller', function ($scope, $controller) {

		$scope.objType = 'userGroup';
		$controller('MainCtrl', {$scope: $scope});
	}])

	.controller('RoleCtrl', ['$scope', 'UUDBasicService', '$controller', function ($scope, UUDBasicService, $controller) {

		$scope.objType = 'role';
		$controller('MainCtrl', {$scope: $scope});
	}])

	.controller('RgroupCtrl', ['$scope', '$controller', function ($scope, $controller) {

		$scope.objType = 'roleGroup';
		$controller('MainCtrl', {$scope: $scope});
	}])

	.controller('PrivilegeCtrl', ['$scope', 'UUDBasicService', function ($scope, UUDBasicService) {

		//	baisc settings
		var setting = {
			view: {
				addHoverDom: addHoverDom,
				removeHoverDom: removeHoverDom,
				selectedMulti: false
			},
			edit: {
				enable: true,
				showRemoveBtn: true,
				showRenameBtn: true,
				removeTitle: '删除节点',
				renameTitle: '更新节点'
			},
			data: {
				simpleData: {
					enable: true,
					idKey: "id",
					pIdKey: "pId",
					rootPId: 0
				}
			},
			callback: {
				beforeDrag: beforeDrag,
				beforeRemove: deleteNode,
				beforeEditName: EditNode
			}
		};

		var current;
		var type = "privilege";
		var error = function($scope, errorMsg) {
			return function(msg) {
				$scope.alertLevel = 'danger';
				$scope.alertMsg = errorMsg;
				if (msg) {
					$scope.alertMsg += ' ' + msg;
				}
			}
		}

		// reset form status
		var resetForm =  function () {
			$scope.submitted = false;
			$scope.priForm.$setPristine();
		}

		UUDBasicService.buildPrivilegeTree(setting);

		function EditNode(treeId, treeNode) {
			current = treeNode;

			$scope.model = {
				id: current.id,
				pId: current.pId,
				name: current.name,
				link: current.link,
				code: current.code,
				method: current.method
			}
			$scope.modalTitle = '编辑节点';
			$scope.modalType = 'edit';
			resetForm();
			$scope.$apply();
			$('#uumodal').modal('show');
			return false;
		}

		function deleteNode(treeId, treeNode) {
			var zTree = $.fn.zTree.getZTreeObj("priv-tree");
			var confirm = function() {
				UUDBasicService.delete(treeNode.id, type)
					.success(function(data, status) {
						// 后台成功删除节点后前端再删除节点
						$scope.alertMsg = '删除成功！';
						$scope.alertLevel = 'success';
						zTree.removeNode(treeNode);
					})
					.error(function(data, status) {
						$scope.alertMsg = '删除失败！';
						$scope.alertLevel = 'error';
					})
			}

			$.confirm({
				text: "请确定您的操作，删除将无法撤销!",
				title: "确定删除吗？",
				confirm: confirm,
				confirmButton: "确定",
				cancelButton: "取消",
				confirmButtonClass: "btn-danger"
			});

			return false;
		}

		function addHoverDom(treeId, treeNode) {
			if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;

			var parentNode = $("#" + treeNode.tId + "_span");
			var newNode = $("<span class='button add' id='addBtn_" + treeNode.tId
							+ "' title='添加节点' onfocus='this.blur();'></span>");

			parentNode.after(newNode);
			newNode.bind("click", function(){
				current = treeNode;
				$scope.createNode();
				return false;
			});
		};


		function removeHoverDom(treeId, treeNode) {
			$("#addBtn_"+treeNode.tId).unbind().remove();
		};

		// 新增节点，初始化弹出层
		$scope.createNode = function(isRoot) {
			$scope.model = {}
			$scope.modalTitle = '新增节点';
			$scope.modalType = 'add';

			resetForm();

			$scope.model.isRoot = isRoot ? true : false;
			if (!isRoot) {
				$scope.$apply();
			}
			$('#uumodal').modal('show');
		}

		// 保存更新的节点
		$scope.save = function(model, isValid) {
			$scope.submitted = true;
			if (isValid) {
				var zTree = $.fn.zTree.getZTreeObj("priv-tree");
				var node = {
					id: model.id,
					name: model.name,
					link: model.link,
					code: model.code,
					method: model.method
				};
				$.extend(current, node);

				zTree.updateNode(current);
				UUDBasicService.update(model, type)
					.success(function(data, status) {
						$scope.alertMsg = '更新成功！';
						$scope.alertLevel = 'success';
					})
					.error( error($scope, '更新失败！') )

				$('#uumodal').modal('hide');
			}
		}

		$scope.add = function(model, isValid) {
			$scope.submitted = true;
			if (isValid) {
				var zTree = $.fn.zTree.getZTreeObj("priv-tree");

				if (!model.isRoot) {
					model.pId = current.id;
				}

				UUDBasicService.add(model, type)
					// 添加成功后，后台返回节点
					.success(function(node, status) {

						if (node) {
							// 添加成功后
							if (model.isRoot) {
								zTree.addNodes(null, node);
							} else {
								zTree.addNodes(current, node);
							}

							$scope.alertMsg = '添加成功！';
							$scope.alertLevel = 'success';
						} else {
							// 添加节点失败
							$scope.alertMsg = '添加失败！';
							$scope.alertLevel = 'warning';
						}

					})
					// 后台添加节点失败
					.error( error($scope, '网络错误，添加失败！') )

				$('#uumodal').modal('hide');
			}
		}

		function beforeDrag(treeId, treeNode) {
			return false;
		}
	}])
