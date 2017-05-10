'use strict';

angular.module('concordyaApp')
        .controller('TemplateApproveDenyVoucherCtrl', ['$scope', '$modalInstance', '$translatePartialLoader', 'WidgetService', 'UtilityService', 'APIService', 'id',
          function ($scope, $modalInstance, $translatePartialLoader, widget, utility, api, id) {
            // add multi-lang file for new_category modal page
            $translatePartialLoader.addPart('template/submit_approve');
            widget.hideMessage();

            $scope.save = function (form) {
              if (form.$valid) {
                api.voucher.approveDeny(id, $scope.reason)
                        .success(function () {
                          $modalInstance.close();
                        });
              } else {
                utility.addErrorClass(form);
              }
            };

            // cancel action, reset account object
            $scope.cancel = function () {
              $modalInstance.dismiss('cancel');
            };
          }]);