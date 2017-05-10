'use strict';

angular.module('concordyaApp')
  .controller('SettingCategoryCtrl', ['$scope', '$state', '$translate', '$translatePartialLoader', 'APIService', 'UtilityService', 'WidgetService', 'StorageService',
    function ($scope, $state, $translate, $translatePartialLoader, api, utility, widget, storage) {
      $translatePartialLoader.addPart('initialize/setting_category');

      var currentUser = storage.getCurrentUser();
      $scope.disabledSetting = currentUser.systemEnable ? true : !currentUser.isAccoundant;

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
      // get account-category
      api.accountCategory.getSet()
        .success(function (data) {
          var list = [];
          _.forEach(data, function (item) {
            item.action = 3;
            list.push(item);
          });
          $scope.dataList = list;
          displayData(true);
          $scope.$safeApply();
        });

      // trigger all category checked or not
      $scope.trigger = function (data) {
        var list = $scope.dataList;
        if (data) {
          _.forEach(list, function (item) {
            if (!item.defaultEnable) {
              if (item.parentCode.indexOf(data.code) !== -1) {
                item.enable = data.enable;
              }
              if (data.parentCode && (data.parentCode.indexOf(item.code) !== -1)) {
                if (data.enable) {
                  item.enable = data.enable;
                }
              }
            }
          });
        } else {
          $scope.allEnable = !$scope.allEnable;
          if ($scope.allEnable) {
            _.forEach(list, function (item) {
              if (!item.defaultEnable) {
                item.enable = true;
              }
            });
          } else {
            _.forEach(list, function (item) {
              if (!item.defaultEnable) {
                item.enable = false;
              }
            });
          }
        }
      };

      // add new sub-category
      $scope.newCategory = function (item) {
        var dataList = $scope.dataList;
        api.accountCategory.getMaxCode(dataList, item.code)
          .success(function (maxCode) {
            var index;
            for (var i = 0, len = dataList.length; i < len; i++) {

              if (dataList[i].code.indexOf(item.code) === 0) {
                index = i;
              }
            }

            var list = _.slice(dataList, 0, index + 1);
            var newItem = {
              'id': null,
              'code': maxCode,
              'name': null,
              'parentCode': item.code,
              'level': item.level + 1,
              'balanceDirection': item.balanceDirection,
              'isPredefined': false,
              'enable': true,
              'action': 0
            };
            list.push(newItem);
            _.forEach(_.slice(dataList, index + 1, dataList.length), function (item) {
              list.push(item);
            });
            $scope.trigger(newItem);
            $scope.dataList = list;
          });
      };

      // delete category
      $scope.delete = function (data) {
        var list = $scope.dataList;
        if (data.action === 0) {
          _.remove(list, function (item) {
            return item.code === data.code || item.parentCode === data.code;
          });
        } else {
          data.action = 2;
          _.forEach(list, function (item) {
            if (item.parentCode.indexOf(data.code) !== -1) {
              item.action = 2;
            }
          });
        }
      };

      // get cancel-watch function
      var cancelWatch = $scope.$watch('dataList', function (newVal, oldVal) {
        if (newVal && oldVal) {
          _.forEach(newVal, function (item, index) {
            // if item's action is not new and not remove
            if (item.action !== 0 && item.action !== 2) {
              var oldItem = oldVal[index];
              if (oldItem && item.code === oldItem.code) {
                if (item.name !== oldItem.name || item.enable !== oldItem.enable) {
                  item.action = 1;
                }
              }
            }
          });
        }
      }, true);

      // remove watch on state-change for performance reason
      $scope.$on('$stateChangeStart', function () {
        cancelWatch();
      });

      // save category function
      function _save(form, isNextStep, url) {
        var enableSubmit = false,
          isSameName = false,
          sameList = [],
          list = $scope.dataList;

        if (form.$valid) {
          _.forEach(list, function(item) {
            if (item.action === 0) {
              item.isSameName = false;
              sameList = _.filter(list, {'parentCode': item.parentCode});
              _.forEach(sameList, function(sameItem) {
                if (item.code !== sameItem.code && item.name === sameItem.name) {
                  isSameName = true;
                  item.isSameName = true;
                }
              });
            }
          });
          if (isSameName) {
            utility.addErrorClass(form);
            widget.showError($translate.instant('SETTING_CATEGORY.NOT_SAME_NAME'));
            return;
          }

          for (var i = 0, len = list.length; i < len; i++) {
            if (list[i].enable) {
              enableSubmit = true;
              break;
            }
          }
          if (!enableSubmit) {
            widget.showError($translate.instant('COMMON.SELECT_OPERATE_ITEM'));
            return;
          }

          api.accountCategory.updateSet($scope.dataList, isNextStep)
            .success(function () {
              currentUser.systemGuide = isNextStep ? 3 : 1;
              storage.updateUser(currentUser);
              $state.go(url);
            });
        } else {
          utility.addErrorClass(form);
        }
      }

      // save category, and go to previous page
      $scope.previous = function (form) {
        var isNextStep = false,
          url = 'setup/setting_company';

        if ($scope.disabledSetting) {
          $state.go(url);
        } else {
          _save(form, isNextStep, url);
        }
      };

      // save category, and go to next page
      $scope.save = function (form) {
        if ($scope.disabledSetting) {
          $state.go('setup/setting_category_balance');
        } else {
          var isNextStep = true,
            url = 'setup/setting_category_balance';

          _save(form, isNextStep, url);
        }
      };
    }]);
