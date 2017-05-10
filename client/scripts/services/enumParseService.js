'use strict';

angular.module('concordyaApp')
        .factory('EnumParseService', ['$translate', function ($translate) {
            return {
              common: {
                parseBoolean: function (type) {
                  var ret = '';
                  switch (type) {
                    case true:
                      ret = $translate.instant('COMMON.YES');
                      break;
                    case false:
                      ret = $translate.instant('COMMON.NO');
                      break;
                  }
                  return ret;
                }
              },
              // bill
              bill: {
                /*
                 * 0:草稿,1:提交,2:分类完成,3:审批通过（待付款）,4:审批拒绝
                 */
                getStatus: function (type) {
                  var ret = '';
                  switch (type) {
                    case 0:
                      ret = $translate.instant('BILL_ENUM.STATUS.DRAFT');
                      break;
                    case 1:
                      ret = $translate.instant('BILL_ENUM.STATUS.COMMIT');
                      break;
                    case 2:
                      ret = $translate.instant('BILL_ENUM.STATUS.CLASSIFY_COMPLETED');
                      break;
                    case 3:
                      ret = $translate.instant('BILL_ENUM.STATUS.APPROVE_PASS');
                      break;
                    case 4:
                      ret = $translate.instant('BILL_ENUM.STATUS.APPROVE_REJECT');
                      break;
                  }
                  return ret;
                },
                /*
                 * 0-自用，1-再销售
                 */
                getPurpose: function (type) {
                  var ret = '';
                  switch (type) {
                    case 0:
                      ret = $translate.instant('BILL_ENUM.PURPOSE_TYPE.SELF_USE');
                      break;
                    case 1:
                      ret = $translate.instant('BILL_ENUM.PURPOSE_TYPE.RESELL');
                      break;
                  }
                  return ret;
                }
              },
              // invoice
              invoice: {
                /*
                 * 0:草稿, 1:提交, 2:分类完成, 3:审批通过（待付款）, 4:审批拒绝
                 */
                getStatus: function (type) {
                  var ret = '';
                  switch (type) {
                    case 0:
                      ret = $translate.instant('INVOICE_ENUM.STATUS.DRAFT');
                      break;
                    case 1:
                      ret = $translate.instant('INVOICE_ENUM.STATUS.COMMIT');
                      break;
                    case 2:
                      ret = $translate.instant('INVOICE_ENUM.STATUS.CLASSIFY_COMPLETED');
                      break;
                    case 3:
                      ret = $translate.instant('INVOICE_ENUM.STATUS.APPROVE_PASS');
                      break;
                    case 4:
                      ret = $translate.instant('INVOICE_ENUM.STATUS.APPROVE_REJECT');
                      break;
                  }
                  return ret;
                }
              },
              // petty cash
              pettyCash: {
                getStatus: function (type) {
                  var ret = '';
                  switch (type) {
                    case null:
                    case 0:
                      ret = $translate.instant('PETTY_CASH.DRAFT');
                      break;
                    case 1:
                      ret = $translate.instant('PETTY_CASH.SUBMIT');
                      break;
                    case 2:
                      ret = $translate.instant('PETTY_CASH.CLASSIFY_COMPLETE');
                      break;
                    case 3:
                      ret = $translate.instant('PETTY_CASH.APPROVE_PASS');
                      break;
                    case 4:
                      ret = $translate.instant('PETTY_CASH.APPROVE_REJECT');
                      break;
                    default:
                      ret = $translate.instant('PETTY_CASH.PAID');
                  }
                  return ret;
                },
                /*
                 * 0-Create, 1-Modify, 2-Submit, 3-Approve, 4-Deny, 5-Paid, 6-Delete, 7-Forward
                 */
                getAction: function (type) {
                  var ret = '';
                  switch (type) {
                    case 0:
                      ret = 'create';
                      break;
                    case 1:
                      ret = 'modify';
                      break;
                    case 2:
                      ret = 'submit';
                      break;
                    case 3:
                      ret = 'approve';
                      break;
                    case 4:
                      ret = 'deny';
                      break;
                    case 5:
                      ret = 'paid';
                      break;
                    case 6:
                      ret = 'delete';
                      break;
                    case 7:
                      ret = 'forward';
                      break;
                  }
                  return ret;
                }
              },
              // purchase order classification
              purchaseOrderClassification: {
                /*
                 * 0:未支付,1:部分支付,2:全额支付
                 */
                getDepreciationMethodType: function (type) {
                  var ret = '';
                  switch (type) {
                    case 1:
                      ret = $translate.instant('PURCHASE_ENUM.DEPRECIATION_METHOD_TYPE__LINE');
                      break;
                    case 2:
                      ret = $translate.instant('PURCHASE_ENUM.DEPRECIATION_METHOD_TYPE__OUTPUT');
                      break;
                  }
                  return ret;
                },
                /*
                 * 0 Bill,1 Invoice,2 Procurement,3 Travell
                 */
                getEntityType: function (type) {
                  var ret = '';
                  switch (type) {
                    case 0:
                      ret = $translate.instant('PURCHASE_ENUM.ENTITY_TYPE.BILL');
                      break;
                    case 1:
                      ret = $translate.instant('PURCHASE_ENUM.ENTITY_TYPE.INVOICE');
                      break;
                    case 2:
                      ret = $translate.instant('PURCHASE_ENUM.ENTITY_TYPE.PROCUREMENT');
                      break;
                    case 3:
                      ret = $translate.instant('PURCHASE_ENUM.ENTITY_TYPE.TRAVELL');
                      break;
                  }
                  return ret;
                }
              },
              //cashier pay
              cashierPay: {
                /*
                 *  2 expense account 报销单 3 petty cash 备用金 4 advance payment 凭证
                 */
                getEntityType: function(type){
                  var ret='';
                  switch (type) {
                    case 2:
                          ret = $translate.instant('PETTY_CASH.EXPENSE_ACCOUNT');
                          break;
                    case 3:
                          ret = $translate.instant('PETTY_CASH.PETTY_CASH');
                          break;
                    case 4:
                          ret = $translate.instant('PETTY_CASH.ADVANCE_PAYMENT');
                          break;
                  }
                  return ret;
                }
              }
            };
          }]);
