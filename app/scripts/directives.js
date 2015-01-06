// generate input field in form
uud.directive('uuInput', function() {
	return {
		scope: {
			label: '@',
			name: '@',
			model: '=?'
		},
		link: function(scope, elem, attrs) {
			scope.labelCol = 'col-xs-' + (attrs.lCol || 4);
			scope.labelOffset = attrs.lOffset ? ('col-xs-' + attrs.lOffset) : '';
			scope.inputCol = 'col-xs-' + (attrs.rCol || 4);
			scope.inputOffset = attrs.rOffset ? ('col-xs-' + attrs.rOffset) : '';
			scope.type = attrs.type || 'text';
			scope.prefix = attrs.prefix || '';
		},
		template: '<div class="form-group">' +
						'<label class="control-label {{ labelCol }} {{ labelOffset }}" for="{{name}}">{{label}}:</label>' +
						'<div class="{{ inputCol }} {{ inputOffset }}">' +
							'<input type="{{ type }}" class="input-sm form-control" ng-model="model" name="{{name}}" id="{{name}}">' +
						'</div>' +
					'</div>'
	}
})

// action buttion in page
.directive('uuActionItem', function() {
	return {
		scope: {
			label: '@',
			ngClick: '&'
		},
		link: function(scope, elem, attrs) {
			scope.target = attrs.target || '#uumodal';
		},
		template: '<ul class="action-group list-inline ng-scope">' +
						'<li><a href="" ng-click="ngClick" data-toggle="modal" data-target="{{ target }}" class="action-item btn">{{label}}</a></li>' +
					'</ul>'

	}
})


// generate simple search field
.directive('uuSimpleSearch', function() {
	return {
		scope: {
			placeholder: '@',
			ngSubmit: '&',
			model: '='
		},
		link: function(scope, elem, attrs) {
			scope.placeholder = attrs.placeholder || '';
			scope.fieldtitle = attrs.fieldtitle || '';
		},
		template: '<form class="form form-horizontal form-small search-form" role="form" ng-submit="ngSubmit">' +
					'<fieldset>' +
						'<legend ng-bind="fieldtitle" ng-if="fieldtitle"></legend>' +
						'<div class="form-group">' +
							'<div style="width: 300px;" class="col-xs-6">' +
								'<input type="text" name="search-box" placeholder="{{ placeholder }}" ng-model="model" class="form-control" id="search-box">' +
							'</div>' +
							'<div style="width: 30px;" class="col-xs-2">' +
								'<button class="btn btn-default" type="submit"><span class="glyphicon glyphicon-search"></span></button>' +
							'</div>' +
						'</div>' +
					'</fieldset>' +
				'</form>'
	}
})


/**
 * generate pagination
 *
 * @param int records 总记录数
 * @param int per-page 每页显示的记录数 default: 10
 * @param int max-pages 最多显示多少页 default: 10
 * @param function action 点击页码后调用的方法
 * @param object model 需要更新的model (最好在controller中初始化: $scope.searchModel = {})
 *
 * example:
 * <div uu-pagination records="1000" per-page="20" max-pages="10" action="search()" model="searchModel.toPage"></div>
 */

.directive('uuPagination', function() {
	return {
		scope: {
			records: '=',
			perPage: '=',
			maxPages: '=',
			action: '&',
			current: '=page',
			model: '='
		},
		link: function($scope, $element, attrs, model) {

			var maxPages = $scope.maxPages || config.maxPages;
			var perPage = $scope.perPage || config.perPage;
			var start = 1;

			updatePagination();

			$scope.current = $scope.current || 1;

			function updatePagination() {
				var totalPages = Math.ceil($scope.records / perPage);
				var pages = betwwen(totalPages , 0, maxPages);
				var middlePage = start + Math.floor(pages / 2);
				var offset = 0;

				if ($scope.current > middlePage) {
					offset = $scope.current - middlePage;
					start += offset;
				}

				if ($scope.current < middlePage) {
					offset = middlePage - $scope.current;
					start -= offset;
				}


				start = betwwen(start, 1, totalPages - pages + 1)

				// update the model passed in
				$scope.model = {
					'toPage': $scope.current,
					'perPage': perPage
				}

				$scope.pages = [];

				for (var i = start; i < start + pages; i++) {
					$scope.pages.push(i)
				}

				// hide pagination when there is only one page
				if (pages <= 1) {
					$element.css('display', 'none');
				}
				return pages;
			}

			$scope.prev = function() {
				$scope.current--;
				if ($scope.current < 1) {
					$scope.current =1;
				}
				updatePagination();
			}

			$scope.to = function(page) {
				$scope.current = page;
				updatePagination();
			}

			$scope.next = function() {
				var totalPages = Math.ceil($scope.records / perPage);
				$scope.current++;
				if ($scope.current > totalPages) {
					$scope.current = totalPages;
				}
				updatePagination();
			}

			// when current page changed, call function
			$scope.$watch('current', function(current, prev, scope) {
				if(current && current !== prev) {
					scope.action();
				}
			})

			function betwwen(val, min, max) {
				if (val < min) return min;
				if (val > max) return max;
				return val;
			}
		},
		template: '<div class="pagination-wraper">' +
						'<ul class="pagination">' +
							'<li><a href="" ng-click="prev()" class="prev">&laquo;</a></li>' +
							'<li ng-repeat="page in pages" ng-class="{active : current == page}">' +
								'<a href="" ng-click="to(page)">{{page}}</a>' +
							'</li>' +
							'<li><a href="" ng-click="next()" class="next">&raquo;</a></li>' +
						'</ul>' +
					'</div>'
	}
})

// confirm dialog, require plugin jquery.confirm
.directive('uuConfirm', function() {
	return {
		scope: {
			label: '@',
			confirm: '&',
			cancel: '&'
		},
		replace: true,
		link: function(scope, elem, attrs) {
			elem.confirm({
				text: attrs.text,
				title: attrs.title,
				confirm: function() {
					scope.confirm();
				},
				cancel: function(button) {
					scope.cancel();
				},
				confirmButton: attrs.confirmBtn || "确定",
				cancelButton: attrs.cancelBtn || "取消",
				confirmButtonClass: "btn-danger"
			})
		},
		template: '<a href="">{{label}}</a>'
	}
})

// use for show error message
.directive('uuAlert', ['$animate', '$timeout', function($animate, $timeout) {
	return {
		replace: true,
		scope: false,
		template: '<div class="alert alert-{{alertLevel}}">' +
						'{{alertMsg}}' +
					'</div>',
		link: function($scope, $element, $attr) {

			$scope.hide = function() {
				$scope.alertMsg = "";
			}

			$scope.hide();
			$scope.alertMsg = $attr.msg;
			$scope.alertLevel = $attr.alertLevel;

			$scope.$watch('alertMsg', function(value) {
				if (value && value.length) {
					$animate.removeClass($element, 'ng-hide-remove');
					$animate.addClass($element, 'ng-hide-add')

					$timeout(function() {
						$scope.alertMsg = '';
					}, 2000)
				} else {
					$animate.removeClass($element, 'ng-hide-add')
					$animate.addClass($element, 'ng-hide-remove');
				}
			})
		}
	}
}]);
