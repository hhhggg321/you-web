'use strict';

angular.module('concordyaApp')
        .controller('CheckoutCtrl', ['$scope', '$translate', 'AuthorityService', 'StorageService', '$translatePartialLoader', 'APIService', 'ModalBoxService','WidgetService',
          function ($scope, $translate, authority, storage, $translatePartialLoader, api, modalBox, widget) {
            // add multi-lang file
              $translatePartialLoader.addPart('financial_manage/checkout');
              var currentUser = storage.getCurrentUser();
              $scope.currentUser = currentUser;

              $scope.loadReverseCheckout = function () {
                  //��ȡ���������
                  api.accountPosting.getRollbackCheckout()
                      .success(function (data) {
                          /*var data = [{"accountingPeriodYear":2015,"accountingPeriodMonth":1,"canRollBack":false,"voucherCount":0},
                              {"accountingPeriodYear":2015,"accountingPeriodMonth":2,"canRollBack":false,"voucherCount":3},
                              {"accountingPeriodYear":2015,"accountingPeriodMonth":3,"canRollBack":true,"voucherCount":5},
                              {"accountingPeriodYear":2015,"accountingPeriodMonth":4,"canRollBack":false,"voucherCount":0}
                          ];*/
                          var j = -1;
                          $scope.dataList = data;
                          var length = data.length;
                          var isAllFalse = true;
                          // ���
                          if (length === 1) {
                              if ( data[0].canRollBack === true ){
                                  data[0].isShow = true;
                              } else {
                                  data[0].isShow = false;
                              }
                          }
                          for (var i = 0; i < data.length; i++){
                              var item = data[i];
                              item.isShow = true;
                              if (item.canRollBack === true) {
                                  j = i;
                                  isAllFalse = false;
                                  item.nextVoucherCount = data[i + 1] && data[i + 1].voucherCount;
                              }

                              if ((j !== -1) && (i > j)){
                                  item.isShow = false;
                              }
                          }

                          if (isAllFalse) {
                              for (var i = 0; i < data.length; i++){
                                  var item = data[i];
                                  item.isShow = false;
                              }
                          }
                      });
              }

              // ���з�����
              $scope.reverseCheckout = function (number) {
                  modalBox.openReverseCheckoutMessage(number)
                      .result.then(function (data) {
                          if (data && data.error ) {
                              return false;
                          }
                          $scope.dataList = data;
                          $scope.$safeApply();
                      });
              };

              // begin
              $scope.checkout = function () {
                api.company.getAccountPeriod()
                  .success(function (data) {
                    var currentPeriod,nextPeriod;
                    if(data.month < 10){
                      currentPeriod = data.year + '-0' +(data.month);
                    }else{
                      currentPeriod = data.year + '-' +(data.month);
                    }
                    if(data.month < 9){
                      nextPeriod = data.year + '-0' +(data.month + 1);
                    }else{
                      nextPeriod = data.year + '-' +(data.month + 1);
                    }

                    var msg = '当前会计期间 : '+ '[' +currentPeriod +  ']' + '，结账成功后，将进入下一个会计区间 : '+ '['+ nextPeriod + ']'+ '，是否继续？';
                    modalBox.openConfirm(msg)
                      .result.then(function () {
                        api.accountPosting.checkout()
                          .success(function (data) {
                            $scope.checkOutType = data.checkOutType;
                            $scope.accountingPostList = data.accountingPostList;
                            $scope.accountVoucherList = data.accountVoucherList;
                            $scope.$safeApply();
                            if(data.checkOutType === 2){
                              // get current account period
                              api.company.getAccountPeriod()
                                .success(function (data) {
                                  var accountPeriod = data.year + '-' +(data.month);
                                  widget.showSuccess($translate.instant('CHECKOUT.MESSAGE_CHECKOUT_SUCCESS') + accountPeriod);
                                });
                            }
                          });
                      });
                  });

              };
          }]);
