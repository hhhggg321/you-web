'use strict';

angular.module('concordyaApp')
        .controller('ReportAccoundantCtrl', ['$rootScope', '$scope', '$translate', '$translatePartialLoader', 'APIService', 'StorageService', 'UtilityService', 'WidgetService',
          function ($rootScope, $scope, $translate, $translatePartialLoader, api, storage, utility, widget) {
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

            $scope.showStructure = false;

            //获取所有会计期间
            var accountingPeriods;
            api.company.getAccountingPeriod(currentUser.currentCompanyId)
                    .success(function (data) {
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

            // search
            $scope.search = function (type) {
              var type_val = type !== undefined ? type : $scope.reportType ? $scope.reportType : 0;
              $scope.reportType = type_val;
              var params = {
                'year': $scope.searchForm.year && $scope.searchForm.year.id,
                'month': $scope.searchForm.month && $scope.searchForm.month.id
              };

              // get list
              $scope.dataList = [];
              if (params.year != null && params.month != null) {
                api.accountReport.getList(params.year, params.month, type_val)
                        .success(function (data) {
                          $scope.dataList = data.singleAccountReportDetailBaseModels;
                          var isPercent = $scope.showStructure ? "isSelectedPercent=true" : "isSelectedPercent=false";
                          $scope.url_prefix = $rootScope.apiUrlPrefix + 'accountreport/download/' + currentUser.currentCompanyId + '/' + params.year + '/' + params.month + '/' + type_val + "?";
                          $scope.url_suffix = isPercent;
                          $scope.downloadUrl = $scope.url_prefix + $scope.url_suffix;
                          $scope.$safeApply();
                        });
              };
            };

            $scope.print = function(){
              window.print();
            };

            // trigger pettyCash selected status
            $scope.triggerItem = function (item) {
              utility.triggerSelect(item, $scope.dataList);
            };

            $scope.generate = function () {
              var ids = utility.getSelectedIds($scope.dataList);
              if (ids && ids.length > 0) {
                api.accountReport.generate(ids)
                        .success(function () {
                          widget.showSuccess($translate.instant('ACCOUNDANT.MESSAGE_GENERATE_REPORT_SUCCESS'));
                          $scope.search();
                          $scope.$safeApply();
                        });
              } else {
                widget.showError($translate.instant('COMMON.SELECT_OPERATE_ITEM'));
              }
            };

            $scope.lock = function (flag) {
              var ids = utility.getSelectedIds($scope.dataList);
              if (ids && ids.length > 0) {
                var data = {
                  'ids': ids,
                  'locked': flag
                };
                api.accountReport.lock(data)
                        .success(function () {
                          if (flag) {
                            widget.showSuccess($translate.instant('MESSAGE_LOCK_REPORT_SUCCESS'));
                          } else {
                            widget.showSuccess($translate.instant('MESSAGE_UNLOCK_REPORT_SUCCESS'));
                          }
                        });
              } else {
                widget.showError($translate.instant('COMMON.SELECT_OPERATE_ITEM'));
              }
            };

            $scope.changeStructure = function(){
              var isPercent = $scope.showStructure ? "isSelectedPercent=true" : "isSelectedPercent=false";
              $scope.url_suffix = isPercent;
              $scope.downloadUrl = $scope.url_prefix + $scope.url_suffix;
            };

            $scope.verify = function () {
              var ids = utility.getSelectedIds($scope.dataList);
              if (ids && ids.length > 0) {
                var data = {
                  'ids': ids
                };
                api.accountReport.verify(data)
                        .success(function () {
                          widget.showSuccess($translate.instant('MESSAGE_VERIFY_REPORT_SUCCESS'));
                        });
              } else {
                widget.showError($translate.instant('COMMON.SELECT_OPERATE_ITEM'));
              }
            };
          }]);
