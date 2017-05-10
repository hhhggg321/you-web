'use strict';

angular.module('concordyaApp')
        .controller('TaxRateCtrl', ['$scope', '$translate', '$translatePartialLoader', 'APIService', 'WidgetService', 'UtilityService', 'ModalBoxService', 'CONSTANT.PAGE_SIZE',
          function ($scope, $translate, $translatePartialLoader, api, widget, utility, modalBox, PAGE_SIZE) {
            // add multi-lang file for setting_tax page
            $translatePartialLoader.addPart('basic_setting/tax_rate');

            // page object
            $scope.page = {
              index: 1,
              size: PAGE_SIZE,
              total: 0
            };

            // get tax-rate list
            function getDataList(params) {
              params = utility.checkParams($scope, params);
              // get taxRate list
              api.taxRate.getList()
                      .success(function (data, status) {
                        if (status === 200) {
                          $scope.dataList = data.list;
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
              modalBox.openNewTaxRate()
                      .result.then(function () {
                        widget.showSuccess($translate.instant('TAXRATE.MESSAGE_NEW_SUCCESS'));
                        getDataList();
                      });
            };

            // edit action
            $scope.edit = function (item) {
              modalBox.openNewTaxRate(item)
                      .result.then(function () {
                        widget.showSuccess($translate.instant('TAXRATE.MESSAGE_UPDATE_SUCCESS'));
                        getDataList();
                      });
            };

            // delete action
            $scope.delete = function () {
              var ids = utility.getSelectedIds($scope.dataList);
              if (ids && ids.length > 0){
                api.taxRate.delete(ids)
                        .success(function (data, status) {
                          if (status === 200) {
                            widget.showSuccess($translate.instant('TAXRATE.MESSAGE_DELETE_SUCCESS'));
                            getDataList();
                          }
                        });
              }else {
                widget.showError($translate.instant('COMMON.SELECT_OPERATE_ITEM'));
              }
            };

            // trigger contact selected status
            $scope.triggerItem = function (item) {
              utility.triggerSelect(item, $scope.dataList);
            };
          }]);