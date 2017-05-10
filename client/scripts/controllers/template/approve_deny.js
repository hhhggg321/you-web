'use strict';

angular.module('concordyaApp')
        .controller('TemplateApproveDenyCtrl', ['$scope', '$modalInstance', '$translatePartialLoader', 'WidgetService', 'UtilityService', 'APIService', 'entityType', 'ids','approvalType',
          function ($scope, $modalInstance, $translatePartialLoader, widget, utility, api, entityType, ids ,approvalType) {
            // add multi-lang file for new_category modal page
            $translatePartialLoader.addPart('template/submit_approve');
            widget.hideMessage();

            api.account.getManagerList()
              .success(function (data) {
                $scope.approverList = data;
              });

            $scope.save = function (form) {
              if (form.$valid) {
                if(entityType === 3||entityType === 4){
                  //petty cash
                  api.approver.approve({
                    'ids': ids,
                    'action': 4,
                    'entityType': entityType,
                    'approvalReason': $scope.reason
                  }).success(function () {
                    $modalInstance.close();
                  });
                }else if(entityType ===2){
                  //expense claim
                  if(approvalType === 1){
                    //forward
                    api.expense.forward(ids, $scope.forwardTo.id, $scope.reason)
                      .success(function(){
                        $modalInstance.close();
                      });
                  }else if(approvalType === 2){
                    //reject
                    api.expense.reject(ids, $scope.reason)
                      .success(function () {
                        $modalInstance.close();
                      });
                  }
                }
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
