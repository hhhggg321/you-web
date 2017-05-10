'use strict';

angular.module('concordyaApp')
        .controller('TemplateConfirmCtrl', ['$scope', '$modalInstance', 'msg',
          function ($scope, $modalInstance, msg) {
            $scope.confirmMessage = msg;

            $scope.ok = function () {
              $modalInstance.close();
            };

            $scope.cancel = function () {
              $modalInstance.dismiss('cancel');
            };
          }]);
