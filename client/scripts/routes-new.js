'use strict';

angular.module('concordyaApp')
  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/dashboard');

    $stateProvider
            .state('index', {
              url: '/dashboard',
              templateUrl: 'views/home.html',
              controller: 'HomeCtrl'
            })
            .state('error', {
              url: '/error/:type',
              templateUrl: 'views/error.html',
              controller: 'ErrorCtrl'
            })
            .state('error_', {
              url: '/error',
              templateUrl: 'views/error.html',
              controller: 'ErrorCtrl'
            })
            // initialize
            .state('setup/choice_entrance', {
              url: '/setup/choice_entrance',
              templateUrl: 'views/initialize/choice_entrance_new.html',
              controller: 'ChoiceEntranceCtrl'
            })
            .state('setup/setting_company', {
              url: '/setup/setting_company',
              templateUrl: 'views/initialize/setting_company_new.html',
              controller: 'SettingCompanyCtrl'
            })
            .state('setup/setting_category', {
              url: '/setup/setting_category',
              templateUrl: 'views/initialize/setting_category_new.html',
              controller: 'SettingCategoryCtrl'
            })
            .state('setup/setting_category_balance', {
              url: '/setup/setting_category_balance',
              templateUrl: 'views/initialize/setting_category_balance_new.html',
              controller: 'SettingCategoryBalanceCtrl'
            })
            .state('setup/setting_finish', {
              url: '/setup/setting_finish',
              templateUrl: 'views/initialize/setting_finish_new.html',
              controller: 'SettingFinishCtrl'
            })
            // account
            .state('account/accept_invitation', {
              url: '/account/accept_invitation?userid&token',
              templateUrl: 'views/account/accept_invitation.html',
              controller: 'AcceptInvitationCtrl'
            })
            .state('account/account_setting', {
              url: '/account/account_setting',
              templateUrl: 'views/account/account_setting_new.html',
              controller: 'AccountSettingCtrl'
            })
            .state('account/profile', {
              url: '/account/profile',
              templateUrl: 'views/account/profile_new.html',
              controller: 'ProfileCtrl'
            })
            .state('account/reset_password', {
              url: '/account/reset_password?userid&token',
              templateUrl: 'views/account/reset_password.html',
              controller: 'ResetPasswordCtrl'
            })
            .state('account/valid_email', {
              url: '/account/valid-email?userid&token',
              templateUrl: 'views/account/valid_email.html',
              controller: 'ValidEmailCtrl'
            })
            // business_manage
            .state('business/sales_list', {
              url: '/business/sales_list',
              templateUrl: 'views/business_manage/sales_list.html',
              controller: 'SalesListCtrl'
            })
            .state('business/sales', {
              url: '/business/sales/:id',
              templateUrl: 'views/business_manage/sales.html',
              controller: 'SalesCtrl'
            })
            .state('business/receivables', {
              url: '/business/receivables',
              templateUrl: 'views/business_manage/receivables.html',
              controller: 'ReceivablesCtrl'
            })
            .state('business/receivables_list', {
              url: '/business/receivables_list',
              templateUrl: 'views/business_manage/receivables_list.html',
              controller: 'ReceivablesListCtrl'
            })
            .state('business/bill', {
              url: '/business/bill/:id',
              templateUrl: 'views/business_manage/bill.html',
              controller: 'BillCtrl'
            })
            .state('business/bills', {
              url: '/business/bills',
              templateUrl: 'views/business_manage/bill_list.html',
              controller: 'BillListCtrl'
            })
            .state('business/invoice', {
              url: '/business/invoice/:id',
              templateUrl: 'views/business_manage/invoice.html',
              controller: 'InvoiceCtrl'
            })
            .state('business/invoices', {
              url: '/business/invoices',
              templateUrl: 'views/business_manage/invoice_list.html',
              controller: 'InvoiceListCtrl'
            })
            .state('business/petty_cashs', {
              url: '/business/petty_cashs',
              templateUrl: 'views/business_manage/petty_cash_list_new.html',
              controller: 'PettyCashListCtrl',
              params: {isshow : false,message:null}
            })
            .state('business/petty_cash', {
              url: '/business/petty_cash/:id',
              templateUrl: 'views/business_manage/petty_cash_new.html',
              controller: 'PettyCashCtrl'
            })
            .state('business/advance_payment', {
              url: '/business/advance_payment/:id',
              templateUrl: 'views/business_manage/advance_payment_new.html',
              controller: 'AdvancePaymentCtrl'
            })
            .state('business/expense_accounts', {
              url: '/business/expense_accounts',
              templateUrl: 'views/business_manage/expense_account_list_new.html',
              controller: 'ExpenseAccountListCtrl'
            })
            .state('business/expense_account', {
              url: '/business/expense_account/:id',
              templateUrl: 'views/business_manage/expense_account_new.html',
              controller: 'ExpenseAccountCtrl'
            })
            .state('business/receipt', {
              url: '/business/receipt/:id',
              templateUrl: 'views/business_manage/receipt_new.html',
              controller: 'ReceiptCtrl'
            })
            // financial_manage
            .state('finance/cashier_pay', {
              url: '/finance/cashier_pay',
              templateUrl: 'views/financial_manage/cashier_pay_new.html',
              controller: 'CashierPayCtrl',
              params: {pay : null}
            })
            .state('finance/assistant_account', {
                url: '/finance/assistant_account',
                templateUrl: 'views/financial_manage/assistant_account_new.html',
                controller: 'AssistantAccountCtrl',
                params: {
                    accountCategory: null,
                    year: null,
                    month: null,
                    assistantAccountType: null,
                    currentHappenDisabled: null,
                    yearTotalDisabled: null,
                    currentHappen: null,
                    yearTotal: null
              }
            })
            .state('finance/account_posting', {
              url: '/finance/account_posting',
              templateUrl: 'views/financial_manage/account_posting_new.html',
              controller: 'AccountPostingCtrl'
            })
            .state('finance/bank_reconciliations', {
              url: '/finance/bank_reconciliations',
              templateUrl: 'views/financial_manage/bank_reconciliations.html',
              controller: 'BankReconciliationsCtrl'
            })
            .state('finance/category', {
              url: '/finance/category',
              templateUrl: 'views/financial_manage/category_new.html',
              controller: 'CategoryCtrl',
              params: {
                year: null,
                month: null
              }
            })
            .state('finance/detail_account', {
              url: '/finance/detail_account',
              templateUrl: 'views/financial_manage/detail_account_new.html',
              controller: 'DetailAccountCtrl',
              params: {'id': null}
            })
            .state('finance/checkout', {
              url: '/finance/checkout',
              templateUrl: 'views/financial_manage/checkout_new.html',
              controller: 'CheckoutCtrl'
            })
            .state('finance/deal', {
              url: '/finance/deal',
              templateUrl: 'views/financial_manage/deal.html',
              controller: 'DealCtrl'
            })
            .state('finance/fixed_asset', {
              url: '/finance/fixed_asset',
              templateUrl: 'views/financial_manage/fixed_asset.html',
              controller: 'FixedAssetCtrl'
            })
            .state('finance/purchase_order_classification', {
              url: '/finance/purchase_order_classification',
              templateUrl: 'views/financial_manage/purchase_order_classification.html',
              controller: 'PurchaseOrderClassificationCtrl'
            })
            .state('finance/receivable', {
              url: '/finance/receivable',
              templateUrl: 'views/financial_manage/receivable.html',
              controller: 'ReceivableCtrl'
            })
            .state('finance/voucher', {
              url: '/finance/voucher/:id',
              templateUrl: 'views/financial_manage/voucher_new.html',
              controller: 'VoucherCtrl',
              params: {id: null, categoryId: null ,isReplace: null, createdOn: null}
            })
            .state('finance/vouchers', {
              url: '/finance/vouchers',
              templateUrl: 'views/financial_manage/voucher_list_new.html',
              controller: 'VoucherListCtrl'
            })
            // reports
            .state('reports/accoundant', {
              url: '/reports/accoundant',
              templateUrl: 'views/reports/accoundant_new.html',
              controller: 'ReportAccoundantCtrl'
            })
            .state('reports/financial', {
              url: '/reports/financial',
              templateUrl: 'views/reports/financial_new.html',
              controller: 'ReportFinancialCtrl'
            })
            .state('reports/asset_liability', {
              url: '/reports/asset_liability/:id',
              templateUrl: 'views/reports/asset_liability.html',
              controller: 'ReportAssetLiabilityCtrl'
            })
            .state('reports/cash_flow', {
              url: '/reports/cash_flow/:id',
              templateUrl: 'views/reports/cash_flow.html',
              controller: 'ReportCashFlowCtrl'
            })
            .state('reports/profit', {
              url: '/reports/profit/:id',
              templateUrl: 'views/reports/profit.html',
              controller: 'ReportProfitCtrl'
            })
            // basic_setting
            .state('settings/account_list', {
              url: '/settings/account_list',
              templateUrl: 'views/basic_setting/account_list_new.html',
              controller: 'AccountListCtrl'
            })
            .state('settings/assist_account', {
              url: '/settings/assist_account',
              templateUrl: 'views/basic_setting/assist_account_new.html',
              controller: 'AssistAccountCtrl'
            })
            .state('settings/expense_account_setting', {
              url: '/settings/expense_account_setting',
              templateUrl: 'views/basic_setting/expense_account_setting_new.html',
              controller: 'ExpenseAccountSettingCtrl'
            })
            .state('settings/company', {
              url: '/settings/company',
              templateUrl: 'views/basic_setting/company_new.html',
              controller: 'CompanyCtrl'
            })
            .state('settings/department', {
              url: '/settings/department',
              templateUrl: 'views/basic_setting/department_new.html',
              controller: 'DepartmentCtrl'
            })
            .state('settings/contact', {
              url: '/settings/contact',
              templateUrl: 'views/basic_setting/contact_new.html',
              controller: 'ContactCtrl'
            })
            .state('settings/category_maintenance', {
              url: '/settings/category_maintenance',
              templateUrl: 'views/basic_setting/category-maintenance.html',
              controller: 'CategoryMaintenanceCtrl'
            })
            .state('settings/inventory', {
              url: '/settings/inventory',
              templateUrl: 'views/basic_setting/inventory_new.html',
              controller: 'InventoryCtrl'
            })
            .state('settings/service-category',{
              url:  '/settings/service-category',
              templateUrl:  'views/basic_setting/service-category.html',
              controller: 'ServiceCategoryCtrl'
            })
            ;
        }]);
