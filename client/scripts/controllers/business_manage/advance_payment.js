'use strict';

angular.module('concordyaApp')
        .controller('AdvancePaymentCtrl', ['$scope', '$translate', '$translatePartialLoader', '$state', '$stateParams', 'APIService', 'StorageService', 'UtilityService', 'WidgetService', 'ModalBoxService', 'EnumParseService',
          function ($scope, $translate, $translatePartialLoader, $state, $stateParams, api, storage, utility, widget, modalBox, enumParse) {
            $translatePartialLoader.addPart('business_manage/petty_cash');

            var originalAdvancePayment = null,
                    maxId = null;
            var currentUser = storage.getCurrentUser();
            // init data
            function init() {
              // advancePayment model
              $scope.advancePayment = {
                'id': null,
                'applyAmount': 0,
                'applyDate': null,
                'applyReason': null,
                'applyer': null,
                'approver': null,
                'advancePaymentNumber': $translate.instant("COMMON.AUTOMATIC_GENERATION"),
                'status': 0,
                'statusText': enumParse.pettyCash.getStatus(0),
                'cashAmount': 0,
                'transferAmount': 0,
                'checkAmount': 0,
                'approvalReason': null,
                'buttonStatus': 1,
                'readOnly': false,
                'showTimeLine': false
              };
            }
            // combine parent name
            function getParentName(data, item, result) {
              var parent = _.findWhere(data, {'id': item.parentId});
              result.parentName = (parent && parent.name) + result.parentName;
              if (parent && parent.parentId) {
                result.parentName = ' — ' + result.parentName;
                getParentName(data, parent, result);
              }
            }

            //get Bank Account Category List function
            var getBankAccountCategoryList = function(){
              api.pettyCash.getBankAccountCategoryList()
                .success(function(data){
                  _.forEach(data, function(item) {
                    if (item.parentId) {
                      item.parentName = '';
                      getParentName(data, item, item);
                    }
                  });
                  $scope.AccountCategoryList = data;
                  $scope.$safeApply();
                });
            };

            api.account.getManagerList()
                    .success(function (data) {
                      $scope.approverList = data;
                    });

            api.contact.getAllSupplier()
                    .success(function (data) {
                      $scope.contactList = data;
                    });

            if ($stateParams && $stateParams.id) {
              api.advancePayment.get($stateParams.id)
                      .success(function (data) {
                      var status = data.status;
                      data.showTimeLine = true;
                      data.statusText = enumParse.pettyCash.getStatus(status);
                      if (status === 0 || status === 4 && currentUser.userId === data.applyer.id) {
                        data.buttonStatus = 1;
                        data.readOnly = false;
                      } else {
                        data.readOnly = true;
                      }
                      if(currentUser.userId == data.approver.id && status == 1){
                        data.buttonStatus = 2;
                      }
                      if ((currentUser.isCashier && status === 3) || status === 5) {
                        data.payFormShow = true;
                        if(status == 3 && currentUser.isCashier){
                          data.buttonStatus = 3;
                          data.payReadOnly = false;
                          data.payCashAmount = data.cashAmount;
                          data.payTransferAmount = data.transferAmount;
                          data.TransferAccountCategory = null;
                          data.payCheckAmount = data.checkAmount;
                          data.CheckAccountCategory = null;
                          data.TransferAccountCategoryRequired = false;
                          data.total = 0;
                          //BankAccountCategoryList is loaded only in this  scenario
                          getBankAccountCategoryList();
                        }else{
                          data.payReadOnly = true;
                        }
                        if(status == 5){
                          data.buttonStatus = 4;
                          var payment = data.payment;
                          data.payCashAmount = payment.cashAmount;
                          data.payTransferAmount = payment.transferAmount;
                          data.TransferAccountCategory = payment.transferAccountCategory;
                          data.payCheckAmount = data.checkAmount;
                          data.CheckAccountCategory = payment.checkAccountCategory;
                        }}else{
                        data.payFormShow = false;
                      }
                  originalAdvancePayment = _.cloneDeep(data);
                  _.forEach(data.timeLine,function(item){
                    item.action = enumParse.pettyCash.getAction(item.actionCode);
                  });
                  $scope.advancePayment = data;
                  $scope.$safeApply();
                });
            } else {
              init();
            }





            // watch advancePayment
            var cancelWatch = $scope.$watch('advancePayment', function (newVal) {
              if (newVal) {
                var advancePayment = $scope.advancePayment;
                advancePayment.applyAmount = utility.floatNumAdd(advancePayment.cashAmount, advancePayment.transferAmount, advancePayment.checkAmount);
                advancePayment.total = utility.floatNumAdd(advancePayment.payCashAmount, advancePayment.payCheckAmount, advancePayment.payTransferAmount);
                if(!((parseFloat(advancePayment.payTransferAmount).toFixed(2) > 0) && advancePayment.TransferAccountCategory == null)){
                  $("#TransferAccountCategory").css("border-color", "#e3e3e3");
                }
                if(!((parseFloat(advancePayment.payCheckAmount).toFixed(2) > 0) && advancePayment.CheckAccountCategory == null)){
                  $("#CheckAccountCategory").css("border-color", "#e3e3e3");
                }
              }
            }, true);
            // remove watch on state-change for performance reason
            $scope.$on('$stateChangeStart', function () {
              cancelWatch();
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

            // view voucher
            $scope.viewVoucher = function () {
              $state.go('finance/voucher', {id: $scope.advancePayment.currentAccountVoucher.id});
            };

            // save advance payment
            function saveAdvancePayment(form, status, fn) {
              if (form.$valid) {
                var currentUser = storage.getCurrentUser();
                if($scope.advancePayment.approver.id == currentUser.userId){
                  widget.showError($translate.instant("PETTY_CASH.MESSAGE_APPLYER_APPORVER_CANNOT_SAME"));
                  return;
                }
                var advancePayment = $scope.advancePayment;

                var params = {
                  'advancePaymentNumber': advancePayment.advancePaymentNumber,
                  'applyReason': advancePayment.applyReason,
                  'contactid': advancePayment.contact.id,
                  'status': status,
                  'applyAmount': advancePayment.applyAmount,
                  'cashAmount': advancePayment.cashAmount,
                  'checkAmount': advancePayment.checkAmount,
                  'transferAmount': advancePayment.transferAmount,
                  'approverId': advancePayment.approver.id
                };

                if ($stateParams && $stateParams.id) {
                  // update an advance payment
                  api.advancePayment.update(advancePayment.id, params)
                          .success(function (data) {
                            //widget.showSuccess($translate.instant('PETTY_CASH.MESSAGE_UPDATE_ADVANCE_PAYMENT_SUCCESS'));
                            //fn && fn(data);
                            //$scope.$safeApply();
                              if(status==1){
                                $state.go('business/petty_cashs', {isshow: true,message:$translate.instant("PETTY_CASH.MESSAGE_SUBMIT_SUCCESS")});
                              }
                              if(status==0){
                                $state.go('business/petty_cashs', {isshow: true,message:$translate.instant('PETTY_CASH.MESSAGE_UPDATE_ADVANCE_PAYMENT_SUCCESS')});
                              }
                          });
                } else {
                  // create new advance payment
                  api.advancePayment.create(params)
                          .success(function (data) {
                            //widget.showSuccess($translate.instant('PETTY_CASH.MESSAGE_NEW_ADVANCE_PAYMENT_SUCCESS'));
                            //advancePayment.id = data.id;
                            //fn && fn(data);
                            //$scope.$safeApply();
                              if(status==1){
                                $state.go('business/petty_cashs', {isshow: true,message:$translate.instant("PETTY_CASH.MESSAGE_SUBMIT_SUCCESS")});
                              }
                              if(status==0){
                                $state.go('business/petty_cashs', {isshow: true,message:$translate.instant('PETTY_CASH.MESSAGE_NEW_ADVANCE_PAYMENT_SUCCESS')});
                              }
                          });
                }
              } else {
                utility.addErrorClass(form);
              }
            }
            // just save
            $scope.save = function (form) {
              saveAdvancePayment(form, 0,function () {
                $state.go('business/petty_cashs');
              });
            };
            // save and new
            $scope.saveAndNew = function (form) {
              saveAdvancePayment(form, 0, function () {
                init();
              });
            };
            // save and submit
            $scope.saveAndSubmit = function (form) {
              saveAdvancePayment(form, 1, function () {
                $state.go('business/petty_cashs',{saveAndSubmit: true});
              });
            };

            // approve action
            $scope.approve = function () {
              api.advancePayment.approve($scope.advancePayment.id)
                      .success(function () {
                        widget.showSuccess($translate.instant('PETTY_CASH.MESSAGE_APPROVE_ADVANCE_PAYMENT_SUCCESS'));
                        $scope.advancePayment.status = 3;
                        $scope.advancePayment.statusText = enumParse.pettyCash.getStatus(3);
                        $scope.advancePayment.buttonStatus = null;
                        $scope.$safeApply();
                      });
            };
            //reject action
            $scope.reject = function () {
              modalBox.openApproveDeny($scope.advancePayment.id, 4)
                      .result.then(function () {
                        widget.showSuccess($translate.instant('PETTY_CASH.MESSAGE_REJECT_ADVANCE_PAYMENT_SUCCESS'));
                        $scope.advancePayment.status = 4;
                        $scope.advancePayment.statusText = enumParse.pettyCash.getStatus(4);
                        $scope.advancePayment.buttonStatus = null;
                        $scope.$safeApply();
                      });
            };

            //pay petty cash
            function payAdvancePayment(form, fn) {
              var advancePayment = $scope.advancePayment;
              if (form.$valid) {
                if((parseFloat(advancePayment.payTransferAmount).toFixed(2) > 0) && advancePayment.TransferAccountCategory == null){
                  utility.addErrorClass(form);
                 //$("#TransferAccountCategory").css("border-color","#ea154c")
                  $("#TransferAccountCategory").addClass("inputInvalid");
                  return;
                }
                if((parseFloat(advancePayment.payCheckAmount).toFixed(2) > 0) && advancePayment.CheckAccountCategory == null){
                  utility.addErrorClass(form);
                  //$("#CheckAccountCategory").css("border-color","#ea154c")
                  $("#CheckAccountCategory").addClass("inputInvalid");
                  return;
                }
                if(advancePayment.applyAmount !== advancePayment.total){
                  widget.showError($translate.instant('PETTY_CASH.MESSAGE_APPLY_PAY_NOT_EQUAL'));
                  return;
                }
                var params = {
                  'id': advancePayment.id,
                  "CashAmount": advancePayment.payCashAmount,
                  "TransferAmount": advancePayment.payTransferAmount,
                  "CheckAmount": advancePayment.payCheckAmount,
                  "TransferAccountCategoryId": advancePayment.TransferAccountCategory && advancePayment.TransferAccountCategory.id,
                  "CheckAccountCategoryId": advancePayment.CheckAccountCategory && advancePayment.CheckAccountCategory.id
                };
                api.advancePayment.pay(params)
                        .success(function (data) {
                          widget.showSuccess($translate.instant('PETTY_CASH.MESSAGE_PAY_ADVANCE_PAYMENT_SUCCESS'));
                          fn && fn(data);
                          $scope.$safeApply();
                          $state.go('finance/cashier_pay',{pay:true});
                        });
              } else {
                utility.addErrorClass(form);
              }
            }

            $scope.pay = function (form) {
              payAdvancePayment(form);
            };
          }]);
