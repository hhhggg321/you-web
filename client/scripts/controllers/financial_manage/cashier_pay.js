'use strict';

angular.module('concordyaApp')
  .controller('CashierPayCtrl', ['$scope', '$translate', '$translatePartialLoader','$state', '$stateParams', 'UtilityService', 'APIService', 'WidgetService', 'EnumParseService','CONSTANT.PAGE_SIZE',
    function ($scope, $translate, $translatePartialLoader, $state, $stateParams, utility, api, widget,enumparse, PAGE_SIZE) {

      $scope.ispay = 0;

      $scope.$watch("ispay", function(newValue, oldValue) {
        $scope.search($scope.ispay);
      });


      $translatePartialLoader.addPart('business_manage/petty_cash');
      //widget.hideMessage();
      // page object

      $scope.page = {
        index: 1,
        size: PAGE_SIZE,
        total: 0
      };
      //search form object
      $scope.searchForm = {
        beginAmount : null,
        endAmount : null,
        entityType : null,
        applyer : null
      };
      //get entity type list
      api.cashierPay.getEntityTypeEnum()
        .success(function(data){
          $scope.entityTypeList = data;
          $scope.$safeApply();
        });

      //get applyer list
      api.account.getActiveUserList()
        .success(function(data){
          var list = [];
          _.forEach(data,function(item){
            list.push({
              id: item.id,
              name: item.displayName
            });
          });
          list.unshift({
            id: null,
            name: $translate.instant('COMMON.ALL')
          });
          $scope.applyerList = list;
        });

      if ($stateParams && $stateParams.pay) {
        window.setTimeout(function(){
          widget.showSuccess($translate.instant('PETTY_CASH.MESSAGE_PAY_PETTY_CASH_SUCCESS'));
        },100);
      }
      // get search form params
      function getSearchFormParams(params) {
        if($scope.searchForm.beginAmount){
          params.beginAmount = $scope.searchForm.beginAmount;
        }
        if($scope.searchForm.endAmount){
          params.endAmount = $scope.searchForm.endAmount;
        }
        if($scope.searchForm.entityType && $scope.searchForm.entityType.id !== null){
          params.entityType = $scope.searchForm.entityType.id;
        }
        if($scope.searchForm.applyer && $scope.searchForm.applyer.id !== null){
          params.applyerId = $scope.searchForm.applyer.id;
        }
      }
      //get data list
      function getDataList(params) {
        params = utility.checkParams($scope, params);
        getSearchFormParams(params);
        api.cashierPay.getList(params)
          .success(function (data, status) {
            var list = data.list;
            if (status === 200) {
              _.forEach(list, function (item){
                for(var i= 0;i<$scope.entityTypeList.length;i++){
                  if(item.entityType == $scope.entityTypeList[i].id){
                    item.entityType = $scope.entityTypeList[i];
                  }
                }
              });
              $scope.dataList = list;
              $scope.page.total = data.totalCount;
              $scope.$safeApply();
            }
          });
      }

      // watch page.index
      utility.watchPageIndex($scope, function (newIndex) {
        getDataList({
          'page': newIndex,
          'pageSize': $scope.page.size
        });
      });

      // search
      $scope.search = function (flag) {
        widget.hideMessage();
        var params = {
          'page': 1,
          'pageSize': $scope.page.size
        };
        switch (flag) {
          case 0:
            params.ispay = false;
            break;
          case 1:
            params.ispay = true;
            break;
        }
        getDataList(params);
      };
    }
  ]);
