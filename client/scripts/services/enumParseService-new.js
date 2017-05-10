'use strict';

angular.module('concordyaApp')
        .factory('EnumParseService', [function () {
            return {
              common: {
                parseBoolean: function (type) {
                  var ret = '';
                  switch (type) {
                    case true:
                      ret = '是';
                      break;
                    case false:
                      ret = '否';
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
                      ret = '草稿';
                      break;
                    case 1:
                      ret = '提交';
                      break;
                    case 2:
                      ret = '分类完成';
                      break;
                    case 3:
                      ret = '审批通过';
                      break;
                    case 4:
                      ret = '审批拒绝';
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
                      ret = '自用';
                      break;
                    case 1:
                      ret = '再销售';
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
                      ret = '草稿';
                      break;
                    case 1:
                      ret = '提交';
                      break;
                    case 2:
                      ret = '分类完成';
                      break;
                    case 3:
                      ret = '审批通过';
                      break;
                    case 4:
                      ret = '审批拒绝';
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
                      ret = '草稿';
                      break;
                    case 1:
                      ret = '已提交';
                      break;
                    case 2:
                      ret = '分类完成';
                      break;
                    case 3:
                      ret = '审批通过';
                      break;
                    case 4:
                      ret = '审批拒绝';
                      break;
                    default:
                      ret = '已付';
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
                      ret = '直线';
                      break;
                    case 2:
                      ret = '产量';
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
                      ret = '采购单';
                      break;
                    case 1:
                      ret = '销售单';
                      break;
                    case 2:
                      ret = 'Procurement';
                      break;
                    case 3:
                      ret = 'Travel';
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
                          ret = '报销单';
                          break;
                    case 3:
                          ret = '备用金';
                          break;
                    case 4:
                          ret = '预付款';
                          break;
                  }
                  return ret;
                }
              }
            };
          }]);
