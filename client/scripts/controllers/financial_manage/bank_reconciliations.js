'use strict';

angular.module('concordyaApp')
        .controller('BankReconciliationsCtrl', ['$scope', '$translate', '$translatePartialLoader', 'APIService', 'UtilityService', 'WidgetService', 'CONSTANT.PAGE_SIZE',
          function ($scope, $translate, $translatePartialLoader, api, utility, widget, PAGE_SIZE) {
            $translatePartialLoader.addPart('financial_manage/bank_reconciliations');

            // page object
            $scope.page = {
              index: 1,
              size: PAGE_SIZE,
              total: 0
            };

            $scope.searchForm = {
              year: null,
              month: null,
              status: null
            };

            /* get init data start */
            // get accountant-list
            api.account.getAccountantList()
                    .success(function (data) {
                      $scope.accountantList = data;
                      $scope.$safeApply();
                    });
            // get cashier-list
            api.account.getCashierList()
                    .success(function (data) {
                      $scope.cashierList = data;
                      $scope.$safeApply();
                    });
            // get active-user-list
            api.account.getActiveUserList()
                    .success(function (data) {
                      $scope.activeUserList = data;
                      $scope.$safeApply();
                    });
            // get year list
            api.date.getYearList()
                    .success(function (data) {
                      $scope.yearList = data;
                      $scope.$safeApply();
                    });
            // get month list
            api.date.getMonthList()
                    .success(function (data) {
                      $scope.monthList = data;
                      $scope.$safeApply();
                    });
            // get dict object
            api.bankStatements.getStatusList()
                    .success(function (data) {
                      $scope.statusList = data;
                      $scope.$safeApply();
                    });
            /* get init data end */

            var originalList, originalBalanceSheet;
            $scope.search = function (form) {
              if (form.$valid) {
                var params = {
                  'year': $scope.searchForm.year && $scope.searchForm.year.id,
                  'month': $scope.searchForm.month && $scope.searchForm.month.id,
                  'status': $scope.searchForm.status && $scope.searchForm.status.id
                };

                // get bank-statement-list
                $scope.dataList = [];
                api.bankStatements.getList(params)
                        .success(function (data) {
                          $scope.dataList = data.list;
                          originalList = _.cloneDeep($scope.dataList);
                          $scope.$safeApply();
                        });

                // get balance-sheet
                $scope.balanceSheet = {};
                api.balanceSheet.get(params)
                        .success(function (data) {
                          $scope.balanceSheet = data;
                          originalBalanceSheet = _.cloneDeep($scope.balanceSheet);
                          $scope.$safeApply();
                        });
              } else {
                utility.addErrorClass(form);
              }
            };

            $scope.save = function (form) {
              if (form.$valid) {
                var diff = utility.getDiff(originalList, $scope.dataList);
                if (diff && diff.length > 0) {
                  var data = [];
                  _.forEach(diff, function (item) {
                    if (item.isSelected) {
                      item.year = $scope.searchForm.year && $scope.searchForm.year.id;
                      item.month = $scope.searchForm.month && $scope.searchForm.month.id;
                      data.push(item);
                    }
                  });

                  api.bankStatements.update(data)
                          .success(function () {
                            widget.showSuccess($translate.instant('BANK_RECONCILIATIONS.MESSAGE_UPDATE_SUCCESS'));
                            $scope.search(form);
                          });
                }
              } else {
                utility.addErrorClass(form);
              }
            };

            $scope.cancel = function (form) {
              utility.addErrorClass(form);
              $scope.dataList = originalList;
            };

            // save balance
            $scope.saveBalance = function (form) {
              if (form.$valid) {
                if ($scope.balanceSheet) {
                  var data = $scope.balanceSheet;
                  data.year = data.year || $scope.searchForm.year && $scope.searchForm.year.id;
                  data.month = data.month || $scope.searchForm.month && $scope.searchForm.month.id;

                  if (data.year && data.month) {
                    data.personInChargeId = data.personInCharge && data.personInCharge.id;
                    data.accountantId = data.accountant && data.accountant.id;
                    data.cashieId = data.cashie && data.cashie.id;

                    if (data.id) {
                      api.balanceSheet.update(data.id, data)
                              .success(function () {
                                widget.showSuccess($translate.instant('BANK_RECONCILIATIONS.MESSAGE_UPDATE_SUCCESS'));
                                $scope.search(form);
                              });
                    } else {
                      api.balanceSheet.create(data)
                              .success(function () {
                                widget.showSuccess($translate.instant('BANK_RECONCILIATIONS.MESSAGE_UPDATE_SUCCESS'));
                                $scope.search(form);
                              });
                    }
                  } else {
                    widget.showSuccess($translate.instant('BANK_RECONCILIATIONS.CHOOSE_YEAR_MONTH'));
                  }
                }
              } else {
                utility.addErrorClass(form);
              }
            };

            // cancel balance
            $scope.cancelBalance = function (form) {
              utility.addErrorClass(form);
              $scope.balanceSheet = originalBalanceSheet;
            };
          }
        ]);
            