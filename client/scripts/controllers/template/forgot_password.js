'use strict';

angular.module('concordyaApp')
  .controller('TemplateForgotPwdCtrl', ['$scope', '$timeout', '$interval', '$modalInstance', 'APIService', 'UtilityService', 'ConfigService',
    function($scope, $timeout, $interval, $modalInstance, api, utility, configService) {

    $scope.captcha_email_passed = false;
    $scope.captcha_phone_passed = false;

    var validateData_email = {},
      validateData_phone = {},
      gtServerIsOK = false;

    //check geetest captcha server status
    api.account.getGTServerStatus()
      .success(function(data) {
        gtServerIsOK = data;
      });

    //初始首页
    $scope.initialPage = true;

    //邮箱找回 -- 错误提示信息
    $scope.emailMsgTip = "";
    //手机找回 -- 确认修改按钮
    $scope.showConfirmBtn = false;
    //手机找回 -- 错误提示信息
    $scope.phoneMsgTip = "";

    //find by Email page
    $scope.gotofindByEmail = function() {
      // first check geetest captcha server status
      if (gtServerIsOK) {
        // instantiate Geetest object
        var gt_captcha_email_obj = new window.Geetest({
          gt: configService.config.geeTestId, // 公钥ID
          product: "float",
          https: true
        });

        // appendTo api is to place widget in specific selector dom
        gt_captcha_email_obj.appendTo("#captcha_email");

        // api to validate captcha , onSuccess event
        gt_captcha_email_obj.onSuccess(function() {
          $scope.emailMsgTip = '';
          // get validate data if pass captcha
          validateData_email = gt_captcha_email_obj.getValidate();
          $scope.captcha_email_passed = true;
          $scope.$apply();
        });

        gt_captcha_email_obj.onRefresh(function() {
          $scope.captcha_email_passed = false; // reset captcha_email_passed to false when refresh
        });
      }
      $scope.showEmailPage = true;
      $scope.initialPage = false;
    };

    // find by phone page
    $scope.gotoFindByPhone = function() {
      // first check geetest captcha server status
      if (gtServerIsOK) {
        // instantiate Geetest object
        var gt_captcha_phone_obj = new window.Geetest({
          gt: configService.config.geeTestId, // 公钥ID
          product: "float",
          https: true
        });

        // appendTo api is to place widget in specific selector dom
        gt_captcha_phone_obj.appendTo("#captcha_phone");

        // api to validate captcha , onSuccess event
        gt_captcha_phone_obj.onSuccess(function() {
          $scope.phoneMsgTip = '';
          // get validate data if pass captcha
          validateData_phone = gt_captcha_phone_obj.getValidate();
          $scope.captcha_phone_passed = true;
          $scope.$apply();
        });

        gt_captcha_phone_obj.onRefresh(function() {
          $scope.captcha_phone_passed = false; // reset captcha_phone_passed to false when refresh
        });
      }
      $scope.showPhonePage = true;
      $scope.initialPage = false;
      $scope.showCaptcha = true;
    };

    //cancel button to close dialog
    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };

    //back to home
    $scope.backtoHome = function() {
      $scope.initialPage = true;
      $scope.showEmailPage = false;
      $scope.showPhonePage = false;
    };
    //初始化 user
    $scope.user = {
      email: null,
      phone: null,
      verifyCode: null,
      password: null
    };

    // send email verify link
    $scope.getEmailVerifyLink = function() {

      $scope.emailMsgTip = "";
      $scope.emailMsgTipSuccess = "";

      var captchaChallenge = validateData_email.geetest_challenge,
        captchaValidate = validateData_email.geetest_validate,
        captchaSeccode = validateData_email.geetest_seccode;

      //校验 1）非空  2）邮箱格式 3) captcha
      var reg_email = /\S+@\S+\.\S+/;
      if (!$scope.user.email) {
        $scope.emailMsgTip = "请输入注册邮箱";
        return false;
      } else if (!reg_email.test($scope.user.email)) {
        $scope.emailMsgTip = "邮箱格式错误";
        return false;
      } else if (!$scope.captcha_email_passed) {
        $scope.emailMsgTip = "验证码错误";
        return false;
      }
      //校验通过，发送重置密码请求
      //检查邮箱是否已经注册?1 如果注册， 发送链接； 2 没有注册， 错误提示
      api.account.passwordResetRequest($scope.user.email, captchaChallenge, captchaValidate, captchaSeccode)
        .success(function(data, status) {
          if (status == 200) {
            //TODO: fix style of tip message
            $scope.emailMsgTipSuccess = "验证邮件链接已发送到你的邮箱中,3秒之后关闭弹窗!";
            //3s之后关闭弹窗
            $timeout(function() {
              $modalInstance.dismiss('cancel');
            }, 3000);
          }
        })
        .error(function(data, status) {
          if (status == 404) {
            $scope.emailMsgTip = "该邮箱未注册!";
          }
        });
    };

    // send phone verify code
    $scope.getVerifyCode = function(code) {
      $scope.disabled = false; // 获取验证码button禁用状态
      $scope.phoneMsgTip = "";
      $scope.phoneMsgTipSuccess = "";
      var reg_phone = /^1\d{10}$/;
      if (!code) {
        $scope.phoneMsgTip = "请输入手机号";
        return false;
      } else if (!reg_phone.test(code)) {
        $scope.phoneMsgTip = "手机号必须为11位有效数字";
        return false;
      } else if (!$scope.captcha_phone_passed) {
        $scope.phoneMsgTip = "验证码错误";
        return false;
      }

      var captchaChallenge = validateData_phone.geetest_challenge,
        captchaValidate = validateData_phone.geetest_validate,
        captchaSeccode = validateData_phone.geetest_seccode;
      // first get verify code
      api.account.verifyPhone(code, captchaChallenge, captchaValidate, captchaSeccode)
        .success(function(data, status) {
          if (status == 200) {
            $scope.showCode = true;
            $scope.showPwd = true;
            $scope.showPwdConfirm = true;
            $scope.showConfirmBtn = true;
            $scope.disabled = true;
            $scope.showCaptcha = false;

            //TODO: 1 60s 倒计时
            //TODO: 2 bootstrap error message
            var IntervalObj;
            $scope.currentCount = 60;
            IntervalObj = $interval(function() {
              if ($scope.currentCount == 0) {
                $interval.cancel(IntervalObj);
                $scope.disabled = false; // verify button restored to click
              } else {
                $scope.currentCount--;
              }
            }, 1000);
          }
        })
        .error(function(data, status) {
          if (status == 404) {
            $scope.phoneMsgTip = "该手机号未注册!";
            return false;
          } else if (status == 400) {
            $scope.phoneMsgTip = "规定时间内不能重复申请验证码!";
            return false;
          }
        });
    };

    //验证手机验证码， 录入新密码 和确认密码
    $scope.modifyPwd = function() {
      $scope.phoneMsgTip = "";
      var reg_pwd = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
      var reg_phone = /^1\d{10}$/;
      if (!$scope.user.phone) {
        $scope.phoneMsgTip = '请输入手机号!';
        return false;
      } else if (!reg_phone.test($scope.user.phone)) {
        $scope.phoneMsgTip = '手机号格式不正确!';
        return false;
      } else if (!$scope.user.verifyCode) {
        $scope.phoneMsgTip = '请输入验证码!';
        return false;
      } else if (!$scope.user.password) {
        $scope.phoneMsgTip = '请输入新密码!';
        return false;
      } else if (!reg_pwd.test($scope.user.password)) {
        $scope.phoneMsgTip = '新密码至少8位，且必须包含一个大小字母和数字!';
        return false;
      } else if (!$scope.user.confrimPassword) {
        $scope.phoneMsgTip = '请输入确认密码!';
        return false;
      } else if ($scope.user.password !== $scope.user.confrimPassword) {
        $scope.phoneMsgTip = '新密码和确认密码两次输入不一致!';
        return false;
      }

      var geetest_challenge = validateData_phone.geetest_challenge,
        geetest_validate = validateData_phone.geetest_validate,
        geetest_seccode = validateData_phone.geetest_seccode;

      var post_data = {
        "phoneNumber": $scope.user.phone,
        "Code": $scope.user.verifyCode,
        "NewPassword": $scope.user.password
      };
      // 重置密码
      api.account.passwordReset(post_data)
        .success(function(data, status) {
          if (status == 200) {
            // 重置密码成功
            $scope.phoneMsgTipSuccess = '新密码设置成功,3秒之后关闭弹窗!';
            //3s之后关闭弹窗
            $timeout(function() {
              $modalInstance.dismiss('cancel');
            }, 3000);
          }
        })
        .error(function(data) {
          $scope.phoneMsgTip = data.message;
        });
    }
  }]);
