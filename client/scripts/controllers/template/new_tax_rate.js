'use strict';

angular.module('concordyaApp')
        .controller('TemplateNewTaxRateCtrl', ['$scope', '$translatePartialLoader', 'APIService', 'WidgetService', 'UtilityService', '$modalInstance', 'itemEditing',
          function ($scope, $translatePartialLoader, api, widget, utility, $modalInstance, itemEditing) {
            // add multi-lang file for setting_tax page
            $translatePartialLoader.addPart('basic_setting/tax_rate');
            widget.hideMessage();

            if (itemEditing) {
              $scope.newTaxRate = _.cloneDeep(itemEditing);
            }

            // save action
            $scope.save = function (form) {
              if (form.$valid) {
                if (itemEditing) {
                  var data = utility.getDiff(itemEditing, $scope.newTaxRate);
                  if (data) {
                    api.taxRate.update(itemEditing.id, data)
                            .success(function () {
                              $modalInstance.close();
                            });
                  }
                } else {
                  api.taxRate.create($scope.newTaxRate)
                          .success(function () {
                            $modalInstance.close();
                          });
                }
              } else {
                utility.addErrorClass(form);
              }
            };

            // cancel action, reset new-taxRate object
            $scope.cancel = function () {
              $modalInstance.dismiss('cancel');
            };
          }]);
