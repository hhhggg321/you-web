'use strict';
angular.module('concordyaApp')
  .controller('VoucherListCtrl', ['$scope', '$state', '$translate', '$translatePartialLoader', 'APIService', 'UtilityService', 'WidgetService', 'ModalBoxService', 'StorageService', 'CONSTANT.PAGE_SIZE',
    function ($scope, $state, $translate, $translatePartialLoader, api, utility, widget, modalBox, storage, PAGE_SIZE) {
      // add multi-lang file for setting/contact page
      $translatePartialLoader.addPart('financial_manage/voucher');

      var currentUser = storage.getCurrentUser();
      $scope.currentUser = currentUser;

      // page object
      $scope.page = {
        index: 1,
        size: PAGE_SIZE,
        total: 0
      };

      $scope.searchForm = {
        year: null,
        month: null,
        number: null,
        summary: null,
        status: null
      };

      $scope.statusList = [
        {name: '全部'},
        {id: 0, name: '待确认'},
        {id: 1, name: '待审核'},
        {id: 2, name: '待记账'},
        {id: 3, name: '已记账'}
      ];

      //获取所有会计期间
      var accountingPeriods;
      api.company.getAccountingPeriod(currentUser.currentCompanyId)
        .success(function (data) {
          var currentYear = data.currentYear,
            currentMonth = data.currentMonth;
          accountingPeriods = data.accountingPeriods;

          $scope.searchForm.status = $scope.statusList[0];

          $scope.searchForm.year = {
            id: currentYear,
            name: currentYear
          };

          $scope.searchForm.month = {
            id: currentMonth,
            name: currentMonth
          };

          // 获取时间段年份列表
          $scope.yearList = utility.map(data.years);
          $scope.monthList = getMonthList(currentYear);
          $scope.$safeApply();
        });

      // 获取时间段月份列表
      function getMonthList(year) {
        var period = _.filter(accountingPeriods, function (item) {
          return item.year === year;
        });
        if (period.length > 0) {
          period = period[0];
          return utility.map(period.months);
        } else {
          return [];
        }
      }

      // 当年份改变时,获取月份
      $scope.changeYear = function (year) {
        $scope.monthList = getMonthList(year);
        $scope.searchForm.month = $scope.monthList[0];
        $scope.$safeApply();
      };

      //reorder
      $scope.reorder = function() {
        modalBox.openReorderVoucher($scope.dataList)
          .result.then(function () {
            widget.showSuccess($translate.instant('更改凭证顺序成功！'));
            $scope.search();
          });
      };

      // add-new
      $scope.addNew = function () {
        $state.go('finance/voucher');
      };

      //insert new voucher
      $scope.insert = function (item) {
        var msg = $translate.instant('VOUCHER.MESSAGE_INSERT_VOUCHER');
        modalBox.openConfirm(msg)
          .result.then(function () {
            $state.go('finance/voucher', {
              id: item.id,
              isReplace: true,
              createdOn: item.createdOn
            });
          });
      };

      // get voucher list
      function getDataList(params) {
        var voucherListData = {};

        params = utility.checkParams($scope, params);
        params.year = $scope.searchForm.year && $scope.searchForm.year.id;
        params.month = $scope.searchForm.month && $scope.searchForm.month.id;
        params.number = $scope.searchForm.number;
        params.description = $scope.searchForm.summary;
        params.status = $scope.searchForm.status && $scope.searchForm.status.id;

        // get bank-statement-list
        $scope.dataList = [];
        api.voucher.getList(params)
          .success(function (data) {
            $scope.dataList = data.list;
            $scope.page.total = data.totalCount;
            voucherListData.prev = data.prev;
            voucherListData.next = data.next;
            voucherListData.list = [];
            _.forEach(data.list, function(item) {
              voucherListData.list.push({
                id: item.id
              });
            });
            storage.setCookie('voucherList', voucherListData);
            $scope.$safeApply();
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
        var params = {
          'pageIndex': 1,
          'pageSize': $scope.page.size
        };

        getDataList(params);
      };

      // trigger bill selected status
      $scope.triggerItem = function (item) {
        utility.triggerSelect(item, $scope.dataList);
      };

      // delete action
      $scope.delete = function() {
        widget.hideMessage();
        var ids = utility.getSelectedIds($scope.dataList);
        if(ids && ids.length > 0){
          var selectedItems = utility.getSelectedItem($scope.dataList);
          var audited = false;
          _.forEach(selectedItems,function(item){
            if(item.checker){
              audited = true;
              widget.showError($translate.instant('审核后的凭证不能删除！'));
            }
            if(item.sourceId){
              audited = true;
              widget.showError($translate.instant('此凭证由业务单据生成，不能删除！'));
            }
          });
          if(!audited){
            var msg = "您确定要删除凭证吗？";
            modalBox.openConfirm(msg)
              .result.then(function () {
                api.voucher.delete(ids)
                  .success(function (data, status) {
                    if (status === 200) {
                      if(data.failedIds.length > 0){
                        widget.showError($translate.instant('COMMON.DELETE_ERROR')+data.failedIds.length+$translate.instant('COMMON.ITEM')+"    "+$translate.instant('COMMON.DELETE_SUCCESS')+data.successIds.length+$translate.instant('COMMON.ITEM'));
                      }else{
                        widget.showSuccess($translate.instant('VOUCHER.MESSAGE_VOUCHER_DELETE_SUCCESS'));
                      }
                    }
                    $scope.search();
                  });
              });
          }
        }else{
          widget.showError($translate.instant('COMMON.SELECT_OPERATE_ITEM'));
        }
      };

      $scope.sterilize = function () {
        var ids = utility.getSelectedIds($scope.dataList);
        if (ids && ids.length > 0) {
          var msg = '您确认要冲销凭证？';
          modalBox.openConfirm(msg)
            .result.then(function () {
              api.voucher.sterilize(ids)
                .success(function () {
                  widget.showSuccess($translate.instant('VOUCHER.MESSAGE_STERILIZE_SUCCESS'));
                  $scope.search();
                });
            });
        } else {
          widget.showError($translate.instant('COMMON.SELECT_OPERATE_ITEM'));
        }
      };

      // account
      $scope.account = function () {
        var ids = utility.getSelectedIds($scope.dataList);
        if (ids && ids.length > 0) {
          api.voucher.account(ids)
            .success(function () {
              widget.showSuccess($translate.instant('VOUCHER.MESSAGE_ACCOUNT_SUCCESS'));
              $scope.search();
            });
        } else {
          widget.showError($translate.instant('COMMON.SELECT_OPERATE_ITEM'));
        }
      };

      // rollback account
      $scope.rollbackAccount = function () {
        var ids = utility.getSelectedIds($scope.dataList);
        if (ids && ids.length > 0) {
          api.voucher.rollbackAccount(ids)
            .success(function () {
              widget.showSuccess($translate.instant('VOUCHER.MESSAGE_ROLLBACK_ACCOUNT_SUCCESS'));
              $scope.search();
            });
        } else {
          widget.showError($translate.instant('COMMON.SELECT_OPERATE_ITEM'));
        }
      };

      // audit
      $scope.audit = function () {
        var ids = utility.getSelectedIds($scope.dataList);

        if (ids && ids.length > 0) {
          api.voucher.audit(ids)
            .success(function () {
              widget.showSuccess($translate.instant('VOUCHER.MESSAGE_AUDIT_SUCCESS'));
              $scope.search();
            });
        } else {
          widget.showError($translate.instant('COMMON.SELECT_OPERATE_ITEM'));
        }
      };

      // rollback audit
      $scope.rollbackAudit = function () {
        var ids = utility.getSelectedIds($scope.dataList);

        if (ids && ids.length > 0) {
          api.voucher.rollbackAudit(ids)
            .success(function () {
              widget.showSuccess($translate.instant('VOUCHER.MESSAGE_ROLLBACK_AUDIT_SUCCESS'));
              $scope.search();
            });
        } else {
          widget.showError($translate.instant('COMMON.SELECT_OPERATE_ITEM'));
        }
      };

      //enter key down
      $scope.enterKeyDown = function(event){
        if(event.keyCode === 13){
          $scope.search();
        }
      };
    }]);
