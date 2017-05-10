'use strict';

angular.module('concordyaApp')
        .directive('diSelect', ['$timeout', function ($timeout) {
            return{
              require: 'ngModel',
              templateUrl: 'scripts/directives/di_select/template.html',
              replace: true,
              transclude: true,
              restrict: 'EA',
              scope: {
                selectedOption: '=ngModel',
                options: '=',
                onChange: '&',
                placeholder: '@',
                datatype: '@',
                noFilter: '@',
                isReadonly: '=',
                categoryLimited: '@'
              },
              link: function (scope, elem, attrs, ngModel) {
                if (attrs.required || attrs.ngRequired) {
                  ngModel.$validators.required = function (modelValue) {
                    if (modelValue && (modelValue.id || modelValue.id === 0)) {
                      return true;
                    }
                    return false;
                  };
                }

                var $input = elem.find('.form-control.form-input');

                scope.$watch('selectedOption', function (newVal) {
                  if (newVal) {
                    var name = scope.selectedOption.name || scope.selectedOption.displayName;
                    if (scope.datatype === 'taxrate') {
                      $input.val(name + ' ' + scope.selectedOption.rate);
                    } else if (scope.datatype === 'category') {
                      $input.val(scope.selectedOption.code + ' ' + name);
                    } else {
                      $input.val(name);
                    }
                  } else {
                    $input.val('');
                  }
                });

                // reset input's value, when blur event happened on it
                elem.bind('mouseleave', function (event) {
                  var $menu = elem.find('.dropdown-menu');
                  if ($menu.is(":visible")) {
                    var offset = elem.offset(),
                            minPageX = offset.left,
                            minPageY = offset.top,
                            maxPageX = minPageX + elem.width(),
                            maxPageY = minPageY + elem.height() + $menu.height();

                    if (event.pageX > minPageX && event.pageX < maxPageX
                            && event.pageY > minPageY && event.pageY < maxPageY) {
                      return;
                    }
                  }

                  scope.keyword = '';
                  scope.$apply();
                  $timeout(function () {
                    if (scope.selectedOption) {
                      var name = scope.selectedOption.name || scope.selectedOption.displayName;
                      if (scope.datatype === 'taxrate') {
                        $input.val(name + ' ' + scope.selectedOption.rate);
                      } else if (scope.datatype === 'category') {
                        $input.val(scope.selectedOption.code + ' ' + name);
                      } else {
                        $input.val(name);
                      }
                    }
                  });
                });

                // filter dropdown list
                scope.filter = function () {
                  scope.keyword = $input.val();
                };

                var $items;

                scope.inputKeydown = function(event) {
                  if (event.keyCode === 40) {
                    $items = elem.find('a.menu-item');
                    if ($items.length > 0) {
                      $timeout(function () {
                        $items.get(0).focus();
                      });
                    }
                  } else if (event.keyCode === 13) {
                    var item;
                    for (var i = 0; i < scope.options.length; i++) {
                      if (scope.keyword === scope.options[i].code) {
                        item = elem.find('a.menu-item').get(0);
                        break;
                      }
                    }
                    if (item) {
                      $timeout(function () {
                        item.click();
                      });
                    }
                  }
                };

                scope.switchFocus = function(event, index, item) {
                  var minIndex = 0,
                    maxIndex = $items.length - 1;
                  if (event.keyCode === 13) {
                    scope.changeOption(item);
                    $timeout(function () {
                      elem.removeClass('open');
                    });
                    return;
                  }
                  if (event.keyCode === 40 && index < maxIndex) {
                    $timeout(function () {
                      $items.get(index + 1).focus();
                    });
                    return;
                  }
                  if (event.keyCode === 38 && index > minIndex) {
                    $timeout(function () {
                      $items.get(index - 1).focus();
                    });
                    return;
                  }
                };

                // set selectedOption
                scope.changeOption = function (option) {
                  if (scope.categoryLimited && option.hasChildren) {
                    return;
                  }

                  scope.selectedOption = option;
                  $timeout(function () {
                    scope.onChange && scope.onChange(option);
                  });
                };
              }
            };
          }]);
