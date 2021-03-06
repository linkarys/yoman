'use strict';

angular.module('mainApp')
.controller('CommodityCtrl', ['$scope', '$controller', function ($scope, $controller) {

	$controller('MainCtrl', {$scope: $scope});
}])

	/**
	 * Sub-Controller
	 * ---------------------------------------------------------------------------------
	 */

	.controller('CommodityManager', ['$scope', '$controller', function ($scope, $controller) {


		// inherit functions from parent
		$controller('CommodityCtrl', {$scope: $scope});

	}])

	// 入库单管理
	.controller('StockIn', ['$scope', '$controller', '$http', '$q', 'dialog', function ($scope, $controller, $http, $q, dialog) {

		var $receiptForm = $('#receipt-form'),
			$goodsDetailsForm = $('#good-details-form');

		// 搜索下拉
		$scope.filters = [
			{name: '入库单号', value: 'receipt_code', input: true},
			{name: '入库单状态', value: 'status', subfilters: [{name: '撤销', value: -1}, {name: '未入库', value: 0}, {name: '部分入库', value: 1}, {name: '入库完成', value: 2}]},
			// {name: '所在库房', value: 'warehouse', input: true},
			// {name: '预入库时间', value: '', date: true},
			// {name: '入库时间', value: '', date: true},
			{name: '创建人', value: 'creator', input: true},
			{name: '修改人', value: 'updater', input: true}
		];

		$scope.subFilters = [
			{name: '商品编号', value: 'goods_code', input: true},
			{name: '商品名称', value: 'goods_name', input: true},
			{name: '商品类型', value: 'goods_type', subfilters: $scope.mapRevert('goodType')},
			{name: '是否有效', value: 'yn', subfilters: [{name: '是', value: 1}, {name: '否', value: 0}]}
		];

		// 获取商品列表
		$scope.getCommdityList = $scope.getBaseCommdityList($scope, 'subSearchModel', 'subQuery', 'goods', $receiptForm);

		// 商品搜索
		$scope.goodsQuery = function() {
			$scope.subQuery = $scope.parseFilter($scope.subSearchModel);
			$scope.getCommdityList();
		};

		// ths
		$scope.isAllThsShow = true;
		$scope.ths = [
			{name: 'receipt_code', label: '入库单号', isChecked: true},
			{name: 'receipt_date', label: '预入库时间', isChecked: true},
			{name: 'receipt_desc', label: '入库描述', isChecked: true},
			{name: 'status', label: '入库单状态', isChecked: true},
			{name: 'warehouse', label: '所在库房', isChecked: true},
			{name: 'create_time', label: '创建时间', isChecked: true},
			{name: 'creator', label: '创建人', isChecked: true},
			{name: 'update_time', label: '更新时间', isChecked: true},
			{name: 'updater', label: '更新人', isChecked: true}
		];

		// 新建入库单
		$scope.newReceipt = function(form) {
			var warehouseDefer = $scope.getWarehouseList();
			var goodsDefer = $scope.getCommdityList();

			$scope.resetForm(form);
			$scope.receipt = {
				receipt_code: $scope.guid(),
				creator: $scope.currentUser.userNo,
				updater: $scope.currentUser.userNo,
				status: 0,
				details: []
			};

			$scope.receiptFormTitle = '新建入库单';


			$q.all([warehouseDefer, goodsDefer])
				.then(function(data) {
					if (data[0].status === 200 && data[1].status === 200) {
						$receiptForm.modal('show');
					}
				});
		};

		// 修改商品
		$scope.editGood = function(good, form) {
			$scope.resetForm(form);
			$scope.productGood = good;
			$scope.productTmpGood = angular.copy(good);
			$goodsDetailsForm.modal('show');
		};

		// 取消入库单
		$scope.cancelReceipt = function(receiptCode, index) {

			dialog.alert({
				text: '确定取消入库单吗? 您的操作将无法撤消!',
				cancel: 1,
				onyes: function() {
					$http.get(config.basewms + 'inbound/receipt/' + receiptCode + '/cancel/')
						.success(function(res) {
							$scope.receipts.splice(index, 1);
						})
						.error(function(data) {
							dialog.alert({
								contentType: 'danger',
								text: '撤消失败!'
							});
						});
				}
			});


		};

		// 保存商品详情
		$scope.saveGoodToProduct = function(form) {
			// 表单验证
			if (!$scope.validateForm(form, $goodsDetailsForm)) return;
			$scope.productGood.qty = $scope.productTmpGood.qty;
			$scope.productGood.is_gift = $scope.productTmpGood.is_gift;
			$goodsDetailsForm.modal('hide');
		};


		// 为产品添加商品
		$scope.addGoodToReceipt = function(good) {

			var exists = false;

			angular.forEach($scope.receipt.details, function(existGood) {
				if (existGood.goods_code === good.goods_code) {
					exists = true;
					return;
				}
			});

			if (!exists) {
				$receiptForm.modal('info', '添加成功');
				$scope.receipt.details.push({
					goods_code: good.goods_code,
					goods_name: good.goods_name,
					goods_type: good.goods_type,
					qty: '1'
				});
			} else {
				$receiptForm.modal('info', '已经存在, 请勿重复添加');
			}
		};

		$scope.removeGood = function(index) {
			$scope.receipt.details.splice(index, 1);
		};


		// 编辑入库单
		$scope.editReceipt = function(receiptCode) {
			// var warehouseDefer = $scope.getWarehouseList();
			var productDefer = $http.get(config.basewms + 'inbound/receipt/' + receiptCode + '/');
			// var commodityListDefer = $scope.getCommdityList();
			// $scope.receiptFormTitle = status > -1 ? '查看入库单' : '修改入库单';
			$scope.receiptFormTitle = '查看入库单';

			$q.all([productDefer])
				.then(function(data) {
					if (data && data[0].status === 200) {
						$scope.receipt = data[0].data;
						// $scope.warehouses = data[1].data;
						$receiptForm.modal('show');
					}
				});
		};

		// 保存入库单
		$scope.saveReceipt = function(form) {

			// 表单验证
			if (!$scope.validateForm(form, $receiptForm)) return;

			// 验证商品列表是否为空
			if (!$scope.receipt.details.length) {
				$receiptForm.modal('fail', '商品列表不能为空');
				return;
			}

			$scope.processing(form, $receiptForm);

			$http.post(config.basewms + 'inbound/receipt/create/', $scope.receipt)
				.success($scope.successHandler(form, $receiptForm, $scope.getReceiptList))
				.error($scope.errorHandler(form, $receiptForm));
		};

		$scope.search = function() {
			$scope.query = $scope.parseFilter($scope.searchModel);
			$scope.getReceiptList();
		};

		$scope.getReceiptList = function() {
			var req = {
				pageSize: $scope.searchModel.pageSize || config.perPage,
				pageNo: $scope.searchModel.pageNo || 1
			};

			$.extend(req, $scope.query);

			$http.post(config.basewms + 'inbound/receipts/', req)
				.success(function(data) {
					$scope.receipts = data.records;

					$scope.receipts.meta = {
						pageSize: data.pageSize,
						pageNo: data.pageNo,
						recordsCount: data.recordsCount,
						pageNumber: data.pageNumber
					};
				});
		};

		// 获取库房列表
		$scope.getWarehouseList = function() {
			var req = {
				pageSize: 50,
				pageNo: 1
			};

			return $http.post(config.basewms + 'baseinfo/warehouses/', req)
				.success(function(data) {
					$scope.warehouses = data.records;
				});
		};


		$scope.getReceiptList();

		// inherit functions from parent
		$controller('CommodityManager', {$scope: $scope});
	}])

	// 商品入库
	.controller('Storage', ['$scope', '$controller', '$http', function ($scope, $controller, $http) {

		var $storageForm = $('#storage-form'),
			$goodsDetailsForm = $('#good-details-form');

		// 搜索下拉
		$scope.filters = [
			{name: '入库单号', value: 'receipt_code', input: true},
			{name: '入库单状态', value: 'status', subfilters: [{name: '撤销', value: -1}, {name: '未入库', value: 0}, {name: '部分入库', value: 1}, {name: '入库完成', value: 2}]},
			// {name: '所在库房', value: 'warehouse', input: true},
			// {name: '预入库时间', value: '', date: true},
			// {name: '入库时间', value: '', date: true},
			{name: '创建人', value: 'creator', input: true},
			{name: '修改人', value: 'updater', input: true}
		];

		// ths
		$scope.isAllThsShow = true;
		$scope.ths = [
			{name: 'receipt_code', label: '入库单号', isChecked: true},
			{name: 'receipt_date', label: '预入库时间', isChecked: true},
			{name: 'receipt_desc', label: '入库描述', isChecked: true},
			{name: 'status', label: '入库单状态', isChecked: true},
			{name: 'warehouse', label: '所在库房', isChecked: true},
			{name: 'create_time', label: '创建时间', isChecked: true},
			{name: 'creator', label: '创建人', isChecked: true},
			{name: 'update_time', label: '更新时间', isChecked: true},
			{name: 'updater', label: '更新人', isChecked: true}
		];

		$scope.search = function() {
			$scope.query = $scope.parseFilter($scope.searchModel);
			$scope.getReceiptList();
		};

		// 新建入库单
		$scope.newPutinedReceipt = function(receiptCode, form) {
			// $scope.resetForm(form);
			$scope.storageFormType = 'new';

			$http.get(config.basewms + 'inbound/receipt/' + receiptCode + '/')
				.success(function(receipt) {
					$scope.receipt = {
						receipt_code: receipt.receipt_code,
						warehouse: receipt.warehouse,
						updater: $scope.currentUser.name,
						details: []
					};

					angular.forEach(receipt.details, function(good) {
						$scope.receipt.details.push({
							goods_type: good.goods_type,
							goods_code: good.goods_code,
							putin_qty: good.putin_qty || '0',
							goods_name: good.goods_name,
							qty: good.qty,
							actual_qty: good.actual_qty
						});
					});

					$storageForm.modal('show');
				});
		};

		$scope.showPutinedReceipt = function(receiptCode) {
			$scope.newPutinedReceipt(receiptCode);
			$scope.storageFormType = 'show';
		};

		$scope.savePutinedReceipt = function(form) {
			$scope.processing(form, $storageForm);

			$http.post(config.basewms + 'inbound/putin/', $scope.receipt)
				.success($scope.successHandler(form, $storageForm, $scope.getReceiptList))
				.error($scope.errorHandler(form, $storageForm));
		};

		$scope.getReceiptList = function() {
			var req = {
				pageSize: $scope.searchModel.pageSize || config.perPage,
				pageNo: $scope.searchModel.pageNo || 1
			};

			$.extend(req, $scope.query);

			$http.post(config.basewms + 'inbound/receipts/', req)
				.success(function(data) {
					$scope.receipts = data.records;
					$scope.receipts.meta = {
						pageSize: data.pageSize,
						pageNo: data.pageNo ? data.pageNo : 1,
						recordsCount: data.recordsCount,
						pageNumber: data.pageNumber
					};
				});
		};

		// 修改商品
		$scope.editGood = function(good, form) {
			$scope.resetForm(form);
			$scope.productGood = good;
			$goodsDetailsForm.modal('show');
			$scope.productTmpGood = angular.copy(good);
			$scope.productTmpGood.max = good.qty - good.actual_qty + 1;
		};

		// 保存商品详情
		$scope.saveGoodToProduct = function(form) {
			// 表单验证
			if (!$scope.validateForm(form, $goodsDetailsForm, '入库数量格式不对或已超过计划数量')) return;
			$scope.productGood.putin_qty = $scope.productTmpGood.putin_qty;
			$goodsDetailsForm.modal('hide');
		};

		$scope.getReceiptList();

		// inherit functions from parent
		$controller('CommodityManager', {$scope: $scope});

	}])
	.controller('Adjust', ['$scope', '$controller', function ($scope, $controller) {


		// inherit functions from parent
		$controller('OrderManager', {$scope: $scope});

	}]);
