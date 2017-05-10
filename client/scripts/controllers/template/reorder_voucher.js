'use strict';

angular.module('concordyaApp')
  .controller('TemplateReorderVoucherCtrl', ['$scope', '$translate', '$modalInstance', '$translatePartialLoader', 'WidgetService', 'UtilityService', 'APIService','currentVoucherList',
    function ($scope, $translate, $modalInstance, $translatePartialLoader, widget, utility, api, currentVoucherList) {
      // add multi-lang file for new_category modal page
      widget.hideMessage();

      function isInTheList(number){
        return _.result(_.find(currentVoucherList,function(item){
                  return item.accountVoucherNumber == number;
               }),'id');
      }
      $scope.save = function (form) {
        if (form.$valid) {
          var fromVoucherId = isInTheList($scope.reorderVoucher.fromVoucherNumber);
          var toVoucherId = isInTheList($scope.reorderVoucher.toVoucherNumber);
          if(fromVoucherId && toVoucherId){
            var param = {
              fromvoucherid: fromVoucherId,
              tovoucherId: toVoucherId
            };
            api.voucher.reorder(param)
              .success(function() {
                $modalInstance.close();
              });
          }else{
            widget.showModalError($translate.instant('当前列表中不存在该编号的凭证！'));
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
