'use strict';

angular.module('concordyaApp')
        .controller('ErrorCtrl', ['$scope', '$translate', '$translatePartialLoader', '$stateParams',
          function ($scope, $translate, $translatePartialLoader, $stateParams) {
            // add multi-lang file for setting/contact page
            $translatePartialLoader.addPart('error');

            var message = '';
            switch ($stateParams.type) {
              case '1':
                message = $translate.instant('ERROR.NOT_INITIALIZED');
                break;
              case '2':
                message = $translate.instant('ERROR.NOT_PERMISSION');
                break;
              default:
                message = $translate.instant('ERROR.UNKNOW_ERROR');
                break;
            }

            $scope.message = message;
          }]);