'use strict';

angular.module('concordyaApp')
  .config(function($locationProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');
  })
  .controller('AcceptInvitationCtrl', ['$window', '$location', '$scope', '$rootScope', 'APIService', 'UtilityService', 'StorageService',
    function($window, $location, $scope, $rootScope, api, utility, storage) {
      var queryStrings = $location.search();

      $scope.errorMessage = null;
      $scope.isValid = true;

      api.account.confirmInvitation({
        userId: queryStrings.userid,
        token: queryStrings.token
      }).success(function(data) {
        $scope.accessToken = data.accessToken;
        $scope.isValid = true;
      }).error(function(data){
        $scope.errorMessage = data.message;
        $scope.isValid = false;
      });

      //Set password;
      $scope.updatePsw = function(form) {
        if ($scope.password !== $scope.confirmPassword) {
          $scope.passwordNotSame = true;
          return false;
        }

        if (form.$valid) {
          api.account.setPassword({
            'newPassword': $scope.password,
            'confirmPassword': $scope.confirmPassword
          }, $scope.accessToken).success(function() {
            // clean old user session
            $window.location.href = '/login';
          }).error(function(data){
            $scope.errorMessage = data.message;
          });
        } else {
          utility.addErrorClass(form);
        }
      };
      // cancel
      $scope.reset = function(form) {
        $scope.password = null;
        $scope.confirmPassword = null;
        $scope.errorMessage = null;
        form.$setUntouched();
      };
    }
  ]);
