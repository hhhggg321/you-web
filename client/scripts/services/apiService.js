'use strict';
angular.module('concordyaApp')
  .factory('APIService', ['$http', '$q', '$upload', '$httpParamSerializer', 'MockAPIService',
    function ($http, $q, $upload, $httpParamSerializer, mock) {
      // if use mock-api
      var isMock = false;

      var voucherHeaders = {headers: {'Accept': 'application/json;version=1'}};

      // if current url is product or staging environment, isMock should be false
      var hostname = window.location.hostname;
      if (hostname.indexOf('chinacloudsites.cn') !== -1 || hostname.indexOf('guanplus.com') !== -1) {
        isMock = false;
      }

      function promise(data) {
        var deferred = $q.defer();
        deferred.resolve({
          data: data,
          status: 200
        });

        var _promise = deferred.promise;
        _promise.success = function (fn) {
          _promise.then(function (res) {
            fn(res.data, res.status);
          });
          return _promise;
        };
        return _promise;
      }

      function query(url, params, data) {
        if (params && _.isObject(params)) {
          if (url.indexOf('?') !== -1) {
            url += '&' + $.param(params);
          } else {
            url += '?' + $.param(params);
          }
        }
        if (data) {
          return $http.get(url, data);
        } else {
          return $http.get(url);
        }
      }

      function queryPost(url, params, body, data) {
        if (params && _.isObject(params)) {
          if (url.indexOf('?') !== -1) {
            url += '&' + $.param(params);
          } else {
            url += '?' + $.param(params);
          }
        }
        if (data) {
          return $http.post(url, body, data);
        } else {
          return $http.post(url, body);
        }
      }


      var api = {
        // account
        account: {
          login: function (data) {
            var postConfig = { headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
                }};
            return $http.post('token', $httpParamSerializer(data), postConfig);
          },
          register: function (data) {
            return $http.post('account/register', data);
          },
          update: function (id, data) {
            return $http.patch('account/user/' + id, data);
          },
          adminUpdate: function (id, data) {
            return $http.patch('account/admin/' + id, data);
          },
          invitation: function (data) {
            return $http.post('account/invitation', data);
          },
          confirmInvitation: function (data) {
            return $http.post('account/confirminvitation', data);
          },
          enable: function (id, enabled) {
            id = _.isArray(id) ? id : [id];
            return $http.post('account/enable/batch?enabled=' + enabled, {'ids': id});
          },
          getEnabledEnum: function () {
            return promise(mock.account.getEnabledEnum());
          },
          getRoleEnum: function () {
            return promise(mock.account.getRoleEnum());
          },
          delete: function (id) {
            id = _.isArray(id) ? id : [id];
            return $http.post('account/user/batchdelete', {'ids': id});
          },
          editRole: function (id, roles) {
            id = _.isArray(id) ? id : [id];
            return $http.post('account/assignrole/batch?role=' + roles, {'ids': id});
          },
          setPassword: function (data, token) {
            var req = {
              method: 'POST',
              url: 'account/setpassword',
              headers: {
                'Authorization': 'bearer ' + token
              },
              data: data
            };
            return $http(req);
          },
          changePassword: function (data) {
            return $http.post('account/changepassword/', data);
          },
          verifyEmail: function (data) {
            return $http.post('account/verifyemail/', data);
          },
          confirmEmail: function (data) {
            return $http.post('account/confirmemail/', data);
          },
          verifyPhone: function (phoneNumber, captchaChallenge, captchaValidate, captchaSeccode) {
            if (captchaChallenge) {
              return $http.get('account/verifyphone/' + phoneNumber + '?captchaChallenge=' + captchaChallenge + '&captchaValidate=' + captchaValidate + '&captchaSeccode=' + captchaSeccode);
            } else {
                return $http.get('account/verifyphone/' + phoneNumber);
            }
          },
          confirmPhone: function (phone, verifycode) {
            return $http.get('account/confirmphone?phone=' + phone + '&verifycode=' + verifycode);
          },
          checkPhone: function (phone) {
            return $http.get('account/avaliable?phonenumber=' + phone);
          },
          get: function (id) {
            return $http.get('account/user/' + id);
          },
          getAccountantList: function () {
            return $http.get('account/userlist/accountant/nopaging');
          },
          getActiveUserList: function () {
            return $http.get('account/userlist/activeuser/nopaging');
          },
          getCashierList: function () {
            return $http.get('account/userlist/cashier/nopaging');
          },
          getManagerList: function () {
            return $http.get('account/userlist/boss/nopaging');
          },
          getList: function (params) {
            return query('account/userlist', params);
          },
          passwordResetRequest: function (email, captchaChallenge, captchaValidate, captchaSeccode) {
            return $http.get('account/passwordreset?email=' + email + '&captchaChallenge=' + captchaChallenge + '&captchaValidate=' + captchaValidate + '&captchaSeccode=' + captchaSeccode);
          },
          passwordReset: function (data) {
            return $http.post('account/passwordreset', data);
          },
          emailAvaliable: function (email) {
            return $http.get('account/avaliable?email=' + email);
          },
          getCompanies: function () {
            return $http.get('account/companies');
          },
          setDefaultCompany: function (companyId) {
            return $http.post('account/companies/' + companyId + '/setdefault');
          },
          getDepartmentList: function () {
            return $http.get('');
          },
          changeDepartment: function (ids, department) {
            return $http.post('')
          },
          getGTServerStatus: function () { // get captcha server status
            return $http.get('captcha/status');
          }
        },
        // Account Category
        accountCategory: {
          getAllData: function (year, month) {
            return $http.get('accountcategory/Index?year=' + year + '&month=' + month);
          },
          getMaintenanceData: function (year, month) {
            return $http.get('accountcategory/modify');
          },
          maintenanceModify: function (data) {
            return $http.post('accountcategory/modify', data);
          },
          getTypeList: function () {
            return promise(mock.accountCategory.getTypeList());
          },
          create: function (data) {
            return $http.post('accountcategory', data);
          },
          update: function (id, data) {
            if (id && data) {
              return $http.patch('accountcategory/' + id, data);
            } else {
              data = id;
              return $http.post('accountcategory/batchupdate', data);
            }
          },
          // get account-category in guide page
          getSet: function () {
            return $http.get('accountcategory/set');
          },
          // set account-category in guide page
          updateSet: function (data, isNextStep) {
            return $http.patch('accountcategory/set/' + isNextStep, data);
          },
          // get balance set in guide page
          getBalanceSet: function () {
            return $http.get('accountcategory/balanceSet');
          },
          // set account-category balance in guide page
          updateBlanceSet: function (data, isNextStep) {
            return $http.patch('accountcategory/balanceSet/' + isNextStep, data);
          },
          delete: function (id) {
            id = _.isArray(id) ? id : [id];
            return $http.post('accountcategory/batchdelete', {'ids': id});
          },
          get: function (id) {
            if (isMock) {
              return promise(mock.accountCategory.get());
            } else {
              return $http.get('accountcategory/' + id);
            }
          },
          getMaxCodeOfSecondAccounting: function (id) {
            return $http.get('accountcategory/maxCodeOfSecondAccounting?id=' + id);
          },
          getMaxCode: function (dataList, code) {
            return promise(mock.accountCategory.getMaxCode(dataList, code));
          },
          getList: function (params) {
            if (isMock) {
              return promise(mock.accountCategory.getList());
            } else {
              return query('accountcategory/search', params);
            }
          },
          getAllList: function () {
            return $http.get('accountcategory/includeall2');
          },
          getPeriodCategoryList: function (params) {
            return query('accountcategory/includeall', params);
          },
          getAssistantCategoryList: function (params) {
            return query('accountcategory/includeall2', params);
          },
          getLevelOneList: function (params) {
            if (isMock) {
              return promise(mock.accountCategory.getLevelOneList());
            } else {
              return query('accountcategory', params);
            }
          },
          getChildrenList: function (id) {
            if (isMock) {
              return promise(mock.accountCategory.getChildrenList(id));
            } else {
              return $http.get('accountcategory/' + id + '/children/');
            }
          },
          getHasTaxList: function () {
            if (isMock) {
              return promise(mock.accountCategory.getHasTaxList());
            } else {
              return $http.get('accountcategory/hastax');
            }
          },
          assistAccount: function (id, data) {
            return $http.put('accountcategory/' + id + "/assistingCategory", data);
          },
          getAssistDetail: function (id) {
            return $http.get('accountcategory/' + id + "/assistingCategory");
          }
        },
        // account-posting
        accountPosting: {
          getDate: function () {
            return $http.get('accountPosting/date');
          },
          getStatus: function () {
            return $http.get('accountPosting/state');
          },
          begin: function () {
            return $http.post('accountPosting/begin');
          },
          end: function () {
            return $http.post('accountPosting/end');
          },
          createVoucher: function (postingType) {
            //0:结转研发支出 1:结转制造费用 2:结转其他费用 3:结转成本 4:结转收入 5:结转所得税
            return $http.post('accountPosting/' + postingType);
          },
          checkout: function () {
            return $http.post('checkout/checkout');
          },
          getRollbackCheckout: function () {
            return $http.get('checkout/rollbackCheckout');
          },
          setRollbackCheckout: function (isrevoke) {
            return $http.post('checkout/rollbackCheckout?isrevoke=' + isrevoke);
          }
        },
        //account reports
        accountReport: {
          getList: function (year, month, type) {
            return $http.get('accountreport/' + year + '/' + month + '/' + type);
          },
          view: function (year, month, type, subType) {
            return $http.get('accountreport/' + year + '/' + month + '/' + type + '?accountReportSubType=' + subType);
          },
          generate: function (data) {
            return $http.post('accountreport/generate', data);
          },
          save: function (id, data) {
            return $http.patch('accountreport/' + id, data);
          },
          verify: function (data) {
            return $http.post('accountreport/verify', data);
          },
          lock: function (data) {
            return $http.post('accountreport/lock', data);
          },
          download: function (year, month, type) {
            //return $http.get('accountreport/download/' + id);
            return $http.get('accountreport/' + year + '/' + month + '/' + type);
          },
          get: function (id) {
            return $http.get('accountreport/' + id);
          }
        },
        // advance payment
        advancePayment: {
          create: function (data) {
            return $http.post('advancePayment', data);
          },
          update: function (id, data) {
            return $http.patch('advancePayment/' + id, data);
          },
          delete: function (id) {
            return $http.post('advancePayment/delete', {'ids': id});
          },
          getMaxId: function () {
            return $http.get('metamaxid?entityType=4');
          },
          get: function (id) {
            return $http.get('advancePayment/' + id);
          },
          approve: function (ids) {
            return api.approver.approve({
              'ids': ids,
              'action': 3,
              'entityType': 4
            });
          },
          submit: function (ids) {
            return api.approver.approve({
              ids: ids,
              action: 1,
              entityType: 4
            });
          },
          pay: function (data) {
            return $http.post('advancePayment/pay', data);
          }
        },
        // area
        area: {
          get: function (id) {
            if (id) {
              return $http.get('meta/area?parentId=' + id);
            } else {
              return $http.get('meta/area');
            }
          }
        },
        // approver
        approver: {
          approve: function (data) {
            var para = {
              'ids': _.isArray(data.ids) ? data.ids : [data.ids],
              'action': data.action, // 1:提交;3：审批通过；4、拒绝；注：3和4只有备用金和预付款才会有这两种动作
              'entityType': data.entityType, // 0:Bill,1:Invoice,2:Procurement,3:Travell
              'approvalReason': data.approvalReason
            };
            if (data.action == 1) {
              return $http.patch('approve/submit', para);
            }
            else {
              return $http.patch('approve/batch', para);
            }
          }
        },
        // attachment
        attachment: {
          create: function (files, data) {
            if (files && files.length) {
              var promises = [];
              for (var i = 0; i < files.length; i++) {
                var file = files[i];
                promises.push($upload.upload({
                  'url': 'attachment',
                  fields: {
                    'title': data.title,
                    'type': data.type,
                    'fkId': data.id
                  },
                  'file': file
                }));
              }

              return $q.all(promises);
            }
          },
          delete: function (id) {
            id = _.isArray(id) ? id : [id];
            return $http.post('attachment/batchdelete', {'ids': id});
          }
        },
        assistAccount: {
          getAssistCategories: function (companyId) {
            return $http.get('assistantaccountitemtype/allCategory/' + companyId);
            //return promise(mock.assistAccount.getAssistCategories());
          },
          getAssistantItemsByCategoryAndType: function (params) {
            return query('assistantaccountitem/Statistics', params);
          },
          saveCategory: function (params) {
            return $http.post('assistantaccountitemtype', params);
          },
          removeCategory: function (id) {
            return $http.delete('assistantaccountitemtype/' + id);
          },
          editCategoryType: function (typeId, params) {
            return $http.put('assistantaccountitemtype/' + typeId, params);
          },
          removeCategoryItems: function (typeId, ids) {
            return $http.post('assistantaccountitem/' + typeId + '/delete', ids);
          },
          createCategoryItem: function (typeId, params) {
            return $http.post('assistantaccountitem/' + typeId, params);
          },
          getCategoryItems: function (categoryId, params) {
            //return promise(mock.assistAccount.getCategoryItems(categoryId));
            return query('assistantaccountitem/' + categoryId, params);
          },
          reSendMail: function (destination) {
            return $http.get('account/invitation/resend?destination=' + destination);
          }
        },
        //accounting bank_reconciliations
        bankStatements: {
          getStatusList: function () {
            return promise(mock.bankStatements.getStatusList());
          },
          getList: function (params) {
            if (isMock) {
              return promise(mock.bankStatements.getList());
            } else {
              return query('paymentrecord/bankstatement', params);
            }
          },
          update: function (data) {
            return $http.put('paymentrecord/batchbankstatement', {'bankStatements': data});
          }
        },
        // balance sheet
        balanceSheet: {
          create: function (data) {
            return $http.post('balanceSheet', data);
          },
          update: function (id, data) {
            return $http.patch('balanceSheet/' + id, data);
          },
          get: function (params) {
            if (isMock) {
              return promise(mock.balanceSheet.get());
            } else {
              return $http.get('balanceSheet' + '/' + params.year + '/' + params.month);
            }
          }
        },
        //expense api
        expense: {
          getList: function (params) {
            return $http.get("expenseclaim/search?" + params);
          },
          getStatusEnum: function () {
            return promise(mock.expense.getStatusEnum());
          },
          getExpenseAccount: function (id) {
            return $http.get("expenseclaim/" + id);
          },
          approve: function (id) {
            return $http.post("expenseclaim/" + id + "/approve", {
              'id': id,
              'ApprovalType': 0
            });
          },
          forward: function (id, forwardTo) {
            return $http.post("expenseclaim/" + id + "/approve", {
              'id': id,
              'ApprovalType': 1,
              'ForwardTo': forwardTo
            });
          },
          reject: function (id, message) {
            return $http.post("expenseclaim/" + id + "/approve", {
              'id': id,
              'Message': message,
              'ApprovalType': 2
            });
          },
          getBankAccountCategoryList: function () {
            return $http.get('accountcategory/bankAccountCategory');
          },
          pay: function (id,data) {
            return $http.post("expenseclaim/" + id + "/paid", data);
          }
        },
        //receipt api
        receipt: {
          getList: function (params) {
            return $http.get("receipt/search?" + params);
          },
          getTypeList: function () {
            return $http.get("receipttype/search?pageIndex=1&pageSize=100");
          },
          getStatusEnum: function () {
            return promise(mock.receipt.getStatusEnum());
          },
          getReceipt: function (id) {
            return $http.get("receipt/" + id);
          }
        },
        // bill api
        bill: {
          create: function (data) {
            return $http.post('bill', data);
          },
          update: function (id, data) {
            return $http.patch('bill/' + id, data);
          },
          delete: function (id) {
            id = _.isArray(id) ? id : [id];
            return $http.post('bill/batchdelete', {'ids': id});
          },
          submit: function (ids) {
            return api.approver.approve({
              ids: ids,
              action: 1,
              entityType: 0
            });
          },
          getAgingStatusEnum: function () {
            return promise(mock.bill.getAgingStatusEnum());
          },
          getPurposeTypeEnum: function () {
            return promise(mock.bill.getPurposeTypeEnum());
          },
          getStatusEnum: function () {
            return promise(mock.bill.getStatusEnum());
          },
          getMaxId: function () {
            return $http.get('metamaxid?entityType=0');
          },
          get: function (id) {
            if (isMock) {
              return promise(mock.bill.get(id));
            } else {
              return $http.get('bill/' + id);
            }
          },
          getList: function (params) {
            if (isMock) {
              return promise(mock.bill.getList());
            } else {
              return query('bill', params);
            }
          }
        },
        // sales
        sales: {
          getList: function (params) {
            return query('salesOrder', params);
          },
          create: function (data) {
            return $http.post('salesOrder',data)
          },
          update: function (id, data){
            return $http.put('salesOrder', data);
          },
          delete: function (id) {
            id = _.isArray(id) ? id : [id];
            return $http.post('salesOrder/delete', id);
          },
          get: function (id) {
            return $http.get('salesOrder/' + id);
          },
          getStatusEnum: function () {
            return $http.get('salesOrder/state');
          }
        },
        // receivables
        receivables: {
          getList: function (params) {
            return query('receivable/search', params);
          },
          create: function (data) {
            return $http.post('receivable',data)
          },
          update: function (id, data){
            return $http.put('receivable', data);
          },
          delete: function (id) {
            id = _.isArray(id) ? id : [id];
            return $http.post('receivable/delete', id);
          },
          get: function (id) {
            return $http.get('receivable/' + id);
          },
          getStatusEnum: function () {
            return $http.get('receivable/state');
          }
        },
        // company
        company: {
          update: function (data) {
            return $http.patch('company/set/' + data.id, data);
          },
          get: function (id) {
            return $http.get('company/' + id);
          },
          modify: function (data) {
            return $http.patch('company/' + data.id, data);
          },
          enable: function (id) {
            return $http.get('company/enable/' + id);
          },
          getStatus: function (id) {
            return $http.get('company/status/' + id);
          },
          getAccountPeriod: function () {
            return $http.get('company/getAccountPeriod/');
          },
          getCategoryList: function () {
            if (isMock) {
              return promise(mock.company.getCategoryList());
            } else {
              return $http.get('companycategory');
            }
          },
          getAccountingPeriod: function (companyId) {
            return $http.get('company/allAccountingPeriod/' + companyId);
          },
          addNewCompany: function (newCompanyName) {
            return $http.post('company?name=' + newCompanyName);
          },
          getSampleCompany: function (companyId) {
            return $http.get('company/skip/' + companyId);
          }
        },
        // contact
        contact: {
          create: function (data) {
            return $http.post('contact', data);
          },
          update: function (id, data) {
            return $http.patch('contact/' + id, data);
          },
          delete: function (id) {
            id = _.isArray(id) ? id : [id];
            return $http.post('contact/batchdelete', {'ids': id});
          },
          get: function (id) {
            return $http.get('contact/' + id);
          },
          getRoleEnum: function () {
            return promise(mock.contact.getRoleEnum());
          },
          getList: function (params) {
            if (isMock) {
              return promise(mock.contact.getList());
            } else {
              return query('contact', params);
            }
          },
          getAllList: function () {
            if (isMock) {
              return promise(mock.contact.getAllList());
            } else {
              return $http.get('contact/nopaging');
            }
          },
          getAllClient: function () {
            return $http.get('contact/nopaging?contactType=0');
          },
          getAllSupplier: function () {
            return $http.get('contact/nopaging?contactType=1');
          }
        },
        // date
        date: {
          getYearList: function () {
            return promise(mock.date.getYearList());
          },
          getMonthList: function () {
            return promise(mock.date.getMonthList());
          }
        },
        dashboard: {
          getBarChart: function (params) {
            return query('dashbord/barchart', params);
          },
          getPieChart: function (params) {
            return query('dashbord/piechart', params);
          },
          getPieChartAssistant: function (params) {
            return query('dashbord/piechart/assistant', params);
          }
        },
        // deal
        deal: {
          update: function (data) {
            return $http.put('paymentrecord/batch', {
              'paymentType': 0,
              'paymentRecords': data
            });
          },
          getList: function (params) {
            if (isMock) {
              return promise(mock.deal.getList());
            } else {
              params.paymentType = 0;
              return query('paymentrecord/GetPageResult', params);
            }
          }
        },
        department: {
          create: function (data) {
            return $http.post('department', data);
          },
          update: function (id, data) {
            return $http.put('department/' + id, data);
          },
          delete: function (ids) {
            return $http.post('department/delete', ids);
          },
          get: function (id) {
            return $http.get('department/' + id);
          },
          getList: function (params) {
            return query('department/all', params);
          },
          getListByPage: function (params) {
            return query('department', params);
          }
        },
        //service category
        serviceCategory:{
          create: function (data) {
            return $http.post('inventory/servicecategory', data);
          },
          update: function (data) {
            return $http.put('inventory/servicecategory', data);
          //  return $http.patch('inventory/servicecategory', data);
          },
          delete: function (ids) {
            return $http.post('inventory/servicecategory/delete', ids);
          },
          get: function (id) {
            return $http.get('inventory/servicecategory/' + id);
          },
          getList: function (params) {
            return query('inventory/servicecategory/search', params);
          },
          getListByPage: function (params) {
            return query('inventory/servicecategory', params);
          }
        },
        detailAccount: {
          getAccountTypes: function () {
            return promise(mock.detailAccount.getAccountTypes());
          },
          getList: function (params) {
            return query('detailAccount/getDetailAccount', params);
          }
        },
        //expenseAccountSetting
        expenseAccountSetting: {
          update: function (data) {
            return $http.put('receipttypemapping', data);
          },
          getSettingList: function (data) {
            return $http.get('receipttypemapping/search/' + data);
            //return promise(mock.expenseAccountSetting.getSettingList());
          },
          getAccountingCategoryList: function () {
            return $http.get('accountcategory/expenseClaimSettingCategory');
            //return promise(mock.expenseAccountSetting.getAccountingCategoryList());
          },
          getIconList: function () {
            return promise(mock.expenseAccountSetting.getIconList());
          }
        },
        // fixed asset
        fixedAsset: {
          update: function (data) {
            if (isMock) {
              return promise(mock.fixedAsset.update());
            } else {
              return $http.post('purchaseOrderClassification/batch', data);
            }
          },
          getList: function (params) {
            if (isMock) {
              return promise(mock.fixedAsset.getList());
            } else {
              return query('purchaseOrderClassification?isqueryFixedAssets=true', params);
            }
          }
        },
        // inventoryItem
        inventoryItem: {
          create: function (data) {
            return $http.post('inventoryitem', data);
          },
          update: function (id, data) {
            return $http.patch('inventoryitem/' + id, data);
          },
          delete: function (id) {
            id = _.isArray(id) ? id : [id];
            return $http.post('inventoryitem/batchdelete', {'ids': id});
          },
          get: function (id) {
            return $http.get('inventoryitem/' + id);
          },
          getTypeEnum: function () {
            return promise(mock.inventoryItem.getTypeEnum());
          },
          getList: function (params) {
            if (isMock) {
              return promise(mock.inventoryItem.getList());
            } else {
              return query('inventoryitem', params);
            }
          },
          getAllList: function (purpose) {
            if (isMock) {
              return promise(mock.inventoryItem.getAllList());
            } else {
              return query('inventoryitem/nopaging', {'purpose': purpose});
            }
          }
        },
        // invoice api
        invoice: {
          create: function (data) {
            return $http.post('invoice', data);
          },
          update: function (id, data) {
            return $http.patch('invoice/' + id, data);
          },
          delete: function (id) {
            id = _.isArray(id) ? id : [id];
            return $http.post('invoice/batchdelete', {'ids': id});
          },
          submit: function (ids) {
            return api.approver.approve({
              ids: ids,
              action: 1,
              entityType: 1
            });
          },
          // get bill/invoice status
          getStatusEnum: function () {
            return promise(mock.invoice.getStatusEnum());
          },
          getMaxId: function () {
            return $http.get('metamaxid?entityType=1');
          },
          get: function (id) {
            if (isMock) {
              return promise(mock.invoice.get(id));
            } else {
              return $http.get('invoice/' + id);
            }
          },
          getList: function (params) {
            if (isMock) {
              return promise(mock.invoice.getList());
            } else {
              return query('invoice', params);
            }
          }
        },
        // pettyCash
        pettyCash: {
          create: function (data) {
            return $http.post('pettycash', data);
          },
          update: function (id, data) {
            return $http.patch('pettycash/' + id, data);
          },
          delete: function (id) {
            return $http.post('pettycash/delete', {'ids': id});
          },
          get: function (id) {
            return $http.get('pettycash/' + id);
          },
          getEntityTypes: function () {
            return promise(mock.pettyCash.getEntityTypes());
          },
          getMaxId: function () {
            return $http.get('metamaxid?entityType=3');
          },
          approve: function (ids) {
            return api.approver.approve({
              'ids': ids,
              'action': 3,
              'entityType': 3
            });
          },
          submit: function (ids) {
            return api.approver.approve({
              ids: ids,
              action: 1,
              entityType: 3
            });
          },
          getBankAccountCategoryList: function () {
            return $http.get('accountcategory/bankAccountCategory');
          },
          pay: function (data) {
            return $http.post('pettycash/pay', data);
          }
        },
        //purchase order classification
        purchaseOrderClassification: {
          update: function (data) {
            return $http.patch('purchaseOrderClassification/batch', data);
          },
          getOptions: function () {
            return $http.get('purchase/options');
          },
          getDepreciationList: function () {
            return promise(mock.purchaseOrderClassification.getDepreciationList());
          },
          // 折旧方法:1、直线；2、产量
          getDepreciationMethodTypeEnum: function () {
            return promise(mock.purchaseOrderClassification.getDepreciationMethodTypeEnum());
          },
          getList: function (params) {
            if (isMock) {
              return promise(mock.purchaseOrderClassification.getList());
            } else {
              return query('purchaseOrderClassification', params);
            }
          }
        },
        //cashier pay
        cashierPay: {
          getEntityTypeEnum: function () {
            return promise(mock.cashierPay.getEntityTypeEnum());
          },
          getList: function (params) {
            return query('todolist/paymentlist', params);
          }
        },
        // receivable
        receivable: {
          update: function (data) {
            return $http.put('paymentrecord/batch', {
              'paymentType': 1,
              'paymentRecords': data
            });
          },
          getList: function (params) {
            if (isMock) {
              return promise(mock.receivable.getList());
            } else {
              params.paymentType = 1;
              return query('paymentrecord/GetPageResult', params);
            }
          }
        },
        // reimbursement
        reimbursement: {
          create: function (data) {
            return $http.post('reimbursement', data);
          },
          update: function (id, data) {
            return $http.patch('reimbursement/' + id, data);
          },
          delete: function (id) {
            id = _.isArray(id) ? id : [id];
            return $http.post('reimbursement/batchdelete', {'ids': id});
          },
          getMaxId: function () {
            return $http.get('metamaxid?entityType=2');
          },
          get: function (id) {
            if (isMock) {
              return promise(mock.invoice.get(id));
            } else {
              return $http.get('reimbursement/' + id);
            }
          },
          getList: function (params) {
            if (isMock) {
              return promise(mock.reimbursement.getList());
            } else {
              return query('reimbursement', params);
            }
          }
        },
        // taxrate
        taxRate: {
          create: function (data) {
            return $http.post('taxrate', data);
          },
          update: function (id, data) {
            return $http.patch('taxrate/' + id, data);
          },
          delete: function (id) {
            id = _.isArray(id) ? id : [id];
            return $http.post('taxrate/batchdelete', {'ids': id});
          },
          getList: function () {
            if (isMock) {
              return promise(mock.taxRate.getList());
            } else {
              return $http.get('taxrate/nopaging');
            }
          },
          getAllList: function () {
            if (isMock) {
              return promise(mock.taxRate.getAllList());
            } else {
              return $http.get('taxrate/nopaging');
            }
          }
        },
        // todolist
        todoList: {
          getList: function (type) {
            if (isMock) {
              return promise(mock.todoList.getList());
            } else {
              return query('todolist', {'todoListTypes': type});
            }
          },
          getApplyList: function (params) {
            return query('todolist/list', params);
          },
          getAllList: function () {
            return $http.get('todolist/todo');
          }
        },
        // settings
        settings: {
          prerequisite: function (entityType) {
            return $http.get('setting/prerequisite?entityType=' + entityType);
          }
        },
        // voucher
        voucher: {
          // get info for creation
          getCreationInfo: function (id) {
            if (id) {
              return $http.get('accountvoucher/create?id=' + id, voucherHeaders);
            } else {
              return $http.get('accountvoucher/create?id=', voucherHeaders);
            }
          },
          //reorder
          reorder: function (params) {
            return queryPost('accountvoucher/updatesequence', params, null, voucherHeaders);
          },
          // create
          create: function (isReplace, data) {
            return $http.post('accountvoucher?isreplace=' + isReplace, data, voucherHeaders);
          },
          // update
          update: function (id, data) {
            return $http.patch('accountvoucher/' + id, data, voucherHeaders);
          },
          delete: function (id) {
            id = _.isArray(id) ? id : [id];
            return $http.post('accountvoucher/batchdelete', {'ids': id}, voucherHeaders);
          },
          approveDeny: function (id, reason) {
            return $http.patch('accountvoucher/denied', {
              'id': id,
              'approvalReason': reason
            }, voucherHeaders);
          },
          approveConfirm: function (data) {
            return $http.patch('accountvoucher/confirm', data, voucherHeaders);
          },
          // get
          get: function (id) {
            if (isMock) {
              return promise(mock.voucher.get());
            } else {
              return $http.get('accountvoucher/' + id, voucherHeaders);
            }
          },
          getMaxId: function () {
            return $http.get('metamaxid?entityType=3');
          },
          // sterilize
          sterilize: function (id) {
            return $http.post('accountvoucher/batchsterilize', {
              'ids': _.isArray(id) ? id : [id]
            }, voucherHeaders);
          },
          // account
          account: function (id) {
            return $http.post('accountvoucher/Tally', {
              'ids': _.isArray(id) ? id : [id]
            }, voucherHeaders);
          },
          // rollback account
          rollbackAccount: function (id) {
            return $http.post('accountvoucher/rollbackTally', {
              'ids': _.isArray(id) ? id : [id]
            });
          },
          // audit
          audit: function (id) {
            return $http.post('accountvoucher/Audit', {
              'ids': _.isArray(id) ? id : [id]
            }, voucherHeaders);
          },
          // rollback audit
          rollbackAudit: function (id) {
            return $http.post('accountvoucher/rollbackAudit', {
              'ids': _.isArray(id) ? id : [id]
            });
          },
          // get list
          getList: function (params) {
            if (isMock) {
              return promise(mock.voucher.getList());
            } else {
              return query('accountvoucher', params, voucherHeaders);
            }
          }
        }
      };

      return api;
    }]);
