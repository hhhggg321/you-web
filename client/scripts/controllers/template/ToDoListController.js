/**
 * Created by William on 2015/10/27.
 */
'use strict';

angular.module('concordyaApp')
  .controller('TemplateToDoListCtrl', ['$scope', '$state', '$modalInstance', 'APIService', 'title', 'data',
    function($scope, $state, $modalInstance, api, title, data) {

      $scope.todoList = data;
      $scope.title = title;

      // edit draft
      $scope.handleTodo = function(item) {
        switch (item.entityType) {
          case 0:
            $state.go('business/bill', {
              id: item.fkId
            });
            break;
          case 1:
            $state.go('business/invoice', {
              id: item.fkId
            });
            break;
          case 2:
            $state.go('business/expense_account', {
              id: item.fkId
            });
            break;
          case 3:
            $state.go('business/petty_cash', {
              id: item.fkId
            });
            break;
          case 4:
            $state.go('business/advance_payment', {
              id: item.fkId
            });
            break;
          case 5:
            $state.go('business/voucher', {
              id: item.fkId
            });
            break;
        }
        $modalInstance.close();
      };

      // cancel action, reset account object
      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };

    }
  ]);
