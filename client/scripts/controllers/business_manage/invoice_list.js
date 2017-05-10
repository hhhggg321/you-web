'use strict';
angular.module('concordyaApp')
  .controller('InvoiceListCtrl', ['$scope', '$state', '$translate', '$translatePartialLoader', 'APIService', 'UtilityService', 'EnumParseService', 'WidgetService', 'ModalBoxService', 'CONSTANT.PAGE_SIZE',
    function ($scope, $state, $translate, $translatePartialLoader, api, utility, enumParse, widget, modalBox, PAGE_SIZE) {
      // add multi-lang file for setting/contact page
      $translatePartialLoader.addPart('business_manage/bill_invoice');

      api.invoice.getStatusEnum()
        .success(function (data) {
          $scope.statusList = data;
        });

      // page object
      $scope.page = {
        index: 1,
        size: PAGE_SIZE,
        total: 0
      };
      $scope.summary = {
        totalAmount: 0
      };

      // trigger date-picker
      $scope.triggerPicker = function ($event, type) {
        $event.preventDefault();
        $event.stopPropagation();

        switch (type) {
          case 'start':
            $scope.startIsOpened = !$scope.startIsOpened;
            break;
          case 'end':
            $scope.endIsOpened = !$scope.endIsOpened;
            break;
        }
      };

      // enumParse data-list
      function parseData(list) {
        var ret = [];
        _.forEach(list, function (item) {
          ret.push({
            'id': item.id,
            'invoiceNumber': item.invoiceNumber,
            'attachment': item.attachment && item.attachment.length || 0,
            'client': item.contact && item.contact.name,
            'invoiceDate': item.invoiceDate,
            'total': item.total,
            'status': enumParse.invoice.getStatus(item.status),
            'currentAccountVoucher': item.currentAccountVoucher
          });
        });
        return ret;
      }

      // search form
      $scope.searchForm = {
        'status': null,
        'beginTime': null,
        'endTime': null,
        'matchName': null
      };

      function getSearchFormParams(params) {
        if ($scope.searchForm.status && $scope.searchForm.status.id !== -1) {
          params.status = $scope.searchForm.status.id;
        }
        if ($scope.searchForm.beginTime) {
          //params.beginTime = moment($scope.searchForm.beginTime).valueOf();
          params.beginTime = $scope.searchForm.beginTime.toISOString();
        }
        if ($scope.searchForm.endTime) {
          //params.endTime = moment($scope.searchForm.endTime).valueOf();
          params.endTime = $scope.searchForm.endTime.toISOString();
        }
        if ($scope.searchForm.text) {
          params.text = $scope.searchForm.text;
        }
      }

      // get bill list
      function getDataList(params) {
        params = utility.checkParams($scope, params);
        getSearchFormParams(params);

        api.invoice.getList(params)
          .success(function (data, status) {
            if (status === 200) {
              $scope.dataList = parseData(data.list);
              $scope.page.total = data.totalCount;
              $scope.$safeApply();
            }
          });
      }

      getDataList();

      // watch page.index
      utility.watchPageIndex($scope, function (newIndex) {
        getDataList({
          'pageIndex': newIndex,
          'pageSize': $scope.page.size
        });
      });

      // get invoice list
      $scope.search = function (form) {
        if (form.$valid) {
          widget.hideMessage();
          getDataList();
        } else {
          utility.addErrorClass(form);
        }
      };

      // watch invoice list
      var cancelWatchInvoice = $scope.$watch('dataList', function (newVal) {
        if (newVal) {
          var selectedItems = utility.getSelectedItem($scope.dataList);
          if (selectedItems.length > 0) {
            $scope.summary.totalAmount = _.sum(selectedItems, function (item) {
              return item.total || 0;
            });
          }
        }
      }, true);
      // remove watch on state-change for performance reason
      $scope.$on('$stateChangeStart', function () {
        cancelWatchInvoice();
      });

      // trigger invoice selected status
      $scope.triggerItem = function (item) {
        utility.triggerSelect(item, $scope.dataList);
      };

      // goto add invoice page
      $scope.addNew = function () {
        $state.go('business/invoice');
      };

      // import invoices
      $scope.import = function () {

      };

      // approve action
      $scope.submit = function () {
        var ids = utility.getSelectedIds($scope.dataList);
        if (ids && ids.length > 0) {
          api.invoice.submit(ids)
            .success(function () {
              widget.showSuccess($translate.instant('BILL_INVOICE.MESSAGE_SUBMIT_INVOICE_SUCCESS'));
              getDataList();
            });
        } else {
          widget.showError($translate.instant('COMMON.SELECT_OPERATE_ITEM'));
        }
      };

      // delete action
      $scope.delete = function () {
        var ids = utility.getSelectedIds($scope.dataList);
        if (ids && ids.length > 0) {
          api.invoice.delete(ids)
            .success(function (data, status) {
              if (status === 200) {
                if (data.failedIds.length > 0) {
                  widget.showError($translate.instant('COMMON.DELETE_ERROR') + data.failedIds.length + $translate.instant('COMMON.ITEM') + "    " + $translate.instant('COMMON.DELETE_SUCCESS') + data.successIds.length + $translate.instant('COMMON.ITEM'));
                  getDataList();
                } else {
                  widget.showSuccess($translate.instant('BILL_INVOICE.MESSAGE_DELETE_INVOICE_SUCCESS'));
                  getDataList();
                }
              }
            });
        } else {
          widget.showError($translate.instant('COMMON.SELECT_OPERATE_ITEM'));
        }
      };

      //enter key down
      $scope.enterKeyDown = function(event){
        if(event.keyCode === 13){
          $scope.search($scope.searchForm);
        }
      };

    }]);
