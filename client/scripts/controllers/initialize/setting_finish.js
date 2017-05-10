'use strict';

angular.module('concordyaApp')
  .controller('SettingFinishCtrl', ['$scope', '$state', '$translate', '$translatePartialLoader', 'APIService', 'ModalBoxService', 'StorageService',
    function ($scope, $state, $translate, $translatePartialLoader, api, modalBox, storage) {
      $translatePartialLoader.addPart('initialize/setting_finish');

      var currentUser = storage.getCurrentUser();
      $scope.disabledSetting = currentUser.systemEnable ? true : !currentUser.isAccoundant;

      $scope.summary = {
        beginning: {
          debit: 0,
          credit: 0,
          balance: true
        },
        cumulative: {
          debit: 0,
          credit: 0,
          balance: true
        }
      };

      function displayData(display) {
        var list = $scope.dataList;
        for (var i = 0, len = list.length; i < len; i++) {
          if (display) {
            list[i].isExpansion = false;
          }
          if (list[i].level > 1) {
            list[i].show = display;
          }
        }
      }

      $scope.expansion = function (item) {
        item.isExpansion = !item.isExpansion;
        var list = $scope.dataList;
        for (var i = 0, len = list.length; i < len; i++) {
          var code = list[i].code;
          if (code.indexOf(item.code) === 0 && code !== item.code) {
            list[i].show = item.isExpansion ? false : true;
            if(list[i].hasChildren){
              list[i].isExpansion = false;
            }
          }
        }
      };
      // get account-category balance
      api.accountCategory.getBalanceSet()
        .success(function (data) {
          $scope.dataList = data;

          _.forEach(data, function (item) {
            // get beginning debit/credit
            var beginningBalance = parseFloat(item.beginningBalance) || 0,
              credit = parseFloat(item.credit) || 0,
              debit = parseFloat(item.debit) || 0;
            if (item.level === 1) {
              if (item.balanceDirection === 0) {
                $scope.summary.beginning.debit += beginningBalance;
              } else {
                $scope.summary.beginning.credit += beginningBalance;
              }

              // get cumulative debit/credit
              $scope.summary.cumulative.debit += debit;
              $scope.summary.cumulative.credit += credit;
            }
          });

          // caculate beginning-balance
          if ($scope.summary.beginning.debit.toFixed(2) === $scope.summary.beginning.credit.toFixed(2)) {
            $scope.summary.beginning.balance = true;
          } else {
            $scope.summary.beginning.balance = false;
          }

          // caculate cumulative-balance
          if ($scope.summary.cumulative.debit.toFixed(2) === $scope.summary.cumulative.credit.toFixed(2)) {
            $scope.summary.cumulative.balance = true;
          } else {
            $scope.summary.cumulative.balance = false;
          }
          displayData(true);
          $scope.$safeApply();
        });

      // go to previous page
      $scope.previous = function () {
        currentUser.systemGuide = 3;
        storage.updateUser(currentUser);

        $state.go('setup/setting_category_balance');
      };

      $scope.goHome = function () {
        $state.go('index');
      };

      // check parent and children debit/credit balance
      function isCategoryBalance(dataList, parent) {
        var childrenList = _.filter(dataList, function (item) {
          return item.parentCode === parent.code;
        });

        if (childrenList && childrenList.length > 0) {
          var parentBeginningBalance = parseFloat(parent.beginningBalance) || 0,
            parentCredit = parseFloat(parent.credit) || 0,
            parentDebit = parseFloat(parent.debit) || 0;

          var beginningBalance = 0, credit = 0, debit = 0;
          _.forEach(childrenList, function (item) {
            if (parent.balanceDirection === item.balanceDirection) {
              beginningBalance += parseFloat(item.beginningBalance) || 0;
            } else {
              beginningBalance -= parseFloat(item.beginningBalance) || 0;
            }
            credit += parseFloat(item.credit) || 0;
            debit += parseFloat(item.debit) || 0;
          });

          // if not balance, mark them as not-balance
          if (beginningBalance.toFixed(2) !== parentBeginningBalance.toFixed(2)
            || credit.toFixed(2) !== parentCredit.toFixed(2) || debit.toFixed(2) !== parentDebit.toFixed(2)) {
            parent.notBalance = true;
            _.forEach(childrenList, function (item) {
              item.notBalance = true;
            });
            return false;
          }

          // continue check grandchild category's balance
          var allChildrenBalance = true;
          _.forEach(childrenList, function (child) {
            if (!isCategoryBalance(dataList, child)) {
              allChildrenBalance = false;
            }
          });
          if (!allChildrenBalance) {
            return false;
          }
        }
        return true;
      }

      // save category, and go to next page
      $scope.save = function (form) {
        if ($scope.disabledSetting) {
          $state.go('index');
        } else {
          // check parent-category and children-category credit/debit balance
          var allCategoryBalance = true,
            dataList = $scope.dataList,
            levelOneList = _.filter(dataList, function (item) {
              return item.level === 1;
            }),
            msg = $translate.instant('SETTING_FINISH.ENABLE_CONFIGURATION');

          _.forEach(levelOneList, function (parent) {
            if (!isCategoryBalance(dataList, parent)) {
              allCategoryBalance = false;
            }
          });

          // if all category are balance, submit them
          if (allCategoryBalance) {
            modalBox.openConfirm(msg)
              .result.then(function () {
                api.company.enable(currentUser.currentCompanyId)
                  .success(function () {
                    currentUser.systemEnable = true;
                    storage.updateUser(currentUser);
                    $state.go('index');
                  });
              });
          }
        }
      };
    }]);
