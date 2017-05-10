'use strict';

angular.module('concordyaApp')
        .directive('diCheckboxGroup', function () {
          return{
            require: 'ngModel',
            templateUrl: 'scripts/directives/di_checkbox_group/template.html',
            replace: true,
            transclude: true,
            restrict: 'EA',
            scope: {
              selectedOption: '=ngModel',
              options: '='
            },
            link: function (scope) {
               // everyone has a default user role , so , here 普通用户 is checked by default and disabled
              //for(var i = 0; i < scope.options.length; i++){
              //  if (scope.options[i].id === 0 && scope.options[i].name === '普通用户'){
              //      scope.options[i].checked = true;
              //  }
              //}
              scope.check = function (item) {
                if (scope.$parent && scope.$parent.touched) {
                  scope.$parent.touched();
                }

                item.checked = !item.checked;
                var checkList = [];
                for (var i = 0; i < scope.options.length; i++) {
                  if (scope.options[i].checked) {
                    checkList.push(scope.options[i]);
                  }
                }
                if (checkList.length === 0) {
                  scope.selectedOption = null;
                } else {
                  scope.selectedOption = checkList;
                }
              };

            }
          };
        });
