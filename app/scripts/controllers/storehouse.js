'use strict';

angular.module('mainApp')
.controller('StorehouseCtrl', ['$scope', '$controller', function ($scope, $controller) {

	$controller('MainCtrl', {$scope: $scope});
}])

	/**
	 * Sub-Controller
	 * ---------------------------------------------------------------------------------
	 */

	.controller('StorehouseManager', ['$scope', '$controller', function ($scope, $controller) {


		// inherit functions from parent
		$controller('StorehouseCtrl', {$scope: $scope});

	}])
	.controller('Define', ['$scope', '$controller', '$http', function ($scope, $controller, $http) {

		// 搜索下拉
		var $warehouseForm = $('#warehouse-form'),
			$pickgoodForm = $('#pickgood-form');

		// 搜索下拉
		$scope.filters = [
			{name: '库房编号', value: 'warehouse_code', input: true},
			// {name: '库房名称', value: 'warehouse_name', input: true},
			{name: '库房类型', value: 'type', subfilters: $scope.mapRevert('warehouse')},
			{name: '创建人', value: 'creator', input: true},
			{name: '修改人', value: 'updater', input: true},
			{name: '是否有效', value: 'yn', subfilters: [{name: '是', value: 1}, {name: '否', value: 0}]}
		];

		// ths
		$scope.isAllThsShow = true;
		$scope.ths = [
			{name: 'warehouse_code', label: '库房编号', isChecked: true},
			{name: 'warehouse_name', label: '库房名称', isChecked: true},
			{name: 'address', label: '库房地址', isChecked: true},
			{name: 'type', label: '库房类型', isChecked: true},
			{name: 'creator', label: '创建人', isChecked: true},
			{name: 'create_time', label: '创建时间', isChecked: true},
			{name: 'updater', label: '修改人', isChecked: true},
			{name: 'update_time', label: '修改时间', isChecked: true},
			{name: 'yn', label: '是否生效', isChecked: true}
		];

		// 新建库房
		$scope.newWarehouse = function(form) {
			$scope.resetForm(form);
			$scope.warehouseFormTitle = '库房定义';
			$scope.warehouse = {
				warehouse_code: $scope.guid(),
				creator: $scope.currentUser.name,
				updater: $scope.currentUser.name,
				type: 1,
				yn: '1'
			};

			$warehouseForm.modal('show');
		};

		// 编辑库房 && 复制添加库房
		$scope.editWarehouse = function(code, isDuplicate) {
			$scope.warehouseFormTitle = isDuplicate ? '复制添加库房' : '编辑库房';

			$http.get(config.basewms + 'baseinfo/warehouse/' + code + '/')
				.success(function(warehouse) {
					$scope.warehouse = warehouse;
					$scope.warehouse.updater = $scope.currentUser.name;

					if (isDuplicate) {
						$scope.warehouse.warehouse_code = $scope.guid();
					}
					$warehouseForm.modal('show');
				});
		};

		// 拣货
		$scope.pickProduct = function(warehouse_code) {

			$scope.pickInfo = {
				warehouse_code: warehouse_code
			};

			$scope.searchModel.pageNo = 1;

			$scope.getProductList()
				.success(function() {
					$pickgoodForm.modal('show');
				});
		};

		// 获取产品列表
		$scope.getProductList = function() {

			var req = {
				pageSize: $scope.searchModel.pageSize || config.perPage,
				pageNo: $scope.searchModel.pageNo || 1
			};

			return $http.post(config.basewms + 'baseinfo/query_product_list/', req)
				.success(function(data) {
					$scope.products = data.records;
					$scope.products.meta = {
							pageSize: data.pageSize,
							pageNo: data.pageNo ? data.pageNo : 1,
							recordsCount: data.recordsCount,
							pageNumber: data.pageNumber
						};
					});
		};


		$scope.savePickProduct = function(product, form) {
			$scope.pickInfo.productName = product.product_name;
			$scope.processing(form, $pickgoodForm);

			$http.post(config.basewms + 'inner/' + $scope.pickInfo.warehouse_code + '/picking/', {
					product_code: product.product_code,
					updater: $scope.currentUser.account
				})
				.success(function(result) {
					form.processing = false;
					$pickgoodForm.modal('info', '操作成功');
					$scope.pickResult = result;
				})
				.error(function() {
					form.processing = false;
					$pickgoodForm.modal('fail', '操作失败');
				});
		};

		// 保存库房
		$scope.saveWarehouse = function(form) {
			// 表单验证
			if (!$scope.validateForm(form, $warehouseForm)) return;

			$scope.processing(form, $warehouseForm);

			$http.post(config.basewms + 'baseinfo/warehouse/save/', $scope.warehouse)
				.success($scope.successHandler(form, $warehouseForm, $scope.getWarehouseList))
				.error($scope.errorHandler(form, $warehouseForm));
		};

		// 搜索
		$scope.search = function() {
			$scope.query = $scope.parseFilter($scope.searchModel);
			$scope.getWarehouseList();
		};

		// 获取库房列表
		$scope.getWarehouseList = function() {

			var req = {
				pageSize: $scope.searchModel.pageSize || config.perPage,
				pageNo: $scope.searchModel.pageNo || 1
			};

			$.extend(req, $scope.query);

			$http.post(config.basewms + 'baseinfo/warehouses/', req)
				.success(function(data) {
					$scope.warehouses = data.records;
					$scope.warehouses.meta = {
							pageSize: data.pageSize,
							pageNo: data.pageNo ? data.pageNo : 1,
							recordsCount: data.recordsCount,
							pageNumber: data.pageNumber
						};
					});
		};

		$scope.getWarehouseList();

		// inherit functions from parent
		$controller('StorehouseManager', {$scope: $scope});

	}])
	.controller('Allocate', ['$scope', '$controller', '$http', function ($scope, $controller, $http) {


		// inherit functions from parent
		$controller('StorehouseManager', {$scope: $scope});

	}])
	.controller('Audit', ['$scope', '$controller', '$http', function ($scope, $controller, $http) {

		$('.article-header-search').stop().slideDown('fast');

		// 搜索下拉
		// $scope.filters = [
		// 	{name: '库房编号', value: 'audit_code', input: true},
		// 	{name: '库房名称', value: 'audit_name', input: true},
		// 	{name: '库房类型', value: 'audit_name', subfilters: $scope.mapRevert('audit')},
		// 	{name: '是否有效', value: 'yn', subfilters: [{name: '是', value: 1}, {name: '否', value: 0}]}
		// ];

		// ths
		$scope.isAllThsShow = true;
		$scope.ths = [
			{name: 'warehouse', label: '库房编码', isChecked: true},
			{name: 'warehouse_name', label: '库房名称', isChecked: true},
			{name: 'goods_code', label: '商品编码', isChecked: true},
			{name: 'goods_name', label: '商品名称', isChecked: true},
			{name: 'qty', label: '商品数量', isChecked: true},
			{name: 'code', label: '单据号', isChecked: true},
			{name: 'type', label: '单据类型', isChecked: true},
			{name: 'create_time', label: '记录创建时间', isChecked: true},
			{name: 'creator', label: '记录创建人', isChecked: true},
			{name: 'update_time', label: '记录修改时间', isChecked: true},
			{name: 'updater', label: '记录最后修改人', isChecked: true}
		];

		// 搜索
		$scope.search = function(warehouseCode) {
			$scope.selectedWarehouse = warehouseCode;
			$scope.query = $scope.searchModel.productFilter ? {goods_code: $scope.searchModel.productFilter } : '';
			$scope.selectedWarehouse && $scope.getAuditList();
		};

		// 获取库房列表
		$scope.getWarehouseList = function() {
			var req = {
				pageSize: 10000,
				pageNo: 1
			};

			$http.post(config.basewms + 'baseinfo/warehouses/', req)
				.success(function(data) {
					$scope.warehouses = data.records;
				});
		};

		// $scope.getWarehouseList();

		// 获取库房列表
		$scope.getAuditList = function() {

			var req = {
				pageSize: $scope.searchModel.pageSize || config.perPage,
				pageNo: $scope.searchModel.pageNo || 1
			};

			$.extend(req, $scope.query);

			$http.post(config.basewms + 'inner/' + $scope.selectedWarehouse + '/records/', req)
				.success(function(data) {
					$scope.audits = data.records;
					$scope.audits.meta = {
							pageSize: data.pageSize,
							pageNo: data.pageNo ? data.pageNo : 1,
							recordsCount: data.recordsCount,
							pageNumber: data.pageNumber
						};
					});
		};

		// inherit functions from parent
		$controller('StorehouseManager', {$scope: $scope});

	}])
	.controller('Remain', ['$scope', '$controller', '$http', function ($scope, $controller, $http) {

		$('.article-header-search').stop().slideDown('fast');

		// ths
		$scope.isAllThsShow = true;
		$scope.goodsThs = [
			{name: 'warehouse', label: '库房编码', isChecked: true},
			{name: 'warehouse_name', label: '库房名称', isChecked: true},
			{name: 'goods_code', label: '商品编码', isChecked: true},
			{name: 'goods_name', label: '商品名称', isChecked: true},
			{name: 'qty', label: '商品总数', isChecked: true},
			{name: 'not_picking_qty', label: '为拣货商品数', isChecked: true},
			{name: 'picking_qty', label: '已预拣货数量', isChecked: true},
			{name: 'create_time', label: '记录创建时间', isChecked: true},
			{name: 'creator', label: '记录创建人', isChecked: true},
			{name: 'update_time', label: '记录修改时间', isChecked: true},
			{name: 'updater', label: '记录最后修改人', isChecked: true}
		];

		$scope.productsThs = [
			{name: 'warehouse', label: '库房编码', isChecked: true},
			{name: 'warehouse_name', label: '库房名称', isChecked: true},
			{name: 'product_code', label: '产品编码', isChecked: true},
			{name: 'product_name', label: '产品名称', isChecked: true},
			{name: 'qty', label: '预拣产品总数', isChecked: true},
			{name: 'create_time', label: '记录创建时间', isChecked: true},
			{name: 'creator', label: '记录创建人', isChecked: true},
			{name: 'update_time', label: '记录修改时间', isChecked: true},
			{name: 'updater', label: '记录最后修改人', isChecked: true}
		];

		$scope.ths = $scope.goodsThs;

		$scope.$watch('searchModel.searchType', function(newVal, oldVal) {
			if (newVal !== oldVal && $scope.selectedWarehouse) {
				if (newVal === 'goods') {
					$scope.ths = $scope.goodsThs;
					$scope.products = '';
				} else {
					$scope.ths = $scope.productsThs;
					$scope.goods = '';
				}
				$scope.getItemList();
			}
		});

		// 搜索
		$scope.search = function(warehouseCode) {
			$scope.selectedWarehouse = warehouseCode;
			$scope.query = $scope.searchModel.productFilter ? {goods_code: $scope.searchModel.productFilter } : '';
			$scope.selectedWarehouse && $scope.getItemList();
		};

		// 获取在库产品/商品列表
		$scope.getItemList = function() {
			var req = {
				pageSize: $scope.searchModel.pageSize || config.perPage,
				pageNo: $scope.searchModel.pageNo || 1
			};

			$.extend(req, $scope.query);

			$http.post(config.basewms + 'inner/' + $scope.selectedWarehouse + '/' + $scope.searchModel.searchType + '/', req)
				.success(function(data) {
					var fieldName = $scope.searchModel.searchType;
					$scope[fieldName] = data.records;
					$scope[fieldName].meta = {
							pageSize: data.pageSize,
							pageNo: data.pageNo ? data.pageNo : 1,
							recordsCount: data.recordsCount,
							pageNumber: data.pageNumber
						};
					});
		};

		// inherit functions from parent
		$controller('StorehouseManager', {$scope: $scope});

	}]);
