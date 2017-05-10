'use strict';

angular.module('concordyaApp')
    .directive('integer', function () {
        var addCommasToInteger = function (val) {
            var commas, wholeNumbers;
            wholeNumbers = val.toString().replace(/(\.\d+)$/, '');
            commas = wholeNumbers.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
            return '' + commas;
        };

        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ngModel) {
                ngModel.$validators.integer = function (modelValue, viewValue) {
                    if (ngModel.$isEmpty(modelValue) || !modelValue) {
                        return true;
                    }
                    if (/^\-?\d{0,3}(\,?\d{3})*$/.test(viewValue)) {
                        return true;
                    }
                    return false;
                };

                ngModel.$parsers.unshift(function (viewVal) {
                    viewVal = viewVal.replace(/,/g, '');
                    viewVal = parseInt(viewVal);
                    return viewVal;
                });
                ngModel.$formatters.push(function (val) {
                    if (val !== 0 && !val) {
                        return '';
                    }
                    val = addCommasToInteger(val);
                    return val;
                });

                elem.on('blur', function () {
                    var viewValue = ngModel.$modelValue;
                    if (viewValue === 0 || viewValue) {
                        var formatters = ngModel.$formatters;
                        for (var i = 0, len = formatters.length; i < len; i++) {
                            viewValue = formatters[i](viewValue);
                        }
                        ngModel.$viewValue = viewValue;
                    } else {
                        ngModel.$viewValue = '';
                    }
                    return ngModel.$render();
                });

                elem.on('focus', function () {
                    var val = elem.val();
                    elem.val(val.replace(/,/g, ''));
                    return elem[0].select();
                });
            }
        };
    })
    .directive('positiveNumber', function () {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ngModel) {
                ngModel.$validators.positiveNumber = function (modelValue) {
                    if (parseFloat(modelValue) > 0) {
                        return true;
                    }
                    return false;
                };
            }
        };
    })
    .directive('notNegativeNumber', function () {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ngModel) {
                ngModel.$validators.notNegativeNumber = function (modelValue) {
                    if (ngModel.$isEmpty(modelValue)) {
                        return true;
                    }
                    if (parseFloat(modelValue) >= 0) {
                        return true;
                    }
                    return false;
                };
            }
        };
    })
    .directive('float', function () {
        var addCommasToFloat = function (val) {
            val = parseFloat(val).toFixed(2);
            var commas, decimals, wholeNumbers;
            decimals = val.indexOf('.') === -1 ? '' : val.replace(/^-?\d+(?=\.)/, '');
            wholeNumbers = val.replace(/(\.\d+)$/, '');
            commas = wholeNumbers.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
            return '' + commas + decimals;
        };

        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ngModel) {
                ngModel.$validators.float = function (modelValue, viewValue) {
                    if (ngModel.$isEmpty(modelValue) || !modelValue) {
                        return true;
                    }
                    if (/^\-?\d{0,3}(\,?\d{3})*(\.\d*)?$/.test(viewValue)) {
                        return true;
                    }
                    return false;
                };

                ngModel.$parsers.unshift(function (viewVal) {
                    viewVal = viewVal.replace(/,/g, '');
                    viewVal = viewVal && parseFloat(viewVal).toFixed(2) || '';
                    return viewVal;
                });
                ngModel.$formatters.push(function (val) {
                    if (val !== 0 && !val) {
                        return '';
                    }
                    val = addCommasToFloat(val);
                    return val;
                });

                elem.on('blur', function () {
                    var viewValue = ngModel.$modelValue;
                    if (viewValue === 0 || viewValue) {
                        var formatters = ngModel.$formatters;
                        for (var i = 0, len = formatters.length; i < len; i++) {
                            viewValue = formatters[i](viewValue);
                        }
                        ngModel.$viewValue = viewValue;
                    } else {
                        ngModel.$viewValue = '';
                    }
                    return ngModel.$render();
                });

                elem.on('focus', function () {
                    var val = elem.val();
                    elem.val(val.replace(/,/g, ''));
                    return elem[0].select();
                });
            }
        };
    })
    .directive('decimal', function () {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ngModel) {
                ngModel.$validators.decimal = function (modelValue, viewValue) {
                    if (ngModel.$isEmpty(modelValue)) {
                        return false;
                    }
                    if (/^0\.\d*$|^1$/.test(viewValue)) {
                        return true;
                    }
                    return false;
                };

                ngModel.$parsers.unshift(function (viewVal) {
                    viewVal = parseFloat(viewVal);
                    if (!viewVal || viewVal >= 1 || viewVal < 0) {
                        viewVal = 1;
                    } else {
                        viewVal = viewVal.toFixed(2);
                    }
                    return viewVal;
                });
                ngModel.$formatters.push(function (val) {
                    val = parseFloat(val);
                    if (!val || val >= 1 || val < 0) {
                        val = 1;
                    } else {
                        val = val.toFixed(2);
                    }
                    return val;
                });

                elem.on('blur', function () {
                    var viewValue = ngModel.$modelValue;
                    if (viewValue) {
                        var formatters = ngModel.$formatters;
                        for (var i = 0, len = formatters.length; i < len; i++) {
                            viewValue = formatters[i](viewValue);
                        }
                        ngModel.$viewValue = viewValue;
                    } else {
                        ngModel.$viewValue = 1;
                    }
                    return ngModel.$render();
                });
            }
        };
    })
    .directive('validatephone', function ($http, $q) {
        return {
            require: 'ngModel',
            scope: {
                em: "=errormessage",
                disablecode: "=codedisabled",
            },
            link: function (scope, elem, attrs, ctrl) {
                ctrl.$validators.validatephone_fe = function (modelValue, viewValue) {
                    if (ctrl.$isEmpty(modelValue)) { // 非空校验
                        scope.disablecode = true;
                        return true;
                    }
                    if (!/^1\d{10}$/.test(viewValue)) { // 手机格式校验
                        scope.em = "手机号码应为 11 位阿拉伯数字";
                        scope.disablecode = true;
                        return false;
                    }
                    return true;
                };
                // TODO: watch viewValue to change disablecode when first pass , change phone number that already register next time
                ctrl.$asyncValidators.validatephone_be = function (modelValue, viewValue) {
                    return $http.get('account/avaliable?phonenumber=' + viewValue)
                        .then(function (response) {
                            if (!response.data.result) {
                                scope.em = "该手机已被注册！";
                                return $q.reject();
                            }
                            scope.disablecode = false;
                            return true;
                        });
                };
            }
        };
    })
    .directive('validatecode', function ($http, $q) {
        return {
            require: "ngModel",
            scope: {
                phone: "=phonenumber",
                em: "=errormessage",
            },
            link: function (scope, elem, attrs, ctrl) {
                ctrl.$validators.validatecode_fe = function (modelValue, viewValue) {
                    if (ctrl.$isEmpty(modelValue)) {
                        return true;
                    }
                    if (!/^\d{6}$/.test(viewValue)) {
                        scope.em = "验证码为 6 位阿拉伯数字";
                        return false;
                    }
                    return true;
                };
                ctrl.$asyncValidators.validatecode_be = function (modelValue, viewValue) {
                    // console.log(scope.phone);
                    return $http.get('account/confirmphone?phone=' + scope.phone + '&verifycode=' + viewValue)
                        .then(function (response) {
                            // response -> null 凡是无错误的应答都认为是正确的
                            return true;
                        }, function (response) {
                            // 未检测输入错误的情况，即服务器返回的验证码和用户输入的验证码是否一致
                            scope.em = response.data.message;
                            return $q.reject();
                        });
                };
            }
        };
    })
    .directive('validatepassword', function () {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var reg_pwd = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
                //validate password
                ctrl.$parsers.unshift(function (viewValue) {
                    //密码校验规则： 至少8位， 一个大写字母 一个小写字母 ， 一个数字
                    if (reg_pwd.test(viewValue)) {
                        ctrl.$setValidity('validatepwdFormat', true);
                        elem.removeClass('ng-invalid ng-touched');
                        return viewValue;
                    } else {
                        ctrl.$setValidity('validatepwdFormat', false);
                        elem.addClass('ng-invalid ng-touched');
                        return viewValue;
                    }
                });
            }
        };
    })
    .directive('validateuserame', [function () {
        return {
            require: 'ngModel',
            restrict: 'EA',
            link: function (scope, elem, attrs, ngModelCtrl) {
                //validate phone or email format
                ngModelCtrl.$parsers.unshift(function (viewValue) {
                    var reg_phone = /^1\d{10}$/;
                    var reg_email = /\S+@\S+\.\S+/;
                    if (reg_phone.test(viewValue) || reg_email.test(viewValue)) {
                        ngModelCtrl.$setValidity('valideuNameFormat', true);
                        elem.removeClass('ng-invalid ng-touched');
                        return viewValue;
                    } else {
                        ngModelCtrl.$setValidity('valideuNameFormat', false);
                        elem.addClass('ng-invalid ng-touched');
                        return viewValue;
                    }
                });
            }
        };
    }]);
