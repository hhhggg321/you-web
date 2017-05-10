'use strict';
angular.module('concordyaApp')
  .controller('SalesCtrl', ['$scope', '$state', '$stateParams', 'APIService', 'UtilityService', 'WidgetService', 'ModalBoxService', 'CONSTANT.PAGE_SIZE',
    function ($scope, $state, $stateParams, api, utility, widget, modalBox, PAGE_SIZE) {

      $scope.taxList = [
        {
            'id': '0',
            'name': '0%'
        },
        {
            'id': '1',
            'name': '3%'
        }
      ];
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
      serviceList();


      if ($stateParams && $stateParams.id) {
        api.sales.get($stateParams.id)
          .success(function (data) {
            $scope.sales = data;
            var itemList = [],
              order = 1;
            _.forEach(data.salesOrderDetails, function (item) {
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
              $scope.sales.issueType = $scope.issueTypeList[data.issueType -1];
            }
            $scope.sales.salesOrderDetails = itemList;
          });
      } else {
        init();
      }

      function init(){
        $scope.isInvoice = true;
        $scope.sales = {
          "id": null,
          "salesOrderNumber": null,
          "customer": null,
          "expectedPaymentDate": null,
          "issueType": {
              'id': 1,
              'name': '开发票'
          },
          "invoiceDate": null,
          "salesOrderDetails": [
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
      }

      //get service list
      function serviceList(){
        api.serviceCategory.getList()
                .success(function (data) {
                  if(data){
                    var list = data.inventoryServiceCategories;
                    list.unshift({
                      'id': 0,
                      'name': '新增类型与帐目',
                      'description': '可依据客户自定义新增'
                    });
                  }
                  $scope.serviceList = list;
                });
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

      //go to receivables page
      $scope.receivables = function () {
        $state.go('business/receivables');
      };

      // new item
      $scope.newItem = function () {
        var list = $scope.sales.salesOrderDetails;
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
        var list = $scope.sales.salesOrderDetails;
        _.remove(list, function (item) {
          return item.order === data.order;
        });
        if (list.length < 2) {
          $scope.newItem();
        }
      };

      $scope.$watch('sales', function (newVal) {
        var sales = $scope.sales;
        var list = $scope.sales.salesOrderDetails || [];
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
          totalAmount = utility.floatNumSubtract(subTotalAmount / 1.03, sales.discountAmount);
          sales.subTotalAmount = subTotalAmount;
          sales.vatAmount = vatAmount;
          sales.freeVatAmount = freeVatAmount;
          sales.totalAmount = totalAmount;
        }
      }, true);

      // // remove watch on state-change for performance reason
      // $scope.$on('$stateChangeStart', function () {
      //   cancelWatchSales();
      // });
      // just save
      $scope.save = function (form) {
        saveSales(form, function () {
          $state.go('business/sales_list');
        });
      };
      // save and new
      $scope.saveAndNew = function (form) {
        saveSales(form, function () {
          init();
        });
      };

      // save sales
      function saveSales(form,fn) {
        if (form.$valid) {
          var sales = $scope.sales;
          var list = _.cloneDeep(sales.salesOrderDetails);
          var itemList = [];
          _.forEach(list, function(item) {
            if(item.isNotEmpty){
              item.tax = item.tax.id;
              itemList.push(item);
            }
          });

          var params = {
            "customer": sales.customer,
            "expectedPaymentDate": sales.expectedPaymentDate && sales.expectedPaymentDate.toISOString(),
            "issueType": sales.issueType && sales.issueType.id,
            "invoiceDate": sales.invoiceDate && sales.invoiceDate.toISOString(),
            "salesOrderDetails": itemList,
            "subTotalAmount": sales.subTotalAmount,
            "vatAmount": sales.vatAmount,
            "freeVatAmount": sales.freeVatAmount,
            "discountAmount": sales.discountAmount,
            "totalAmount": sales.totalAmount
          };
          if ($stateParams && $stateParams.id || sales.id) {
            params.id = sales.id;
            // update an sales
            api.sales.update(sales.id, params)
              .success(function (data) {
                widget.showSuccess("修改销售单成功！");
                fn && fn();
              });
          } else {
            // create new sales
            api.sales.create(params)
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
        if($scope.sales.issueType.id === 1){
          $scope.isInvoice = true;
        }else{
          $scope.isInvoice = false;
        }
      };

    }]);
