'use strict';

angular.module('concordyaApp')
  .controller('AccountSettingCtrl', ['$scope', '$http', '$translatePartialLoader', '$translate', 'APIService', 'UtilityService', 'WidgetService', 'StorageService',
    function ($scope, $http, $translatePartialLoader, $translate, api, utility, widget, storage) {
      $translatePartialLoader.addPart('account/account_setting');

      var currentAccount = storage.getCurrentUser();

      function initAccount() {
        api.account.get(currentAccount.userId)
          .success(function (data) {
            $scope.account = {
              'email': data.email,
              'phoneNumber': data.phoneNumber
            };
            $scope.$safeApply();
          });
      }

      initAccount();

      //change email
      $scope.changeEmail = function (form) {
        if (form.$valid) {
          $http.post('account/verifyemail', {
            email: $scope.account.email
          }).success(function () {
            widget.showSuccess($translate.instant('ACCOUNT_SETTING.MESSAGE_CHANGE_EMAIL_SUCCESS'));
            $scope.cancelChangeEmail(form);
            $scope.$safeApply();
          });
        } else {
          utility.addErrorClass(form);
        }
      };

      //cancel change email
      $scope.cancelChangeEmail = function (form) {
        $scope.account.email = null;
        form && utility.removeErrorClass(form);
      };


      //change password
      $scope.changePassword = function (form) {
        var reg_pwd = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@$!%*#?&]{8,}$/;
        if (form.$valid) {
          if ($scope.account.newPassword === $scope.account.oldPassword) {
            widget.showError($translate.instant('ACCOUNT_SETTING.NEW_PASSWORD_SHOULD_NOT_EQUAL_PASSWORD'));
            return;
          }

          if ($scope.account.newPassword !== $scope.account.confirmPassword) {
            widget.showError($translate.instant('ACCOUNT_SETTING.NEW_PASSWORD_SHOULD_EQUAL_CONFIRM_PASSWORD'));
            return;
          }
          if (!reg_pwd.test($scope.account.newPassword)){
            widget.showError($translate.instant('至少8位,且必须包含一个大小字母和数字'));
            return;
          }
          $http.post('account/changepassword', {
            OldPassword: $scope.account.oldPassword,
            NewPassword: $scope.account.newPassword,
            ConfirmPassword: $scope.account.confirmPassword
          }).success(function () {
            widget.showSuccess($translate.instant('ACCOUNT_SETTING.MESSAGE_CHANGE_PASSWORD_SUCCESS'));
            $scope.cancelChangePassword(form);
            $scope.$safeApply();
          });
        } else {
          utility.addErrorClass(form);
        }
      };

      //clear
      $scope.cancelChangePassword = function (form) {
        $scope.account.oldPassword = null;
        $scope.account.newPassword = null;
        $scope.account.confirmPassword = null;
        form && utility.removeErrorClass(form);
      };

      // get verify code
      $scope.getVerifyCode = function () {
          api.account.checkPhone($scope.account.phoneNumber)
            .success(function(data){
              if(data.result){
                api.account.verifyPhone($scope.account.phoneNumber)
                  .success(function(){
                    widget.showSuccess($translate.instant('ACCOUNT_SETTING.SEND_VERIFYCODE_SUCCESS'));
                    var IntervalObj;
                    $scope.buttonDisabled = true;
                    $scope.$safeApply();
                    $scope.currentCount = 60;
                    IntervalObj = window.setInterval(function(){
                      if($scope.currentCount === 0){
                        window.clearInterval(IntervalObj);
                        $scope.buttonDisabled = false;
                        $scope.$safeApply();
                      }else{
                        $scope.currentCount--;
                        $scope.$safeApply();
                      }
                    },1000);
                  });
              }else{
                widget.showError($translate.instant('COMMON.ERROR_MASSAGE_PHONE_HAS_BEEN_REGISTERED'));
              }
            });
      };

      // change phone
      $scope.changePhone = function (form) {
        if (form.$valid) {
          api.account.confirmPhone($scope.account.phoneNumber,$scope.account.verifyCode)
            .success(function(){
              widget.showSuccess($translate.instant('ACCOUNT_SETTING.MESSAGE_CHANGE_PHONE_SUCCESS'));
              $scope.cancelChangePhone(form);
              $scope.$safeApply();
            });
        } else {
          utility.addErrorClass(form);
        }
      };

      // cancel
      $scope.cancelChangePhone = function (form) {
        initAccount();
        form && utility.removeErrorClass(form);
      };
    }
  ]);
