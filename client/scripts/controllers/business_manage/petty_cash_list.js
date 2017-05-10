'use strict';
angular.module('concordyaApp')
        .controller('PettyCashListCtrl', ['$scope', '$rootScope','$q', '$state','$stateParams', '$translate', '$translatePartialLoader', 'StorageService', 'APIService', 'ModalBoxService', 'UtilityService', 'WidgetService', 'CONSTANT.PAGE_SIZE',
          function ($scope, $rootScope, $q, $state,$stateParams, $translate, $translatePartialLoader, storage, api, modalBox, utility, widget, PAGE_SIZE) {
            // add multi-lang file for business_manage/petty_cash page
            $translatePartialLoader.addPart('business_manage/petty_cash');

            // page object
            $scope.page = {
              index: 1,
              size: PAGE_SIZE,
              total: 0
            };

            $scope.searchForm = {
              'beginTime': null,
              'endTime': null,
              'entityType': null
            };


            // get entity-types
            api.pettyCash.getEntityTypes()
                    .success(function (data) {
                      $scope.entityTypeList = data;
                    });

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

            // goto add petty cash page
            $scope.addNewPettyCash = function () {
              $state.go('business/petty_cash');
            };

            // goto add advance payment page
            $scope.addNewAdvancePayment = function () {
              $state.go('business/advance_payment');
            };

            function getSearchFormParams(params) {
              if ($scope.searchForm.beginTime) {
                //params.beginTime = moment($scope.searchForm.beginTime).valueOf();
                params.beginTime = $scope.searchForm.beginTime.toISOString();
              }
              if ($scope.searchForm.endTime) {
                //params.endTime = moment($scope.searchForm.endTime).valueOf();
                params.endTime = $scope.searchForm.endTime.toISOString();
              }
              if ($scope.searchForm.entityType && $scope.searchForm.entityType.id !== -1) {
                params.entityType = $scope.searchForm.entityType.id;
              }
            }

            // get todolist
            function getDataList(params) {
              params = utility.checkParams($scope, params);
              getSearchFormParams(params);

              api.todoList.getApplyList(params)
                      .success(function (data, status) {
                        if (status === 200) {
                          $scope.dataList = data.list;
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

            if ($stateParams && $stateParams.isshow) {
              window.setTimeout(function(){
                widget.showSuccess($stateParams.message);
              },100);
            }
            // get todo list
            $scope.search = function (form) {
              if (form.$valid) {
                widget.hideMessage();
                getDataList();
              } else {
                utility.addErrorClass(form);
              }
            };

            // trigger pettyCash selected status
            $scope.triggerItem = function (item) {
              utility.triggerSelect(item, $scope.dataList);
            };

            // get selected ids
            function getSelectedIds() {
              var pettyCashIds = [],
                      advancePaymentIds = [];
              _.forEach(utility.getSelectedItem($scope.dataList), function (item) {
                if (item.entityType === 3) {
                  pettyCashIds.push(item.id);
                } else if (item.entityType === 4) {
                  advancePaymentIds.push(item.id);
                }
              });
              return {
                'pettyCashIds': pettyCashIds,
                'advancePaymentIds': advancePaymentIds
              };
            }

            function deleteCheck(){
              var isPaied = false;
              var isNotApplyer = false;
              _.forEach(utility.getSelectedItem($scope.dataList), function (item) {
                //if the status is equal to five(paid),it cannot be deleted;
                if(item.status == 5){
                  isPaied = true;
                  return;
                }
                if(item.applyer.id != $rootScope.currentUser.userId){
                  isNotApplyer = true;
                  return;
                }
              });
              if(isPaied){
                return "isPaied";
              }
              if(isNotApplyer){
                return "isNotApplyer";
              }
             var date= getSelectedIds();
              return date;
            }
            // delete
            $scope.delete = function () {
              var data = deleteCheck();
              if(data === "isPaied"){
                widget.showError($translate.instant("PETTY_CASH.MESSAGE_ALREADY_PAIED_CANNOT_DELETE"));
                return;
              }
              if(data === "isNotApplyer"){
                widget.showError($translate.instant("不能删除其他人提交的单据！"));
                return;
              }
              if (data.pettyCashIds.length > 0 || data.advancePaymentIds.length > 0) {
                var promises = [];
                var successIds = 0;
                var failedIds = 0;
                if (data.pettyCashIds.length > 0) {
                  promises.push(api.pettyCash.delete(data.pettyCashIds)
                    .success(function(data,status){
                      successIds = successIds + data.successIds.length;
                      failedIds = failedIds + data.failedIds.length;
                    }));
                }
                if (data.advancePaymentIds.length > 0) {
                  promises.push(api.advancePayment.delete(data.advancePaymentIds)
                    .success(function(data,status){
                      successIds = successIds + data.successIds.length;
                      failedIds = failedIds + data.failedIds.length
                    }));
                }

                $q.all(promises)
                        .then(function () {
                          if(failedIds > 0){
                            widget.showError($translate.instant('COMMON.DELETE_ERROR')+failedIds+$translate.instant('COMMON.ITEM')+"    "+$translate.instant('COMMON.DELETE_SUCCESS')+successIds+$translate.instant('COMMON.ITEM'));
                            getDataList();
                          }else{
                            widget.showSuccess($translate.instant('PETTY_CASH.MESSAGE_DELETE_SUCCESS'));
                            getDataList();
                          }
                        });
              } else {
                widget.showError($translate.instant('COMMON.SELECT_OPERATE_ITEM'));
              }
            };

            //submit action
            $scope.submit = function () {
              var data = getSelectedIds();
              if (data.pettyCashIds.length > 0 || data.advancePaymentIds.length > 0) {
                var promises = [];
                if (data.pettyCashIds.length > 0) {
                  promises.push(api.pettyCash.submit(data.pettyCashIds));
                }
                if (data.advancePaymentIds.length > 0) {
                  promises.push(api.advancePayment.submit(data.advancePaymentIds));
                }

                $q.all(promises)
                        .then(function () {
                          widget.showSuccess($translate.instant('PETTY_CASH.MESSAGE_SUBMIT_SUCCESS'));
                          getDataList();
                        });
              } else {
                widget.showError($translate.instant('COMMON.SELECT_OPERATE_ITEM'));
              }
            };

            function approveCheck(){
              var currentUser = storage.getCurrentUser();
              var isNotApprover = false;
              _.forEach(utility.getSelectedItem($scope.dataList), function (item) {
                //if current user is not the approver,can not approve or deny .
                if(currentUser.userId != item.approver.id){
                  isNotApprover = true;
                  return;
                }
              });
              if(isNotApprover){
                return "isNotApprover";
              }
              return getSelectedIds();
            }
            //approve
            $scope.approveConfirm = function () {
              var data = approveCheck();
              if(data == "isNotApprover"){
                widget.showError($translate.instant("当前用户非审批人！"));
                return;
              }
              if (data.pettyCashIds.length > 0 || data.advancePaymentIds.length > 0) {
                var promises = [];
                if (data.pettyCashIds.length > 0) {
                  promises.push(api.pettyCash.approve(data.pettyCashIds,3));
                }
                if (data.advancePaymentIds.length > 0) {
                  promises.push(api.advancePayment.approve(data.advancePaymentIds,3));
                }

                $q.all(promises)
                        .then(function () {
                          widget.showSuccess($translate.instant('PETTY_CASH.MESSAGE_APPROVE_SUCCESS'));
                          getDataList();
                        });
              } else {
                widget.showError($translate.instant('COMMON.SELECT_OPERATE_ITEM'));
              }
            };

            // approve deny
            $scope.approveDeny = function () {
              var data = approveCheck();
              if(data == "isNotApprover"){
                widget.showError($translate.instant("当前用户非审批人！"));
                return;
              }
              if (data.pettyCashIds.length > 0 || data.advancePaymentIds.length > 0) {
                modalBox.openApproveDenyPettyCashList(data.pettyCashIds, data.advancePaymentIds)
                        .result.then(function () {
                          widget.showSuccess($translate.instant('PETTY_CASH.MESSAGE_REJECT_SUCCESS'));
                          getDataList();
                        });
              } else {
                widget.showError($translate.instant('COMMON.SELECT_OPERATE_ITEM'));
              }
            };
          }]);
