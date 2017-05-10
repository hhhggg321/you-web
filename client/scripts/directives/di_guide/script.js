'use strict';

angular.module('concordyaApp')
  .directive('diGuide', ['StorageService', 'APIService', function(storage, api) {
    return {
      templateUrl: 'scripts/directives/di_guide/template.html',
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        type: '@',
        onClose: '&'
      },
      link: function(scope, elem, attrs) {
        var currentUser = storage.getCurrentUser();
        var companyId = currentUser.currentCompanyId;

        var cookieName = 'di_guide_' + attrs.type + '_' + companyId;

        scope.closeGuide = function($event) {
          scope.showMessage = false;
          storage.setCookie(cookieName, true);
          scope.onClose && scope.onClose.call(null, arguments);
        };

        var showGuide = function() {
          return (storage.getCookie(cookieName) === null);
        };

        scope.resetGuide = function() {
          storage.removeCookie(cookieName);
        };

        if (showGuide()) {
          api.settings.prerequisite(scope.type)
            .success(function(data) {
              scope.showMessage = !data;
            });
        }

      }
    };
  }]);
