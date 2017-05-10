'use strict';

angular.module('concordyaApp')
  .controller('SettingCategoryBalanceCtrl', ['$scope', '$state', '$translatePartialLoader', 'APIService', 'UtilityService', 'StorageService',
    function ($scope, $state, $translatePartialLoader, api, utility, storage) {
      $translatePartialLoader.addPart('initialize/setting_category');

      var currentUser = storage.getCurrentUser();
      $scope.disabledSetting = currentUser.systemEnable ? true : !currentUser.isAccoundant;

      function initSummary() {
        $scope.summary = {
          beginning: {
            debit: 0,
            credit: 0,
            balance: false
          },
          cumulative: {
            debit: 0,
            credit: 0,
            balance: false
          }
        };
      }

      initSummary();

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
          displayData(true);
          $scope.$safeApply();
        });

      function updateParentCategory(parentCode) {
        var dataList = $scope.dataList;
        var parent = _.filter(dataList, function (item) {
          return item.code === parentCode;
        });

        if (parent.length > 0) {
          parent = parent[0];
          parent.beginningBalance = 0;
          parent.debit = 0;
          parent.credit = 0;
          parent.initialBalance = 0;

          var items = _.filter(dataList, function (item) {
            return item.parentCode === parentCode;
          });

          _.forEach(items, function (item) {
            // 期初余额同向相加, 反向相减
            if (parent.balanceDirection === item.balanceDirection) {
              parent.beginningBalance = utility.floatNumAdd(parent.beginningBalance, item.beginningBalance);
            } else {
              parent.beginningBalance = utility.floatNumSubtract(parent.beginningBalance, item.beginningBalance);
            }
            // 借：所有相加
            parent.debit = utility.floatNumAdd(parent.debit, item.debit);
            // 贷：所有相加
            parent.credit = utility.floatNumAdd(parent.credit, item.credit);
            // 期末余额： 同向相加，异向相减
            if (parent.balanceDirection === item.balanceDirection) {
              parent.initialBalance = utility.floatNumAdd(parent.initialBalance, item.initialBalance);
            } else {
              parent.initialBalance = utility.floatNumSubtract(parent.initialBalance, item.initialBalance);
            }

          });

          if (parent.parentCode) {
            updateParentCategory(parent.parentCode);
          }
        }
      }

      // get cancel-watch function
      var cancelWatch = $scope.$watch('dataList', function (newVal, oldVal) {
        if (newVal && oldVal !== newVal) {
          initSummary();
          var beginning = {
              debit: null,
              credit: null
            },
            cumulative = {
              debit: null,
              credit: null
            };

          _.forEach(newVal, function (item, i) {
            if (oldVal && !item.hasChildren && (item.beginningBalance !== oldVal[i].beginningBalance || item.debit !== oldVal[i].debit || item.credit !== oldVal[i].credit)) {

              if (item.balanceDirection === 0) {
                item.initialBalance = utility.floatNumSubtract(utility.floatNumAdd(item.beginningBalance, item.debit), item.credit);
              } else {
                item.initialBalance = utility.floatNumSubtract(utility.floatNumAdd(item.beginningBalance, item.credit), item.debit);
              }

              if (item.parentCode) {
                updateParentCategory(item.parentCode);
              }
            }

            if (item.level === 1) {
              if (item.balanceDirection === 0) {
                beginning.debit = utility.floatNumAdd(beginning.debit, item.beginningBalance);
              } else {
                beginning.credit = utility.floatNumAdd(beginning.credit, item.beginningBalance);
              }

              // get cumulative debit/credit
              cumulative.debit = utility.floatNumAdd(cumulative.debit, item.debit);
              cumulative.credit = utility.floatNumAdd(cumulative.credit, item.credit);
            }
          });
          $scope.summary.beginning = beginning;
          $scope.summary.cumulative = cumulative;
        }
      }, true);
      // remove watch on state-change for performance reason
      $scope.$on('$stateChangeStart', function () {
        cancelWatch();
      });

      // save data function
      function _save(form, isNextStep, url) {
        if (form.$valid) {
          var dataList = $scope.dataList,
            data = [];

          _.forEach(dataList, function (item) {
            data.push({
              'id': item.id,
              'balanceDirection': item.balanceDirection,
              'beginningBalance': item.beginningBalance,
              'debit': item.debit,
              'credit': item.credit,
              'initialBalance': item.initialBalance
            });
          });
          api.accountCategory.updateBlanceSet(data, isNextStep)
            .success(function () {
              currentUser.systemGuide = isNextStep ? 4 : 2;
              storage.updateUser(currentUser);
              $state.go(url);
            });
        } else {
          utility.addErrorClass(form);
        }
      }

      // go to previous page and save data
      $scope.previous = function (form) {
        var isNextStep = false,
          url = 'setup/setting_category';

        if ($scope.disabledSetting) {
          $state.go(url);
        } else {
          _save(form, isNextStep, url);
        }
      };

      // save
      $scope.save = function (form) {
        if ($scope.disabledSetting) {
          $state.go('setup/setting_finish');
        } else {
          var isNextStep = true,
            url = 'setup/setting_finish';

          _save(form, isNextStep, url);
        }
      };
    }]);
