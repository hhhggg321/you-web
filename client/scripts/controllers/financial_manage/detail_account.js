'use strict';

angular.module('concordyaApp')
  .controller('DetailAccountCtrl', ['$scope', '$translate', '$state', '$stateParams', '$translatePartialLoader', 'APIService', 'StorageService', 'UtilityService',
    function ($scope, $translate, $state, $stateParams, $translatePartialLoader, api, storage, utility) {
      // add multi-lang file for setting/category page
      $translatePartialLoader.addPart('financial_manage/detail_account');

      var currentUser = storage.getCurrentUser();

      $scope.searchForm = {
        accountCategory: null,
        month: null,
        year: null,
        accountType: {
          id: 1,
          name: $translate.instant('DETAIL_ACCOUNT.CURRENT_HAPPENED')
        }
      };

      // 生成统计类型
      api.detailAccount.getAccountTypes()
        .success(function (data) {
          $scope.acconutTypes = data;
          $scope.$safeApply();
        });

      // 会计区间
      var accountPeriods = {};
      // 根据年份获取当年会计区间
      function getMonthsByYear(year) {
        var monthList = [];
        _.forEach(accountPeriods, function (item) {
          if (item.year === year) {
            monthList = utility.map(item.months);
            return;
          }
        });
        return monthList;
      }

      // 根据年月获取会计科目
      function loadAccountCategoriesByPeriod(isSearch) {
        // 获取区间科目列表
        var form = $scope.searchForm;
        api.accountCategory.getPeriodCategoryList({
          'year': form.year.id,
          'month': form.month.id
        }).success(function (data) {
          $scope.accountCategories = data;
          form.accountCategory = data[0];
          if ($stateParams.id !== null) {
            _.forEach(data, function (item) {
              if ($stateParams.id === item.id) {
                form.accountCategory = item;
              }
            });
          }
          $scope.$safeApply();
          if (isSearch) {
            $scope.search();
          }
        });
      }

      // 获取所有会计区间
      api.company.getAccountingPeriod(currentUser.currentCompanyId)
        .success(function (data) {
          accountPeriods = data.accountingPeriods;
          var endPeriod = accountPeriods[accountPeriods.length - 1],
            endYear = endPeriod.year,
            endMonth = endPeriod.months[endPeriod.months.length - 1];
          $scope.searchForm.year = {
            id: endYear,
            name: endYear
          };
          $scope.searchForm.month = {
            id: endMonth,
            name: endMonth
          };
          $scope.yearList = utility.map(data.years);
          $scope.monthList = getMonthsByYear(endYear);
          $scope.searchForm.accountType = {
            id: 1,
            name: $translate.instant('DETAIL_ACCOUNT.CURRENT_HAPPENED')
          };
          loadAccountCategoriesByPeriod(true);
        });

      // 监听年份变化
      $scope.changeYear = function () {
        var year = $scope.searchForm.year.id;
        $scope.monthList = getMonthsByYear(year);
        $scope.searchForm.month = $scope.monthList[0];
        loadAccountCategoriesByPeriod();
      };

      //监听月份变化
      $scope.changeMonth = function () {
        loadAccountCategoriesByPeriod();
      };

      // 单机选中单行
      $scope.selectVoucher = function (item) {
        _.forEach($scope.dataList, function (data) {
          if (data !== item) {
            data.selected = false;
          }
        });
        item.selected = !item.selected;
        $scope.selectedItem = null;
        if (item.selected && item.accountVoucherId) {
          $scope.selectedItem = item;
        }
      };

      // 联查凭证
      $scope.gotoVoucher = function () {
        $state.go('finance/voucher', {
          id: $scope.selectedItem.accountVoucherId,
          categoryId: $scope.searchForm.accountCategory && $scope.searchForm.accountCategory.id
        });
      };

      // search action
      $scope.search = function () {
        var form = $scope.searchForm;
        if (form.year) {
          api.detailAccount.getList({
            'accountCategoryId': form.accountCategory && form.accountCategory.id,
            'year': form.year && form.year.id,
            'month': form.month && form.month.id,
            'isCurrentPeriod': form.accountType && (parseInt(form.accountType.id) === 1 ? true : false)
          }).success(function (data, status) {
            if (status === 200) {
              _.forEach(data, function (item) {
                if (item.accountVoucherNumber !== null) {
                  item.accountVoucherNumber = item.accountVoucherNumber;
                }
              });
              $scope.dataList = data;
              $scope.$safeApply();
            }
          });
        }
        ;

      };
    }]);
