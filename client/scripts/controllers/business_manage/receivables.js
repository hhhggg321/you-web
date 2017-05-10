'use strict';
angular.module('concordyaApp')
  .controller('ReceivablesCtrl', ['$scope', '$state', '$stateParams', 'APIService', 'UtilityService', 'WidgetService', 'ModalBoxService', 'CONSTANT.PAGE_SIZE',
    function ($scope, $state, $stateParams, api, utility, widget, modalBox, PAGE_SIZE) {

      // page object
      $scope.page = {
        index: 1,
        size: PAGE_SIZE,
        total: 0
      };


      // get todolist
      function getDataList(params) {
        params = utility.checkParams($scope, params);
        if($scope.receivables.customer){
          params.customer = $scope.receivables.customer.id;
          api.receivables.getList(params)
                  .success(function (data, status) {
                    if (status === 200) {
                      $scope.dataList = data.receivableItems;
                      $scope.page.total = data.totalPages;
                    }
                  });
        }else{
          $scope.dataList = [{
            'id':1,
            'description':1
          }];
        }
      }
      $scope.getDataList = getDataList;
      // watch page.index
      utility.watchPageIndex($scope, function (newIndex) {
        getDataList({
          'pageIndex': newIndex,
          'pageSize': $scope.page.size
        });
      });


      $scope.issueTypeList = [
        {
            'id': 1,
            'name': '开发票'
        },
        {
            'id': 2,
            'name': '开收据'
        }
      ];


      customerList();


      if ($stateParams && $stateParams.id) {
        api.receivables.get($stateParams.id)
          .success(function (data) {
            $scope.receivables = data;
            var itemList = [],
              order = 1;
            _.forEach(data.receivablesOrderDetails, function (item) {
              item.order = order++;
              itemList.push(item);
            });
            while (order < 3) {
              itemList.push({
                'order': order++,
                "id": null,
                "item": null,
                "description": null,
                "tax": null,
                "itemAmount": 0
              });
            }

            if(data.issueType){
              data.issueType = $scope.issueTypeList[data.issueType -1];
            }
            $scope.receivables.receivablesOrderDetails = itemList;
          });
      } else {
        init();
        // getDataList();
      }

      function init(){
        $scope.isInvoice = true;
        $scope.receivables = {
          "id": null,
          "receivablesOrderNumber": null,
          "customer": null,
          "expectedPaymentDate": null,
          "issueType": {
              'id': 1,
              'name': '开发票'
          },
          "invoiceDate": null,
          "receivablesOrderDetails": [
            {
              "order": 1,
              "id": null,
              "item": null,
              "description": null,
              "tax": null,
              "itemAmount": 0
            },
            {
              "order": 2,
              "id": null,
              "item": null,
              "description": null,
              "tax": null,
              "itemAmount": 0
            }
          ],
          "subTotalAmount": 0,
          "vatAmount": 0,
          "freeVatAmount": 0,
          "discountAmount": 0,
          "totalAmount": 0
        };
        $scope.dataList = [
          {
            'id': 1
          },
          {
            'id': 2
          }
        ];

      }

      //get customer list
      function customerList(){
        api.contact.getAllClient()
                .success(function (data) {
                  $scope.customerList = data;
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


      // add new customer
      $scope.newCustomer = function () {
        modalBox.openNewContact()
                .result.then(function () {
                  widget.showSuccess('新增客户成功！');
                  customerList();
                });
      };

      // attachment
      $scope.attachment = function () {
          modalBox.openAttachmentList({
            sourceList: null,
            sourceId: null,
            sourceType: null,
            enable: true,
            updateAttachmentCount: function(attachmentListLength) {
              // $scope.voucher.attachmentCount = parseInt(voucher.attachmentCount) + attachmentListLength;
            }
          }).result.then(function (attachmentList) {

            });
      };


      // new item
      $scope.newItem = function () {
        var list = $scope.receivables.receivablesOrderDetails;
        var length = list.length;
        var orderTmp = list[length-1].order + 1;
          list.push({
            "id": null,
            "item": null,
            "description": null,
            "tax": null,
            "itemAmount": 0,
            "order": orderTmp
          });
      };

      // delete item
      $scope.deleteItem = function (data) {
        var list = $scope.receivables.receivablesOrderDetails;
        _.remove(list, function (item) {
          return item.order === data.order;
        });
        if (list.length < 2) {
          $scope.newItem();
        }
      };

      $scope.$watch('receivables', function (newVal) {
        var receivables = $scope.receivables;
        var list = $scope.receivables.receivablesOrderDetails || [];
        var subTotalAmount = 0.00;
        var vatAmount = 0.00;
        var freeVatAmount = 0.00;
        var totalAmount = 0.00;
        if (newVal) {
          //add new service to the service list
          var i = _.findIndex(list, function(item) {
            return item.item && item.item.id === 0;
          });
          if(i > -1){
            list[i].item = null;
            modalBox.openNewServiceCategory()
            .result.then(function(){
              widget.showSuccess('添加成功');
              //reload the service list
              serviceList();
            });
          }
          //automatically change the subTotalAmount,vatAmount,freeVatAmount,totalAmount
          _.forEach(list, function(item){
            if(item.item || item.description || item.tax || item.itemAmount){
              item.isNotEmpty = true;
            }else{
              item.isNotEmpty = false;
            }
            subTotalAmount = utility.floatNumAdd(subTotalAmount, item.itemAmount);
            if(item.tax && item.tax.id){
              if(item.tax.id == 0){
                vatAmount = utility.floatNumAdd(vatAmount, item.itemAmount * 0.03);
              }else{
                freeVatAmount = utility.floatNumAdd(freeVatAmount, item.itemAmount * 0.03);
              }
            }
          });
          //if discountAmount is bigger than the subTotalAmount
          totalAmount = utility.floatNumSubtract(subTotalAmount / 1.03, receivables.discountAmount);
          receivables.subTotalAmount = subTotalAmount;
          receivables.vatAmount = vatAmount;
          receivables.freeVatAmount = freeVatAmount;
          receivables.totalAmount = totalAmount;
        }
      }, true);

      // // remove watch on state-change for performance reason
      // $scope.$on('$stateChangeStart', function () {
      //   cancelWatchreceivables();
      // });
      // just save
      $scope.save = function (form) {
        savereceivables(form, function () {
          $state.go('business/receivables_list');
        });
      };
      // save and new
      $scope.saveAndNew = function (form) {
        savereceivables(form, function () {
          init();
        });
      };

      // save receivables
      function savereceivables(form,fn) {
        if (form.$valid) {
          var receivables = $scope.receivables;
          var list = _.cloneDeep(receivables.receivablesOrderDetails);
          var itemList = [];
          _.forEach(list, function(item) {
            if(item.isNotEmpty){
              item.tax = item.tax.id;
              itemList.push(item);
            }
          });

          var params = {
            "customer": receivables.customer,
            "expectedPaymentDate": receivables.expectedPaymentDate && receivables.expectedPaymentDate.toISOString(),
            "issueType": receivables.issueType && receivables.issueType.id,
            "invoiceDate": receivables.invoiceDate && receivables.invoiceDate.toISOString(),
            "receivablesOrderDetails": itemList,
            "subTotalAmount": receivables.subTotalAmount,
            "vatAmount": receivables.vatAmount,
            "freeVatAmount": receivables.freeVatAmount,
            "discountAmount": receivables.discountAmount,
            "totalAmount": receivables.totalAmount
          };
          if ($stateParams && $stateParams.id || receivables.id) {
            params.id = receivables.id;
            // update an receivables
            api.receivables.update(receivables.id, params)
              .success(function (data) {
                widget.showSuccess("修改销售单成功！");
                fn && fn();
              });
          } else {
            // create new receivables
            api.receivables.create(params)
              .success(function (data) {
                widget.showSuccess("新增销售单成功！");
                fn && fn();
              });
          }
        } else {
          utility.addErrorClass(form);
        }
      }

      $scope.issueTypeChanges = function () {
        if($scope.receivables.issueType.id === 1){
          $scope.isInvoice = true;
        }else{
          $scope.isInvoice = false;
        }
      };


    }]);
