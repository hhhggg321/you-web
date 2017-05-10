'use strict';

angular.module('concordyaApp')
    .filter('accountVoucherNumberformat', function () {
        return function (input) {
            if (Number(input) > 0) {
                return "记-" + input;
            }
            return input;
        };
    });
