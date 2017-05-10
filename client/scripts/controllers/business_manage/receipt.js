'use strict';
angular.module('concordyaApp')
        .controller('ReceiptCtrl', ['$scope', '$q', '$state', '$translate', '$translatePartialLoader', '$stateParams', 'APIService', 'ModalBoxService', 'UtilityService', 'WidgetService',
          function ($scope, $q, $state, $translate, $translatePartialLoader, $stateParams, api, modalBox, utility, widget) {
            // add multi-lang file for business_manage/petty_cash page
            $translatePartialLoader.addPart('business/petty_cash');

            if ($stateParams && $stateParams.id) {
              api.receipt.getReceipt($stateParams.id)
                .success(function(data){
                  $scope.receipt = data;
                });
            }else{

            }

          }]);
