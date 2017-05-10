'use strict';

angular.module('concordyaApp')
        .controller('BillCtrl', ['$scope', '$translate', '$translatePartialLoader', '$state', '$stateParams', 'APIService', 'ModalBoxService', 'UtilityService', 'WidgetService', 'EnumParseService',
          function ($scope, $translate, $translatePartialLoader, $state, $stateParams, api, modalBox, utility, widget, enumParse) {
            $translatePartialLoader.addPart('business_manage/bill_invoice');

            var originalBill = null,
                    maxId = null;

            $scope.payShow = false;

            // init data
            function init() {
              // bill model
              $scope.bill = {
                'id': null,
                'billNumber': null,
                'contactId': null,
                'billDate': null,
                'purposeType': null,
                'status': 0,
                'statusText': $translate.instant('BILL_ENUM.STATUS.DRAFT'),
                'agingStatus': 0,
                'attachment': [],
                'inventoryAmount': null,
                'tax': [],
                'taxAmount': null,
                'vatNormalInvoiceAmount': null,
                'vatSpecialInvoiceAmount': null,
                'total': null,
                'invoiceAmount': null,
                'personalAmount': null,
                'pettycashAmount': null,
                'advancePaymentAmount': null,
                'unpaidAmount': null,
                'isImmediately': false,
                'immediatelyAmount': null,
                'billItems': [{
                    'id': null,
                    'inventoryItemId': null,
                    'description': null,
                    'quantity': null,
                    'pricePerUnit': null,
                    'taxRateId': null,
                    'taxAmount': null,
                    'itemAmount': null,
                    'action': 0
                  }]
              };
            }
            // get max-id
            function getMaxId() {
              api.bill.getMaxId()
                      .success(function (data) {
                        $scope.bill.billNumber = maxId = data.maxId;
                        $scope.$safeApply();
                      });
            }

            if ($stateParams && $stateParams.id) {
              api.bill.get($stateParams.id)
                      .success(function (data) {
                        data.purposeType = {
                          'id': data.purposeType,
                          'name': enumParse.bill.getPurpose(data.purposeType)
                        };
                        data.statusText = enumParse.bill.getStatus(data.status);
                        originalBill = _.cloneDeep(data);
                        $scope.bill = data;
                        $scope.$safeApply();
                      });
            } else {
              init();
              getMaxId();
            }

            api.bill.getPurposeTypeEnum()
                    .success(function (data) {
                      $scope.purposeTypeList = data;
                      $scope.$safeApply();
                    });

            // refresh contact list
            function refreshContactList() {
              return api.contact.getAllSupplier()
                      .success(function (data) {
                        $scope.contactList = data;
                        $scope.$safeApply();
                      });
            }
            refreshContactList();

            // add new contact
            $scope.newContact = function () {
              modalBox.openNewContact()
                      .result.then(function () {
                        widget.showSuccess($translate.instant('BILL_INVOICE.MESSAGE_NEW_CONTACT_SUCCESS'));
                        refreshContactList();
                      });
            };

            // refresh inventory list
            function refreshInventoryList() {
              return api.inventoryItem.getAllList(0)
                      .success(function (data) {
                        $scope.inventoryList = data;
                        $scope.$safeApply();
                      });
            }
            refreshInventoryList();

            // add new inventory
            $scope.newInventory = function () {
              modalBox.openNewInventory()
                      .result.then(function () {
                        widget.showSuccess($translate.instant('BILL_INVOICE.MESSAGE_NEW_INVENTORY_SUCCESS'));
                        refreshInventoryList();
                      });
            };

            // refresh tax rate list
            function refreshTaxRateList() {
              return api.taxRate.getAllList()
                      .success(function (data) {
                        $scope.taxRateList = data;
                        $scope.$safeApply();
                      });
            }
            refreshTaxRateList();

            // add new setting tax
            $scope.newTaxRate = function () {
              modalBox.openNewTaxRate()
                      .result.then(function () {
                        widget.showSuccess($translate.instant('BILL_INVOICE.MESSAGE_NEW_TAXRATE_SUCCESS'));
                        refreshTaxRateList();
                      });
            };

            // action： 0-new，1-edit，2-delete
            // add new item of bill model
            $scope.newItem = function () {
              $scope.bill.billItems.push({
                'id': null,
                'inventoryItemId': null,
                'description': null,
                'quantity': null,
                'pricePerUnit': null,
                'taxRateId': null,
                'taxAmount': null,
                'itemAmount': null,
                'itemInvoiceAmount': null,
                'itemInvoiceTaxAmount': null,
                'action': 0
              });
            };

            // remove item in bill model
            $scope.removeItem = function (item) {
              var billItems = $scope.bill.billItems;
              if (item.id) {
                item.action = 2;
              } else {
                _.remove(billItems, function (obj) {
                  return item === obj;
                });
              }
              var filterList = _.filter(billItems, function (item) {
                return item.action !== 2;
              });
              if (filterList.length === 0) {
                $scope.newItem();
              }
            };

            // attachment for bill
            $scope.attachment = function () {
              modalBox.openAttachmentList({
                sourceList: $scope.bill.attachment,
                sourceId: $scope.bill.id,
                sourceType: 1,
                enable: $scope.bill.status === 0 || $scope.bill.status === 4
              }).result.then(function (attachmentList) {
                $scope.bill.attachment = attachmentList;
                $scope.$safeApply();
              });
            };

            // view voucher
            $scope.viewVoucher = function () {
              $state.go('finance/voucher', {id: $scope.bill.currentAccountVoucher.id});
            };

            // save bill
            function saveBill(form, status, fn) {
              if (form.billDate.$viewValue) {
                form.billDate.$setValidity('date', true);
              }

              if (form.$valid) {
                var bill = $scope.bill;
                var items = [];

                _.forEach(bill.billItems, function (item) {
                  if (item.action !== undefined) {
                    items.push({
                      'id': item.id,
                      'inventoryItemId': item.inventoryItem && item.inventoryItem.id,
                      'description': item.description,
                      'quantity': item.quantity,
                      'pricePerUnit': item.pricePerUnit,
                      'taxRateId': item.taxRate.id,
                      'taxAmount': item.taxAmount,
                      'otherTaxRateValue': (item.taxRate && item.taxRate.taxRateType === 3) ? item.taxRate.rate : null,
                      'itemAmount': item.itemAmount,
                      'itemInvoiceAmount': item.itemInvoiceAmount,
                      'itemInvoiceTaxAmount': item.itemInvoiceTaxAmount,
                      'action': item.action
                    });
                  }
                });

                var attachmentIds = [];
                _.forEach(bill.attachment, function (item) {
                  attachmentIds.push(item.id);
                });

                var params = {
                  'id': bill.id,
                  'billNumber': bill.billNumber,
                  'contactId': bill.contact && bill.contact.id,
                  'billDate': bill.billDate ? moment(bill.billDate).valueOf() : null,
                  'status': status,
                  'purposeType': bill.purposeType && bill.purposeType.id,
                  'agingStatus': 0,
                  'attachmentId': attachmentIds,
                  'inventoryAmount': bill.inventoryAmount,
                  'tax': bill.tax,
                  'taxAmount': bill.taxAmount,
                  'vatNormalInvoiceAmount': bill.vatNormalInvoiceAmount,
                  'vatSpecialInvoiceAmount': bill.vatSpecialInvoiceAmount,
                  'total': bill.total,
                  'invoiceAmount': bill.invoiceAmount,
                  'personalAmount': bill.personalAmount,
                  'pettycashAmount': bill.pettycashAmount,
                  'advancePaymentAmount': bill.advancePaymentAmount,
                  'unpaidAmount': parseFloat(bill.unpaidAmount) || 0,
                  'isImmediately': bill.isImmediately,
                  'immediatelyAmount': bill.immediatelyAmount,
                  'billItems': items
                };

                if ($stateParams && $stateParams.id || bill.id) {
                  // update an bill
                  api.bill.update(bill.id, params)
                          .success(function (data) {
                            widget.showSuccess($translate.instant('BILL_INVOICE.MESSAGE_UPDATE_BILL_SUCCESS'), function(){
                              $state.go('business/bills');
                            });
                            fn && fn(data);
                            $scope.$safeApply();
                          });
                } else {
                  // create new bill
                  api.bill.create(params)
                          .success(function (data) {
                            widget.showSuccess($translate.instant('BILL_INVOICE.MESSAGE_UPDATE_BILL_SUCCESS'), function(){
                              $state.go('business/bills');
                            });
                            bill.id = data.id;
                            var items = [];
                            _.forEach(data.billItems, function (item) {
                              item.action = 3;
                              items.push(item);
                            });
                            bill.billItems = items;
                            fn && fn(data);
                            $scope.$safeApply();
                          });
                }
              } else {
                utility.addErrorClass(form);
              }
            }

            // just save
            $scope.save = function (form) {
              saveBill(form, 0);
            };
            // save and new
            $scope.saveAndNew = function (form) {
              saveBill(form, 0, function () {
                init();
                getMaxId();
              });
            };
            // save and submit
            $scope.saveAndSubmit = function (form) {
              saveBill(form, 1);
            };

            // reset action
            // clear all form and table
            $scope.reset = function () {
              if ($stateParams && $stateParams.id) {
                $scope.bill = originalBill;
              } else {
                init();
                $scope.bill.billNumber = maxId;
              }
            };

            // get cancel-watch function
            var cancelWatchBill = $scope.$watch('bill', function (newVal, oldVal) {
              if (newVal) {
                var taxMap = {};
                var bill = $scope.bill;
                bill.billDate = bill.billDate ? moment(bill.billDate).valueOf() : null;

                bill.inventoryAmount = 0;
                bill.taxAmount = 0;
                bill.vatNormalAmount = 0;
                bill.vatSpecialAmount = 0;
                bill.vatNormalInvoiceAmount = 0;
                bill.vatSpecialInvoiceAmount = 0;
                bill.total = 0;
                bill.invoiceAmount = 0;
                bill.tax = [];

                if (!bill.isImmediately) {
                  bill.immediatelyAmount = null;
                }

                // get inventory amount, and calculate every inventory tax
                _.forEach(newVal.billItems, function (item) {
                  if (item.action !== 2) {
                    if (item.pricePerUnit && item.quantity && item.taxRate) {
                      item.itemAmount = item.pricePerUnit * item.quantity;
                      item.taxAmount = utility.toDecimal(item.itemAmount * item.taxRate.rate);
                      item.itemInvoiceTaxAmount = utility.toDecimal(item.itemInvoiceAmount * item.taxRate.rate);

                      if (item.itemInvoiceAmount > item.itemAmount) {
                        item.itemInvoiceAmount = item.itemAmount;
                      }
                      if (item.itemInvoiceTaxAmount > item.taxAmount) {
                        item.itemInvoiceTaxAmount = item.taxAmount;
                      }

                      bill.inventoryAmount = utility.floatNumAdd(bill.inventoryAmount, item.itemAmount);
                      bill.invoiceAmount = utility.floatNumAdd(item.itemInvoiceAmount, item.itemInvoiceTaxAmount, bill.invoiceAmount);

                      if (taxMap[item.taxRate.id]) {
                        taxMap[item.taxRate.id].taxAmount = utility.floatNumAdd(taxMap[item.taxRate.id].taxAmount, item.taxAmount);
                        taxMap[item.taxRate.id].invoiceTaxAmount = utility.floatNumAdd(taxMap[item.taxRate.id].invoiceTaxAmount, item.itemInvoiceTaxAmount);
                      } else {
                        taxMap[item.taxRate.id] = {
                          'name': item.taxRate.name,
                          'rate': item.taxRate.rate,
                          'taxRateType': item.taxRate.taxRateType,
                          'taxAmount': parseFloat(item.taxAmount) || 0,
                          'invoiceTaxAmount': parseFloat(item.itemInvoiceTaxAmount) || 0
                        };
                      }
                    }

                    _.forEach(oldVal && oldVal.billItems, function (oldItem) {
                      if (item.id && item.id === oldItem.id) {
                        if (item !== oldItem) {
                          item.action = 1;
                        }
                      }
                    });
                  }
                });

                // get every tax type's tax and taxAmount
                _.forEach(taxMap, function (val, key) {
                  bill.tax.push({
                    'taxRateId': key,
                    'name': val.name,
                    'rate': val.rate,
                    'taxAmount': val.taxAmount,
                    'invoiceTaxAmount': val.invoiceTaxAmount
                  });
                  bill.taxAmount = utility.floatNumAdd(bill.taxAmount, val.taxAmount);

                  if (val.taxRateType === 1) {
                    bill.vatSpecialAmount = utility.floatNumAdd(bill.vatSpecialAmount, val.taxAmount);
                    bill.vatSpecialInvoiceAmount = utility.floatNumAdd(bill.vatSpecialInvoiceAmount, val.invoiceTaxAmount);
                  } else if (val.taxRateType === 2) {
                    bill.vatNormalAmount = utility.floatNumAdd(bill.vatNormalAmount, val.taxAmount);
                    bill.vatNormalInvoiceAmount = utility.floatNumAdd(bill.vatNormalInvoiceAmount, val.invoiceTaxAmount);
                  }
                });

                // get total
                bill.total = utility.floatNumAdd(bill.inventoryAmount, bill.taxAmount);
                bill.unpaidAmount = utility.floatNumSubtract(bill.total, bill.personalAmount, bill.pettycashAmount, bill.advancePaymentAmount);

                if (bill.unpaidAmount < 0
                        || bill.invoiceAmount > bill.total || bill.invoiceAmount < 0
                        || bill.immediatelyAmount > bill.unpaidAmount || bill.immediatelyAmount < 0) {
                  $scope.bill = oldVal;
                }
              }
            }, true);
            // remove watch on state-change for performance reason
            $scope.$on('$stateChangeStart', function () {
              cancelWatchBill();
            });

            // trigger date-picker
            $scope.triggerPicker = function ($event, type) {
              $event.preventDefault();
              $event.stopPropagation();
              switch (type) {
                case 'bill-date':
                  $scope.billDateIsOpen = !$scope.billDateIsOpen;
                  break;
              }
            };
          }]);
