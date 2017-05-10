'use strict';

angular.module('concordyaApp')
        .directive('diDropmenu', function () {
          return{
            require: 'ngModel',
            templateUrl: 'scripts/directives/di_dropmenu/template.html',
            restrict: 'EA',
            replace: true,
            scope: {
              selectedOption: '=ngModel',
              disabledOptions: '=',
              options: '=',
              onChange: '&',
              isOpen: '=',
              title: '@'
            },
            link: function (scope, elem) {
              scope.$watch('isOpen', function(newVal) {
                if (newVal === true) {
                  elem.addClass('open-dropdown-menu');
                } else {
                  elem.removeClass('open-dropdown-menu');
                }
              });
              scope.changeOption = function (option) {
                if (option.disabled === true) {
                  return false;
                }
                scope.selectedOption._option = option;
                scope.onChange && scope.onChange();
              };
            }
          };
        });
