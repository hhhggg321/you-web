'use strict';
angular.module('concordyaApp')
        .controller('ExpenseAccountListCtrl', ['$rootScope', '$scope', '$q', '$state', '$translate', '$translatePartialLoader', 'APIService', 'ModalBoxService', 'UtilityService', 'WidgetService', 'CONSTANT.PAGE_SIZE',
          function ($rootScope, $scope, $q, $state, $translate, $translatePartialLoader, api, modalBox, utility, widget, PAGE_SIZE) {
            // add multi-lang file for business_manage/petty_cash page
            $translatePartialLoader.addPart('business_manage/petty_cash');

            // page object
            $scope.page = {
              index: 1,
              size: PAGE_SIZE,
              total: 0
            };

            userList();
            deparmentList();
            expenseStatusList();
            receiptStatusList();
            receiptTypeList();

            $scope.searchForm = {
              'type': 0
            };

            $scope.total = {
              receiptAmount: 0,
              expenseAmount: 0
            };

            $scope.expenseSearchForm = {
              'beginTime': null,
              'endTime': null,
              'beginAmount': null,
              'endAmount': null,
              'keyWord': null,
              'submitter': null,
              'department': null,
              'status': null
            };

            $scope.receiptSearchForm = {
              'beginTime': null,
              'endTime': null,
              'beginAmount': null,
              'endAmount': null,
              'expenseStatus': null,
              'receiptNumber': null,
              'submitter': null,
              'receiptType': null,
              'status': null
            };

            function userList(){
              api.account.getActiveUserList()
                      .success(function (data) {
                        if(data){
                          data.unshift({
                            id: null,
                            name: $translate.instant('COMMON.ALL')
                          });
                        }
                        $scope.userList = data;
                      });
            }

            function deparmentList(){
              api.department.getList()
                      .success(function(data){
                        if(data){
                          data.unshift({
                            id: null,
                            name: $translate.instant('COMMON.ALL')
                          });
                        }
                        $scope.deparmentList = data;
                      });
            }

            function expenseStatusList(){
              api.expense.getStatusEnum()
                      .success(function(data){
                        $scope.statusList = data;
                      });
            }

            function receiptStatusList(){
              api.receipt.getStatusEnum()
                      .success(function(data){
                        $scope.receiptStatusList = data;
                      });
            }

            function receiptTypeList(){
              var typeList;
              api.receipt.getTypeList()
                      .success(function(data){
                        $scope.receiptTypeList = [];
                        typeList = data && data.receiptTypes
                        if(typeList) {
                          for (var i = 0, len = typeList.length; i < len; i++) {
                            var type = {}
                            type.id = typeList[i].code;
                            type.name = typeList[i].name;
                            $scope.receiptTypeList.push(type);
                          }
                          $scope.receiptTypeList.unshift({
                            id: null,
                            name: $translate.instant('COMMON.ALL')
                          });
                        }
                      })
            }

            // trigger date-picker
            $scope.triggerPicker_expense = function ($event, type) {
              $event.preventDefault();
              $event.stopPropagation();

              switch (type) {
                case 'start':
                  $scope.expenseStartIsOpened = !$scope.expenseStartIsOpened;
                  break;
                case 'end':
                  $scope.expenseEndIsOpened = !$scope.expenseEndIsOpened;
                  break;
              }
            };

            $scope.triggerPicker_receipt = function ($event, type) {
              $event.preventDefault();
              $event.stopPropagation();

              switch (type) {
                case 'start':
                  $scope.receiptStartIsOpened = !$scope.receiptStartIsOpened;
                  break;
                case 'end':
                  $scope.receiptEndIsOpened = !$scope.receiptEndIsOpened;
                  break;
              }
            };

            $scope.reportType = 0;

            $scope.$watch("reportType", function(newValue, oldValue) {
              $scope.search();
            });

            // search
            $scope.search = function (type) {
              if($scope.reportType === 0){
                receiptList();
              }else{
                expenseList();
              }
              $scope.searchForm.type = $scope.reportType;
            };

            function receiptList(){
              var params = "page=" + $scope.page.index + "&pageSize=" + $scope.page.size;
              var condition = getAvailableCondition($scope.receiptSearchForm);
              var searchModel = buildSearchModel(condition, buildReceiptFilter);
              var searchModelStr = encodeURI(JSON.stringify(searchModel));
              params += "&search=" + searchModelStr;

              api.receipt.getList(params).success(function(data){
                  $scope.dataList = data && data.receipts;
                  if($scope.dataList){
                    var totalAmount = 0;
                    for(var i =0,len = $scope.dataList.length;i < len;i ++){
                      var item = $scope.dataList[i];
                      totalAmount = totalAmount + item.amount;
                    }
                    $scope.total.receiptAmount = totalAmount;
                  }else{
                    $scope.total.receiptAmount = 0;
                  }
                });
            }

            function expenseList(){
              var params = "page=" + $scope.page.index + "&pageSize=" + $scope.page.size;
              var condition = getAvailableCondition($scope.expenseSearchForm);
              var searchModel = buildSearchModel(condition, buildExpenseFilter);
              var searchModelStr = encodeURI(JSON.stringify(searchModel));
              params += "&search=" + searchModelStr;

              api.expense.getList(params).success(function(data){
                  $scope.dataList = data && data.expenseClaims;
                  if($scope.dataList){
                    var totalAmount = 0;
                    for(var i =0,len = $scope.dataList.length;i < len;i ++){
                      var item = $scope.dataList[i];
                      totalAmount = totalAmount + item.totalAmount;
                    }
                    $scope.total.expenseAmount = totalAmount;
                  }else{
                    $scope.total.expenseAmount = 0;
                  }
                });
            }

            function buildSearchModel(condition, buildFilter){
              var searchModel = {};
              searchModel.FilterBy = [];
              for(key in condition){
                if(condition.hasOwnProperty(key)){
                  var filter = buildFilter(condition, key);
                  if(filter){
                    searchModel.FilterBy.push(filter);
                  }
                }
              }
              return searchModel;
            }

            function buildReceiptFilter(condition,key){
              var filter = {};
              switch(key){
                case "receiptNumber":
                  filter.Name = "ReceiptNumber";
                  filter.Operator = 6;
                  filter.Value = condition[key];
                  break;
                case "beginTime":
                  filter.Name = "ReceiptDate";
                  filter.Operator = 3;
                  filter.Value = condition[key];
                  break;
                case "endTime":
                  filter.Name = "ReceiptDate";
                  filter.Operator = 5;
                  filter.Value = condition[key];
                  break;
                case "beginAmount":
                  filter.Name = "TotalAmount";
                  filter.Operator = 3;
                  filter.Value = condition[key];
                  break;
                case "endAmount":
                  filter.Name = "TotalAmount";
                  filter.Operator = 5;
                  filter.Value = condition[key];
                  break;
                case "submitter":
                  filter.Name = "ExpenseFrom";
                  filter.Operator = 0;
                  filter.Value = condition[key];
                  break;
                case "expenseStatus":
                  filter.Name = "ExpenseClaimStatus";
                  filter.Operator = 0;
                  filter.Value = condition[key];
                  break;
                case "receiptType":
                  filter.Name = "ReceiptType";
                  filter.Operator = 0;
                  filter.Value = condition[key];
                  break;
                case "status":
                  filter.Name = "isClaim";
                  filter.Operator = 0;
                  filter.Value = condition[key];
                  break;
                default :
                  filter = null;
              }
              return filter;
            }

            function buildExpenseFilter(condition,key){
              var filter = {};
              switch(key){
                case "beginTime":
                  filter.Name = "SubmittedDate";
                  filter.Operator = 3;
                  filter.Value = condition[key];
                  break;
                case "endTime":
                  filter.Name = "SubmittedDate";
                  filter.Operator = 5;
                  filter.Value = condition[key];
                  break;
                case "beginAmount":
                  filter.Name = "TotalAmount";
                  filter.Operator = 3;
                  filter.Value = condition[key];
                  break;
                case "endAmount":
                  filter.Name = "TotalAmount";
                  filter.Operator = 5;
                  filter.Value = condition[key];
                  break;
                case "department":
                  filter.Name = "Department";
                  filter.Operator = 0;
                  filter.Value = condition[key];
                  break;
                case "submitter":
                  filter.Name = "ExpenseFrom";
                  filter.Operator = 0;
                  filter.Value = condition[key];
                  break;
                case "status":
                  filter.Name = "Status";
                  filter.Operator = 0;
                  filter.Value = condition[key];
                  break;
                case "keyWord":
                  filter.Name = "Name";
                  filter.Operator = 6;
                  filter.Value = condition[key];
                  break;
              }
              return filter;
            }

            function getAvailableCondition(condition_obj){
              var condition = {};
              for(key in condition_obj){
                if(condition_obj.hasOwnProperty(key) && condition_obj[key]){
                  var type = typeof condition_obj[key];
                  if(type === "object"){
                    if(condition_obj[key].id !== null){
                      if(key === "beginTime" || key === "endTime"){
                        //condition[key] = moment(condition_obj[key]).format("YYYY-MM-DD");
                        condition[key] = (condition_obj[key]).toISOString();
                      }else{
                        condition[key] = condition_obj[key].id;
                      }
                    }
                  }else{
                    condition[key] = condition_obj[key];
                  }
                }
              }

              return condition;
            }
            //default to expenseclaim
            $scope.search(1);


          }]);
