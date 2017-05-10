'use strict';

angular.module('concordyaApp')
  .controller('ExpenseAccountSettingCtrl', ['$scope', '$filter', '$translate', '$translatePartialLoader', 'APIService', 'UtilityService', 'WidgetService', 'ModalBoxService', 'StorageService', 'CONSTANT.PAGE_SIZE',
    function ($scope, $filter, $translate, $translatePartialLoader, api, utility, widget, modalBox, storage, PAGE_SIZE) {
      $translatePartialLoader.addPart('basic_setting/expense_account_setting');
      widget.hideMessage();

      $scope.AccountCategoryList = [];
      $scope.CategorySubList = [];
      getAccountingCategoryList();
      $scope.formInvalid = false;

      $scope.changeTab = function(code,form){
        if($scope.formInvalid){
          utility.removeErrorClass(form);
        }
        widget.hideMessage();
        loadCategorySubList(code);
        getSettingList(code);
      };

      //get account category list
      function getAccountingCategoryList(){
        api.expenseAccountSetting.getAccountingCategoryList()
          .success(function(data){
            itemHasChildren(data);
            $scope.AccountCategoryList = data;
          });
      }
      //is item has children
      function itemHasChildren(data){
        _.forEach(data,function(item){
          if(item.children.length){
            item.hasChildren = true;
            itemHasChildren(item.children);
          }else{
            item.hasChildren = false;
          }
        });
      }
      //option list of the selete text area
      function loadCategorySubList(code){
        $scope.CategorySubList = [];
        var list = $scope.AccountCategoryList;
        var subList = [];
        for(var i=0;i<list.length;i++){
          if(list[i].code == code){
            subList.push(list[i]);
            break;
          }
        }
        addChildrenToList(subList);
        $scope.$safeApply();
      }
      //add children to the CategorySubList(option list)
      function addChildrenToList(list){
        list.sort(function(a,b){
          return a.code - b.code;
        });
        _.forEach(list,function(item){
          var tempItem = _.cloneDeep(item);
          delete tempItem.children;
          $scope.CategorySubList.push(tempItem);
          if(item.hasChildren){
            addChildrenToList(item.children);
          }
        });
      }

      function getSettingList(code){
        api.expenseAccountSetting.getSettingList(code)
          .success(function(data){
            $scope.travelExpenseList = modifySettingList(data.travel);
            $scope.nonTravelExpenseList = modifySettingList(data.nonTravel);
          });
      }

      //modify setting list
      function modifySettingList(list){
        _.forEach(list,function(item){
          item.accountCategory = _.findWhere($scope.CategorySubList,{code: item.accountcategoryCode});
          item.name = item.receiptType.name;
        });
        list = list.sort(function(a,b){
          return a.receiptType.orderNo - b.receiptType.orderNo;
        });
        return list;
      }

      $scope.save = function(form){
        if(form.$valid){
          var params = [];
          var travelList = $scope.travelExpenseList;
          var nonTravelList = $scope.nonTravelExpenseList;
          var list = travelList.concat(nonTravelList);
          _.forEach(list,function(item) {
            params.push({
              id: item.id,
              accountcategoryCode: item.accountCategory && item.accountCategory.code
            });
          });
          api.expenseAccountSetting.update(params)
            .success(function(data,status){
              if (status === 200) {
                if(data.failedIds.length > 0){
                  widget.showError($translate.instant('COMMON.UPDATE_ERROR')+data.failedIds.length+$translate.instant('COMMON.ITEM')+"    "+$translate.instant('COMMON.UPDATE_SUCCESS')+data.successIds.length+$translate.instant('COMMON.ITEM'));
                }else{
                  widget.showSuccess($translate.instant('COMMON.UPDATE_SUCCESS'));
                }
              }
            });
        }else{
          $scope.formInvalid = true;
          utility.addErrorClass(form);
        }
      };

    }]);
