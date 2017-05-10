'use strict';
angular.module('concordyaApp')
        .factory('MockAPIService', ['$translate', function ($translate) {
            return {
              // account
              account: {
                login: function () {

                },
                register: function () {

                },
                invitation: function () {

                },
                confirmInvitation: function () {

                },
                enable: function () {

                },
                getEnabledEnum: function () {
                  return [{
                      'id': -1,
                      'name': $translate.instant('COMMON.ALL')
                    }, {
                      'id': 0,
                      'name': $translate.instant('COMMON.ENABLE')
                    }, {
                      'id': 1,
                      'name': $translate.instant('COMMON.DISABLE')
                    }];
                },
                getRoleEnum: function () {
                  //return[{
                  //    'id': 0,
                  //    'name': $translate.instant('COMMON.ROLE_USER')
                  //  }, {
                  //    'id': 1,
                  //    'name': $translate.instant('COMMON.ROLE_ACCOUNDANT')
                  //  }, {
                  //    'id': 2,
                  //    'name': $translate.instant('COMMON.ROLE_CASHIER')
                  //  }, {
                  //    'id': 3,
                  //    'name': $translate.instant('COMMON.ROLE_ADMIN')
                  //  }, {
                  //    'id': 4,
                  //    'name': $translate.instant('COMMON.ROLE_MANAGER')
                  //  }, {
                  //    'id': 5,
                  //    'name': $translate.instant('COMMON.ROLE_DEPARTMENT__MANAGER')
                  //  }, {
                  //    'id': 6,
                  //    'name': $translate.instant('COMMON.ROLE_FINANCIAL__MANAGER')
                  //  }];
                  return[{
                    'id': 0,
                    'name': '普通用户',
                    'checked':false,
                    'isdisable':false
                  }, {
                    'id': 1,
                    'name': '会计',
                    'checked':false,
                    'isdisable':false
                  }, {
                    'id': 2,
                    'name': '出纳',
                    'checked':false,
                    'isdisable':false
                  }, {
                    'id': 3,
                    'name': '管理员',
                    'checked':false,
                    'isdisable':false
                  }, {
                    'id': 4,
                    'name': '总经理',
                    'checked':false,
                    'isdisable':false
                  }, {
                    'id': 5,
                    'name': '部门经理',
                    'checked':false,
                    'isdisable':false
                  }, {
                    'id': 6,
                    'name': '财务经理',
                    'checked':false,
                    'isdisable':false
                  }];
                },
                delete: function () {

                },
                assignRole: function () {

                },
                setPassword: function () {

                },
                changePassword: function () {

                },
                verifyEmail: function () {

                },
                confirmEmail: function () {

                },
                verifyPhone: function () {

                },
                confirmPhone: function () {

                },
                getList: function () {

                },
                get: function () {

                },
                update: function () {

                },
                passwordResetRequest: function () {

                },
                passwordReset: function () {

                },
                emailAvaliable: function () {

                },
                search: function () {

                },
                getCompanies: function () {

                },
                setDefaultCompany: function () {

                }
              },
              // Account Category
              accountCategory: {
                getTypeList: function () {
                  return [{
                      id: 0,
                      name: '资产'
                    }, //资产
                    {
                      id: 1,
                      name: '负债'
                    }, //
                    {
                      id: 2,
                      name: '权益'
                    }, //权益
                    {
                      id: 3,
                      name: '成本'
                    }, //
                    {
                      id: 4,
                      name: '损益'
                    }//损益
                  ];
                },
                create: function () {

                },
                update: function () {

                },
                delete: function () {

                },
                get: function () {
                  return {
                    'id': '1000',
                    'level': 1,
                    'parentId': ':100',
                    'name': '库存现金',
                    'code': '20010',
                    'debit': 200.00,
                    'credit': 300.00,
                    'isPrivate': false,
                    'isCategory': true,
                    'taxRate': {'id': '232', 'name': '增值税', 'rate': 0.17}
                  };
                },
                getBalanceSet: function () {
                  return [
                    {
                      'id': 'ae56be18-1895-4f9d-b404-e23f5a5e7ad1',
                      'code': '1001',
                      'parentCode': '',
                      'name': '库存现金',
                      'level': 1,
                      'balanceDirection': 0,
                      'beginningBalance': 49380.77,
                      'debit': 1947333.25,
                      'credit': 892281.16,
                      'initialBalance': 1104432.85,
                      'hasChildren': false
                    },
                    {
                      'id': '1b9103a5-2105-47bc-bdb7-d5b61f086cbf',
                      'code': '1002',
                      'parentCode': '',
                      'name': '银行存款',
                      'level': 1,
                      'balanceDirection': 0,
                      'beginningBalance': 905417.43,
                      'debit': 18133932.15,
                      'credit': 16076785.82,
                      'initialBalance': 2962563.76,
                      'hasChildren': true
                    },
                    {
                      'id': '8cf5fc23-e286-420b-90f0-cc6aef475c02',
                      'code': '100201',
                      'parentCode': '1002',
                      'name': '杭州银行复兴支行1570',
                      'level': 2,
                      'balanceDirection': 0,
                      'beginningBalance': 70859.62,
                      'debit': 3103521.91,
                      'credit': 3164958.5,
                      'initialBalance': 9423.03,
                      'hasChildren': false
                    },
                    {
                      'id': '16bfa73d-f8e4-4024-9af0-6dd8f57dcee9',
                      'code': '100202',
                      'parentCode': '1002',
                      'name': '杭州银行科技支行4698',
                      'level': 2,
                      'balanceDirection': 0,
                      'beginningBalance': 834557.81,
                      'debit': 12120410.24,
                      'credit': 12911827.32,
                      'initialBalance': 43140.73,
                      'hasChildren': false
                    },
                    {
                      'id': '76180285-0e08-4d28-93d4-26efa2d4048d',
                      'code': '100203',
                      'parentCode': '1002',
                      'name': '中兴银行杭州余杭支行',
                      'level': 2,
                      'balanceDirection': 0,
                      'beginningBalance': null,
                      'debit': 2910000,
                      'credit': null,
                      'initialBalance': 2910000,
                      'hasChildren': false
                    },
                    {
                      'id': '5d15cc97-ed76-40ee-88dc-1df2928d01f3',
                      'code': '22210106',
                      'parentCode': '222101',
                      'name': '出口抵减内销产品应纳税额',
                      'level': 3,
                      'balanceDirection': 0,
                      'beginningBalance': null,
                      'debit': null,
                      'credit': null,
                      'initialBalance': null,
                      'hasChildren': false
                    },
                    {
                      'id': '68db0c0c-5dc7-4109-b750-ae4e835e6bda',
                      'code': '22210107',
                      'parentCode': '222101',
                      'name': '出口退税',
                      'level': 3,
                      'balanceDirection': 1,
                      'beginningBalance': null,
                      'debit': null,
                      'credit': null,
                      'initialBalance': null,
                      'hasChildren': false
                    },
                    {
                      'id': '1077f781-b249-441f-9f72-ba31da125836',
                      'code': '222102',
                      'parentCode': '2221',
                      'name': '未交增值税',
                      'level': 2,
                      'balanceDirection': 1,
                      'beginningBalance': 7572.82,
                      'debit': 26003.89,
                      'credit': 22590.29,
                      'initialBalance': 4159.22,
                      'hasChildren': false
                    },
                    {
                      'id': '015977ef-aef6-4ca7-88be-b6b2321094be',
                      'code': '222103',
                      'parentCode': '2221',
                      'name': '应交营业税',
                      'level': 2,
                      'balanceDirection': 1,
                      'beginningBalance': null,
                      'debit': 181998.81,
                      'credit': 216585.46,
                      'initialBalance': 34586.64,
                      'hasChildren': false
                    },
                    {
                      'id': 'd0329301-1802-41a0-a1e4-2e1af7830a2c',
                      'code': '222104',
                      'parentCode': '2221',
                      'name': '应交消费税',
                      'level': 2,
                      'balanceDirection': 1,
                      'beginningBalance': null,
                      'debit': null,
                      'credit': null,
                      'initialBalance': null,
                      'hasChildren': false
                    }
                  ]
                },
                getMaxCode: function (dataList, code) {
                  var ret = null;

                  var list = _.filter(dataList, function (item) {
                    return item.parentCode === code;
                  });

                  if (list && list.length) {
                    var item = _.max(list, function (item) {
                      return item.code;
                    });
                    ret = parseInt(item.code) + 1;
                    ret = ret.toString();
                  } else {
                    ret = code + '01';
                  }
                  return ret;
                },
                getList: function () {
                  return [{
                      'id': '1000',
                      'level': 1,
                      'parentId': ':100',
                      'name': '库存现金',
                      'code': '20010',
                      'debit': 200.00,
                      'credit': 300.00,
                      'isPrivate': false,
                      'isCategory': true,
                      'taxRate': {'id': '232', 'name': '增值税', 'rate': 0.17}
                    }, {
                      'id': '1001',
                      'level': 1,
                      'parentId': '100',
                      'name': '银行存款',
                      'code': '20020',
                      'debit': 200.00,
                      'credit': 300.00,
                      'isPrivate': false,
                      'isCategory': true,
                      'taxRate': {'id': '232', 'name': '增值税', 'rate': 0.17}
                    }];
                },
                getLevelOneList: function () {
                  return [{
                      'id': '1000',
                      'level': 1,
                      'parentId': ':100',
                      'name': '库存现金',
                      'code': '20010',
                      'debit': 200.00,
                      'credit': 300.00,
                      'isPrivate': false,
                      'isCategory': true,
                      'taxRate': {'id': '232', 'name': '增值税', 'rate': 0.17}
                    }, {
                      'id': '1001',
                      'level': 1,
                      'parentId': '100',
                      'name': '银行存款',
                      'code': '20020',
                      'debit': 200.00,
                      'credit': 300.00,
                      'isPrivate': false,
                      'isCategory': true,
                      'taxRate': {'id': '232', 'name': '增值税', 'rate': 0.17}
                    }];
                },
                getChildrenList: function () {
                  return [{
                      'id': '1000',
                      'level': 1,
                      'parentId': ':100',
                      'name': '库存现金',
                      'code': '20010',
                      'debit': 200.00,
                      'credit': 300.00,
                      'isPrivate': false,
                      'isCategory': true,
                      'taxRate': {'id': '232', 'name': '增值税', 'rate': 0.17}
                    }, {
                      'id': '1001',
                      'level': 1,
                      'parentId': '100',
                      'name': '银行存款',
                      'code': '20020',
                      'debit': 200.00,
                      'credit': 300.00,
                      'isPrivate': false,
                      'isCategory': true,
                      'taxRate': {'id': '232', 'name': '增值税', 'rate': 0.17}
                    }];
                },
                getHasTaxList: function () {
                  return [{
                      'id': '1000',
                      'level': 1,
                      'parentId': ':100',
                      'name': '库存现金',
                      'code': '20010',
                      'debit': 200.00,
                      'credit': 300.00,
                      'isPrivate': false,
                      'isCategory': true,
                      'taxRate': {'id': '232', 'name': '增值税', 'rate': 0.17}
                    }, {
                      'id': '1001',
                      'level': 1,
                      'parentId': '100',
                      'name': '银行存款',
                      'code': '20020',
                      'debit': 200.00,
                      'credit': 300.00,
                      'isPrivate': false,
                      'isCategory': true,
                      'taxRate': {'id': '232', 'name': '增值税', 'rate': 0.17}
                    }];
                }
              },
              accountPosting: {
                getRollbackCheckout: function () {
                  return [
                    {'accountingPeriodYear':2015,
                      'accountingPeriodMonth':1,
                      'canRollBack':false,
                      'voucherCount':5
                    },{
                      'accountingPeriodYear':2015,
                      'accountingPeriodMonth':2,
                      'canRollBack':false,
                      'voucherCount':10
                    },{
                      'accountingPeriodYear':2015,
                      'accountingPeriodMonth':3,
                      'canRollBack': false,
                      'voucherCount':20
                    },{
                      'accountingPeriodYear':2015,
                      'accountingPeriodMonth':4,
                      'canRollBack': true,
                      'voucherCount':13
                    },{
                      'accountingPeriodYear':2015,
                      'accountingPeriodMonth':5,
                      'canRollBack':false,
                      'voucherCount':30
                    }]
                }
              },
              assistAccount: {
                getAssistCategories: function () {
                  return [
                    {
                      companyId: 111223,
                      id: 1,
                      name: '客户',
                      category: 0
                    },
                    {
                      companyId: 111224,
                      id: 2,
                      name: '供应商',
                      category: 1
                    },
                    {
                      companyId: 111225,
                      id: 3,
                      name: '员工',
                      category: 2
                    },
                    {
                      companyId: 111226,
                      id: 4,
                      name: '现金流',
                      category: 3
                    },
                    {
                      companyId: 111227,
                      id: 5,
                      name: '部门',
                      category: 4
                    },
                    {
                      companyId: 111228,
                      id: 6,
                      name: '项目',
                      category: 5
                    },
                    {
                      companyId: 111228,
                      id: 7,
                      name: '自定义1',
                      category: 6
                    },
                    {
                      companyId: 111228,
                      id: 8,
                      name: '自定义2',
                      category: 6
                    },
                    {
                      companyId: 111228,
                      id: 9,
                      name: '自定义3',
                      category: 6
                    }
                  ]
                },
                getCategoryItems: function (typeId) {
                  if (typeId === 1) {
                    return {
                      'totalCount': 7,
                      'totalPages': 3,
                      'prev': 'http://localhost:51500/api/assistantaccounting/{:typeId}?pageIndex=1&pageSize=30',
                      'next': '',
                      'list': [
                        {
                          'id': 11,
                          'code': '编码1',
                          'name': '名称1'
                        },
                        {
                          'id': 22,
                          'code': '编码2',
                          'name': '名称2'
                        },
                        {
                          'id': 33,
                          'code': '编码3',
                          'name': '名称3'
                        },
                        {
                          'id': 44,
                          'code': '编码4',
                          'name': '名称4'
                        },
                        {
                          'id': 55,
                          'code': '编码5',
                          'name': '名称5'
                        },
                        {
                          'id': 66,
                          'code': '编码6',
                          'name': '名称6'
                        },
                        {
                          'id': 77,
                          'code': '编码7',
                          'name': '名称7'
                        }
                      ]
                    }
                  } else if (typeId === 7) {
                    return {
                      'totalCount': 1,
                      'totalPages': 10,
                      'prev': 'http://localhost:51500/api/assistantaccounting/{:typeId}?pageIndex=1&pageSize=30',
                      'next': '',
                      'list': [
                        {
                          'id': 11,
                          'code': 'z编码1',
                          'name': 'z名称1'
                        },
                        {
                          'id': 22,
                          'code': 'z编码2',
                          'name': 'z名称2'
                        },
                        {
                          'id': 33,
                          'code': 'z编码3',
                          'name': 'z名称3'
                        }
                      ]
                    }
                  } else {
                    return {
                      'totalCount': 1,
                      'totalPages': 10,
                      'prev': 'http://localhost:51500/api/assistantaccounting/{:typeId}?pageIndex=1&pageSize=30',
                      'next': '',
                      'list': [ ]
                    }
                  }
                }

              },
              // area
              area: {
                get: function () {
                  return [{
                      'id': '110000',
                      'name': '北京市',
                      'parentId': null
                    },
                    {
                      'areaId': '510000',
                      'name': '四川省',
                      'parentId': null
                    }];
                }
              },
              //accounting bank_reconciliations
              bankStatements: {
                getStatusList: function () {
                  return [{
                      id: 1,
                      name: '未核对'
                    }, {
                      id: 0,
                      name: '已核对'
                    }];
                },
                getList: function () {
                  var list = [{
                      paymentDateTime: 1428681361333,
                      entityType: '1',
                      summary: '付料款',
                      debit: '',
                      credit: '10,000.00',
                      contactName: 'OCR',
                      account: '1545151657461',
                      balance: '500,000.00',
//                      status: '未核对',
                      paymentCheckStatus: 0,
                      remark: ''
                    }, {
                      paymentDateTime: 1428681361333,
                      entityType: '2',
                      summary: '付料款',
                      debit: '10,000.00',
                      credit: '',
                      contactName: 'OCR',
                      account: '1545151657461',
                      balance: '500,000.00',
//                      status: '未核对',
                      paymentCheckStatus: 1,
                      remark: ''
                    }];
                  return list;
                }
              },
              // balance sheet
              balanceSheet: {
                get: function () {
                  return {
                    'id': 'Id',
                    'year': 2015,
                    'Month': 4,
                    'companyBalance': 40000,
                    'companyPlus': 80000,
                    'companyLess': 70000,
                    'companyAdjustAfterBalance': 50000,
                    'bankBalance': 40000,
                    'bankPlus': 80000,
                    'bankLess': 70000,
                    'bankAdjustAfterBalance': 50000,
                    'personInCharge': '负责人guid',
                    'accountant': '会记guid',
                    'cashie': '出纳guid'
                  };
                }
              },
              receipt: {
                getStatusEnum: function(){
                  return [
                    {
                      'id': null,
                      'name': $translate.instant('PETTY_CASH.ALL')
                    },{
                      'id': false,
                      'name': $translate.instant('PETTY_CASH.NOT_PUT_EXPENSE')
                    },{
                      'id': true,
                      'name': $translate.instant('PETTY_CASH.PUT_EXPENSE')
                    }
                  ];
                }
              },
              expense: {
                getStatusEnum: function(){
                  return [
                    {
                      'id': null,
                      'name': $translate.instant('COMMON.ALL')
                    }, {
                      'id': 0,
                      'name': $translate.instant('COMMON.DRAFT')
                    }, {
                      'id': 1,
                      'name': $translate.instant('COMMON.SUBMITTED')
                    },
                    {
                      'id': 2,
                      'name': $translate.instant('COMMON.CLASSIFY_COMPLETE')
                    }, {
                      'id': 3,
                      'name': $translate.instant('COMMON.APPROVE_PASS')
                    },
                    {
                      'id': 4,
                      'name': $translate.instant('COMMON.APPROVE_REJECT')
                    }, {
                      'id': 5,
                      'name': $translate.instant('COMMON.PAY_COMPLETE')
                    }
                  ];
                }
              },
              // bill api
              bill: {
                // create new bill
                create: function () {
                  return [];
                },
                // update bill
                update: function () {
                  return [];
                },
                // delete bill
                delete: function () {
                  return [];
                },
                approve: function () {

                },
                /*
                 * get aging status
                 * 0:正常,1:删除
                 */
                getAgingStatusEnum: function () {
                  return [{
                      'id': -1,
                      'name': $translate.instant('COMMON.ALL')
                    }, {
                      'id': 0,
                      'name': $translate.instant('BILL_ENUM.AGING_STATUS.NORMAL')
                    }, {
                      'id': 1,
                      'name': $translate.instant('BILL_ENUM.AGING_STATUS.DELETE')
                    }];
                },
                /*
                 * get purpose type
                 * 0-自用，1-再销售
                 */
                getPurposeTypeEnum: function () {
                  return [{
                      'id': 0,
                      'name': $translate.instant('BILL_ENUM.PURPOSE_TYPE.SELF_USE')
                    }, {
                      'id': 1,
                      'name': $translate.instant('BILL_ENUM.PURPOSE_TYPE.RESELL')
                    }];
                },
                /*
                 * get bill/invoice status
                 * 0:草稿,1:提交,2:分类完成,3:审批通过（待付款）,4:审批拒绝
                 */
                getStatusEnum: function () {
                  return [{
                      'id': -1,
                      'name': $translate.instant('COMMON.ALL')
                    }, {
                      'id': 0,
                      'name': $translate.instant('BILL_ENUM.STATUS.DRAFT')
                    }, {
                      'id': 1,
                      'name': $translate.instant('BILL_ENUM.STATUS.COMMIT')
                    }, {
                      'id': 2,
                      'name': $translate.instant('BILL_ENUM.STATUS.CLASSIFY_COMPLETED')
                    }, {
                      'id': 3,
                      'name': $translate.instant('BILL_ENUM.STATUS.APPROVE_PASS')
                    }, {
                      'id': 4,
                      'name': $translate.instant('BILL_ENUM.STATUS.APPROVE_REJECT')
                    }];
                },
                get: function () {
                  return {
                    'id': '664622a3-16b2-4fc6-afc0-5da4af5159de',
                    'company': {
                      'id': '50911b7b-9a48-416f-b693-8d9fa8616298',
                      'name': '有序科技',
                      'address': [],
                      'category': null,
                      'scope': null,
                      'serialNumber': null,
                      'email': null
                    },
                    'billNumber': '00001',
                    'approver': {
                      'id': '5067e4c6-8807-42d4-8ca8-f5928eef9f8d',
                      'name': '张三',
                      'amount': 0
                    },
                    'contact': {
                      'id': '2545617a-efe1-45f8-8e69-c454c0d1f410',
                      'currentCompanyId': '50911b7b-9a48-416f-b693-8d9fa8616298',
                      'name': '李四',
                      'phone': '1234567890',
                      'email': 'baidu@163.com',
                      'address': null,
                      'account': 'no',
                      'isVendor': false,
                      'isCustomer': true
                    },
                    'billDate': 1428681361333333,
                    'status': 0,
                    'agingStatus': 0,
                    'sterilizeStatus': 0,
                    'paymentStatus': 1,
                    'reference': '0001',
                    'attachmentId': null,
                    'billItems': [{
                        'id': '29c16634-db53-4fd0-b4ad-641bb2cbf78d',
                        'description': '0001',
                        'inventoryItem': {
                          'id': '111',
                          'name': '水',
                          'isDelete': false,
                          'description': '11',
                          'accountingCategoryId': null
                        },
                        'pricePerUnit': 40,
                        'taxRate': {
                          'id': 'eb1207fa-f9c3-45b1-9604-a9cdcb17809c',
                          'name': '增值税',
                          'rate': 0.12
                        },
                        'quantity': 10,
                        'itemAmount': 400,
                        'taxAmount': 40
                      }, {
                        'id': '2dad4095-817e-418a-893d-6d9de994d9bd',
                        'description': '0001',
                        'inventoryItem': {
                          'id': '111',
                          'name': '水',
                          'isDelete': false,
                          'description': '11',
                          'accountingCategoryId': null
                        },
                        'pricePerUnit': 30,
                        'taxRate': {
                          'id': '0784a5ed-a49e-4bcd-b3d8-83b94db5a228',
                          'name': '营业税',
                          'rate': 0.02
                        },
                        'quantity': 10,
                        'itemAmount': 300,
                        'taxAmount': 60
                      }],
                    'inventoryAmount': 700,
                    'tax': [{
                        'id': '5b762991-ee9b-4114-872e-c78e71ba049e',
                        'name': '增值税',
                        'amount': 60,
                        'action': 0
                      }, {
                        'id': '63c5ea05-3cad-4de6-9196-69879f3e593f',
                        'name': '营业税',
                        'amount': 40,
                        'action': 0
                      }],
                    'taxAmount': 100,
                    'total': 800,
                    'payAmount': 60,
                    'payDate': 1428681361333333,
                    'nextPayDate': 1428681361333333,
                    'payAttachmentId': 'a1,a2',
                    'payReference': '0001'
                  };
                },
                getList: function () {
                  return {
                    'list': [{
                        'id': '1',
                        'number': '20150408120589',
                        'attachmentName': '附件名称1',
                        'displayName': '张三',
                        'dateOfExpiry': '1428681361333333',
                        'isPayment': 1,
                        'amount': 56000,
                        'state': 1
                      }, {
                        'id': '2',
                        'number': '20150408120590',
                        'attachmentName': '附件名称2',
                        'displayName': '李四',
                        'dateOfExpiry': '1428681361333333',
                        'isPayment': 1,
                        'amount': 56000,
                        'state': 1
                      }],
                    'totalCount': 2
                  };
                }
              },
              // company
              company: {
                get: function () {
                  return {};
                },
                getCategoryList: function () {
                  return [{
                      id: 1,
                      name: 'IT'
                    }];
                }
              },
              //contact
              contact: {
                create: function () {

                },
                update: function () {

                },
                delete: function () {

                },
                get: function () {

                },
                getRoleEnum: function () {
                  return[{
                      'id': 0,
                      'name': $translate.instant('CONTACT.VENDOR')
                    }, {
                      'id': 1,
                      'name': $translate.instant('CONTACT.CUSTOMER')
                    }];
                },
                getList: function () {
                  return {
                    list: [{
                        'name': 'name',
                        'phone': '130000000000',
                        'email': 'a@b.c',
                        'address': {
                          'id': '9b87ced0-6457-47b5-a1aa-79ff25b3e774',
                          'street': '善缘街1号立方庭大厦',
                          'areaId': '100011',
                          'areaName': '东城区',
                          'cityId': '100010',
                          'cityName': '北京市',
                          'provinceId': '100010',
                          'provinceName': '北京市',
                          'postalCode': null
                        },
                        'accountName': '测试账号',
                        'accountNumber': '100000',
                        'isVendor': true,
                        'isCustomer': false,
                        'id': '3d59907c-2b8e-42cd-8b2e-884a2b1b5a89'
                      }],
                    totalCount: 1
                  };
                },
                getAllList: function () {
                  return [{
                      'name': 'name',
                      'phone': '130000000000',
                      'email': 'a@b.c',
                      'address': {
                        'id': '9b87ced0-6457-47b5-a1aa-79ff25b3e774',
                        'street': '善缘街1号立方庭大厦',
                        'areaId': '100011',
                        'areaName': '东城区',
                        'cityId': '100010',
                        'cityName': '北京市',
                        'provinceId': '100010',
                        'provinceName': '北京市',
                        'postalCode': null
                      },
                      'accountName': '测试账号',
                      'accountNumber': '100000',
                      'isVendor': true,
                      'isCustomer': false,
                      'id': '3d59907c-2b8e-42cd-8b2e-884a2b1b5a89'
                    }];
                }
              },
              detailAccount: {
                getAccountTypes: function(){
                  return [{
                    id: 1,
                    name: $translate.instant('DETAIL_ACCOUNT.CURRENT_HAPPENED')
                  }, {
                    id: 0,
                    name: $translate.instant('DETAIL_ACCOUNT.THIS_CUMULATIVE')

                  }];
                }
              },
              // date
              date: {
                getYearList: function () {
                  var year = new Date().getFullYear();
                  var count = 15, list = [];
                  while (count > 0) {
                    list.push({
                      id: year,
                      name: year
                    });
                    year--;
                    count--;
                  }
                  return list;
                },
                getMonthList: function () {
                  return [{
                      id: 1,
                      name: 1
                    }, {
                      id: 2,
                      name: 2
                    }, {
                      id: 3,
                      name: 3
                    }, {
                      id: 4,
                      name: 4
                    }, {
                      id: 5,
                      name: 5
                    }, {
                      id: 6,
                      name: 6
                    }, {
                      id: 7,
                      name: 7
                    }, {
                      id: 8,
                      name: 8
                    }, {
                      id: 9,
                      name: 9
                    }, {
                      id: 10,
                      name: 10
                    }, {
                      id: 11,
                      name: 11
                    }, {
                      id: 12,
                      name: 12
                    }];
                }
              },
              // deal
              deal: {
                getList: function () {
                  return {
                    'list': [{
                        'di': 'payment1',
                        'number': '00001', //单据编号
                        'amount': '3000', //采购金额
                        'PaymentAmount': 2000, //支付金额
                        'paymentDateTime': 1428681361333, //支付日期
                        'documentNumber': 1428681361333, //交易凭证号
                        'nextPaymentAmount': '2000', //下次支付金额
                        'nextPaymentDateTime': 1428681361333//下次支付日期
                      }],
                    'totalCount': 1,
                    'totalPages': 10
                  };
                }
              },
              //department
              department: {
                create: function (data) {
                  return {};
                },
                update: function (id) {
                  return {};
                },
                delete: function (ids) {
                  return {};
                },
                get: function (id) {
                  if(id == 10){
                    return {
                      'id' : '1',
                      'code':'0001',
                      'name':'财务部',
                      'parentId':'10',
                      'description':'描述'
                    }
                  }else{
                    return{
                      'id' : '2',
                      'code':'0002',
                      'name':'后勤部',
                      'peoplenumber':'20',
                      'description':'后勤部描述'
                    }
                  }
                },
                getList: function () {
                  return[{
                    'id' : '1',
                    'code':'0001',
                    'name':'财务部',
                    'peoplenumber':'10',
                    'description':'描述'
                  },{
                    'id' : '2',
                    'code':'0002',
                    'name':'后勤部',
                    'peoplenumber':'20',
                    'description':'后勤部描述'
                  },{
                    'id' : '3',
                    'code':'0003',
                    'name':'市场部',
                    'peoplenumber':'30',
                    'description':'市场部描述'
                  }];
                }
              },

              // fixed asset
              fixedAsset: {
                update: function () {
                  return {};
                },
                getList: function () {
                  return {
                    'list': [{
                        'id': 'guid', //分类guid
                        'accountingCategory': {
                          'id': '1000',
                          'name': '库存现金'
                        },
                        'inventoryItem': {
                          'id': '1',
                          'name': '联想电脑'
                        },
                        'entityType': '1', //分类物品来源
                        'accumulatedDepreciation': 4000, //累计折旧
                        'remainValue': 1000, //账面价值
                        'depreciableYears': 5, //折旧年限
                        'depreciationMethodType': 1//折旧方法:1、直线；2、产量
                      }],
                    'totalCount': 0
                  };
                }
              },
              // inventoryItem
              inventoryItem: {
                create: function () {
                },
                update: function () {
                },
                delete: function () {
                },
                get: function () {
                },
                getTypeEnum: function () {
                  return[{
                      'id': 0,
                      'name': $translate.instant('INVENTORY.IS_FOR_BUY')
                    }, {
                      'id': 1,
                      'name': $translate.instant('INVENTORY.IS_FOR_SELL')
                    }];
                },
                getList: function () {
                  return {
                    'list': [{
                        'id': 'c20f3627-86f4-4ef6-8d00-fef74db33f98',
                        'name': '电脑1',
                        'description': '111',
                        'accountingCategoryId': '26c6951c-fd32-4cf4-b4ea-979595a886eb',
                        'accountingCategoryModel': {
                          'id': '26c6951c-fd32-4cf4-b4ea-979595a886eb',
                          'rootCategory': 4,
                          'parentId': null,
                          'code': '5101',
                          'level': 1,
                          'debit': 0,
                          'credit': 0,
                          'name': '主营业务收入',
                          'isCategory': true,
                          'taxRate': null
                        }
                      }, {
                        'id': 'c20f3627-86f4-4ef6-8d00-fef74db33f98',
                        'name': '电脑2',
                        'description': '222',
                        'accountingCategoryId': '26c6951c-fd32-4cf4-b4ea-979595a886eb',
                        'accountingCategoryModel': {
                          'id': '26c6951c-fd32-4cf4-b4ea-979595a886eb',
                          'rootCategory': 4,
                          'parentId': null,
                          'code': '5101',
                          'level': 1,
                          'debit': 0,
                          'credit': 0,
                          'name': '主营业务收入',
                          'isCategory': true,
                          'taxRate': null
                        }
                      }],
                    'totalCount': 0
                  };
                },
                getAllList: function () {
                  return [{
                      'id': 'c20f3627-86f4-4ef6-8d00-fef74db33f98',
                      'name': '电脑1',
                      'description': '111',
                      'accountingCategoryId': '26c6951c-fd32-4cf4-b4ea-979595a886eb',
                      'accountingCategoryModel': {
                        'id': '26c6951c-fd32-4cf4-b4ea-979595a886eb',
                        'rootCategory': 4,
                        'parentId': null,
                        'code': '5101',
                        'level': 1,
                        'debit': 0,
                        'credit': 0,
                        'name': '主营业务收入',
                        'isCategory': true,
                        'taxRate': null
                      }
                    }, {
                      'id': 'c20f3627-86f4-4ef6-8d00-fef74db33f98',
                      'name': '电脑2',
                      'description': '222',
                      'accountingCategoryId': '26c6951c-fd32-4cf4-b4ea-979595a886eb',
                      'accountingCategoryModel': {
                        'id': '26c6951c-fd32-4cf4-b4ea-979595a886eb',
                        'rootCategory': 4,
                        'parentId': null,
                        'code': '5101',
                        'level': 1,
                        'debit': 0,
                        'credit': 0,
                        'name': '主营业务收入',
                        'isCategory': true,
                        'taxRate': null
                      }
                    }];
                }
              },
              // bill api
              invoice: {
                // create new bill
                create: function () {
                  return [];
                },
                // update bill
                update: function () {
                  return [];
                },
                // delete bill
                delete: function () {
                  return [];
                },
                approve: function () {

                },
                /*
                 * get bill/invoice status
                 * 0:草稿,1:提交,2:分类完成,3:审批通过（待付款）,4:审批拒绝
                 */
                getStatusEnum: function () {
                  return [{
                      'id': -1,
                      'name': $translate.instant('COMMON.ALL')
                    }, {
                      'id': 0,
                      'name': $translate.instant('INVOICE_ENUM.STATUS.DRAFT')
                    }, {
                      'id': 1,
                      'name': $translate.instant('INVOICE_ENUM.STATUS.COMMIT')
                    }, {
                      'id': 3,
                      'name': $translate.instant('INVOICE_ENUM.STATUS.APPROVE_PASS')
                    }, {
                      'id': 4,
                      'name': $translate.instant('INVOICE_ENUM.STATUS.APPROVE_REJECT')
                    }];
                },
                get: function () {
                  return {
                    'id': '664622a3-16b2-4fc6-afc0-5da4af5159de',
                    'company': {
                      'id': '50911b7b-9a48-416f-b693-8d9fa8616298',
                      'name': '有序科技',
                      'address': [],
                      'category': null,
                      'scope': null,
                      'serialNumber': null,
                      'email': null
                    },
                    'invoiceNumber': '00001',
                    'approver': {
                      'id': '5067e4c6-8807-42d4-8ca8-f5928eef9f8d',
                      'name': '张三',
                      'amount': 0
                    },
                    'contact': {
                      'id': '2545617a-efe1-45f8-8e69-c454c0d1f410', 'currentCompanyId': '50911b7b-9a48-416f-b693-8d9fa8616298',
                      'name': '李四',
                      'phone': '1234567890',
                      'email': 'baidu@163.com',
                      'address': null,
                      'account': 'no',
                      'isVendor': false,
                      'isCustomer': true
                    },
                    'invoiceDate': 1428681361333333,
                    'status': 0,
                    'agingStatus': 0,
                    'sterilizeStatus': 0,
                    'paymentStatus': 1,
                    'reference': '0001',
                    'attachmentId': null,
                    'invoiceItems': [{
                        'id': '29c16634-db53-4fd0-b4ad-641bb2cbf78d',
                        'description': '0001',
                        'inventoryItem': {
                          'id': '111',
                          'name': '水',
                          'isDelete': false,
                          'description': '11',
                          'accountingCategoryId': null
                        },
                        'pricePerUnit': 40,
                        'taxRate': {
                          'id': 'eb1207fa-f9c3-45b1-9604-a9cdcb17809c',
                          'name': '增值税', 'rate': 0.12
                        },
                        'discount': 0.9,
                        'quantity': 10,
                        'itemAmount': 400,
                        'taxAmount': 40
                      }, {
                        'id': '2dad4095-817e-418a-893d-6d9de994d9bd',
                        'description': '0001',
                        'inventoryItem': {
                          'id': '111',
                          'name': '水',
                          'isDelete': false,
                          'description': '11',
                          'accountingCategoryId': null
                        },
                        'pricePerUnit': 30,
                        'taxRate': {
                          'id': '0784a5ed-a49e-4bcd-b3d8-83b94db5a228',
                          'name': '营业税',
                          'rate': 0.02
                        }, 'discount': 0.9, 'quantity': 10,
                        'itemAmount': 300,
                        'taxAmount': 60
                      }],
                    'inventoryAmount': 700,
                    'tax': [{
                        'id': '5b762991-ee9b-4114-872e-c78e71ba049e',
                        'name': '增值税',
                        'amount': 60,
                        'action': 0
                      }, {
                        'id': '63c5ea05-3cad-4de6-9196-69879f3e593f',
                        'name': '营业税',
                        'amount': 40,
                        'action': 0
                      }],
                    'taxAmount': 100,
                    'total': 800,
                    'payAmount': 60,
                    'payDate': 1428681361333333,
                    'nextPayDate': 1428681361333333,
                    'payAttachmentId': 'a1,a2',
                    'payReference': '0001'
                  };
                },
                getList: function () {
                  return {
                    'list': [{
                        'id': '1',
                        'number': '20150408120589',
                        'attachmentName': '附件名称1',
                        'displayName': '张三',
                        'dateOfExpiry': '1428681361333333',
                        'isPayment': 1,
                        'amount': 56000,
                        'state': 1
                      }, {
                        'id': '2',
                        'number': '20150408120590',
                        'attachmentName': '附件名称2',
                        'displayName': '李四',
                        'dateOfExpiry': '1428681361333333',
                        'isPayment': 1,
                        'amount': 56000,
                        'state': 1
                      }],
                    'totalCount': 2
                  };
                }
              },
              // petty cash
              pettyCash: {
                getEntityTypes:function(){
                  return [{
                      'id': -1,
                      'name': $translate.instant('COMMON.ALL')
                    }, {
                      'id': 0,
                      'name': $translate.instant('PETTY_CASH.PETTY_CASH')
                    }, {
                      'id': 1,
                      'name': $translate.instant('PETTY_CASH.ADVANCE_PAYMENT')
                    }];
                }
              },
              // purchase order classification
              purchaseOrderClassification: {
                getDict: function () {
                  var dict = {
                    feiList: [{
                        id: 1,
                        name: '财务'
                      }, {
                        id: 2,
                        name: '管理'
                      }, {
                        id: 3,
                        name: '销售'
                      }],
                    stockList: [{
                        id: 1,
                        name: '库存'
                      }, {
                        id: 2,
                        name: '固定资产'
                      }],
                    depreciationList: [{
                        id: 1,
                        name: '直线'
                      }, {
                        id: 2,
                        name: '产量'
                      }]
                  };
                  return dict;
                },
                getDepreciationList: function () {
                  return [{
                      id: 1,
                      name: '直线'
                    }, {
                      id: 2,
                      name: '产量'
                    }];
                },
                // 折旧方法:1、直线；2、产量
                getDepreciationMethodTypeEnum: function () {
                  return [{
                      'id': 1,
                      'name': $translate.instant('PURCHASE_ENUM.DEPRECIATION_METHOD_TYPE__LINE')
                    }, {
                      'id': 2,
                      'name': $translate.instant('PURCHASE_ENUM.DEPRECIATION_METHOD_TYPE__OUTPUT')
                    }];
                },
                getList: function () {
                  var result = {
                    totalCount: 1,
                    totalPages: 10,
                    list: [{
                        id: '',
                        accountingCategory: {'id': 'guid', 'name': '固定资产'},
                        inventoryItemName: '电脑A',
                        entityType: '1',
                        dateOfPurchase: '2014-10-10',
                        purchasePrice: '5000.00',
                        accumulatedDepreciation: '1000.00',
                        remainValue: '4000.00',
                        depreciableYears: 1,
                        depreciationType: {
                          name: '直线',
                          id: 1
                        },
                        isChecked: true
                      }, {
                        id: '',
                        accountingCategory: {'id': 'guid', 'name': '固定资产'},
                        inventoryItemName: '电脑B',
                        entityType: '2',
                        dateOfPurchase: '2014-10-10',
                        purchasePrice: '5000.00',
                        accumulatedDepreciation: '1000.00',
                        remainValue: '4000.00',
                        depreciableYears: 1,
                        depreciationType: {
                          name: '直线',
                          id: 1
                        },
                        isChecked: false
                      }]
                  };
                  return result;
                }
              },
              //cashier pay
              cashierPay: {
                getEntityTypeEnum: function () {
                  //return[{
                  //  id: null,
                  //  name:$translate.instant('COMMON.ALL')
                  //}, {
                  //  id:'2',
                  //  name:$translate.instant('PETTY_CASH.EXPENSE_ACCOUNT')
                  //  }, {
                  //  id:'3',
                  //  name:$translate.instant('PETTY_CASH.PETTY_CASH')
                  //}, {
                  //  id:'4',
                  //  name:$translate.instant('PETTY_CASH.ADVANCE_PAYMENT')
                  //}];
                  return[{
                    id: null,
                    name: '全部'
                  }, {
                    id:'2',
                    name: '报销单'
                  }, {
                    id:'3',
                    name: '备用金'
                  }, {
                    id:'4',
                    name: '预付款'
                  }];
                }
              },
              // receivable
              receivable: {
                getList: function () {
                  return {
                    'list': [{
                        'di': 'payment1',
                        'number': '00001', //单据编号
                        'amount': '3000', //采购金额
                        'PaymentAmount': 2000, //支付金额
                        'paymentDateTime': 1428681361333, //支付日期
                        'documentNumber': 1428681361333, //交易凭证号
                        'nextPaymentAmount': '2000', //下次支付金额
                        'nextPaymentDateTime': 1428681361333//下次支付日期
                      }],
                    'totalCount': 1,
                    'totalPages': 10
                  };
                }
              },
              // reimbursement
              reimbursement: {
                create: function () {

                },
                update: function () {

                },
                delete: function () {

                },
                get: function () {

                },
                getList: function () {
                  return [];
                }
              },
              // taxrate
              taxRate: {
                create: function () {
                },
                update: function () {

                },
                delete: function () {

                },
                getList: function () {
                  return {
                    'list': [{'id': 1, 'name': '增值税', 'rate': 0.15}, {'id': 2, 'name': '消费税', 'rate': 0.25}],
                    'totalCount': 2
                  };
                },
                getAllList: function () {
                  return [{'id': 1, 'name': '增值税', 'rate': 0.15}, {'id': 2, 'name': '消费税', 'rate': 0.25}];
                }
              },
              // todolist
              todoList: {
                getList: function () {
                  return {
                    'list': [{
                        'fkId': 'fa5f3ef8-b414-45c1-ae37-7405c68955cf',
                        'formName': '账单',
                        'reference': '0001',
                        'status': 0,
                        'entityType': 0,
                        'date': 1429348793,
                        'money': 800,
                        'creater': {
                          'id': 'testEmployeeA@concordya.com',
                          'name': '测试员工A'
                        }
                      }],
                    'totalCount': 0
                  };
                }
              },
              // voucher
              voucher: {
                /*
                 * get sterilize status
                 * 0:正常,1:已冲销
                 */
                getSterilizeStatusEnum: function () {
                  return [{
                      'id': -1,
                      'name': $translate.instant('COMMON.ALL')
                    }, {
                      'id': 0,
                      'name': $translate.instant('BILL_ENUM.STERILIZE_STATUS.NORMAL')
                    }, {
                      'id': 1,
                      'name': $translate.instant('BILL_ENUM.STERILIZE_STATUS.COMPLETED')
                    }];
                },
                get: function () {
                  return {
                    'id': ':id',
                    'createOn': 1428681361333,
                    'number': 'AC0000001',
                    'summary': '摘要文字',
                    'status': 0, //审批状态
                    'checkStatus': 0, //审核状态
                    'sterilizeStatus': 0, //冲销状态
                    'attachment': [{
                        'id': '1',
                        'fileName': 'name',
                        'location': 'http://xxxxx'
                      }],
                    'createBy': '杨洋', //制单
                    'checkBy': '李四', //审核
                    'accountBy': '张三', //记账
                    'cashier': '王五', //出纳
                    'sourceId': ':id',
                    'sourceType': 0,
                    'sourceNumber': 'B0000001',
                    'companyName': '有序科技',
                    'items': [{
                        'summary': '缴纳社保',
                        'accountingCategory': {
                          'id': '',
                          'name': '银行存款'
                        },
                        'credit': 400,
                        'debit': 0,
                        'selectedAssistingCategory': {
                          'id': '123123123123',
                          'name': '有序科技'
                        }
                      }, {
                        'summary': '缴纳社保',
                        'accountingCategory': {
                          'id': '',
                          'name': '银行存款'
                        },
                        'credit': 400,
                        'debit': 0,
                        'selectedAssistingCategory': {
                          'id': '123123123123',
                          'name': '有序科技'
                        }
                      }]
                  };
                },
                getList: function () {
                  return {
                    'list': [{
                        'id': ':id',
                        'createOn': 1428681361333,
                        'number': 'AC0000001',
                        'summary': '摘要文字',
                        'amount': -300,
                        'createBy': '张三',
                        'approveBy': '李四',
                        'accountBy': '王五',
                        'sourceId': ':id',
                        'sourceType': 0,
                        'sourceNumber': 'B0000001',
                        'companyName': '有序科技'
                      }],
                    'totalCount': 0
                  };
                }
              },
              expenseAccountSetting: {
                getSettingList: function () {
                  return{
                    Travel: [
                      {id : 1, name: '飞机',icon:'icon-flights',accountCategory :null},
                      {id : 2, name: '火车',icon:'icon-train'},
                      {id : 3, name: '轮船',icon:'icon-ship'},
                      {id : 4, name: '长途汽车',icon:'icon-bus'},
                      {id : 5, name: '住宿',icon:'icon-accommodation'},
                      {id : 6, name: '餐食',icon:'icon-food'},
                      {id : 7, name: '当地交通',icon:'icon-subway'},
                      {id : 8, name: '过桥过路',icon:'icon-bridge'},
                      {id : 9, name: '其他',icon:'icon-etc'}],
                    NonTravel: [
                      {id : 1, name: '烟费',icon:'icon-smoking'},
                      {id : 2, name: '酒',icon:'icon-alcohol'},
                      {id : 3, name: '食品',icon:'icon-snacks'},
                      {id : 4, name: '出租车',icon:'icon-car'},
                      {id : 5, name: '办公用品费',icon:'icon-office'},
                      {id : 6, name: '证照规费',icon:'icon-license'},
                      {id : 7, name: '物业管理费',icon:'icon-manage'},
                      {id : 8, name: '水费',icon:'icon-water'},
                      {id : 9, name: '电费',icon:'icon-electricity'},
                      {id : 10, name: '燃气费',icon:'icon-gas'},
                      {id : 11, name: '取暖费',icon:'icon-warm'},
                      {id : 12, name: '车辆加油费',icon:'icon-refuel'},
                      {id : 13, name: '图书资料费',icon:'icon-book'},
                      {id : 14, name: '会议费',icon:'icon-conference'},
                      {id : 15, name: '咨询费',icon:'icon-consult'},
                      {id : 16, name: '广告费',icon:'icon-advertisement'},
                      {id : 17, name: '电话费',icon:'icon-telephone'},
                      {id : 18, name: '网络费',icon:'icon-web'},
                      {id : 19, name: '修理费',icon:'icon-repair'},
                      {id : 20, name: '保险费',icon:'icon-insurance'},
                      {id : 21, name: '房屋租赁费',icon:'icon-rent'},
                      {id : 22, name: '运杂费',icon:'icon-shipped-miscellaneous'},
                      {id : 23, name: '展览展示费',icon:'icon-display'},
                      {id : 24, name: '宣传费',icon:'icon-promote'}
                    ]
                  };
                },
                getIconList: function(){
                  return{
                    travelIconList: [
                      {id : 1, name: '飞机',icon:'icon-flights',accountCategory :null},
                      {id : 2, name: '火车',icon:'icon-train'},
                      {id : 3, name: '轮船',icon:'icon-ship'},
                      {id : 4, name: '长途汽车',icon:'icon-bus'},
                      {id : 5, name: '住宿',icon:'icon-accommodation'},
                      {id : 6, name: '餐食',icon:'icon-food'},
                      {id : 7, name: '当地交通',icon:'icon-subway'},
                      {id : 8, name: '过桥过路',icon:'icon-bridge'},
                      {id : 9, name: '其他',icon:'icon-etc'}
                    ],
                    nonTravelIconList: [
                        {id : 1, name: '烟费',icon:'icon-smoking'},
                        {id : 2, name: '酒',icon:'icon-alcohol'},
                        {id : 3, name: '食品',icon:'icon-snacks'},
                        {id : 4, name: '出租车',icon:'icon-car'},
                        {id : 5, name: '办公用品费',icon:'icon-office'},
                        {id : 6, name: '证照规费',icon:'icon-license'},
                        {id : 7, name: '物业管理费',icon:'icon-manage'},
                        {id : 8, name: '水费',icon:'icon-water'},
                        {id : 9, name: '电费',icon:'icon-electricity'},
                        {id : 10, name: '燃气费',icon:'icon-gas'},
                        {id : 11, name: '取暖费',icon:'icon-warm'},
                        {id : 12, name: '车辆加油费',icon:'icon-refuel'},
                        {id : 13, name: '图书资料费',icon:'icon-book'},
                        {id : 14, name: '会议费',icon:'icon-conference'},
                        {id : 15, name: '咨询费',icon:'icon-consult'},
                        {id : 16, name: '广告费',icon:'icon-advertisement'},
                        {id : 17, name: '电话费',icon:'icon-telephone'},
                        {id : 18, name: '网络费',icon:'icon-web'},
                        {id : 19, name: '修理费',icon:'icon-repair'},
                        {id : 20, name: '保险费',icon:'icon-insurance'},
                        {id : 21, name: '房屋租赁费',icon:'icon-rent'},
                        {id : 22, name: '运杂费',icon:'icon-shipped-miscellaneous'},
                        {id : 23, name: '展览展示费',icon:'icon-display'},
                        {id : 24, name: '宣传费',icon:'icon-promote'}
                      ]
                  }
                },
                getAccountingCategoryList: function(){
                  return [{
                    id: 1,
                    code: '1001',
                    level: 1,
                    name: '开支',
                    hasChildren: true,
                    parentId: 3333,
                    children: [
                      {
                        id: 11,
                        code: '1001',
                        level: 2,
                        name: '二级科目',
                        hasChildren: true,
                        parentId: 3333,
                        children:[
                          {
                            id: 11,
                            code: '1001',
                            level: 3,
                            name: '三级科目',
                            hasChildren: false,
                            parentId: 3333
                          },
                          {
                            id: 11,
                            code: '1001',
                            level: 3,
                            name: '三级科目',
                            hasChildren: false,
                            parentId: 3333
                          }
                        ]
                      },
                      {
                        id: 12,
                        code: '1001',
                        level: 2,
                        name: '二级科目',
                        hasChildren: false,
                        parentId: 3333
                      }
                    ]
                  },{
                    id: 2,
                    code: '1002',
                    level: 1,
                    name: '收入',
                    hasChildren: true,
                    parentId: 3333,
                    children: [
                      {
                        id: 11,
                        code: '1001',
                        level: 2,
                        name: '二级科目',
                        hasChildren: false,
                        parentId: 3333
                      },
                      {
                        id: 12,
                        code: '1001',
                        level: 2,
                        name: '二级科目',
                        hasChildren: false,
                        parentId: 3333
                      }
                    ]
                  }];
                }
              }
            };
          }]);
