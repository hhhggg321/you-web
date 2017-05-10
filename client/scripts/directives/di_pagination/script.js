'use strict';

angular.module('concordyaApp')
        .directive('diPagination', function () {
          return{
            require: 'ngModel',
            templateUrl: 'scripts/directives/di_pagination/template.html',
            restrict: 'EA',
            scope: {
              currentPage: '=ngModel',
              itemsPerPage: '=',
              totalItems: '=',
              maxSize: '='
            }
          };
        });