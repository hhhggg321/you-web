/**
 * Created by shansong on 2015/7/27.
 */
'use strict';

angular.module('concordyaApp')
    .controller('AssistantAccountCtrl', ['$scope', '$translate', '$state', '$stateParams', '$translatePartialLoader', 'APIService', 'StorageService', 'UtilityService',
        function ($scope, $translate, $state, $stateParams, $translatePartialLoader, api, storage, utility) {
            // add multi-lang file for setting/category page
            //$translatePartialLoader.addPart('financial_manage/assistant_account');
            //$translatePartialLoader.addPart('financial_manage/category');
            //$translatePartialLoader.addPart('financial_manage/detail_account');
            var currentUser = storage.getCurrentUser();
            var queryHistoryStack = [];

            $scope.searchForm = {
                accountCategoryId: $stateParams.accountCategory,
                year: $stateParams.year,
                month: $stateParams.month,
                assistantAccountTypeId: $stateParams.assistantAccountType && $stateParams.assistantAccountType.id,
                assistantItems: []
            };

            // 辅助核算历史操作栈
            $scope.assistantStack = [];
            $scope.assistantItems = [];

            // 本年累计，本期发生布局属性
            $scope.currentHappenDisabled = $stateParams.currentHappenDisabled || true;
            $scope.yearTotalDisabled = $stateParams.yearTotalDisabled || false;
            $scope.currentHappen = $stateParams.currentHappen || true;
            $scope.yearTotal = $stateParams.yearTotal || false;
            // set default layout
            if ($scope.currentHappen && $scope.yearTotal) {
                $scope.layout = 3;
            } else if ($scope.currentHappenDisabled) {
                $scope.layout = 1;
            } else if ($scope.yearTotalDisabled) {
                $scope.layout = 2;
            } else {
                $scope.layout = 1;
            }

            // 用于保存已经选择的辅助核算类型
            $scope.assistantAccountTypes = [];
            $stateParams.assistantAccountType && $scope.assistantAccountTypes.push($stateParams.assistantAccountType);

            // 进行辅助核算的科目
            $scope.accountCategories = null;
            $scope.accountCategory = null;

            // 科目对应的辅助核算类型
            $scope.assistantCategories = null;
            $scope.assistantCategory = null;

            // 获取所有会计区间
            api.company.getAccountingPeriod(currentUser.currentCompanyId)
                .success(function (data) {
                    accountPeriods = data.accountingPeriods;
                    var endPeriod = accountPeriods[accountPeriods.length - 1],
                        endYear = endPeriod.year,
                        endMonth = endPeriod.months[endPeriod.months.length - 1];

                    // the default year when view initialize
                    var year = $stateParams.year && $stateParams.year.id ? $stateParams.year.id : endYear;
                    $scope.searchForm.year = {id: year, name: year};

                    // the default month when view intialize
                    var month = $stateParams.month && $stateParams.month.id ? $stateParams.month.id : endMonth;

                    $scope.searchForm.month = {id: month, name: month};
                    $scope.yearList = utility.map(data.years);
                    $scope.monthList = getMonthsByYear(year);
                    // 加载会计区间科目
                    loadAccountCategoriesByPeriod();

                });

            // 根据年月获取会计科目
            function loadAccountCategoriesByPeriod() {
                // 获取区间科目列表
                var form = $scope.searchForm;
                api.accountCategory.getAssistantCategoryList({
                    'year': form.year.id,
                    'month': form.month.id,
                    'isHasBindedAssistantTypes': true // only return account category which has assistant account type.
                }).success(function (data) {
                    $scope.accountCategories = data;
                    $scope.accountCategory = $stateParams.accountCategory ? $stateParams.accountCategory : data[0];
                    if ($scope.accountCategory && ($scope.accountCategory.id !== null)) {
                        _.forEach (data, function(item) {
                            if ($scope.accountCategory.id === item.id) {
                                $scope.assistantCategories = item.bindedAssistantTypes;
                                $scope.assistantCategory = $stateParams.assistantAccountType ? $stateParams.assistantAccountType : ($scope.assistantCategories && $scope.assistantCategories[0]);

                                // 获取辅助核算项列表
                                searchAssistantAccountItems();
                            }
                        });
                    }
                });
            }

            // 根据查询条件查询辅助核算项
            function searchAssistantAccountItems() {
                // 获取当前科目编号
                $scope.searchForm.accountCategoryId = $scope.accountCategory && $scope.accountCategory.id;
                // 获取当前辅助核算类型
                $scope.searchForm.assistantAccountTypeId = $scope.assistantCategory && $scope.assistantCategory.id;

                // 重置辅助核算类型数组
                $scope.assistantAccountTypes = [];
                $scope.assistantCategory && $scope.assistantAccountTypes.push($scope.assistantCategory);
                // 清空辅助核算历史操作栈
                $scope.assistantStack = [];
                // 清空当前辅助核算项
                $scope.dataList = [];
                // 清空当前查询历史栈
                queryHistoryStack = [];
                queryHistoryStack.push(angular.copy($scope.searchForm));
                refreshDisabledOptions();
                // 根据会计期间, 科目, 辅助核算类型查找辅助核算项
                search();
            }

            // 加载辅助核算项目, 根据辅助核算类型递归查询
            function loadAssistantAccountItems (back) {
                refreshDisabledOptions();
                search();
                // 若不为返回操作, 将查询条件入栈
                if (!back) {
                    queryHistoryStack.push(angular.copy($scope.searchForm));
                }
            }

            // float number add
            function floatAdd(num1, num2){
                var result = parseFloat(num1) + parseFloat(num2)
                return result.toFixed(2);
            }

            // send request
            function search() {
                api.assistAccount.getAssistantItemsByCategoryAndType({
                    year: $scope.searchForm.year.id,
                    month: $scope.searchForm.month.id,
                    accountingCategoryId: $scope.searchForm.accountCategoryId,
                    assistantAccountItemTypeId: $scope.searchForm.assistantAccountTypeId,
                    assistantparams: generateAssistantParams()
                }).success(function (data) {

                    var totalItem = {
                        code: '----',
                        name: '合计',
                        beginningBalanceDebit: 0,
                        beginningBalanceCredit: 0,
                        initialBalanceDebit: 0,
                        initialBalanceCredit: 0,
                        debit: 0,
                        credit: 0,
                        thisYearDebit: 0,
                        thisYearCredit: 0,
                        endingbalanceDebit: 0,
                        endingbalanceCredit: 0
                    };

                    _.forEach(data,function(item){
                        if(item.balanceDirection === 0){
                            item.beginningBalanceDebit= item.beginningBalance;
                            item.initialBalanceDebit= item.initialBalance;
                            item.endingbalanceDebit= item.endingbalance;
                        }else{
                            item.beginningBalanceCredit= item.beginningBalance;
                            item.initialBalanceCredit= item.initialBalance;
                            item.endingbalanceCredit= item.endingbalance;
                        }
                        totalItem.beginningBalanceDebit = floatAdd(totalItem.beginningBalanceDebit, item.beginningBalanceDebit || 0);
                        totalItem.beginningBalanceCredit = floatAdd(totalItem.beginningBalanceCredit, item.beginningBalanceCredit || 0);
                        totalItem.initialBalanceDebit = floatAdd(totalItem.initialBalanceDebit, item.initialBalanceDebit || 0);
                        totalItem.initialBalanceCredit = floatAdd(totalItem.initialBalanceCredit, item.initialBalanceCredit || 0);
                        totalItem.debit = floatAdd(totalItem.debit, item.debit || 0);
                        totalItem.credit = floatAdd(totalItem.credit, item.credit || 0);
                        totalItem.thisYearDebit = floatAdd(totalItem.thisYearDebit, item.thisYearDebit || 0);
                        totalItem.thisYearCredit = floatAdd(totalItem.thisYearCredit, item.thisYearCredit || 0);
                        totalItem.endingbalanceDebit = floatAdd(totalItem.endingbalanceDebit, item.endingbalanceDebit || 0);
                        totalItem.endingbalanceCredit = floatAdd(totalItem.endingbalanceCredit, item.endingbalanceCredit || 0);
                    });
                    data.push(totalItem);
                    $scope.dataList = data;
                    $scope.$safeApply();
                });
            }

            function generateAssistantParams() {
                var stack = $scope.assistantStack;
                var paramStack = [];
                _.forEach(stack, function (item) {
                    var type = item.type;
                    var item = item.item;
                    var itemParam = type.id + ":" + item.id;
                    paramStack.push(itemParam);
                });

                return paramStack.join("!");
            }

            $scope.$watchCollection('assistantAccountTypes', function (newVal, oldVal, scope) {
                scope.assistantItems.length = 0;
                if (scope.assistantStack.length > 0) {
                    _.forEach(scope.assistantStack, function (item){
                        var wrapItem = {
                            id: item.type.id + ":" + item.item.id,
                            name: item.type.name + "(" + item.item.name + ")"
                        }
                        /*scope.assistantItems.push(item.type);
                        scope.assistantItems.push(item.item);*/
                        scope.assistantItems.push(wrapItem);
                    })
                }
                var assistantAccountType = $scope.assistantAccountTypes[$scope.assistantAccountTypes.length - 1];
                assistantAccountType && scope.assistantItems.push(assistantAccountType);

            });

            //已选择的辅助核算类型，不能再进行选择
            function refreshDisabledOptions () {
                _.forEach($scope.assistantCategories, function (type) {
                    type.disabled = false;
                    _.forEach($scope.assistantAccountTypes, function (disabledType) {
                        if (type && disabledType && (type.id === disabledType.id)) {
                            type.disabled = true;
                            return;
                        }
                    });
                });
            }

            // search form conditions
            // 监听年份变化
            $scope.changeYear = function () {
                var year = $scope.searchForm.year.id;
                $scope.monthList = getMonthsByYear(year);
                $scope.searchForm.month = $scope.monthList[0];
                loadAccountCategoriesByPeriod();
            };

            // 监听月份变化
            $scope.changeMonth = function () {
                loadAccountCategoriesByPeriod();
            };

            // 监听科目改变
            $scope.changeAccountCategory = function () {
                $scope.assistantCategories = $scope.accountCategory.bindedAssistantTypes;
                $scope.assistantCategory = $scope.assistantCategories && $scope.assistantCategories[0];
                if ($scope.assistantCategory !== null) {
                    // 查询辅助核算项
                    searchAssistantAccountItems();
                }
            };

            // 监听辅助核算类型改变
            $scope.changeAssistantCategory = function () {
                searchAssistantAccountItems();
            };

            // change layout
            $scope.changeLayout = function () {
                if ($scope.currentHappen && $scope.yearTotal) {
                    $scope.currentHappenDisabled = false;
                    $scope.yearTotalDisabled = false;
                    $scope.layout = 3;
                } else if ($scope.currentHappen || $scope.yearTotal) {
                    if ($scope.currentHappen) {
                        $scope.layout = 1;
                        $scope.currentHappenDisabled = true;
                    } else {
                        $scope.layout = 2;
                        $scope.yearTotalDisabled = true;
                    }
                }
            };

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

            // 选择辅助核算项单元格
            $scope.selectItem = function (item,event) {
              console.log(event);
                _.forEach($scope.dataList, function (data) {
                    if (data !== item ) {
                        data.selected = false;
                        data.isOpen = false;
                    }
                });
                item.selected = !item.selected;
                item.isOpen = !item.isOpen;
                var offsetX = $("#assistAccount").offset().left + 15;
                var offsetY = $("#assistAccount").offset().top;
                var x = event.pageX - offsetX;
                var y = event.pageY - offsetY;
                $(event.currentTarget).children("td").eq(0).children('ul').css({"left":x,"top":y});
            };

            // 返回
            $scope.gotoBack = function () {
                var back = true;
                queryHistoryStack.pop();
                $scope.assistantAccountTypes.pop();
                $scope.assistantStack.pop();

                if (queryHistoryStack.length === 0) {
                    $state.go('finance/category', {year: $stateParams.year, month: $stateParams.month})
                    return;
                }
                $scope.searchForm = angular.copy(queryHistoryStack[queryHistoryStack.length - 1]);

                loadAssistantAccountItems(back);
            }

            // 查看辅助核算详细
            $scope.gotoAssistAccount = function (item) {
                var length = $scope.assistantAccountTypes.length;
                // 获取最近选择的一个辅助核算类型
                var assistantAccountType = $scope.assistantAccountTypes[length - 1];
                // 生成辅助核算类型/项目/类型的历史栈
                $scope.assistantStack.push({
                    type: assistantAccountType,
                    item: {id: item.id, name: item.name}
                });
                // 生成当前辅助核算类型id
                $scope.searchForm.assistantAccountTypeId = item._option.id;
                // 将当前选中的辅助核算类型放入历史记录中
                $scope.assistantAccountTypes.push(item._option);
                loadAssistantAccountItems();
            };

        }]);
