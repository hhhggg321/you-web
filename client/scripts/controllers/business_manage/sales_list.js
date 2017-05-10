'use strict';
angular.module('concordyaApp')
  .controller('SalesListCtrl', ['$scope', '$state','APIService', 'UtilityService', 'WidgetService', 'ModalBoxService', 'CONSTANT.PAGE_SIZE',
    function ($scope, $state, api, utility, widget, modalBox, PAGE_SIZE) {


      // page object
      $scope.page = {
        index: 1,
        size: PAGE_SIZE,
        total: 0
      };

      $scope.searchForm = {
        'beginTime': null,
        'endTime': null,
        'customer': null,
        'entityType': null
      };

      getDataList();
      // entityTypeList();
      customerList();

      function getSearchFormParams(params) {
        if ($scope.searchForm.beginTime) {
          params.beginTime = $scope.searchForm.beginTime.toISOString();
        }
        if ($scope.searchForm.endTime) {
          params.endTime = $scope.searchForm.endTime.toISOString();
        }
        if ($scope.searchForm.entityType && $scope.searchForm.entityType.id !== -1) {
          params.entityType = $scope.searchForm.entityType.id;
        }
        if ($scope.searchForm.customer && $scope.searchForm.customer.id !== -1) {
          params.customer = $scope.searchForm.customer.id;
        }
      }

      // get todolist
      function getDataList(params) {
        params = utility.checkParams($scope, params);
        getSearchFormParams(params);

        api.sales.getList(params)
                .success(function (data, status) {
                  if (status === 200) {
                    $scope.dataList = data.list;
                    $scope.page.total = data.totalPages;
                  }
                });
      }

      // watch page.index
      utility.watchPageIndex($scope, function (newIndex) {
        getDataList({
          'pageIndex': newIndex,
          'pageSize': $scope.page.size
        });
      });

      // get sales list
      $scope.search = function (form) {
        if (form.$valid) {
          widget.hideMessage();
          getDataList();
        } else {
          utility.addErrorClass(form);
        }
      };

      //get customer list
      function customerList(){
        api.contact.getAllClient()
                .success(function (data) {
                  if(data){
                    data.unshift({
                      id: null,
                      name: '全部'
                    });
                  }
                  $scope.customerList = data;
                });
      }

      function entityTypeList(){
        api.sales.getStatusEnum()
                .success(function (data) {
                  if(data){
                    data.unshift({
                      id: null,
                      name: '全部'
                    });
                  }
                  $scope.entityTypeList = data;
                });
      }

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



      $scope.entityTypeList = [
        {
            'id': 1,
            'name': '第一种'
        },
        {
            'id': 2,
            'name': '第二种'
        }
      ];


      //go to sales page
      $scope.newSales = function (){
        $state.go('business/sales');
      };

      // add new customer
      $scope.newCustomer = function () {
        modalBox.openNewContact()
                .result.then(function () {
                  widget.showSuccess('新增客户成功！');
                  customerList();
                });
      };

      // delete action
      $scope.delete = function () {
        var ids = utility.getSelectedIds($scope.dataList);
        if (ids && ids.length > 0){
          api.sales.delete(ids)
            .success(function (data, status) {
              if (status === 200) {
                if(data && data.failedIds && data.failedIds.length > 0){
                  widget.showError('删除失败'+data.failedIds.length+'项'+"    "+'删除成功'+data.successIds.length+'项');
                  getDataList();
                }else{
                  widget.showSuccess('销售单删除成功！');
                  getDataList();
                }
              }
            });
        } else {
          widget.showError('请选择操作对象');
        }
      };

      // trigger sales selected status
      $scope.triggerItem = function (item) {
        utility.triggerSelect(item, $scope.dataList);
      };

    }]);
