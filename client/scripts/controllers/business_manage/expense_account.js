'use strict';
angular.module('concordyaApp')
  .controller('ExpenseAccountCtrl', ['$scope', '$q', '$state', '$translate', '$translatePartialLoader', '$stateParams', 'APIService', 'ModalBoxService', 'UtilityService', 'WidgetService', 'StorageService', 'EnumParseService',
    function ($scope, $q, $state, $translate, $translatePartialLoader, $stateParams, api, modalBox, utility, widget, storage, enumParse) {
      // add multi-lang file for business_manage/petty_cash page
      $translatePartialLoader.addPart('business_manage/petty_cash');
      var currentUser = storage.getCurrentUser();
      $scope.total = {
        receiptAmount: 0,
        receipts: 0
      };

      // combine parent name
      function getParentName(data, item, result) {
        var parent = _.findWhere(data, {'id': item.parentId});
        result.parentName = (parent && parent.name) + result.parentName;
        if (parent && parent.parentId) {
          result.parentName = ' — ' + result.parentName;
          getParentName(data, parent, result);
        }
      }

      if ($stateParams && $stateParams.id) {

        api.expense.getExpenseAccount($stateParams.id)
          .success(function (data) {
            var status = data.expenseClaimStatus;
            if (currentUser.userId == data.lastApprovedBy.userId && status == 1) {
              data.buttonStatus = 2;
            } else if ((status == 3 || status == 5) && currentUser.isCashier) {
              $scope.expense = {
                'id': data.expenseClaimId,
                'cashAmount': data.cashAmount,
                'transferAmount': data.bankAmount,
                'pettyCash': data.pettyCashAmount,
                'total': data.totalAmount,
                'isTransferAccountCategoryShow': false,
                'TransferAccountCategory': status == 5?data.bankTransferAmount:'',
                'readonly': (status == 5),
                'disabled': true,
                'applyAmount': data.totalAmount
              };
              data.buttonStatus = status;

              api.expense.getBankAccountCategoryList()
                .success(function (accountCategoryData) {
                  _.forEach(accountCategoryData, function (item) {
                    if (item.parentId) {
                      item.parentName = '';
                      getParentName(accountCategoryData, item, item);
                    }
                  });
                  $scope.AccountCategoryList = accountCategoryData;
                  $scope.$safeApply();
                });


            }
            _.forEach(data.timeline, function (item) {
              item.action = enumParse.pettyCash.getAction(item.actionCode);
            });
            $scope.expenseAccount = data;
            calculateTotal(data.receipts);
          });
      } else {

      }

      // watch expense
      var cancelWatch = $scope.$watch('expense', function (newVal) {
        if ($scope.expense) {
          var expense = $scope.expense;
          expense.total = utility.floatNumAdd(expense.cashAmount, expense.transferAmount, expense.pettyCash);
          $scope.expense.isTransferAccountCategoryShow = parseFloat($scope.expense.transferAmount) > 0;
          if (($scope.expense.isTransferAccountCategoryShow && $scope.expense.TransferAccountCategory) || !$scope.expense.isTransferAccountCategoryShow) {
            $("#TransferAccountCategory").removeClass("inputInvalid");
          }
        }
      }, true);

      // remove watch on state-change for performance reason
      $scope.$on('$stateChangeStart', function () {
        cancelWatch();
      });

      function calculateTotal(receipts) {
        var amount = 0, attachments = 0;
        for (var i = 0, len = receipts.length; i < len; i++) {
          var item = receipts[i];
          amount = amount + item.amount;
          attachments = attachments + item.attachments.length;
        }
        $scope.total.receiptAmount = amount;
        $scope.total.receipts = attachments;
      }

      // approve action
      $scope.approve = function () {
        api.expense.approve($scope.expenseAccount.expenseClaimId)
          .success(function () {
            widget.showSuccess($translate.instant('报销单通过成功！'));
            $scope.expenseAccount.expenseClaimStatus = 3;
            $scope.expenseAccount.buttonStatus = null;
            $scope.$safeApply();
          });
      };
      //reject action
      $scope.reject = function () {
        modalBox.openApproveDeny($scope.expenseAccount.expenseClaimId, 2, 2)
          .result.then(function () {
            widget.showSuccess($translate.instant('报销单拒绝成功！'));
            $scope.expenseAccount.status = 4;
            $scope.expenseAccount.buttonStatus = null;
            $scope.$safeApply();
          });
      };

      //forward action
      $scope.forward = function () {
        modalBox.openForward($scope.expenseAccount.expenseClaimId, 2, 1)
          .result.then(function () {
            widget.showSuccess($translate.instant('报销单转发成功！'));
            $scope.expenseAccount.buttonStatus = null;
            $scope.$safeApply();
          });
      };

      //pay expense cash
      $scope.pay = function (form) {
        if (form.$valid) {
          var expense = $scope.expense;
          if (expense.isTransferAccountCategoryShow && !expense.TransferAccountCategory) {
            $("#TransferAccountCategory").addClass("inputInvalid");
            return;
          }
          if (expense.applyAmount !== expense.total) {
            widget.showError($translate.instant('PETTY_CASH.MESSAGE_APPLY_PAY_NOT_EQUAL'));
            return;
          }

          var params = {
            "PettyCashAmount": expense.payCashAmount,
            "CashAmount": expense.payCashAmount,
            "BankAmount": expense.payTransferAmount,
            "ChartOfBankTransfer": {Id: expense.TransferAccountCategory.id}
          };
          api.expense.pay(expense.id, params)
            .success(function () {
              $state.go('finance/cashier_pay', {pay: true});
              widget.showSuccess($translate.instant('报销单支付完成！'));
              $scope.$safeApply();
            });
        } else {
          utility.addErrorClass(form);
        }
      };

    }]);
