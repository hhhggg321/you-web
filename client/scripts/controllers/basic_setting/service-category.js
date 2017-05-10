
'use strict';

angular.module('concordyaApp')

  .controller('ServiceCategoryCtrl', ['$scope', '$rootScope', 'APIService', 'WidgetService', 'UtilityService', 'ModalBoxService', 'CONSTANT.PAGE_SIZE',
    function ($scope, $rootScope, api, widget, utility, modalBox, PAGE_SIZE) {
      widget.hideMessage();

      //$scope.disabledSetting = currentUser.systemEnable ? true : !currentUser.isAccoundant;
      //page var
      $scope.page = {
        index:0,
        size:PAGE_SIZE,
        total:0,
        model:null
      };
      //search model
      $scope.searchForm = {
        codeOrName:null
      };

      //get servicetype list by page
      function getDataList(params){
          params = utility.checkParams($scope,params);
          api.serviceCategory.getList(params).success(function(data,status){
              if(status === 200){
                $scope.dataList = data.inventoryServiceCategories;
                $scope.page.total = data.totalCount;
                $scope.$safeApply();
              }
          });
      };
      getDataList();

      utility.watchPageIndex($scope,function(newIndex){
          getDataList({
            'pageIndex': newIndex,
            'pageSize': $scope.page.size
          });
      });

      //triggerItem  selected/unselected
      $scope.triggerItem = function(item){
        utility.triggerSelect(item,$scope.dataList);
      };
      //create new servicetype
      $scope.addNew = function(){
          //alert("来了");
          modalBox.openNewServiceCategory()
          .result.then(function(){
            widget.showSuccess('添加成功');
            getDataList();
          });
      };
      //edit open detail
      $scope.edit = function(item){
        console.log(item);
          modalBox.openNewServiceCategory(item)
          .result.then(function(){
              widget.showSuccess("更新成功");
              getDataList();
          });
      };
      //delete function
      $scope.delete = function(){
        var ids = utility.getSelectedIds($scope.dataList);
        if(ids && ids.length>0){
          console.log(ids);
        }else{
          widget.showError("请选择操作对象");
        }
      };

    }]);
