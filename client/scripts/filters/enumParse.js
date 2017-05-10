'use strict';

angular.module('concordyaApp')
    .filter('entityType', ['$translate', function ($translate) {
        return function (input) {
            var ret = '';
            switch (input) {
                case 0:
                    ret = $translate.instant('PURCHASE_ENUM.ENTITY_TYPE.BILL');
                    break;
                case 1:
                    ret = $translate.instant('PURCHASE_ENUM.ENTITY_TYPE.INVOICE');
                    break;
                case 2:
                    ret = $translate.instant('PURCHASE_ENUM.ENTITY_TYPE.PROCUREMENT');
                    break;
                case 3:
                    ret = $translate.instant('PURCHASE_ENUM.ENTITY_TYPE.TRAVELL');
                    break;
            }
            return ret;
        };
    }])
    .filter('purposeType', ['$translate', function ($translate) {
        return function (input) {
            var ret = '';
            switch (input) {
                case 0:
                    ret = $translate.instant('BILL_ENUM.PURPOSE_TYPE.SELF_USE');
                    break;
                case 1:
                    ret = $translate.instant('BILL_ENUM.PURPOSE_TYPE.RESELL');
                    break;
            }
            return ret;
        };
    }])
    .filter('boolean', ['$translate', function ($translate) {
        return function (input) {
            var ret = '';
            switch (input) {
                case true:
                    ret = $translate.instant('COMMON.YES');
                    break;
                case false:
                    ret = $translate.instant('COMMON.NO');
                    break;
            }
            return ret;
        };
    }])
    .filter('length', function () {
        return function (input, length) {
            var ret = input;
            if (input && (input.length > length)) {
                ret = input.substr(0, length) + '...';
            }
            return ret;
        };
    });
