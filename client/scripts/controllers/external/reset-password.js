'use strict';

angular.module('concordyaApp')
  .config(function($locationProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');
  })
  .controller('ResetPasswordCtrl', ['$window', '$scope', '$location', '$http', 'UtilityService', 'APIService',
    function($window, $scope, $location, $http, utility, api) {

      var queryStrings = $location.search();
      //Set password;
      $scope.resetPsw = function(form) {
        $scope.pwdMsgTip = "";
        $scope.pwdConfirmMsgTip = "";
        var reg_pwd = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@$!%*#?&]{8,}$/;
        if (!$scope.password) {
          $scope.pwdMsgTip = "请输入新密码";
          return false;
        } else if (!reg_pwd.test($scope.password)) {
          $scope.pwdMsgTip = "至少8位,且必须包含一个大小字母和数字";
          return false;
        } else if (!$scope.passwordConfirm) {
          $scope.pwdConfirmMsgTip = "请输入确认密码";
          return false;
        } else if ($scope.password !== $scope.passwordConfirm) {
          $scope.pwdConfirmMsgTip = "两次输入密码不一致";
          return false;
        }

        if (form.$valid) {
          api.account.resetPassword({
            'newPassword': $scope.password,
            'userId': queryStrings.userid,
            'token': queryStrings.token
          }).success(function(data) {
            alert('密码重置成功!');
            $window.location.href = '/login';
          }).error(function(data){
            $scope.errorMessage = data && data.message;
          });
        } else {
          utility.addErrorClass(form);
        }
      };
    }
  ]);
