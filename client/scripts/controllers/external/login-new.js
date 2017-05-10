'use strict';

angular.module('concordyaApp')
  .controller('LoginCtrl', ['$window', '$scope', '$rootScope', 'APIService', 'UtilityService', 'StorageService', '$uibModal', 'ConfigService',
    function($window, $scope, $rootScope, api, utility, storage, modalBox, configService) {
      //When log in, the old session must be clean;
      storage.setToken(null);

      $scope.showCaptcha = false;
      $scope.errorMessage = '';

      var captcha_passed = false, // captcha passed
        validateData = {},
        loginFCount = 0, // login failed times
        gtServerIsOK = false,
        captchaObject = null; // hold on to capthaObject

      //check geetest captcha server status
      // api.account.getGTServerStatus()
      //   .success(function(data) {
      //     gtServerIsOK = data;
      //   });

      // login
      $scope.login = function(form) {
        $scope.errorMessage = '';
        var login_pass = $scope.showCaptcha ? (form.$valid && captcha_passed) : form.$valid;
        var form_data; // form data to post
        if ($scope.showCaptcha) {
          form_data = {
            'grant_type': 'password',
            'username': $scope.user.userName,
            'password': $scope.user.password,
            'captchaChallenge': validateData.geetest_challenge,
            'captchaValidate': validateData.geetest_validate,
            'captchaSeccode': validateData.geetest_seccode
          }
        } else {
          form_data = {
            'grant_type': 'password',
            'username': $scope.user.userName,
            'password': $scope.user.password
          }
        }
        if (login_pass) {
          api.account.login(form_data).success(function(oauthToken) { //sdk_result
            // first save currentUser,
            // beacuse api.company.getStatus need user's auth
            storage.setToken(oauthToken);

            api.company.getStatus(oauthToken.user.currentCompanyId)
              .success(function(data) {
                oauthToken.user.systemEnable = data.enable;
                oauthToken.user.systemGuide = data.systemGuide;
                storage.setToken(oauthToken);
                if (oauthToken.user.systemEnable) {
                  $window.location.href = "/";
                } else {
                  //$rootScope.$broadcast('$stateChangeSuccess');
                  var url = "";
                  switch (oauthToken.user.systemGuide) {
                    case null:
                    case 0:
                      url = 'setup/choice_entrance';
                      break;
                    case 1:
                      url = 'setup/setting_company';
                      break;
                    case 2:
                      url = 'setup/setting_category';
                      break;
                    case 3:
                      url = 'setup/setting_category_balance';
                      break;
                    case 4:
                      url = 'setup/setting_finish';
                      break;
                  }
                  $window.location.href = "/#" + url;
                }
              });
          }).error(function(data) {
            $scope.errorMessage = data && data.error_description;
            if (data.error == 'UserNameOrPasswordInvalid') {
              loginFCount++; // 错误次数加1
            }

            // when login failed more than three times , initiate gt_captcha_obj only once

            // if (loginFCount >= 3) {
            //   $scope.showCaptcha = true;
            //   // first check geetest captcha server status
            //   if (gtServerIsOK) {
            //     if (captchaObject === null) {
            //       captchaObject = new window.Geetest({
            //         gt: configService.config.geeTestId, // 公钥ID
            //         product: "float",
            //         https: true
            //       });
            //
            //       // appendTo api is to place widget in specific selector dom
            //       captchaObject.appendTo('#captcha_login');
            //
            //       // api to validate captcha , onSuccess event
            //       captchaObject.onSuccess(function() {
            //         $scope.captchaErrorMsg = '';
            //         // get validate data if pass captcha
            //         validateData = captchaObject.getValidate();
            //         captcha_passed = true;
            //         $scope.$apply();
            //       });
            //
            //       // reset captcha_passed to false when refresh
            //       captchaObject.onRefresh(function() {
            //         captcha_passed = false;
            //       });
            //     } else {
            //       captchaObject.refresh();
            //     }
            //   }
            // }

            //$scope.$safeApply();
          });
        } else {
          //$scope.captchaErrorMsg = '验证码错误';
          utility.addErrorClass(form);
        }
      };

      $scope.forgetPassword = function() {
        return modalBox.open({
          templateUrl: 'views/template/forgot_password.html',
          controller: 'TemplateForgotPwdCtrl',
          windowClass: 'forgotPwd-dialog'
        }).result.then(function() {

        });
      };
    }
  ]);
