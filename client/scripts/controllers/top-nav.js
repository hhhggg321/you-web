'use strict';

angular.module('concordyaApp')
  .controller('topNavCtrl', ['$window', '$rootScope', '$scope', '$interval', '$state', '$translate', '$translatePartialLoader', 'tmhDynamicLocale', 'TranslateService', 'AuthorityService', 'StorageService', 'WidgetService', 'APIService', 'ModalBoxService', 
    function($window, $rootScope, $scope, $interval, $state, $translate, $translatePartialLoader, tmhDynamicLocale, translateService, authority, storage, widget, api, modalBox) {
      $translatePartialLoader.addPart('header');

      //get companies
      function refreshCompanyList() {
        api.account.getCompanies()
          .success(function(data) {
            _.forEach(data, function(item) {
              if (item.isExperience) {
                item.name = '样本公司：' + item.name;
              }
            });
            $scope.companies = data;
          });
      }

      $rootScope.$on('$stateChangeSuccess', function(event, toState) {
        refreshCompanyList();
      });

      //switch-company
      $scope.switchCompany = function(companyId, companyName) {
        modalBox.openSwitchCompany(companyId, companyName, $scope.currentUser.email)
          .result.then(function() {
            $rootScope.$emit('currentUserChanged', storage.getCurrentUser());
            widget.showSuccess($translate.instant('HEADER.MESSAGE_SWITCH_COMPANY_SUCCESS'));
          });
      };

      //new-company
      $scope.newCompany = function() {
        modalBox.openNewCompany()
          .result.then(function() {
            widget.showSuccess($translate.instant('HEADER.MESSAGE_NEW_COMPANY_SUCCESS'));
            refreshCompanyList();
            $rootScope.$emit('currentUserChanged', storage.getCurrentUser());
          });
      };

      // logout
      $scope.logout = function() {
        storage.setToken(null);
        $window.location.href = '/login';
      };

    }
  ]);
