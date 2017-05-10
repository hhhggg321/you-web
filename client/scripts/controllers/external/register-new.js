'use strict';

angular.module('concordyaApp')
  .controller('RegisterCtrl', ['$window', '$scope', '$rootScope', '$interval', 'WidgetService', 'APIService', 'UtilityService', 'StorageService', 'ConfigService',
    function($window, $scope, $rootScope, $interval, widget, api, utility, storage, configService) {

      var validateData = {},
        gtServerIsOK = false;

      //check geetest captcha server status
      api.account.getGTServerStatus()
        .success(function(data) {
          gtServerIsOK = data;
          $scope.captcha_passed = false; // captcha passed
          // first check geetest captcha server status
          if (gtServerIsOK) {
            //TODO : check gtServer status if ok ?
            // instance captcha widget
            var gt_captcha_obj = new window.Geetest({
              gt: configService.config.geeTestId, // 公钥ID
              product: "float",
              https: true
            });

            // appendTo api is to place widget in specific selector dom
            gt_captcha_obj.appendTo("#captcha_register");
            // api to validate captcha , onSuccess event
            gt_captcha_obj.onSuccess(function() {
              $scope.captchaErrorMsg = '';
              // get validate data if pass captcha
              validateData = gt_captcha_obj.getValidate();
              $scope.captcha_passed = true;
              $scope.$apply();
            });
            //
            gt_captcha_obj.onRefresh(function() {
              $scope.captcha_passed = false; // reset captcha_passed to false when refresh
            });
          }
        });
      $scope.codeDisabled = true;
      $scope.currentCOunt = "";
      $scope.displayOrigin = true;
      $scope.phoneInvalid = false;
      $scope.codeInvalid = false;
      $scope.passwordInvalid = false;
      $scope.errorMessage = "";

      $scope.user = {
        phone: null,
        verifyCode: null,
        password: null,
        // confrimPassword: null
      };
      //verify cellphone
      $scope.getVerifyCode = function() {
        // $scope.clearErrorMessage();
        var captchaChallenge = validateData.geetest_challenge,
          captchaValidate = validateData.geetest_validate,
          captchaSeccode = validateData.geetest_seccode;

        api.account.verifyPhone($scope.user.phone, captchaChallenge, captchaValidate, captchaSeccode)
          .success(function() {
            $scope.displayOrigin = false; // 覆盖原始button， 再次获取并倒计时
            var IntervalObj;
            // $scope.$safeApply();
            $scope.currentCount = 60;
            IntervalObj = $interval(function() {
              if ($scope.currentCount === 0) {
                $interval.cancel(IntervalObj);
                $scope.displayOrigin = true;
              } else {
                $scope.currentCount--;
                // $scope.$safeApply();
              }
            }, 1000);
          });
      };
      // register
      $scope.register = function(form) {
        if (!form.$valid) {
          utility.addErrorClass(form);
          if (!form.phone.$valid) {
            $scope.phoneInvalid = true;
          }
          if (!form.code.$valid) {
            $scope.codeInvalid = true;
          }
          if (!form.password.$valid) {
            $scope.passwordInvalid = true;
          }
        } else {
          api.account.register({
            'phone': $scope.user.phone,
            'verifyCode': $scope.user.verifyCode,
            'password': $scope.user.password
          }).success(function(oauthToken) {
            oauthToken.user.systemEnable = false;
            oauthToken.user.systemGuide = 0;
            storage.setToken(oauthToken);
            $window.location.href = "/#/setup/choice_entrance";
          }).error(function(data) {
            $scope.errorMessage = data && data.message;
          });
        }
      };
    }
  ]);
