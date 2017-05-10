'use strict';

angular.module('concordyaApp')
        .controller('InvoiceCtrl', ['$scope', '$translate', '$translatePartialLoader', '$state', '$stateParams', 'APIService', 'ModalBoxService', 'UtilityService', 'WidgetService', 'EnumParseService',
          function ($scope, $translate, $translatePartialLoader, $state, $stateParams, api, modalBox, utility, widget, enumParse) {
            $translatePartialLoader.addPart('business_manage/bill_invoice');

            var originalInvoice = null,
                    maxId = null;

            // init data
            function init() {
              // invoice model
              $scope.invoice = {
                'id': null,
                'invoiceNumber': null,
                'contactId': null,
                'invoiceDate': null,
                'status': 0,
                'statusText': $translate.instant('INVOICE_ENUM.STATUS.DRAFT'),
                'agingStatus': 0,
                'reference': null,
                'attachment': [],
                'inventoryAmount': null,
                'tax': [],
                'taxAmount': null,
                'vatNormalInvoiceAmount': null,
                'vatSpecialInvoiceAmount': null,
                'total': null,
                'invoiceAmount': null,
                'cashAmount': null,
                'transferAmount': null,
                'checkAmount': null,
                'advancePaymentAmount': null,
                'unpaidAmount': null,
                'invoiceItems': [{
                    'id': null,
                    'inventoryItemId': null,
                    'description': null,
                    'quantity': null,
                    'pricePerUnit': null,
                    'taxRateId': null,
                    'taxAmount': null,
                    'discount': 1,
                    'itemAmount': null,
                    'action': 0
                  }]
              };
            }
            // get max-id
            function getMaxId() {
              api.invoice.getMaxId()
                      .success(function (data) {
                        $scope.invoice.invoiceNumber = maxId = data.maxId;
                        $scope.$safeApply();
                      });
            }

            if ($stateParams && $stateParams.id) {
              api.invoice.get($stateParams.id)
                      .success(function (data) {
                        var invoiceItems = [];
                        _.forEach(data.invoiceItems, function (item) {
                          item.taxRate.rate = item.otherTaxRateValue || item.taxRate.rate;
                          invoiceItems.push(item);
                        });
                        data.statusText = enumParse.invoice.getStatus(data.status);
                        data.invoiceItems = invoiceItems;
                        originalInvoice = _.cloneDeep(data);
                        $scope.invoice = data;
                        $scope.$safeApply();
                      });
            } else {
              init();
              getMaxId();
            }

            // refresh contact list
            function refreshContactList() {
              return api.contact.getAllClient()
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
              return api.inventoryItem.getAllList(1)
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
            $scope.changeInventory = function (item) {
              item.taxRate = item.inventoryItem && item.inventoryItem.taxRate;
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
            // add new item of invoice model
            $scope.newItem = function () {
              $scope.invoice.invoiceItems.push({
                'id': null,
                'inventoryItemId': null,
                'description': null,
                'quantity': null,
                'pricePerUnit': null,
                'taxRateId': null,
                'taxAmount': null,
                'discount': 1,
                'itemAmount': null,
                'itemInvoiceAmount': null,
                'itemInvoiceTaxAmount': null,
                'action': 0
              });
            };

            // remove item in invoice model
            $scope.removeItem = function (item) {
              var invoiceItems = $scope.invoice.invoiceItems;
              if (item.id) {
                item.action = 2;
              } else {
                _.remove(invoiceItems, function (obj) {
                  return item === obj;
                });
              }
              var filterList = _.filter(invoiceItems, function (item) {
                return item.action !== 2;
              });
              if (filterList.length === 0) {
                $scope.newItem();
              }
            };

            // attachment for invoice
            $scope.attachment = function () {
              modalBox.openAttachmentList({
                sourceList: $scope.invoice.attachment,
                sourceId: $scope.invoice.id,
                sourceType: 2,
                enable: $scope.invoice.status === 0 || $scope.invoice.status === 4
              }).result.then(function (attachmentList) {
                $scope.invoice.attachment = attachmentList;
                $scope.$safeApply();
              });
            };

            // view voucher
            $scope.viewVoucher = function () {
              $state.go('finance/voucher', {id: $scope.invoice.currentAccountVoucher.id});
            };

            // save invoice
            function saveInvoice(form, status, fn) {
              if (form.invoiceDate.$viewValue) {
                form.invoiceDate.$setValidity('date', true);
              }

              if (form.$valid) {
                var invoice = $scope.invoice;
                var items = [];

                _.forEach(invoice.invoiceItems, function (item) {
                  if (item.action !== undefined) {
                    items.push({
                      'id': item.id,
                      'inventoryItemId': item.inventoryItem && item.inventoryItem.id,
                      'description': item.description,
                      'quantity': item.quantity,
                      'pricePerUnit': item.pricePerUnit,
                      'taxRateId': item.taxRate && item.taxRate.id,
                      'taxAmount': item.taxAmount,
                      'otherTaxRateValue': (item.taxRate && item.taxRate.taxRateType === 3) ? item.taxRate.rate : null,
                      'discount': item.discount,
                      'itemAmount': item.itemAmount,
                      'itemInvoiceAmount': item.itemInvoiceAmount,
                      'itemInvoiceTaxAmount': item.itemInvoiceTaxAmount,
                      'action': item.action
                    });
                  }
                });

                var attachmentIds = [];
                _.forEach(invoice.attachment, function (item) {
                  attachmentIds.push(item.id);
                });

                var params = {
                  'id': invoice.id,
                  'invoiceNumber': invoice.invoiceNumber,
                  'contactId': invoice.contact && invoice.contact.id,
                  'invoiceDate': invoice.invoiceDate ? moment(invoice.invoiceDate).valueOf() : null,
                  'status': status,
                  'agingStatus': 0,
                  'reference': invoice.reference,
                  'attachmentId': attachmentIds,
                  'inventoryAmount': invoice.inventoryAmount,
                  'tax': invoice.tax,
                  'taxAmount': invoice.taxAmount,
                  'vatNormalInvoiceAmount': invoice.vatNormalInvoiceAmount,
                  'vatSpecialInvoiceAmount': invoice.vatSpecialInvoiceAmount,
                  'total': invoice.total,
                  'invoiceAmount': invoice.invoiceAmount,
                  'cashAmount': invoice.cashAmount,
                  'transferAmount': invoice.transferAmount,
                  'checkAmount': invoice.checkAmount,
                  'advancePaymentAmount': invoice.advancePaymentAmount,
                  'unpaidAmount': parseFloat(invoice.unpaidAmount || 0),
                  'invoiceItems': items
                };

                if ($stateParams && $stateParams.id || invoice.id) {
                  // update an invoice
                  return api.invoice.update(invoice.id, params)
                          .success(function (data) {
                            widget.showSuccess($translate.instant('BILL_INVOICE.MESSAGE_UPDATE_INVOICE_SUCCESS'));
                            fn && fn(data);
                            $scope.$safeApply();
                          });
                } else {
                  // create new invoice
                  return api.invoice.create(params)
                          .success(function (data) {
                            widget.showSuccess($translate.instant('BILL_INVOICE.MESSAGE_NEW_INVOICE_SUCCESS'));
                            invoice.id = data.id;
                            var items = [];
                            _.forEach(data.invoiceItems, function (item) {
                              item.action = 3;
                              items.push(item);
                            });
                            invoice.invoiceItems = items;
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
              saveInvoice(form, 0);
            };
            // save and new
            $scope.saveAndNew = function (form) {
              saveInvoice(form, 0, function () {
                init();
                getMaxId();
              });
            };
            // save and submit
            $scope.saveAndSubmit = function (form) {
              saveInvoice(form, 1, function () {
                $state.go('business/invoices');
              });
            };

            // reset action
            // clear all form and table
            $scope.reset = function () {
              if ($stateParams && $stateParams.id) {
                $scope.invoice = originalInvoice;
              } else {
                init();
                $scope.invoice.invoiceNumber = maxId;
              }
            };

            // get cancel-watch function
            var cancelWatchInvoice = $scope.$watch('invoice', function (newVal, oldVal) {
              if (newVal) {
                var taxMap = {};
                var invoice = $scope.invoice;
                invoice.invoiceDate = invoice.invoiceDate ? moment(invoice.invoiceDate).valueOf() : null;

                invoice.inventoryAmount = 0;
                invoice.taxAmount = 0;
                invoice.vatNormalAmount = 0;
                invoice.vatSpecialAmount = 0;
                invoice.vatNormalInvoiceAmount = 0;
                invoice.vatSpecialInvoiceAmount = 0;
                invoice.total = 0;
                invoice.invoiceAmount = 0;
                invoice.tax = [];

                // get inventory amount, and calculate every inventory tax
                _.forEach(newVal.invoiceItems, function (item) {
                  if (item.action !== 2) {
                    if (item.pricePerUnit && item.quantity && item.taxRate) {
                      if (item.discount) {
                        item.itemAmount = item.pricePerUnit * item.quantity * item.discount;
                      } else {
                        item.itemAmount = item.pricePerUnit * item.quantity;
                      }

                      item.taxAmount = utility.toDecimal(item.pricePerUnit * item.quantity * item.taxRate.rate);
                      item.itemInvoiceTaxAmount = utility.toDecimal(item.itemInvoiceAmount * item.taxRate.rate);

                      if (item.itemInvoiceAmount > item.itemAmount) {
                        item.itemInvoiceAmount = item.itemAmount;
                      }
                      if (item.itemInvoiceTaxAmount > item.taxAmount) {
                        item.itemInvoiceTaxAmount = item.taxAmount;
                      }
                      invoice.inventoryAmount = utility.floatNumAdd(invoice.inventoryAmount, item.itemAmount);
                      invoice.invoiceAmount = utility.floatNumAdd(item.itemInvoiceAmount, item.itemInvoiceTaxAmount, invoice.invoiceAmount);

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

                    _.forEach(oldVal && oldVal.invoiceItems, function (oldItem) {
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
                  invoice.tax.push({
                    'taxRateId': key,
                    'name': val.name,
                    'rate': val.rate,
                    'taxAmount': val.taxAmount,
                    'invoiceTaxAmount': val.invoiceTaxAmount
                  });
                  invoice.taxAmount = utility.floatNumAdd(invoice.taxAmount, val.taxAmount);

                  if (val.taxRateType === 1) {
                    invoice.vatSpecialAmount = utility.floatNumAdd(invoice.vatSpecialAmount, val.taxAmount);
                    invoice.vatSpecialInvoiceAmount = utility.floatNumAdd(invoice.vatSpecialInvoiceAmount, val.invoiceTaxAmount);
                  } else if (val.taxRateType === 2) {
                    invoice.vatNormalAmount = utility.floatNumAdd(invoice.vatNormalAmount, val.taxAmount);
                    invoice.vatNormalInvoiceAmount = utility.floatNumAdd(invoice.vatNormalInvoiceAmount, val.invoiceTaxAmount);
                  }
                });

                // get total
                invoice.total = utility.floatNumAdd(invoice.inventoryAmount, invoice.taxAmount);
                invoice.unpaidAmount = utility.floatNumSubtract(invoice.total, invoice.cashAmount, invoice.transferAmount, invoice.checkAmount, invoice.advancePaymentAmount);

                if (invoice.unpaidAmount < 0
                        || invoice.invoiceAmount > invoice.total || invoice.invoiceAmount < 0) {
                  $scope.invoice = oldVal;
                }
              }
            }, true);
            // remove watch on state-change for performance reason
            $scope.$on('$stateChangeStart', function () {
              cancelWatchInvoice();
            });

            // trigger date-picker
            $scope.triggerPicker = function ($event, type) {
              $event.preventDefault();
              $event.stopPropagation();
              switch (type) {
                case 'invoice-date':
                  $scope.invoiceDateIsOpen = !$scope.invoiceDateIsOpen;
                  break;
              }
            };
          }]);
