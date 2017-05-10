'use strict';

angular.module('concordyaApp')
  .controller('PettyCashCtrl', ['$scope', '$translate', '$translatePartialLoader', '$state', '$stateParams', 'APIService', 'StorageService', 'UtilityService', 'WidgetService', 'ModalBoxService', 'EnumParseService',
    function ($scope, $translate, $translatePartialLoader, $state, $stateParams, api, storage, utility, widget, modalBox, enumParse) {
      $translatePartialLoader.addPart('business_manage/petty_cash');

      var originalPettyCash = null, maxId = null;
      var currentUser = storage.getCurrentUser();
      // init data
      function init() {
        // pettyCash model
        $scope.pettyCash = {
          'id': null,
          'applyAmount': 0,
          'applyDate': null,
          'applyReason': null,
          'applyer': null,
          'approver': null,
          'pettycashNumber': $translate.instant("COMMON.AUTOMATIC_GENERATION"),
          'status': 0,
          'statusText': enumParse.pettyCash.getStatus(0),
          'cashAmount': 0,
          'transferAmount': 0,
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
      var getBankAccountCategoryList = function () {
        api.pettyCash.getBankAccountCategoryList()
          .success(function (data) {
            _.forEach(data, function (item) {
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

      if ($stateParams && $stateParams.id) {
        api.pettyCash.get($stateParams.id)
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
            if (currentUser.userId == data.approver.id && status == 1) {
              data.buttonStatus = 2;
            }
            if ((currentUser.isCashier && status === 3) || status === 5) {
              data.payFormShow = true;
              if (status == 3 && currentUser.isCashier) {
                data.buttonStatus = 3;
                data.payReadOnly = false;
                data.payCashAmount = data.cashAmount;
                data.payTransferAmount = data.transferAmount;
                data.TransferAccountCategory = null;
                data.TransferAccountCategoryRequired = false;
                data.total = 0;
                //BankAccountCategoryList is loaded only in this  scenario
                getBankAccountCategoryList();
              } else {
                data.payReadOnly = true;
              }
              if (status == 5) {
                data.buttonStatus = 4;
                var payment = data.payment;
                data.payCashAmount = payment.cashAmount;
                data.payTransferAmount = payment.transferAmount;
                data.TransferAccountCategory = payment.transferAccountCategory;
              }
            } else {
              data.payFormShow = false;
            }
            originalPettyCash = _.cloneDeep(data);
            _.forEach(data.timeLine, function (item) {
              item.action = enumParse.pettyCash.getAction(item.actionCode);
            });
            $scope.pettyCash = data;
            $scope.$safeApply();
          });
      } else {
        init();
      }

      // watch pettyCash
      var cancelWatch = $scope.$watch('pettyCash', function (newVal) {
        if (newVal) {
          var pettyCash = $scope.pettyCash;
          pettyCash.applyAmount = utility.floatNumAdd(pettyCash.cashAmount, pettyCash.transferAmount);
          pettyCash.total = utility.floatNumAdd(pettyCash.payCashAmount, pettyCash.payTransferAmount);

          if (!((parseFloat(pettyCash.payTransferAmount).toFixed(2) > 0) && pettyCash.TransferAccountCategory == null)) {
            $("#TransferAccountCategory").removeClass("inputInvalid");
            //  $("#TransferAccountCategory").css("border-color", "#e3e3e3");
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
        $state.go('finance/voucher', {id: $scope.pettyCash.currentAccountVoucher.id});
      };

      // save pettyCash
      function savePettyCash(form, status, fn) {
        if (form.$valid) {
          var currentUser = storage.getCurrentUser();
          if ($scope.pettyCash.approver.id == currentUser.userId) {
            widget.showError($translate.instant("PETTY_CASH.MESSAGE_APPLYER_APPORVER_CANNOT_SAME"));
            return;
          }
          var pettyCash = $scope.pettyCash;
          var params = {
            'pettyCashNumber': pettyCash.pettycashNumber,
            'applyReason': pettyCash.applyReason,
            'status': status,
            'applyAmount': pettyCash.applyAmount,
            'cashAmount': pettyCash.cashAmount,
            'transferAmount': pettyCash.transferAmount,
            'approverId': pettyCash.approver.id
          };
          if ($stateParams && $stateParams.id || pettyCash.id) {
            // update an pettyCash
            api.pettyCash.update(pettyCash.id, params)
              .success(function (data) {
                //widget.showSuccess($translate.instant('PETTY_CASH.MESSAGE_UPDATE_PETTYCASH_SUCCESS'));
                //fn && fn(data);
                //$scope.$safeApply();
                if(status==1){
                  $state.go('business/petty_cashs', {isshow: true,message:$translate.instant("PETTY_CASH.MESSAGE_SUBMIT_SUCCESS")});
                }
                if(status==0){
                  $state.go('business/petty_cashs', {isshow: true,message:$translate.instant("PETTY_CASH.MESSAGE_UPDATE_PETTYCASH_SUCCESS")});
                }
              });
          } else {
            // create new pettyCash
            api.pettyCash.create(params)
              .success(function (data) {
                //widget.showSuccess($translate.instant('PETTY_CASH.MESSAGE_NEW_PETTYCASH_SUCCESS'));
                //pettyCash.id = data.id;
                //fn && fn(data);
                //$scope.$safeApply();
                if(status==1){
                  $state.go('business/petty_cashs', {isshow: true,message:$translate.instant("PETTY_CASH.MESSAGE_SUBMIT_SUCCESS")});
                  //$state.go('business/petty_cashs', {isshow: true,message:"备用金保存成功"});
                }
                if(status==0){
                  $state.go('business/petty_cashs', {isshow: true,message:$translate.instant('PETTY_CASH.MESSAGE_NEW_PETTYCASH_SUCCESS')});
                }

              });
          }
        } else {
          utility.addErrorClass(form);
        }
      }

      // just save
      $scope.save = function (form) {
        savePettyCash(form, 0, function () {
        });
      };
      // save and new
      $scope.saveAndNew = function (form) {
        savePettyCash(form, 0, function () {
          init();
        });
      };
      // save and submit
      $scope.saveAndSubmit = function (form) {
        savePettyCash(form, 1, function () {

        });
      };

      // approve action
      $scope.approve = function () {
        api.pettyCash.approve($scope.pettyCash.id)
          .success(function () {
            widget.showSuccess($translate.instant('PETTY_CASH.MESSAGE_APPROVE_PETTY_CASH_SUCCESS'));
            $scope.pettyCash.status = 3;
            $scope.pettyCash.statusText = enumParse.pettyCash.getStatus(3);
            $scope.pettyCash.buttonStatus = null;
            $scope.$safeApply();
          });
      };
      //reject action
      $scope.reject = function () {
        modalBox.openApproveDeny($scope.pettyCash.id, 3)
          .result.then(function () {
            widget.showSuccess($translate.instant('PETTY_CASH.MESSAGE_REJECT_PETTY_CASH_SUCCESS'));
            $scope.pettyCash.status = 4;
            $scope.pettyCash.statusText = enumParse.pettyCash.getStatus(4);
            $scope.pettyCash.buttonStatus = null;
            $scope.$safeApply();
          });
      };

      //pay petty cash
      $scope.pay = function (form) {
        var pettyCash = $scope.pettyCash;
        if (form.$valid) {
          if ((parseFloat(pettyCash.payTransferAmount).toFixed(2) > 0) && pettyCash.TransferAccountCategory == null) {
            utility.addErrorClass(form);
            // $("#TransferAccountCategory").css("height", "36px");
            // $("#TransferAccountCategory").css("border", "1px solid #ea154c");
            $("#TransferAccountCategory").addClass("inputInvalid");
            return;
          }
          if (pettyCash.applyAmount !== pettyCash.total) {
            widget.showError($translate.instant('PETTY_CASH.MESSAGE_APPLY_PAY_NOT_EQUAL'));
            return;
          }
          var params = {
            'id': pettyCash.id,
            "CashAmount": pettyCash.payCashAmount,
            "TransferAmount": pettyCash.payTransferAmount,
            "TransferAccountCategoryId": pettyCash.TransferAccountCategory && pettyCash.TransferAccountCategory.id
          };
           api.pettyCash.pay(params)
             .success(function () {
               $state.go('finance/cashier_pay', {pay: true});
               widget.showSuccess($translate.instant('PETTY_CASH.MESSAGE_PAY_PETTY_CASH_SUCCESS'));
               $scope.$safeApply();
             });
        } else {
          utility.addErrorClass(form);
        }
      };
    }]);
