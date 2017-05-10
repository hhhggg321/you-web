'use strict';

angular.module('concordyaApp')
  .config(function($locationProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');
  })
  .controller('ValidEmailCtrl', ['$scope', '$http', '$location', '$window', 'APIService',
    function($scope, $http, $location, $window, api) {

      $scope.errorMessage = '';

      $scope.doValid = function() {
        api.account.verifyEmail({
          userid: $location.search().userid,
          token: $location.search().token
        }).success(function(data) {
            $window.location.href = '/login';
        }).error(function(data){
          $scope.errorMessage = data && data.message;
        });
      };
    }
  ]);
