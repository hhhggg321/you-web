'use strict';

angular.module('concordyaApp')
    .directive('singleClick', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(function () {
                    return element.data('isLoading');
                }, function (isLoading) {
                    if (isLoading) {
                        element.addClass('disabled').attr('disabled', 'disabled');

                    } else {
                        //if (!attrs.ngDisabled || scope.$eval(attrs.ngDisabled)){
                        element.removeClass('disabled').removeAttr('disabled');
                        //};
                    }
                });

                element.bind('click', function (e) {
                    scope.$apply(function () {
                        if (element.data('isLoading')) {
                            e.stopImmediatePropagation();
                            e.preventDefault();
                            return false;
                        }
                        element.data('isLoading', true);
                        $timeout(function () {
                            element.data('isLoading', false);
                        }, 500)

                        return true;
                    });
                });
            }
        };
    });
