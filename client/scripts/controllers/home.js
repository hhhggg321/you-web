'use strict';

angular.module('concordyaApp')
  .controller('HomeCtrl', ['$scope', '$translate', '$translatePartialLoader', '$state', '$timeout',
    'APIService', 'StorageService', 'ModalBoxService',
    function($scope, $translate, $translatePartialLoader, $state, $timeout, api, storage, modalBox) {
      $translatePartialLoader.addPart('home');

      // get current-user
      var currentUser = storage.getCurrentUser();

      $scope.currentUser = currentUser;

      $scope.years = [];
      $scope.year = null;
      $scope.months = ["--"];
      $scope.month = null;
      $scope.weeks = ["--"];
      $scope.week = null;

      $scope.noTransition = true;

      $scope.hideData = {
        hasBtn: currentUser && currentUser.isManager,
        hide: true
      };

      $scope.selectMonth = function() {
        return false;
      };

      $scope.timeSelect = [{
        id: 0,
        name: '最近30天'
      }];

      $scope.chartEarning = {
        time: $scope.timeSelect[0]
      };
      $scope.chartCost = {
        time: $scope.timeSelect[0]
      };

      $scope.switchData = function() {
        $scope.hideData.hide = !$scope.hideData.hide;
      };

      $scope.accountPeriod = {
        year: null,
        month: null,
        week: null,
        day: null
      };

      function getMonthDays(year, month) {
        return 32 - new Date(year, month - 1, 32).getDate();
      }

      /**
       * get the week count in special month
       * @param year
       * @param month
       * @returns {number|*}
       */
      function getWeekCounts(year, month) {
        var dayNum, week_count = 5;
        dayNum = getMonthDays(year, month);
        if (dayNum === 28) {
          week_count = 4;
        }
        return week_count;
      }

      function getWeeks(year, month) {
        var week = 0, weeks = ["--" ];
        week = getWeekCounts(year, month);
        var i = 1;
        while (i <= week) {
          weeks.push(i++);
        }
        return weeks;
      }

      // get accounting period
      if (currentUser && currentUser.currentCompanyId) {
        api.company.getAccountingPeriod(currentUser.currentCompanyId)
          .success(function(data) {
            var year_arr = [],
              year_obj = {},
              period = data.accountingPeriods;
              //period.months.push(3);

            for (var i = 0, len = period.length; i < len; i++) {
              var month_arr = period[i].months,
                months = [];
              //for (var j = 0, jen = month_arr.length; j < jen; j++) {
              //  var month_obj = {},
              //    weeks = [];
              //  month_obj.month = month_arr[j];
              //  month_obj.weeks = getWeeks(period[i].year, month_arr[j]);
              //  months.push(month_obj);
              //}
              for (var j = -1, jen = month_arr.length; j < jen; j++) {
                var month_obj = {},
                  weeks = [];
                if(j==-1){
                  month_obj.month = "--";
                  month_obj.weeks = ["--"];
                }else{
                  month_obj.month = month_arr[j];
                  month_obj.weeks = getWeeks(period[i].year, month_arr[j]);
                }

                months.push(month_obj);
              }

              year_obj.year = period[i].year;
              year_obj.months = months;
              year_arr.push(year_obj);
            }
            $scope.years = year_arr;
            //load bar chart data and realtime data
            $scope.accountPeriod.year = data.currentYear;
            $scope.accountPeriod.month = data.currentMonth;
            $scope.accountPeriod.week = 1;
            // 0:年 1:月 2:周 3:日
            $scope.periodType = 2;
            api.settings.prerequisite(5)
              .success(function(data) {
                $scope.showChart = data;
                if (data) {
                  loadBarChart();
                  getRealTimeData();
                }
              });
          });
      }

      // get real time data
      $scope.realTimeData = {
        cashInStock: 0,
        bankDeposit: 0,
        receivableAccount: 0,
        payableAccount: 0,
        inventory: 0,
        monthValueAddedTax: 0,
        yearEarning: 0,
        yearNetProfit: 0
      };
      // 嵌套饼状图图形数据
      $scope.categoryData = {
        names: [],
        datas: []
      };

      $scope.assistantType = {
        id: null,
        name: null
      };

      $scope.assistantTypes = [{
        id: 2,
        name: '员工'
      }, {
        id: 4,
        name: '部门'
      }];

      // 柱状图的收入饼状图
      $scope.incomeData = {
        names: [],
        datas: []
      };

      $scope.barData = {
        names: ['收入', '支出', '利润'],
        datas: [
          [],
          [],
          []
        ],
        periods: []
      };

      $scope.selectedBarItem = {};
      $scope.showBar = true;
      $scope.isincome = false;
      // 显示关联图表
      $scope.showRelativePie = function() {
        var item = $scope.selectedBarItem.event;
        if (item.seriesName === '利润') {
          return;
        } else if (item.seriesName === '收入') {
          $scope.isincome = true;
        }
        switch ($scope.periodType) {
          case 0:
            $scope.accountPeriod.month = item.name;
            break;
          case 1:
            $scope.accountPeriod.week = item.name;
            break;
          case 2:
            $scope.accountPeriod.day = item.name;
            break;
        }
        $scope.showBar = false;
        loadPieChart();
        $scope.$safeApply();
      };

      $scope.back = function() {
        $scope.showBar = true;
      };

      $scope.getYearData = function(selectedItem) {
        $scope.periodType = 0;
        $scope.months = selectedItem.months;
        //$scope.months.push(selectedItem.months)  ;
        $scope.accountPeriod.year = selectedItem.year;
        loadBarChart();
        getRealTimeData();
      };

      $scope.getMonthData = function(selectedItem) {
        $scope.periodType = 1;
        $scope.weeks = selectedItem.weeks;
        $scope.accountPeriod.month = selectedItem.month;
        loadBarChart();
        getRealTimeData();
      };

      $scope.getWeekData = function(selectedItem) {
        $scope.periodType = 2;
        $scope.accountPeriod.week = selectedItem;
        loadBarChart();
        getRealTimeData();
      };

      // 加载柱状图
      function loadBarChart() {
        if($scope.accountPeriod.week=="--"){
            $scope.periodType=1;
        };
        if($scope.accountPeriod.month=="--"){
            $scope.periodType=0;
        };
        api.dashboard.getBarChart({
            year: $scope.accountPeriod.year,
            month: $scope.accountPeriod.month,
            week: $scope.accountPeriod.week,
            periodType: $scope.periodType
          })
          .success(function(data) {
            $scope.barData.periods.length = 0;
            $scope.barData.datas[0].length = 0;
            $scope.barData.datas[1].length = 0;
            $scope.barData.datas[2].length = 0;

            _.forEach(data, function(item) {
              $scope.barData.periods.push(item.number);
              $scope.barData.datas[0].push(item.income);
              $scope.barData.datas[1].push(item.outcome);
              $scope.barData.datas[2].push(item.profit);
            });
          });
      }


      function loadPieChart() {
        api.dashboard.getPieChart({
            year: $scope.accountPeriod.year,
            month: $scope.accountPeriod.month,
            week: $scope.accountPeriod.week,
            day: $scope.accountPeriod.day,
            periodType: $scope.periodType + 1,
            assistCategoryType: $scope.assistantType.id,
            isincome: $scope.isincome
          })
          .success(function(data) {
            // 利润图标
            $scope.incomeData.names.length = 0;
            $scope.incomeData.datas.length = 0;
            var innerData = [];
            var outerData = [];

            _.forEach(data.first, function(item) {
              if (parseInt(item.value) !== 0) {
                innerData.push(item);
                $scope.incomeData.names.push(item.name);
              }
            });
            _.forEach(data.second, function(item) {
              if (parseInt(item.value) !== 0) {
                outerData.push(item);
              }
            });
            $scope.incomeData.datas.push(innerData);
            $scope.incomeData.datas.push(outerData);
          });
      }

      $scope.loadPieChart = loadPieChart;

      function getRealTimeData() {
        api.accountCategory.getAllData($scope.accountPeriod.year, $scope.accountPeriod.month).
        success(function(data) {
          var realTimeData = $scope.realTimeData;
          $scope.categoryData.names.length = 0;
          $scope.categoryData.datas.length = 0;
          var names = $scope.categoryData.names;
          var parentData = [];
          var childrenData = [];
          _.forEach(data, function(item) {
            switch (item.code) {
              case '1001':
                realTimeData.cashInStock = (!item.balanceDirection && item.endingbalanceDebit) || (item.balanceDirection && item.endingbalanceCredit) || 0;
                break;
              case '1002':
                realTimeData.bankDeposit = (!item.balanceDirection && item.endingbalanceDebit) || (item.balanceDirection && item.endingbalanceCredit) || 0;
                break;
              case '1122':
                realTimeData.receivableAccount = (!item.balanceDirection && item.endingbalanceDebit) || (item.balanceDirection && item.endingbalanceCredit) || 0;
                break;
              case '1123':
                realTimeData.payableAccount = (!item.balanceDirection && item.endingbalanceDebit) || (item.balanceDirection && item.endingbalanceCredit) || 0;
                break;
              case '1403':
                realTimeData.inventory += (!item.balanceDirection && item.endingbalanceDebit) || (item.balanceDirection && item.endingbalanceCredit) || 0;
                break;
              case '1405':
                realTimeData.inventory += (!item.balanceDirection && item.endingbalanceDebit) || (item.balanceDirection && item.endingbalanceCredit) || 0;
                break;
              case '222102':
                realTimeData.monthValueAddedTax = item.credit || 0;
                break;
              case '5001':
                realTimeData.yearEarning += item.thisYearCredit || 0;
                realTimeData.yearNetProfit += item.thisYearCredit || 0;
                break;
              case '5051':
                realTimeData.yearEarning += item.thisYearCredit || 0;
                realTimeData.yearNetProfit += item.thisYearCredit || 0;
                break;
              case '5301':
                realTimeData.yearEarning += item.thisYearCredit || 0;
                realTimeData.yearNetProfit += item.thisYearCredit || 0;
                break;
              case '5401':
              case '5402':
              case '5403':
              case '5601':
              case '5602':
              case '5603':
              case '5711':
              case '5801':
                if (item.debit !== 0) {
                  parentData.push({
                    value: item.debit,
                    name: item.name
                  });
                  names.push(item.name);
                  var childrenDataList = getChildrenData(data, item.id);
                  // 判断有没有字节点
                  if (childrenDataList[0].length === 0) {
                    childrenData.push({
                      value: item.debit,
                      name: item.name
                    });
                  } else if (childrenDataList[0].length > 0) {
                    childrenData = childrenData.concat(childrenDataList[1]);
                  }
                }
                realTimeData.yearNetProfit -= item.thisYearDebit || 0;
                break;
            }
          });
          $scope.categoryData.names = names;
          $scope.categoryData.datas.push(parentData);
          $scope.categoryData.datas.push(childrenData);
          $scope.realTimeData = realTimeData;
          $scope.$safeApply();
          //drawChart(realTimeData);
        });
      }

      // get children data
      function getChildrenData(data, parentId) {
        var childrenData = [];
        var legendData = [];
        _.forEach(data, function(item) {
          if (item.parentId === parentId) {
            childrenData.push({
              value: item.debit,
              name: item.name
            });
            legendData.push(item.name);
          }
        });
        return [legendData, childrenData];
      }

      //get todo-all-list
      $scope.allList = null;
      //count items in each list
      $scope.itemCount = {
        draftCount: null,
        categoryCount: null,
        confirmedCount: null,
        payCount: null,
        approvalCount: null,
        deniedCount: null
      };


      // get to do list and if not login goto login page
      api.todoList.getAllList()
        .success(function(data) {
          $scope.allList = data;
          $scope.itemCount.draftCount = data.inDraftList.length;
          $scope.itemCount.categoryCount = data.inCategoryList.length;
          $scope.itemCount.confirmedCount = data.inConfirmedList.length;
          $scope.itemCount.payCount = data.inpayList.length;
          $scope.itemCount.approvalCount = data.inApprovalList.length;
          $scope.itemCount.deniedCount = data.inDeniedList.length;
        });

      // get todo-list
      $scope.getTodoList = function(type) {
        var data = [];
        var list = [];
        var action = null;
        var showToDoModal = false;
        var dialogTitle = '';
        switch (type) {
          case 1:
            if (currentUser.isUser && $scope.itemCount.draftCount > 0) {
              showToDoModal = true;
              data = $scope.allList.inDraftList;
              action = 'edit_draft';
              dialogTitle = '待提交';
            }
            break;
          case 2:
            if (currentUser.isAccoundant && $scope.itemCount.categoryCount > 0) {
              data = $scope.allList.inCategoryList;
              action = 'request_category';
              showToDoModal = true;
              dialogTitle = '待分类';
            }
            break;
          case 3:
            if (currentUser.isAccoundant && $scope.itemCount.confirmedCount > 0) {
              data = $scope.allList.inConfirmedList;
              action = 'request_confirm';
              showToDoModal = true;
              dialogTitle = '待确认';
            }
            break;
          case 4:
            if (currentUser.isCashier && $scope.itemCount.payCount > 0) {
              data = $scope.allList.inpayList;
              action = 'request_pay';
              showToDoModal = true;
              dialogTitle = '待支付';
            }
            break;
          case 5:
            if (currentUser.isManager && $scope.itemCount.approvalCount > 0) {
              data = $scope.allList.inApprovalList;
              action = 'approval';
              showToDoModal = true;
              dialogTitle = '待审批';
            }
            break;
          case 6:
            if (currentUser.isUser && $scope.itemCount.deniedCount > 0) {
              data = $scope.allList.inDeniedList;
              action = 'edit_draft';
              showToDoModal = true;
              dialogTitle = '审批拒绝';
            }
            break;
        }
        _.forEach(data, function(item) {
          if (action === 'approval') {
            item.action = currentUser.userId === item.creater.id ? 'immediate_approval' : 'request_approval';
          } else {
            item.action = action;
          }
          list.push(item);
        });

        if (showToDoModal) {
          modalBox.openToDoList(dialogTitle, list);
        }
      };

      // function drawChart(realTimeData) {
      //   incomeChart(realTimeData);
      // }
      //
      // function getPersent(a, total) {
      //   return (a / total).toFixed(2) * 100 + "%";
      // }
      //
      // var incomeChart = function(realTimeData) {
      //   var incomeChart = echarts.init(document.getElementById('income_chart'));
      //
      //   var totalAmount = parseInt(realTimeData.cashInStock) + parseInt(realTimeData.bankDeposit) + parseInt(realTimeData.receivableAccount);
      //
      //   var cash = $translate.instant('HOME.CASH_IN_STOCK');
      //   var bankDeposit = $translate.instant('HOME.BANK_DEPOSIT');
      //   var accounts = $translate.instant('HOME.RECEIVABLE_ACCOUNT');
      //
      //   var cashValue = realTimeData.cashInStock;
      //   var bankDepositValue = realTimeData.bankDeposit;
      //   var accountsValue = realTimeData.receivableAccount;
      //
      //   var cashDes = $scope.displayData ? cashValue : getPersent(cashValue, totalAmount);
      //   var bankDepositDes = $scope.displayData ? bankDepositValue : getPersent(bankDepositValue, totalAmount);
      //   var accountsDes = $scope.displayData ? accountsValue : getPersent(accountsValue, totalAmount);
      //
      //   var dataIsEmpty = cashValue === 0 && bankDepositValue === 0 && accountsValue === 0 ? true : false;
      //
      //   var option = {
      //     legend: {
      //       data: [cash + cashDes, bankDeposit + bankDepositDes, accounts + accountsDes]
      //     },
      //     xAxis: [{
      //       show: false,
      //       type: 'value'
      //     }],
      //     yAxis: [{
      //       show: false,
      //       type: 'category',
      //       data: ["income"]
      //     }],
      //     series: [{
      //       type: 'bar',
      //       stack: 'income',
      //       name: cash + cashDes,
      //       itemStyle: {
      //         normal: {
      //           label: {
      //             show: false,
      //             position: 'insideRight'
      //           }
      //         }
      //       },
      //       data: dataIsEmpty ? null : [realTimeData.cashInStock]
      //     }, {
      //       type: 'bar',
      //       stack: 'income',
      //       name: bankDeposit + bankDepositDes,
      //       itemStyle: {
      //         normal: {
      //           label: {
      //             show: false,
      //             position: 'insideRight'
      //           }
      //         }
      //       },
      //       data: dataIsEmpty ? null : [realTimeData.bankDeposit]
      //     }, {
      //       type: 'bar',
      //       stack: 'income',
      //       name: accounts + accountsDes,
      //       itemStyle: {
      //         normal: {
      //           label: {
      //             show: false,
      //             position: 'insideRight'
      //           }
      //         }
      //       },
      //       data: dataIsEmpty ? null : [realTimeData.receivableAccount]
      //     }],
      //     grid: {
      //       borderWidth: 0
      //     }
      //   };
      //
      //   incomeChart.setOption(option);
      // };
      //
      // var costChart = function(realTimeData) {
      //   var costChart = echarts.init(document.getElementById('cost_chart'));
      //
      //   var totalAmount = parseInt(realTimeData.payableAccount) + parseInt(realTimeData.inventory) + parseInt(realTimeData.monthValueAddedTax) + parseInt(realTimeData.yearEarning) + parseInt(realTimeData.yearNetProfit);
      //
      //   var payableAccount = $translate.instant('HOME.PAYABLE_ACCOUNT');
      //   var inventory = $translate.instant('HOME.INVENTORY');
      //   var monthValueAddedTax = $translate.instant('HOME.MONTH_VALUE_ADDED_TAX');
      //   var yearEarning = $translate.instant('HOME.YEAR_EARNING');
      //   var yearNetProfit = $translate.instant('HOME.YEAR_NET_PROFIT');
      //
      //   var payableAccountValue = realTimeData.payableAccount;
      //   var inventoryValue = realTimeData.inventory;
      //   var monthValueAddedTaxValue = realTimeData.monthValueAddedTax;
      //   var yearEarningValue = realTimeData.yearEarning;
      //   var yearNetProfitValue = realTimeData.yearNetProfit;
      //
      //   var payableAccountDes = $scope.displayData ? payableAccountValue : getPersent(payableAccountValue, totalAmount);
      //   var inventoryDes = $scope.displayData ? inventoryValue : getPersent(inventoryValue, totalAmount);
      //   var monthValueAddedTaxDes = $scope.displayData ? monthValueAddedTaxValue : getPersent(monthValueAddedTaxValue, totalAmount);
      //   var yearEarningDes = $scope.displayData ? yearEarningValue : getPersent(yearEarningValue, totalAmount);
      //   var yearNetProfitDes = $scope.displayData ? yearNetProfitValue : getPersent(yearNetProfitValue, totalAmount);
      //
      //   var dataIsEmpty = payableAccountValue === 0 && inventoryValue === 0 && monthValueAddedTaxValue === 0 && yearEarningValue === 0 && yearNetProfitValue === 0 ? true : false;
      //
      //   var option = {
      //     title: {
      //       text: totalAmount,
      //       x: 10,
      //       y: 150
      //     },
      //     legend: {
      //       orient: 'vertical',
      //       x: 'left',
      //       data: [payableAccount + payableAccountDes, inventory　 + inventoryDes, monthValueAddedTax　 + monthValueAddedTaxDes,
      //         yearEarning　 + yearEarningDes, yearNetProfit　 + yearNetProfitDes
      //       ]
      //     },
      //
      //     series: [{
      //       name: 'cost',
      //       type: 'pie',
      //       radius: ['50%', '80%'],
      //       itemStyle: {
      //         normal: {
      //           label: {
      //             show: false
      //           },
      //           labelLine: {
      //             show: false
      //           }
      //         },
      //         emphasis: {
      //           label: {
      //             show: false,
      //             position: 'center',
      //             textStyle: {
      //               fontSize: '30',
      //               fontWeight: 'bold'
      //             }
      //           }
      //         }
      //       },
      //       data: dataIsEmpty ? null : [{
      //         value: payableAccountValue,
      //         name: payableAccount　 + payableAccountDes
      //       }, {
      //         value: inventoryValue,
      //         name: inventory + inventoryDes
      //       }, {
      //         value: monthValueAddedTaxValue,
      //         name: monthValueAddedTax + monthValueAddedTaxDes
      //       }, {
      //         value: yearEarningValue,
      //         name: yearEarning + yearEarningDes
      //       }, {
      //         value: yearNetProfitValue,
      //         name: yearNetProfit + yearNetProfitDes
      //       }]
      //     }]
      //   };
      //
      //   costChart.setOption(option);
      // };

      //根据员工和部门获取饼图数据
      function loadPieChartByAssistCategoryType() {
        api.dashboard.getPieChartAssistant({
            year: $scope.accountPeriod.year,
            month: $scope.accountPeriod.month,
            week: $scope.accountPeriod.week,
            day: $scope.accountPeriod.day,
            periodType: $scope.periodType + 1,
            assistCategoryType: $scope.assistantType.id,
            isincome: $scope.isincome
          })
          .success(function(data) {
            // 利润图标
            $scope.incomeData.names.length = 0;
            $scope.incomeData.datas.length = 0;
            var innerData = [];
            var outerData = [];

            _.forEach(data.first, function(item) {
              if (parseInt(item.value) !== 0) {
                innerData.push(item);
                $scope.incomeData.names.push(item.name);
              }
            });
            _.forEach(data.second, function(item) {
              if (parseInt(item.value) !== 0) {
                outerData.push(item);
              }
            });
            $scope.incomeData.datas.push(innerData);
            $scope.incomeData.datas.push(outerData);
          });
      }
      $scope.loadPieChartByAssistCategoryType = loadPieChartByAssistCategoryType;
    }
  ]);
