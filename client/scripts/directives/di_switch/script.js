'use strict';

angular.module('concordyaApp')
        .directive('diSwitch', function ($rootScope) {
          return{
            templateUrl: 'scripts/directives/di_switch/template.html',
            restrict: 'EA',
            replace: true,
            scope: {
              options: '=',
              model: '=',
              onSwitch: '&'
            },
            link: function (scope) {
              scope.switch = function (item) {
                scope.model.id = item.id;
                scope.model.name = item.name;
                scope.onSwitch && scope.onSwitch.call();
                $rootScope.$safeApply();
              };
            }
          };
        });
