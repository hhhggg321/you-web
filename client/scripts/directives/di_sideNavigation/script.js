'use strict';

angular.module('concordyaApp')
  .directive('diSideNavigation', function sideNavigation($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element) {
        // Call the metsiMenu plugin and plug it to sidebar navigation
        $timeout(function() {
          element.metisMenu();
        });
      }
    };
  });
