'use strict';

angular.module('concordyaApp')
  .controller('CategoryMaintenanceCtrl', ['$rootScope', '$scope', '$translate', '$translatePartialLoader', 'APIService', 'UtilityService', 'ModalBoxService', 'WidgetService', 'StorageService',
    function ($rootScope, $scope, $translate, $translatePartialLoader, api, utility, modalBox, widget, storage) {
      // add multi-lang file for setting/category page
      $translatePartialLoader.addPart('financial_manage/category');

      var currentUser = storage.getCurrentUser();
      $scope.currentUser = currentUser;

      loadMaintenanceData();
      var _copyDatalist = {};

      $scope.selectedItem = null;
      $scope.navTabs = {
        rootCategory: 0
      };

      $scope.switchTabs = function (status) {
        $scope.navTabs.rootCategory = status;
      };

      function displayData(display) {
        var list = $scope.dataList,
        // focused item that is in accordance to requirement
          item;
        for (var i = 0, len = list.length; i < len; i++) {
          //if (item){
          //  // the subcategory of THE item
          //  if (list[i].code.indexOf(item.code) !== -1){
          //    list[i].isDisabled = true;
          //  }
          //  else{
          //    item = null;
          //  }
          //}
          if (display) {
            list[i].isExpansion = false;
          }
          if (list[i].level > 1) {
            list[i].show = display;
          }
          //if (list[i].initialBalance == 0 && (list[i].credit !== 0 || list[i].debit !== 0)){
          //  item = list[i];
          //}

        }
      }

      $scope.expansion = function (item) {
        item.isExpansion = !item.isExpansion;
        var list = $scope.dataList;
        for (var i = 0, len = list.length; i < len; i++) {
          var code = list[i].code;
          if (code.indexOf(item.code) === 0 && code !== item.code) {
            list[i].show = item.isExpansion ? false : true;
            if (list[i].hasChildren) {
              list[i].isExpansion = false;
            }
          }
        }
      };

      function loadMaintenanceData() {
        api.accountCategory.getMaintenanceData().success(function (data) {
          $scope.dataList = data;
          _copyDatalist = angular.copy($scope.dataList);
          displayData(true);
        });
      }

      function whetherFillSub(item) {
        var dataList = $scope.dataList,
        //index of current item
          itemIndex = dataList.indexOf(item),
        //counter for next item
          i = itemIndex,
        // next item
          target;
        // check if the current item has initalBalance -> not fill
        if (item.initialBalance === 0 || item.initialBalance === null) {
          return false;
        }
        while (true) {
          target = dataList[++i];
          // next item is not the subcategory of current item
          if (target.code.indexOf(item.code) == -1) {
            // current item has no subcategory
            // if ( i == itemIndex +1 ){
            //   return true;
            // }
            // all the subcategories is unenabled
            return true;
          }
          // next item is the subcategory of current item
          else {
            // subcategory is enabled
            if (target.enable) {
              return false;
            }
            continue;
          }
        }
      }

      function addNew(item, isFirst) {
        $scope.directionList = [{id: 0, name: '鍊�'}, {id: 1, name: '璐�'}];
        ;
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
            var initialBalance = isFirst ? item.initialBalance : 0;
            var newCategory = {
              'code': maxCode,
              'name': null,
              'parentCode': item.code,
              'parentItem': item,
              'parentId': item.id,
              'rootCategory': item.rootCategory,
              'level': item.level + 1,
              'balanceDirection': item.balanceDirection,
              'balanceDirectionObj': $scope.directionList[item.balanceDirection],
              'initialBalance': initialBalance,
              'endingbalance': initialBalance,
              'prohibitCreation': false,
              'debit': 0,
              'credit': 0,
              'enable': true,
              'isNew': true,
              'action': 0
            };

            list.push(newCategory);
            _.forEach(_.slice(dataList, index + 1, dataList.length), function (item) {
              list.push(item);
            });
            $scope.dataList = list;
          });
      }

      $scope.newCategory = function (item) {
        if (!item.enable) {
          return;
        }
        if (whetherFillSub(item)) {
          var msg = $translate.instant('CATEGORY.IMPORT_INITIAL_VALUE');
          modalBox.openConfirm(msg)
            .result.then(function () {
              addNew(item, true);
            }, function () {
            });
        } else {
          addNew(item, false);
        }
      };

      $scope.delete = function (data) {
        var list = $scope.dataList;
        _.remove(list, function (item) {
          return item.code === data.code;
        });
      };

      $scope.addRootCategory = function (category) {
        var list = $scope.dataList;
        var code = getRootMaxCodeByCategory(parseInt(category) + 1);
        //var code =  parseInt(category) + 1;
        /*api.accountCategory.getMaxCode(list, null)
         .success(function (maxCode) {*/
        var newCategory = {
          'code': code.toString(),
          'name': null,
          'parentCode': null,
          'level': 1,
          'rootCategory': category,
          'balanceDirection': 0,
          'initialBalance': 0,
          'endingbalance': 0,
          'prohibitCreation': false,
          'debit': 0,
          'credit': 0,
          'enable': true,
          'isNew': true,
          'action': 0,
          'isNewRoot': true
        };
        list.push(newCategory);
        /* });*/
      };

      $scope.save = function (form) {
        if (!repeatNameValidate()) {
          utility.addErrorClass(form);
          return;
        }
        if (form.$valid) {
          var saveList = [];
          var list = $scope.dataList;
          for (var i = 0, len = list.length; i < len; i++) {
            if (typeof(list[i].action) !== 'undefined' && list[i].action === 0 || list[i].action === 1) {
              saveList.push(list[i]);
            }
          }

          if (saveList.length > 0) {
            api.accountCategory.maintenanceModify(saveList).success(function (data, status) {
              if (status === 200) {
                if (data.failedIds.length > 0) {
                  widget.showError($translate.instant('COMMON.SAVE_ERROR') + data.failedIds.length + $translate.instant('COMMON.ITEM') + "    " + $translate.instant('COMMON.SAVE_SUCCESS') + data.successIds.length + $translate.instant('COMMON.ITEM'));
                } else {
                  widget.showSuccess($translate.instant('CATEGORY.SAVE_SUCCESS'));
                }
              }
              loadMaintenanceData();
            });
          }
        } else {
          utility.addErrorClass(form);
        }
      };

      /**
       * @param {object} item should be equal or below 2nd level
       * @param {object} parent should be the parent of item
       **/
      function hasEnabledSlibingcategory(item, parent) {
        var dataList = $scope.dataList,
        //parent index
          parentIndex = dataList.indexOf(parent),
        //counter for child item
          i = parentIndex,
        //next item
          next;

        while (true) {

          next = dataList[++i];
          // subcategory
          if (next.code.indexOf(parent.code) !== -1) {
            if (next.enable && next !== item) {
              return true;
            }
            else {
              continue;
            }
          }
          else {
            return false;
          }
        }

      }

      $scope.changeEnable = function (data) {
        if (!data.isNew) {
          data.action = 1;
        }

        //enable or disable children item automatically
        if (!data.enable) {
          var list = $scope.dataList;
          for (var i = 0, len = list.length; i < len; i++) {
            if (list[i].code.indexOf(data.code) === 0 && list[i].code !== data.code) {
              list[i].enable = false;
            }
          }
        }

        //enable or disable parent item automatically
        var parent = findItemByCode(data.parentCode);
        if (parent&&!parent.defaultEnable) {
          if (!data.enable && !hasEnabledSlibingcategory(data, parent)) {
            parent.enable = false;
          } else {
            parent.enable = true;
          }
        }
        if (data.enable && data.level !== 1) {
          if (!hasEnabledSlibingcategory(data, parent)) {
            if (parent.initialBalance > 0) {
              var msg = $translate.instant('CATEGORY.IMPORT_INITIAL_VALUE');
              modalBox.openConfirm(msg)
                .result.then(function () {
                  parent.enable = true;
                  data.initialBalance = parent.initialBalance;
                }, function () {
                  data.enable = false;
                });
            }
          }
        }
      };

      function findItemByCode(code) {
        var list = $scope.dataList;
        var result;
        for (var i = 0, len = list.length; i < len; i++) {
          if (list[i].code === code) {
            result = list[i];
            break;
          }
        }
        return result;
      }

      $scope.changeDirection = function (item) {
        if (item.balanceDirection != item.balanceDirectionObj.id) {
          item.balanceDirection = item.balanceDirectionObj.id;
          item.endingbalance = -item.initialBalance;
          item.initialBalance = -item.initialBalance;
        }
      };

      function repeatNameValidate() {
        var list = $scope.dataList;
        var validateList = [];
        for (var i = 0, len = list.length; i < len; i++) {
          if (typeof(list[i].action) !== 'undefined' && list[i].action === 0) {
            validateList.push(list[i]);
          }
        }

        var result = true;

        for (var j = 0, j_len = validateList.length; j < j_len; j++) {
          var parentCode = validateList[j].parentCode;
          var count = 0;
          for (var i = 0, len = list.length; i < len; i++) {
            if (list[i].parentCode === parentCode && validateList[j].name === list[i].name) {
              count += 1;
            }
          }
          if (count > 1) {
            validateList[j].nameRepeat = true;
            result = false;
          } else {
            validateList[j].nameRepeat = false;
          }
        }

        return result;
      }

      function getRootMaxCodeByCategory(category) {
        var dataList = $scope.dataList;
        var list = _.filter(dataList, function (item) {
          return item.level === 1 && item.code.indexOf(category) === 0;
        });
        var len = list.length;
        return parseInt(list[len - 1].code) + 1;
      }

      $scope.editAssistAccount = function () {
        if ($scope.selectedItem !== null) {
          modalBox.openAssistAccount($scope.selectedItem)
            .result.then(function () {
              widget.showSuccess($translate.instant('CATEGORY.EDIT_ASSIST_SUCCESS'));
              loadMaintenanceData();
            });
        } else {
          widget.showError($translate.instant('COMMON.SELECT_OPERATE_ITEM'));
        }
      };

      $scope.selectCategory = function (item,isEnable) {
        if ($scope.selectedItem !== null) {
          $scope.selectedItem.selected = false;
          item.selected = true;
          $scope.selectedItem = item;
        } else {
          item.selected = true;
          $scope.selectedItem = item;
        }
        var tt = _copyDatalist;
        var tt1 =$scope.dataList;
        $scope.assistEnable = !(item.credit !== 0 || item.debit !== 0) && item.id && (item.enable ? true : false)&&isEnable;
      };

      $scope.itemBindAssistInfo = function (item) {
        if (item.bindedAssistantTypes) {
          var content = "";
          for (var i = 0, len = item.bindedAssistantTypes.length; i < len; i++) {
            content += "," + item.bindedAssistantTypes[i].name;
          }
          return content.substring(1);
        }
      };

    }]);
