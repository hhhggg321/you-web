'use strict';

angular.module('concordyaApp')
        .controller('PurchaseOrderClassificationCtrl', ['$scope', '$translate', '$translatePartialLoader', 'UtilityService', 'APIService', 'WidgetService', 'CONSTANT.PAGE_SIZE',
          function ($scope, $translate, $translatePartialLoader, utility, api, widget, PAGE_SIZE) {
            $translatePartialLoader.addPart('financial_manage/purchase_order_classification');

            // page object
            $scope.page = {
              index: 1,
              size: PAGE_SIZE,
              total: 0
            };

            var originalList;
            api.purchaseOrderClassification.getOptions()
                    .success(function (data) {
                      $scope.optionList = data;
                      $scope.$safeApply();
                    });

            // get contact list
            function getDataList(params) {
              params = utility.checkParams($scope, params);
              api.purchaseOrderClassification.getList(params)
                      .success(function (data, status) {
                        if (status === 200) {
                          $scope.dataList = data.list;
                          originalList = _.cloneDeep($scope.dataList);
                          $scope.page.total = data.totalCount;
                          $scope.$safeApply();
                        }
                      });
            }

            // watch page.index
            utility.watchPageIndex($scope, function (newIndex) {
              getDataList({
                'pageIndex': newIndex,
                'pageSize': $scope.page.size
              });
            });

            // search
            $scope.search = function (flag) {
              var params = {
                'pageIndex': 1,
                'pageSize': $scope.page.size
              };
              switch (flag) {
                case 0:
                  params.isChecked = true;
                  break;
                case 1:
                  params.isChecked = false;
                  break;
                case 2:
                  params.isGenerationAccountVoucher = true;
                  break;
              }
              getDataList(params);
            };

            // trigger item
            $scope.triggerItem = function (item) {
              var dataList = _.filter($scope.dataList, function (item) {
                return !item.bill.isClassificationFinish;
              });
              utility.triggerSelect(item, dataList, 'isChecked');
            };

            $scope.applyForm = {
              option: null,
              feeOption: null
            };
            // apply
            $scope.apply = function () {
              var form = $scope.applyForm;
              if (form.option) {
                var option = form.option.isFeeOption ? form.feeOption : form.option;
                if (option) {
                  _.forEach($scope.dataList, function (item) {
                    if (item.isChecked && !item.bill.isClassificationFinish) {
                      item.accountingCategory = option;
                    }
                  });
                }
              }
            };

            // save
            $scope.save = function () {
              var list = [],
                      emptyCategory = false;
              var diff = utility.getDiff(originalList, $scope.dataList);
              _.forEach(diff, function (item) {
                if (!item.bill.isClassificationFinish) {
                  if (item.accountingCategory) {
                    list.push({
                      'id': item.id,
                      'accountingCategoryId': item.accountingCategory.id
                    });
                  } else {
                    emptyCategory = true;
                    return;
                  }
                }
              });

              if (emptyCategory) {
                widget.showError($translate.instant('PURCHASE.MESSAGE_ERROR_EMPTY_ACCOUNTING_CATEGORY'));
                return;
              }

              if (list && list.length > 0) {
                api.purchaseOrderClassification.update({'purchaseOrderClassifications': list})
                        .success(function () {
                          widget.showSuccess($translate.instant('PURCHASE.MESSAGE_UPDATE_SUCCESS'));
                          getDataList();
                        });
              } else {
                widget.showError($translate.instant('COMMON.SELECT_OPERATE_ITEM'));
              }
            };

            // cancel
            $scope.cancel = function () {
              $scope.dataList = originalList;
            };
          }
        ]);
