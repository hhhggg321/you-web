'use strict';

angular.module('concordyaApp')
        .controller('HeaderCtrl', ['$rootScope', '$scope', '$interval', '$state', '$translate', '$translatePartialLoader', 'tmhDynamicLocale', 'TranslateService', 'AuthorityService', 'StorageService', 'WidgetService', 'APIService', 'ModalBoxService','$timeout',
          function ($rootScope, $scope, $interval, $state, $translate, $translatePartialLoader, tmhDynamicLocale, translateService, authority, storage, widget, api, modalBox,$timeout) {
            $translatePartialLoader.addPart('header');
            //get companies
            function refreshCompanyList(){
              api.account.getCompanies()
                .success(function (data) {
                  _.forEach(data,function(item){
                    if(item.isExperience){
                      item.name = "样本公司："+item.name;
                    }
                  });
                  $scope.companies = data;
                });
            }

            function represhCurrentUser(currentUser) {
              if (currentUser && currentUser.currentCompanyId) {
                api.company.get(currentUser.currentCompanyId)
                        .success(function (data) {
                          if(data.isExperience){
                            $rootScope.currentCompanyName = "样本公司：" + data.name;
                          }else{
                            $rootScope.currentCompanyName = data.name;
                          }
                          $scope.$safeApply();
                        });
              }
              refreshCompanyList();
              // check if company has initialized, and user also has roles
              var roles = currentUser && currentUser.systemEnable && currentUser.roles || null;
              $scope.moduleList = roles ? authority.getModulesByRole(roles) : [];
            }
            //after login
            var currentUser = storage.getCurrentUser();
            if (currentUser){
              represhCurrentUser($rootScope.currentUser);
            }
            // watch : change if switch company
            $rootScope.$on('currentUserChanged', function (event, val) {
              if (val) {
                represhCurrentUser(val);
              }
            });

            // change current-location when $state changed
            $rootScope.$on('$stateChangeSuccess', function (event, toState) {
              $scope.displayUser = false;

              var url = toState.name.split('/');
              var MAIN_URL, SUB_URL;
              $scope.subMenuList = [];
              $scope.currentLocation = '';

              // hide alert message
              widget.hideMessage();

              // initialize the submenu indicator variable
              $scope.displayUser = false;
              $scope.displayLang = false;
              $scope.displayCompany = false;
              $scope.is = false;


              var $mainMenu = $('.main-menu'),
                      $subMenu = $('.sub-menu-list');

              // remove active style
              $mainMenu.find('.menu-item.active').removeClass('active');
              $subMenu.find('.menu-item.active').removeClass('active');

              var $activeMainMenu = null;
              // get main-url language-key
              switch (url[0]) {
                case 'index':
                // case 'index_':
                  $activeMainMenu = $mainMenu.find('.menu-item.index');
                  MAIN_URL = 'HEADER.HOME_PAGE';
                  break;
                case 'initialize':
                  MAIN_URL = 'INITIALIZE';
                  break;
                case 'account':
                  MAIN_URL = 'ACCOUNT_MANAGE';
                  break;
                case 'business_manage':
                  $activeMainMenu = $mainMenu.find('.menu-item.business_manage');
                  MAIN_URL = 'BUSINESS_MANAGE';
                  break;
                case 'financial_manage':
                  $activeMainMenu = $mainMenu.find('.menu-item.financial_manage');
                  MAIN_URL = 'FINANCIAL_MANAGE';
                  break;
                case 'reports':
                  $activeMainMenu = $mainMenu.find('.menu-item.reports');
                  MAIN_URL = 'REPORTS';
                  break;
                case 'basic_setting':
                  $activeMainMenu = $mainMenu.find('.menu-item.basic_setting');
                  MAIN_URL = 'BASIC_SETTING';
                  break;
                case 'error':
                  MAIN_URL = 'ERROR';
                  break;
              }

              // get sub-url language-key
              if (url[1]) {
                switch (url[1]) {
                  // initialize
                  case 'setting_company':
                    SUB_URL = 'INITIALIZE__SETTING_COMPANY';
                    break;
                  case 'setting_category':
                    SUB_URL = 'INITIALIZE__SETTING_CATEGORY';
                    break;
                  case 'setting_category_balance':
                    SUB_URL = 'INITIALIZE__SETTING_CATEGORY_BALANCE';
                    break;
                  case 'setting_finish':
                    SUB_URL = 'INITIALIZE__SETTING_FINISH';
                    break;
                    // account
                  case 'account_setting':
                    SUB_URL = 'ACCOUNT_MANAGE__ACCOUNT_SETTING';
                    break;
                  case 'profile':
                    SUB_URL = 'ACCOUNT_MANAGE__ACCOUNT_PROFILE';
                    break;
                    // business_manage
                  case 'bill':
                    SUB_URL = 'BUSINESS_MANAGE__BILL';
                    break;
                  case 'bills':
                    SUB_URL = 'BUSINESS_MANAGE__BILL_LIST';
                    break;
                  case 'invoice':
                    SUB_URL = 'BUSINESS_MANAGE__INVOICE';
                    break;
                  case 'invoices':
                    SUB_URL = 'BUSINESS_MANAGE__INVOICE_LIST';
                    break;
                  case 'petty_cash':
                    SUB_URL = 'BUSINESS_MANAGE__PETTY_CASH';
                    break;
                  case 'petty_cashs':
                    SUB_URL = 'BUSINESS_MANAGE__PETTY_CASH_LIST';
                    break;
                  case 'expense_accounts':
                    SUB_URL = 'BUSINESS_MANAGE__EXPENSE_ACCOUNT';
                    break;
                    // financial_manage
                  case 'cashier_pay':
                    SUB_URL = 'FINANCIAL_MANAGE__CASHIER_PAY';
                    break;
                  case 'checkout':
                    SUB_URL = 'FINANCIAL_MANAGE__CHECKOUT';
                    break;
                  case 'bank_reconciliations':
                    SUB_URL = 'FINANCIAL_MANAGE__BANK_RECONCILIATIONS';
                    break;
                  case 'category':
                    SUB_URL = 'FINANCIAL_MANAGE__CATEGORY';
                    break;
                  case 'detail_account':
                    SUB_URL = 'FINANCIAL_MANAGE__DETAIL_ACCOUNT';
                    break;
                  case 'deal':
                    SUB_URL = 'FINANCIAL_MANAGE__DEAL';
                    break;
                  case 'account_posting':
                    SUB_URL = 'FINANCIAL_MANAGE__ACCOUNT_POSTING';
                    break;
                  case 'fixed_asset':
                    SUB_URL = 'FINANCIAL_MANAGE__FIXED_ASSET';
                    break;
                  case 'purchase_order_classification':
                    SUB_URL = 'FINANCIAL_MANAGE__PURCHASE_ORDER_CLASSIFICATION';
                    break;
                  case 'receivable':
                    SUB_URL = 'FINANCIAL_MANAGE__RECEIVABLE';
                    break;
                  case 'voucher':
                    SUB_URL = 'FINANCIAL_MANAGE__VOUCHER';
                    break;
                  case 'vouchers':
                    SUB_URL = 'FINANCIAL_MANAGE__VOUCHER_LIST';
                    break;
                  case 'assistant_account':
                    SUB_URL = 'FINANCIAL_MANAGE__ASSISTANT_ACCOUNT';
                    break;
                    // reports
                  case 'accoundant':
                    SUB_URL = 'REPORTS__ACCOUNDANT';
                    break;
                  case 'financial':
                    SUB_URL = 'REPORTS__FINANCIAL';
                    break;
                  case 'asset_liability':
                    SUB_URL = 'REPORTS__ASSET_LIABILITY';
                    break;
                  case 'cash_flow':
                    SUB_URL = 'REPORTS__CASH_FLOW';
                    break;
                  case 'profit':
                    SUB_URL = 'REPORTS__PROFIT';
                    break;
                    // basic_setting
                  case 'account_list':
                    SUB_URL = 'BASIC_SETTING__ACCOUNT_MANAGE';
                    break;
                  case 'assist_account':
                    SUB_URL = 'BASIC_SETTING__ASSIST_ACCOUNT';
                    break;
                  case 'company':
                    SUB_URL = 'BASIC_SETTING__COMPANY';
                    break;
                  case 'department':
                    SUB_URL = 'BASIC_SETTING__DEPARTMENT';
                    break;
                  case 'contact':
                    SUB_URL = 'BASIC_SETTING__CONTACT';
                    break;
                  case 'inventory':
                    SUB_URL = 'BASIC_SETTING__INVENTORY';
                    break;
                  case 'tax_rate':
                    SUB_URL = 'BASIC_SETTING__TAX_RATE';
                    break;
                  case 'expense_account_setting':
                    SUB_URL = 'BASIC_SETTING__EXPENSE_ACCOUNT_SETTING';
                    break;
                  case 'category_maintenance':
                    SUB_URL = 'BASIC_SETTING__CATEGORY_MAINTENANCE';
                    break;
                }
              }

              var stop = $interval(function () {
                var langPartLoaded = $translatePartialLoader.isPartLoaded('header', $translate.use());

                if (langPartLoaded) {
                  $interval.cancel(stop);

                  var locationName = $translate.instant(MAIN_URL);
                  if (SUB_URL) {
                    locationName += ' - ' + $translate.instant(SUB_URL);
                  }
                  $scope.currentLocation = locationName;

                  if ($activeMainMenu) {
                    setTimeout(function () {
                      $activeMainMenu.trigger('click');
                      if (SUB_URL) {
                        $subMenu.find('.menu-item.' + SUB_URL.toLowerCase()).addClass('active');
                      }
                    }, 100);
                  }
                }
              }, 30);
            });

            // show sub-menu
            var menuId;
            $scope.showSubMenu = function (event, menuList) {
              if (menuId){
                $timeout.cancel(menuId);
              }
              // change menu style
              var $target = $(event.currentTarget);
              //remove other active menu and add active class for current active menu
              $('.main-menu .menu-item.active').removeClass('active');
              $target.addClass('active');
              // show sub-menu-container
              if (menuList){
                $('.sub-menu-container').show();
              }
              // center sub-menu positive active main menu
              if (menuList) {
                $scope.subMenuList = menuList;
                $scope.$safeApply(function () {
                  var $subMenu = $('.sub-menu-list');
                  var $subMenuList = $subMenu.find('ul');

                  if ($subMenuList.width() < $subMenu.width()) {
                    setTimeout(function () {
                      var subMenuLeft = $subMenu.offset().left;
                      var subMenuListWidth = $subMenuList.width();
                      var targetWidth = $target.width();
                      var offsetLeft = $target.offset().left + targetWidth/2 - subMenuListWidth/2 - subMenuLeft;
                      $subMenuList.css('left', offsetLeft);
                    }, 20)

                  }
                });
              }
            };
            //hide  sub menu
            $scope.hideSubMenu = function(event, menuList){
              var $target = $(event.currentTarget);
              $target.removeClass('active');
              menuId = $timeout(function(){
                $('.sub-menu-container').hide();
              },500);
            };

            $scope.clickMenu = function (event, menuList) {
              if (!menuList) {
                $state.go('index');
              }
            };


            $scope.staySubMenu = function(){
              // still show submenu
              if (menuId){
                $('.sub-menu-container').show();
                $timeout.cancel(menuId);
              }
            };

            $scope.cancelStaySubMenu = function(){
              menuId = $timeout(function(){
                $('.sub-menu-container').hide();
              },500);
            };

            // goto url
            $scope.goPage = function (url) {
              $state.go(url);
            };

            // logout
            $scope.logout = function () {
              storage.setCurrentUser(null);
              $state.go('login');
            };

            // switch-language
            $scope.switchLang = function (langKey) {
              $translate.refresh(langKey);
              $translate.use(langKey);
              tmhDynamicLocale.set(langKey);
              translateService.changeHttpHeader();
              translateService.changeDatePickerConfig();
            };

            //switch-company
            $scope.switchCompany = function (companyId, companyName) {
              modalBox.openSwitchCompany(companyId, companyName, $scope.currentUser.email)
                .result.then(function () {
                  widget.showSuccess($translate.instant('HEADER.MESSAGE_SWITCH_COMPANY_SUCCESS'));
                });
            };

            //new-company
            $scope.newCompany = function () {
              modalBox.openNewCompany()
                .result.then(function () {
                  widget.showSuccess($translate.instant('HEADER.MESSAGE_NEW_COMPANY_SUCCESS'));
                  refreshCompanyList();
                });
            };

            //display subUserMenu
            $scope.displayUser = false;
            var userId;
            $scope.showUserMenu = function(){
                if ($scope.displayLang){
                  $scope.displayLang = false;
                }
                if (userId){
                  $timeout.cancel(userId);
                }
                $scope.displayUser = true;
            };
            $scope.hiddenUserMenu = function(){
                userId = $timeout(function(){
                  $scope.displayUser = false;
                },300);
            };

            //display subLang
            $scope.displayLang = false;
            var langId;
            $scope.showSubLang = function(){
                if ($scope.displayUser){
                  $scope.displayUser = false;
                }
                if (langId){
                  $timeout.cancel(langId);
                }
                $scope.displayLang = true;
            };
            $scope.hiddenSubLang = function(){
                langId = $timeout(function(){
                  $scope.displayLang = false;
                },300);
            };

            //display subCompany
            $scope.displayCompany = false;
            var companyId;
            $scope.showSubCompany = function(){
              if (companyId){
                $timeout.cancel(companyId);
              }
              $scope.displayCompany = true;
            };
            $scope.hiddenSubCompany = function(){
              companyId = $timeout(function(){
                $scope.displayCompany = false;
              },300);
            };
          }]);
