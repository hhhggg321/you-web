'use strict';

angular.module('concordyaApp')
        .controller('InventoryCtrl', ['$scope', '$translate', '$translatePartialLoader', 'APIService', 'WidgetService', 'UtilityService', 'EnumParseService', 'ModalBoxService', 'CONSTANT.PAGE_SIZE',
          function ($scope, $translate, $translatePartialLoader, api, widget, utility, enumParse, modalBox, PAGE_SIZE) {
            // add multi-lang file for setting/inventory page
            $translatePartialLoader.addPart('basic_setting/inventory');

            // page object
            $scope.page = {
              index: 1,
              size: PAGE_SIZE,
              total: 0
            };

            // enumParse data-list
            function parseData(list) {
              var ret = [];
              _.forEach(list, function (item) {
                ret.push({
                  'id': item.id,
                  'code': item.code,
                  'name': item.name,
                  'accountingCategoryModel': item.accountingCategoryModel,
                  'taxRate': item.taxRate,
                  'isForBuy': enumParse.common.parseBoolean(item.isForBuy),
                  'isForSell': enumParse.common.parseBoolean(item.isForSell),
                  'description': item.description
                });
              });
              return ret;
            }

            // get inventory list
            function getDataList(params) {
              params = utility.checkParams($scope, params);

              api.inventoryItem.getList(params)
                      .success(function (data, status) {
                        if (status === 200) {
                          $scope.dataList = parseData(data.list);
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
            $scope.search = function () {
              widget.hideMessage();
              getDataList();
            };

            // add action
            $scope.addNew = function () {
              modalBox.openNewInventory()
                      .result.then(function () {
                        widget.showSuccess($translate.instant('INVENTORY.MESSAGE_NEW_SUCCESS'));
                        getDataList();
                      });
            };

            // edit action
            $scope.edit = function (item) {
              modalBox.openNewInventory(item)
                      .result.then(function () {
                        widget.showSuccess($translate.instant('INVENTORY.MESSAGE_UPDATE_SUCCESS'));
                        getDataList();
                      });
            };

            // delete action
            $scope.delete = function () {
              var ids = utility.getSelectedIds($scope.dataList);
              if (ids && ids.length > 0) {
                api.inventoryItem.delete(ids)
                        .success(function (data,status) {
                        if (status === 200) {
                          if(data.failedIds.length > 0){
                            widget.showError($translate.instant('COMMON.DELETE_ERROR')+data.failedIds.length+$translate.instant('COMMON.ITEM')+"    "+$translate.instant('COMMON.DELETE_SUCCESS')+data.successIds.length+$translate.instant('COMMON.ITEM'));
                            getDataList();
                          }else{
                            widget.showSuccess($translate.instant('INVENTORY.MESSAGE_DELETE_SUCCESS'));
                            getDataList();
                          }
                        }
                        });
              } else {
                widget.showSuccess($translate.instant('INVENTORY.MESSAGE_SELECT_OPERATE_ITEM'));
              }
            };

            // trigger inventory selected status
            $scope.triggerItem = function (item) {
              utility.triggerSelect(item, $scope.dataList);
            };
          }]);
