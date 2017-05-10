'use strict';

angular.module('concordyaApp')
  .controller('ReportFinancialCtrl', ['$rootScope', '$scope', '$translate', '$translatePartialLoader', 'APIService', 'StorageService', 'UtilityService', 'WidgetService',
    function($rootScope, $scope, $translate, $translatePartialLoader, api, storage, utility, widget) {
      var currentUser = storage.getCurrentUser();
      // add multi-lang file
      $translatePartialLoader.addPart('reports/accoundant');

      $scope.searchForm = {
        year: null,
        month: null
      };

      $scope.reportType = 0;
      $scope.$watch("reportType", function(newValue, oldValue) {
        $scope.search();
      });


      $scope.percentDisplay = {
        saleRate: $translate.instant('ACCOUNDANT.MAKE_PROFIT_SALE_RATE'),
        saleCostRate: $translate.instant('ACCOUNDANT.MAKE_PROFIT_SALE_COST_RATE'),
        manageCostRate: $translate.instant('ACCOUNDANT.MAKE_PROFIT_MANAGE_COST_RATE'),
        fiananceRate: $translate.instant('ACCOUNDANT.MAKE_PROFIT_FIANANCE_RATE'),
        flowDebit: $translate.instant('ACCOUNDANT.FLOW_DEBIT'),
        salesProfitRate: $translate.instant('ACCOUNDANT.SALES_PROFIT_RATE'),
        assetProfitRate: $translate.instant('ACCOUNDANT.ASSET_PROFIT_RATE')
      };

      $scope.dayDisplay = {
        receiveTurnoverDay: $translate.instant("ACCOUNDANT.RECEIVABLES_TURNOVER_DAY"),
        storeTurnoverDay: $translate.instant("ACCOUNDANT.STORE_TURNOVER_DAY"),
      }

      $scope.getIntNumber = function(number) {
        return Math.round(number);
      }

      //获取所有会计期间
      var accountingPeriods;
      api.company.getAccountingPeriod(currentUser.currentCompanyId)
        .success(function(data) {
          var currentYear = data.currentYear,
            currentMonth = data.currentMonth;
          accountingPeriods = data.accountingPeriods;

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
          //获取当前时间的默认数据
          $scope.search();
        });

      // 获取时间段月份列表
      function getMonthList(year) {
        var period = _.filter(accountingPeriods, function(item) {
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
      $scope.changeYear = function(year) {
        $scope.monthList = getMonthList(year);
        $scope.searchForm.month = $scope.monthList[0];
        $scope.$safeApply();
      };

      // search
      $scope.search = function(subtype) {
        var type = 3;
        var subType_val = subtype !== undefined ? subtype : $scope.reportType ? $scope.reportType : 0;
        $scope.reportType = subType_val;
        var params = {
          'year': $scope.searchForm.year && $scope.searchForm.year.id,
          'month': $scope.searchForm.month && $scope.searchForm.month.id
        };

        if (params.year != null && params.month != null) {
          // get list
          $scope.dataList = [];
          api.accountReport.view(params.year, params.month, type, subType_val)
            .success(function(data) {
              $scope.dataList = data.singleAccountReportDetailBaseModels;
              $scope.downloadUrl = $rootScope.apiUrlPrefix + 'accountreport/download/' + currentUser.currentCompanyId + '/' + params.year + '/' + params.month + '/' + type + '?accountReportSubType=' + subType_val;
              $scope.$safeApply();
            });
        };
      };

      $scope.print = function() {
        window.print();
      };

      // trigger pettyCash selected status
      $scope.triggerItem = function(item) {
        utility.triggerSelect(item, $scope.dataList);
      };

      $scope.generate = function() {
        var ids = utility.getSelectedIds($scope.dataList);
        if (ids && ids.length > 0) {
          api.accountReport.generate(ids)
            .success(function() {
              widget.showSuccess($translate.instant('ACCOUNDANT.MESSAGE_GENERATE_REPORT_SUCCESS'));
              $scope.search();
              $scope.$safeApply();
            });
        } else {
          widget.showError($translate.instant('COMMON.SELECT_OPERATE_ITEM'));
        }
      };


    }
  ]);
