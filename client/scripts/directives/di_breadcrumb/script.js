'use strict';

angular.module('concordyaApp')
        .directive('diBreadcrumb', function () {
          return{
            templateUrl: 'scripts/directives/di_breadcrumb/template.html',
            restrict: 'EA',
            replace: true,
            scope: {
              first: '@first',
              last: '@last',
              items: '=items',
              onLast: '&'
            },
            link: function (scope) {
              scope.clickLast = function () {
                scope.onLast && scope.onLast.call(null, arguments);
              };
            }
          };
        });
