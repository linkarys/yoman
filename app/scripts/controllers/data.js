'use strict';

angular.module('mainApp')
.controller('DataCtrl', ['$scope', '$controller', function ($scope, $controller) {

	$scope.objType = 'service';

	$controller('MainCtrl', {$scope: $scope});
}])

	/**
	 * Sub-Controller
	 * ---------------------------------------------------------------------------------
	 */

	.controller('DataManager', ['$scope', '$controller', function ($scope, $controller) {

		// 获取工单相关信息
		$scope.orders = [{customerName: '李四民', orderSN: '5223071231', customerPhone: '1395334239543', province: '山东', city: '青岛', products: '季度', area: '0', alipay: '1232113124@gail.com', orderStatus: '1', payType: '1', payway: 'online', payStatus: '0', createTime: '2014-10-15', contactTimes: '2014-10-15'}, {customerName: '张三', orderSN: '212131071231', customerPhone: '3123334239543', province: '上海', city: '上海', area: '0', alipay: '1232113124@gail.com', orderStatus: '1', payType: '1', payway: 'online', products: '季度', payStatus: '1', createTime: '2014-11-15', contactTimes: '2014-10-15'}, {customerName: '李七', orderSN: '123071231', customerPhone: '4395334239543', province: '山东', city: '青岛', products: '季度', area: '1', alipay: '1232113124@gail.com', orderStatus: '1', payType: '1', payway: 'online', payStatus: '1', createTime: '2014-10-15', contactTimes: '2014-10-15'}, {customerName: '李五民', orderSN: '223071231', customerPhone: '5395334234343', province: '山东', city: '青岛', area: '1', alipay: '1232113124@gail.com', orderStatus: '1', payType: '1', payway: 'online', products: '季度', payStatus: '1', createTime: '2014-10-15', contactTimes: '2014-10-15'}, ];

		$scope.showOrder = function(order) {
			$scope.currentOrder = order;
			$('#order-details').modal('show');
		};


		$controller('DataCtrl', {$scope: $scope});

	}])


	.controller('OrderManager', ['$scope', '$controller', function ($scope, $controller) {

		// 搜索下拉
		$scope.filters = [
			{name: '所在省份', value: 1, subfilters: [{name: '河北省', value: 1 }, {name: '山西省', value: 2 }, {name: '吉林省', value: 3 }, {name: '辽宁省', value: 4 }, {name: '黑龙江省', value: 5 }, {name: '陕西省', value: 6 }, {name: '甘肃省', value: 7 }, {name: '青海省', value: 8 }, {name: '山东省', value: 9 }, {name: '福建省', value: 10 }, {name: '浙江省', value: 11 }, {name: '台湾省', value: 12 }, {name: '河南省', value: 13 }, {name: '湖北省', value: 14 }, {name: '湖南省', value: 15 }, {name: '江西省', value: 16 }, {name: '江苏省', value: 17 }, {name: '安徽省', value: 18 }, {name: '广东省', value: 19 }, {name: '海南省', value: 20 }, {name: '四川省', value: 21 }, {name: '贵州省', value: 22 }, {name: '云南省', value: 23 }, {name: '北京市', value: 24 }, {name: '天津市', value: 25 }, {name: '上海市', value: 26 }, {name: '重庆市', value: 27 }, {name: '内蒙古', value: 28 }, {name: '新疆', value: 29 }, {name: '宁夏', value: 30 }, {name: '广西', value: 31 }, {name: '西藏', value: 32 }, {name: '香港', value: 33 }, {name: '澳门', value: 34 }]},
			{name: '城市', value: 2, input: true},
			{name: '订单类型', value: 3, subfilters: [{name: '季度', value: 0}, {name: '半年度', value: 1}, {name: '年度', value: 2}, {name: '一次性周边', value: 3}]},
			{name: '付款状态', value: 4, subfilters: [{name: '已付款', value: 1}, {name: '未付款', value: 2}]},
			{name: '支付方式', value: 5, subfilters: [{name: '货到付款', value: 1}, {name: '在线付款', value: 2}]},
			{name: '审单状态', value: 6, subfilters: [{name: '待审核', value: 1}, {name: '审核中', value: 2}, {name: '审核通过', value: 3}, {name: '无效', value: 4}]},
			{name: '创建时间', value: 7, datetime: true},
			{name: '联系次数', value: 8, input: true},
			{name: '订单状态', value: 9, subfilters: [{name: '正常', value: 1}, {name: '取消', value: 2}]},
			{name: '发货状态', value: 10, subfilters: [{name: '已发货', value: 1}, {name: '未发货', value: 2}]},
			{name: '发票状态', value: 11, subfilters: [{name: '已开', value: 1}, {name: '未开', value: 2}]},
			{name: '退换货单号', value: 12, input: true}
		];

		// ths
		$scope.isAllThsShow = false;
		$scope.ths = [
			{name: 'customerName', label: '姓名', isChecked: true, sortable: true},
			{name: 'gender', label: '性别', isChecked: true, sortable: true},
			{name: 'customerPhone', label: '手机', isChecked: true, sortable: true},
			{name: 'orderSN', label: '订单号', isChecked: true, sortable: true},
			{name: 'orderType', label: '订购商品', isChecked: true, sortable: true},
			{name: 'city', label: '城市', isChecked: false, sortable: true},
			{name: 'area', label: '地址', isChecked: false, sortable: true},
			{name: 'alipay', label: '支付宝账号', isChecked: false, sortable: true},
			{name: 'orderStatus', label: '订单时间', isChecked: true, sortable: true},
			{name: 'payType', label: '订单状态', isChecked: false, sortable: true},
			{name: 'payway', label: '订单类型', isChecked: true, sortable: true},
			{name: 'payStatus', label: '付款方式', isChecked: true, sortable: true},
			{name: 'sumAmount', label: '付款状态', isChecked: true, sortable: true},
			{name: 'sumAmount', label: '累计订单金额', isChecked: false, sortable: true},
			{name: 'details', label: '详细', isChecked: true, sortable: true}
		];

		$scope.newContact = function(record) {
			$('#contact-history').modal('show');
		};

		$scope.showContact = function(record) {
			$('#contact-history').modal('show');
		};

		$controller('DataManager', {$scope: $scope});
	}])
	.controller('Work', ['$scope', '$controller', function ($scope, $controller) {

		// 搜索下拉
		$scope.filters = [
			{name: '所在省份', value: 1, subfilters: [{name: '河北省', value: 1 }, {name: '山西省', value: 2 }, {name: '吉林省', value: 3 }, {name: '辽宁省', value: 4 }, {name: '黑龙江省', value: 5 }, {name: '陕西省', value: 6 }, {name: '甘肃省', value: 7 }, {name: '青海省', value: 8 }, {name: '山东省', value: 9 }, {name: '福建省', value: 10 }, {name: '浙江省', value: 11 }, {name: '台湾省', value: 12 }, {name: '河南省', value: 13 }, {name: '湖北省', value: 14 }, {name: '湖南省', value: 15 }, {name: '江西省', value: 16 }, {name: '江苏省', value: 17 }, {name: '安徽省', value: 18 }, {name: '广东省', value: 19 }, {name: '海南省', value: 20 }, {name: '四川省', value: 21 }, {name: '贵州省', value: 22 }, {name: '云南省', value: 23 }, {name: '北京市', value: 24 }, {name: '天津市', value: 25 }, {name: '上海市', value: 26 }, {name: '重庆市', value: 27 }, {name: '内蒙古', value: 28 }, {name: '新疆', value: 29 }, {name: '宁夏', value: 30 }, {name: '广西', value: 31 }, {name: '西藏', value: 32 }, {name: '香港', value: 33 }, {name: '澳门', value: 34 }]},
			{name: '城市', value: 2, input: true},
			{name: '订单类型', value: 3, subfilters: [{name: '季度', value: 0}, {name: '半年度', value: 1}, {name: '年度', value: 2}, {name: '一次性周边', value: 3}]},
			{name: '付款状态', value: 4, subfilters: [{name: '已付款', value: 1}, {name: '未付款', value: 2}]},
			{name: '支付方式', value: 5, subfilters: [{name: '货到付款', value: 1}, {name: '在线付款', value: 2}]},
			{name: '审单状态', value: 6, subfilters: [{name: '待审核', value: 1}, {name: '审核中', value: 2}, {name: '审核通过', value: 3}, {name: '无效', value: 4}]},
			{name: '创建时间', value: 7, datetime: true},
			{name: '联系次数', value: 8, input: true},
			{name: '订单状态', value: 9, subfilters: [{name: '正常', value: 1}, {name: '取消', value: 2}]},
			{name: '发货状态', value: 10, subfilters: [{name: '已发货', value: 1}, {name: '未发货', value: 2}]},
			{name: '发票状态', value: 11, subfilters: [{name: '已开', value: 1}, {name: '未开', value: 2}]},
			{name: '退换货单号', value: 12, input: true}
		];

		// ths
		$scope.isAllThsShow = true;
		$scope.ths = [
			{name: 'customerName', label: '姓名', isChecked: true, sortable: true},
			{name: 'gender', label: '性别', isChecked: true, sortable: true},
			{name: 'customerPhone', label: '手机', isChecked: true, sortable: true},
			{name: 'orderSN', label: '工单号', isChecked: true, sortable: true},
			{name: 'city', label: '城市', isChecked: true, sortable: true},
			{name: 'workstart', label: '工单开始时间', isChecked: false, sortable: true},
			{name: 'workend', label: '工单结束时间', isChecked: false, sortable: true},
			{name: 'responser', label: '受理人', isChecked: true, sortable: true},
			{name: 'workStatus', label: '工单状态', isChecked: true, sortable: true},
			{name: 'workType', label: '工单类型', isChecked: true, sortable: true}
		];

		$controller('DataManager', {$scope: $scope});
	}])
	.controller('Inventory', ['$scope', '$controller', function ($scope, $controller) {

		$scope.products = [{type: 'lorem', name: '李四民', content: 'lorem', sku: '3213', minSKU: '123', SN: '1231231123', location: '山东'}, {type: 'lorem', name: '张三', content: 'lorem', sku: '1231', minSKU: '123', SN: '123124121', location: '青岛'} ]; $scope.isAllThsShow = true;

		$scope.ths = [
				{name: 'type', label: '产品类别', isChecked: true, sortable:true},
				{name: 'name', label: '产品名称', isChecked: true, sortable:true},
				{name: 'content', label: '产品内容', isChecked: true, sortable:true},
				{name: 'sku', label: '库存数量', isChecked: true, sortable:true},
				{name: 'minSKU', label: '库存下限', isChecked: true, sortable:true},
				{name: 'SN', label: '产品编码', isChecked: true, sortable:true},
				{name: 'location', label: '所在仓库', isChecked: true, sortable:true}
		];

		$scope.getProducts = function(order) {
			$scope.currentOrder = order;
			$scope.modalTitle = '调库';
			$('#order-details').modal('show');
		};

		$scope.fillProducts = function(order) {
			$scope.currentOrder = order;
			$scope.modalTitle = '补库';
			$('#order-details').modal('show');
		};

		$controller('DataManager', {$scope: $scope});
	}])
	.controller('Statistics', ['$scope', '$controller', function ($scope, $controller) {

		$scope.products = [{type: 'lorem', name: '李四民', content: 'lorem', sku: '3213', minSKU: '123', SN: '1231231123', location: '山东'}, {type: 'lorem', name: '张三', content: 'lorem', sku: '1231', minSKU: '123', SN: '123124121', location: '青岛'} ]; $scope.isAllThsShow = true;

		$scope.ths = [
				{name: 'type', label: '产品类别', isChecked: true, sortable:true},
				{name: 'name', label: '产品名称', isChecked: true, sortable:true},
				{name: 'content', label: '产品内容', isChecked: true, sortable:true},
				{name: 'sku', label: '库存数量', isChecked: true, sortable:true},
				{name: 'minSKU', label: '库存下限', isChecked: true, sortable:true},
				{name: 'SN', label: '产品编码', isChecked: true, sortable:true},
				{name: 'location', label: '所在仓库', isChecked: true, sortable:true}
		];

		$scope.getProducts = function(order) {
			$scope.currentOrder = order;
			$scope.modalTitle = '调库';
			$('#order-details').modal('show');
		};

		$scope.fillProducts = function(order) {
			$scope.currentOrder = order;
			$scope.modalTitle = '补库';
			$('#order-details').modal('show');
		};

		$scope.printCharts = function() {
			$scope.print();
		};

		$controller('DataManager', {$scope: $scope});
	}]);