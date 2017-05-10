'use strict';

angular.module('concordyaApp')
        .controller('TemplateApproveDenyPettyCashCtrl', ['$scope', '$q', '$modalInstance', '$translatePartialLoader', 'WidgetService', 'UtilityService', 'APIService', 'pettyCashIds', 'advancePaymentIds',
          function ($scope, $q, $modalInstance, $translatePartialLoader, widget, utility, api, pettyCashIds, advancePaymentIds) {
            // add multi-lang file for new_category modal page
            $translatePartialLoader.addPart('template/submit_approve');
            widget.hideMessage();

            $scope.save = function (form) {
              if (form.$valid) {
                var promises = [];
                if (pettyCashIds.length > 0) {
                  promises.push(api.approver.approve({
                    'ids': pettyCashIds,
                    'action': 4,
                    'entityType': 3,
                    'approvalReason': $scope.reason
                  }));
                }
                if (advancePaymentIds.length > 0) {
                  promises.push(api.approver.approve({
                    'ids': advancePaymentIds,
                    'action': 4,
                    'entityType': 4,
                    'approvalReason': $scope.reason
                  }));
                }

                $q.all(promises)
                        .then(function () {
                          $modalInstance.close();
                        });
              } else {
                utility.addErrorClass(form);
              }
            };

            //enter key down
            $scope.enterKeyDown = function(event){
              if(event.keyCode === 13){
                $scope.save($scope.approveForm);
              }
            };
            // cancel action, reset account object
            $scope.cancel = function () {
              $modalInstance.dismiss('cancel');
            };
          }]);
