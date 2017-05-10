'use strict';

angular.module('concordyaApp')
        .directive('diOnoff', function () {
          return{
            templateUrl: 'scripts/directives/di_onoff/template.html',
            restrict: 'EA',
            replace: true,
            scope: {
              label: '@label',
              onSwitch: '&',
              active: '='
            },
            link: function (scope) {
              scope.switch = function () {
                scope.onSwitch && scope.onSwitch.call(null, arguments);
              };
            }
          };
        });
