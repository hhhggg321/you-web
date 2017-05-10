'use strict';

angular.module('concordyaApp')
        .directive('diListSelection', [function () {
            return{
              require: 'ngModel',
              templateUrl: 'scripts/directives/di_list_selection/template.html',
              replace: true,
              transclude: true,
              restrict: 'EA',
              link: function (scope, elem, attrs, ngModel) {
                var attr = attrs['selectedAttr'] ? attrs['selectedAttr'] : 'selected';
                scope.$watch(function () {
                  return ngModel.$modelValue;
                }, function (newVal) {
                  var selectedItem = _.filter(newVal, function (item) {
                    return item[attr] === true;
                  });
                  scope.selectedCount = selectedItem.length;
                }, true);
              }
            };
          }]);
