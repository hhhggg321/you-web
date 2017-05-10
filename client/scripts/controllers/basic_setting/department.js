
'use strict';

angular.module('concordyaApp')
  .controller('DepartmentCtrl', ['$scope', '$translate', '$translatePartialLoader', 'APIService', 'WidgetService', 'UtilityService', 'ModalBoxService', 'CONSTANT.PAGE_SIZE',
    function ($scope, $translate, $translatePartialLoader, api, widget, utility, modalBox, PAGE_SIZE) {
      // add multi-lang file for setting/contact page
      $translatePartialLoader.addPart('basic_setting/department');
      widget.hideMessage();

      getAccountingCategoryList();
      // page object
      $scope.page = {
        index: 1,
        size: PAGE_SIZE,
        total: 0
      };
      $scope.searchForm = {
        codeOrName: null
      };
      function getSearchFormParams(params) {
        if ($scope.searchForm.codeOrName) {
          params.keyword = $scope.searchForm.codeOrName;
        }
      }
      // get department list by page
      function getDataList(params) {
        params = utility.checkParams($scope, params);
        getSearchFormParams(params);
        $scope.dataList = [];
        api.department.getListByPage(params)
          .success(function (data) {
            _.forEach(data.list,function(item){
              item.category = _.findWhere($scope.categoryList,{code: item.accountCategoryCode});
            });
            $scope.dataList = data.list;
            $scope.page.total = data.totalCount;
            $scope.$safeApply();
          });
      }

      //get account category list
      function getAccountingCategoryList(){
        api.expenseAccountSetting.getAccountingCategoryList()
          .success(function(data){
            $scope.categoryList = data;
          });
      }
      // watch page.index
      utility.watchPageIndex($scope, function (newIndex) {
        getDataList({
          'pageIndex': newIndex,
          'pageSize': $scope.page.size
        });
      });

      // search
      $scope.search = function () {
        var params = {
          'pageIndex': 1,
          'pageSize': $scope.page.size
        };
        widget.hideMessage();
        getDataList(params);
      };

      // add new department
      $scope.addNew = function () {
        modalBox.openNewDepartment()
          .result.then(function () {
            widget.showSuccess($translate.instant('DEPARTMENT.MESSAGE_NEW_SUCCESS'));
            getDataList();
          });
      };

      $scope.edit = function (item) {
        modalBox.openNewDepartment(item)
          .result.then(function () {
            widget.showSuccess($translate.instant('DEPARTMENT.MESSAGE_UPDATE_SUCCESS'));
            getDataList();
          });
      };

      // delete action
      $scope.delete = function () {
        var ids = utility.getSelectedIds($scope.dataList);
        if (ids && ids.length > 0){
          api.department.delete(ids)
            .success(function (data, status) {
              if (status === 200) {
                if(data && data.failedIds && data.failedIds.length > 0){
                  widget.showError($translate.instant('COMMON.DELETE_ERROR')+data.failedIds.length+$translate.instant('COMMON.ITEM')+"    "+$translate.instant('COMMON.DELETE_SUCCESS')+data.successIds.length+$translate.instant('COMMON.ITEM'));
                  getDataList();
                }else{
                  widget.showSuccess($translate.instant('DEPARTMENT.MESSAGE_DELETE_SUCCESS'));
                  getDataList();
                }
              }
            });
        } else {
          widget.showError($translate.instant('COMMON.SELECT_OPERATE_ITEM'));
        }
      };
      //enter key down
      $scope.enterKeyDown=function(event){
        if(event.keyCode === 13){
          $scope.search();
        }
      };
      // trigger contact selected status
      $scope.triggerItem = function (item) {
        utility.triggerSelect(item, $scope.dataList);
      };
    }]);
