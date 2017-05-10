'use strict';

angular.module('concordyaApp')
  .factory('AuthorityService', ['$window', '$translate', '$state', function($window, $translate, $state) {
    function notPermission() {
      $state.go('error', {
        type: 2
      });
    }

    return {
      // check if is user
      isUser: function(roles) {
        return roles && roles.indexOf('0') !== -1;
      },
      // check if is accoundant
      isAccoundant: function(roles) {
        return roles && roles.indexOf('1') !== -1;
      },
      // check if is cashier
      isCashier: function(roles) {
        return roles && roles.indexOf('2') !== -1;
      },
      // check if is admin
      isAdmin: function(roles) {
        return roles && roles.indexOf('3') !== -1;
      },
      // check if is manager
      isManager: function(roles) {
        return roles && roles.indexOf('4') !== -1;
      },
      // check if is departmenter
      isDepartmentManager: function(roles) {
        return roles && roles.indexOf('5') !== -1;
      },
      // check if is accounter
      isFinancialManager: function(roles) {
        return roles && roles.indexOf('6') !== -1;
      },
      // check user if has permission go to current url
      checkUrlPermission: function(currentUser, stateName) {
        // first check current-user,
        // if user doesn't login, and the state-name doesn't included in ignoreLoginUrl
        // redirect to login page
        if (!currentUser) {
          $window.location.href = '/login';
        } else {
          var isUser = currentUser.isUser,
            isAccoundant = currentUser.isAccoundant,
            isCashier = currentUser.isCashier,
            isManager = currentUser.isManager,
            isFinancialManager = currentUser.isFinancialManager;

          // first check system-enable and system-guide
          if (!currentUser.systemEnable) {
            if (isAccoundant) {
              var url = '';
              switch (currentUser.systemGuide) {
                case null:
                case 0:
                  url = 'setup/choice_entrance';
                  break;
                case 1:
                  url = 'setup/setting_company';
                  break;
                case 2:
                  url = 'setup/setting_category';
                  break;
                case 3:
                  url = 'setup/setting_category_balance';
                  break;
                case 4:
                  url = 'setup/setting_finish';
                  break;
              }
              $state.go(url);
            } else {
              $state.go('error', {
                type: 1
              });
            }
          } else {
            switch (stateName) {
              // **** initialize pages ****
              case 'setup/choice_entrance':
              case 'setup/setting_company':
              case 'setup/setting_category':
              case 'setup/setting_category_balance':
              case 'setup/setting_finish':
                if (!isAccoundant && !isCashier && !isManager) {
                  notPermission();
                }
                break;
                // **** basic setting ****
              case 'finance/category':
                if (!isUser && !isAccoundant && !isCashier && !isManager) {
                  notPermission();
                }
                break;
                // **** business ****

                // **** finance ****
                // purchase order
              case 'finance/purchase_order_classification':
                if (!isAccoundant) {
                  notPermission();
                }
                break;
                // voucher
              case 'finance/vouchers':
              case 'finance/voucher':
                if (!isAccoundant && !isCashier && !isFinancialManager) {
                  notPermission();
                }
                break;
            }
          }
        }
      },

      getUserModules: function(currentUser) {
        var modules = {
            'businessManage': {
              'billList': {
                name: 'BUSINESS_MANAGE__BILL_LIST',
                url: 'business/bills'
              },
              'invoiceList': {
                name: 'BUSINESS_MANAGE__INVOICE_LIST',
                url: 'business/invoices'
              },
              'salesList': {
                name: 'BUSINESS_MANAGE__SALES_LIST',
                url: 'business/sales_list'
              },
              'receivablesList': {
                name: 'BUSINESS_MANAGE__RECEIVABLES_LIST',
                url: 'business/receivables_list'
              },
              'pettyCashList': {
                name: 'BUSINESS_MANAGE__PETTY_CASH_LIST',
                url: 'business/petty_cashs'
              },
              'expenseAccount': {
                name: 'BUSINESS_MANAGE__EXPENSE_ACCOUNT',
                url: 'business/expense_accounts'
              }
            },
            'financialManage': {
              'purchaseOrderClassification': {
                name: 'FINANCIAL_MANAGE__PURCHASE_ORDER_CLASSIFICATION',
                url: 'finance/purchase_order_classification'
              },
              'cashierPay': {
                name: 'FINANCIAL_MANAGE__CASHIER_PAY',
                url: 'finance/cashier_pay'
              },
              'voucherList': {
                name: 'FINANCIAL_MANAGE__VOUCHER_LIST',
                url: 'finance/vouchers'
              },
              'category': {
                name: 'FINANCIAL_MANAGE__CATEGORY',
                url: 'finance/category'
              },
              'detailAccount': {
                name: 'FINANCIAL_MANAGE__DETAIL_ACCOUNT',
                url: 'finance/detail_account'
              },
              'assistantAccount': {
                name: 'FINANCIAL_MANAGE__ASSISTANT_ACCOUNT',
                url: 'finance/assistant_account'
              },
              'accountPosting': {
                name: 'FINANCIAL_MANAGE__ACCOUNT_POSTING',
                url: 'finance/account_posting'
              },
              'checkout': {
                name: 'FINANCIAL_MANAGE__CHECKOUT',
                url: 'finance/checkout'
              },
              'bankReconciliations': {
                name: 'FINANCIAL_MANAGE__BANK_RECONCILIATIONS',
                url: 'finance/bank_reconciliations'
              },
              'deal': {
                name: 'FINANCIAL_MANAGE__DEAL',
                url: 'finance/deal'
              },
              'fixedAsset': {
                name: 'FINANCIAL_MANAGE__FIXED_ASSET',
                url: 'finance/fixed_asset'
              },
              'receivable': {
                name: 'FINANCIAL_MANAGE__RECEIVABLE',
                url: 'finance/receivable'
              }
            },
            'reports': {
              'accoundant': {
                name: 'REPORTS__ACCOUNDANT',
                url: 'reports/accoundant'
              },
              'financial': {
                name: 'REPORTS__FINANCIAL',
                url: 'reports/financial'
              },
              'asset_liability': {
                name: 'REPORTS__ASSET_LIABILITY',
                url: 'reports/asset_liability'
              },
              'cash_flow': {
                name: 'REPORTS__CASH_FLOW',
                url: 'reports/cash_flow'
              },
              'profit': {
                name: 'REPORTS__PROFIT',
                url: 'reports/profit'
              }
            },
            'basicSetting': {
              'company': {
                name: 'BASIC_SETTING__COMPANY',
                url: 'settings/company'
              },
              'department': {
                name: 'BASIC_SETTING__DEPARTMENT',
                url: 'settings/department'
              },
              'contact': {
                name: 'BASIC_SETTING__CONTACT',
                url: 'settings/contact'
              },
              'inventory': {
                name: 'BASIC_SETTING__INVENTORY',
                url: 'settings/inventory'
              },
              'accountList': {
                name: 'BASIC_SETTING__ACCOUNT_MANAGE',
                url: 'settings/account_list'
              },
              'assistAccount': {
                name: 'BASIC_SETTING__ASSIST_ACCOUNT',
                url: 'settings/assist_account'
              },
              'expenseAccountSetting': {
                name: 'BASIC_SETTING__EXPENSE_ACCOUNT_SETTING',
                url: 'settings/expense_account_setting'
              },
              'taxRate': {
                name: 'BASIC_SETTING__TAX_RATE',
                url: 'settings/tax_rate'
              },
              'category_maintenance': {
                name: 'BASIC_SETTING__CATEGORY_MAINTENANCE',
                url: 'settings/category_maintenance'
              },
              'servicecategory':{
                name: 'BASIC_SETTING_SERVICE_CATEGORY',
                url:  'settings/service-category'
              }
            }
          },
          moduleList = [{
            name: 'HEADER.HOME_PAGE',
            icon: 'fa fa-home fa-lg',
            menuList: null
          }];

        // add BUSINESS_MANAGE menu
        var businessManageMenu = [];
        businessManageMenu.push(modules.businessManage.billList);
        businessManageMenu.push(modules.businessManage.salesList);
        businessManageMenu.push(modules.businessManage.receivablesList);
        if (currentUser.isUser || currentUser.isFinancialManager || currentUser.isDepartmentManager || currentUser.isManager) {
          businessManageMenu.push(modules.businessManage.pettyCashList);
        }
        if (currentUser.isUser || currentUser.isAccoundant || currentUser.isCashier || currentUser.isFinancialManager || currentUser.isDepartmentManager || currentUser.isManager) {
          businessManageMenu.push(modules.businessManage.expenseAccount);
        }
        if (businessManageMenu.length > 0) {
          moduleList.push({
            name: 'BUSINESS_MANAGE',
            icon: 'fa fa-bank fa-fw',
            menuList: businessManageMenu
          });
        }

        // add FINANCIAL_MANAGE menu
        var financialManageMenu = [];
        if (currentUser.isCashier) {
          financialManageMenu.push(modules.financialManage.cashierPay);
        }
        if (currentUser.isCashier || currentUser.isAccoundant || currentUser.isFinancialManager) {
          financialManageMenu.push(modules.financialManage.voucherList);
        }
        if (currentUser.isFinancialManager || currentUser.isAccoundant || currentUser.isCashier || currentUser.isManager) {
          financialManageMenu.push(modules.financialManage.category);
          financialManageMenu.push(modules.financialManage.detailAccount);
          financialManageMenu.push(modules.financialManage.assistantAccount);
        }
        if (currentUser.isAccoundant || currentUser.isFinancialManager) {
          financialManageMenu.push(modules.financialManage.accountPosting);
          financialManageMenu.push(modules.financialManage.checkout);
        }
        if (financialManageMenu.length > 0) {
          moduleList.push({
            name: 'FINANCIAL_MANAGE',
            icon: 'fa fa-industry fa-fw',
            menuList: financialManageMenu
          });
        }

        // add reports menu
        var reportsMenu = [];
        if (currentUser.isAccoundant || currentUser.isCashier || currentUser.isFinancialManager || currentUser.isManager) {
          reportsMenu.push(modules.reports.accoundant);
        }
        if (currentUser.isAccoundant || currentUser.isFinancialManager || currentUser.isDepartmentManager || currentUser.isManager) {
          reportsMenu.push(modules.reports.financial);
        }
        if (reportsMenu.length > 0) {
          moduleList.push({
            name: 'REPORTS',
            icon: 'fa fa-bar-chart fa-fw',
            menuList: reportsMenu
          });
        }

        // add settings menu
        var basicSettingMenus = [];
        basicSettingMenus.push(modules.basicSetting.company);
        basicSettingMenus.push(modules.basicSetting.department);
        basicSettingMenus.push(modules.basicSetting.accountList);
        basicSettingMenus.push(modules.basicSetting.assistAccount);
        if (currentUser.isFinancialManager || currentUser.isAccoundant || currentUser.isCashier || currentUser.isManager) {
          basicSettingMenus.push(modules.basicSetting.category_maintenance);
        }
        basicSettingMenus.push(modules.basicSetting.expenseAccountSetting);
        basicSettingMenus.push(modules.basicSetting.contact);
          //basicSettingMenus.push(modules.basicSetting.inventory);
          basicSettingMenus.push(modules.basicSetting.servicecategory);

        if (basicSettingMenus.length > 0) {
          moduleList.push({
            name: 'BASIC_SETTING',
            icon: 'fa fa-gear fa-fw',
            menuList: basicSettingMenus
          });
        }

        return moduleList;
      },
      // get display name by role
      getRoleDisplayName: function(roles) {
        var self = this,
          displayName = '';
        if (self.isUser(roles)) {
          displayName = $translate.instant('COMMON.ROLE_USER') + ',';
        }
        if (self.isAccoundant(roles)) {
          displayName += $translate.instant('COMMON.ROLE_ACCOUNDANT') + ',';
        }
        if (self.isCashier(roles)) {
          displayName += $translate.instant('COMMON.ROLE_CASHIER') + ',';
        }
        if (self.isAdmin(roles)) {
          displayName += $translate.instant('COMMON.ROLE_ADMIN') + ',';
        }
        if (self.isManager(roles)) {
          displayName += $translate.instant('COMMON.ROLE_MANAGER') + ',';
        }
        if (self.isDepartmentManager(roles)) {
          displayName += $translate.instant('COMMON.ROLE_DEPARTMENT__MANAGER') + ',';
        }
        if (self.isFinancialManager(roles)) {
          displayName += $translate.instant('COMMON.ROLE_FINANCIAL__MANAGER') + ',';
        }

        return displayName.substr(0, displayName.length - 1);
      }
    };
  }]);
