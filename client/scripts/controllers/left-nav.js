'use strict';

angular.module('concordyaApp')
  .controller('leftNavCtrl', ['$window', '$rootScope', '$scope', '$interval', '$state', '$translate', '$translatePartialLoader', 'tmhDynamicLocale', 'TranslateService', 'AuthorityService', 'StorageService', 'WidgetService', 'APIService', 'ModalBoxService', '$timeout',
    function($window, $rootScope, $scope, $interval, $state, $translate, $translatePartialLoader, tmhDynamicLocale, translateService, authority, storage, widget, api, modalBox, $timeout) {
      $translatePartialLoader.addPart('header');

      $rootScope.$state = $state;

      //after login
      var currentUser = storage.getCurrentUser();
      if (currentUser) {
        refreshCurrentUser($rootScope.currentUser);
      }

      // watch : change if switch company
      $rootScope.$on('currentUserChanged', function(event, val) {
        if (val) {
          refreshCurrentUser(val);
        }
      });

      $scope.isSubMenuActive = function(stateName, subMenu) {
        if (subMenu != null && subMenu.url === stateName) {
          return true;
        } else {
          return false;
        }
      };

      $scope.isMainMenuActive = function(stateName, module) {
        if (stateName.indexOf(module.name.toLowerCase()) > -1) {
          return true;
        } else {
          return false;
        }
      };

      $scope.initMetisMenu = function() {
        $timeout(function() {
          var sideMenu = $('#side-menu');
          sideMenu.removeData('mm');
          sideMenu.metisMenu();
        });
      }

      // refreshCurrentUser
      function refreshCurrentUser(currentUser) {
        if (currentUser && currentUser.currentCompanyId) {
          api.company.get(currentUser.currentCompanyId)
            .success(function(data) {
              if (data.isExperience) {
                $rootScope.currentCompanyName = '样本公司：' + data.name;
              } else {
                $rootScope.currentCompanyName = data.name;
              }
              $scope.$safeApply();
            });
        }

        $scope.moduleList = authority.getUserModules(currentUser);
      }

      // logout
      $scope.logout = function() {
        storage.setToken(null);
        $window.location.href = '/login';
      };
    }
  ]);
