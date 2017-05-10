'use strict';

angular.module('concordyaApp')
        .controller('AccountPostingCtrl', ['$scope', '$state', '$translate', '$translatePartialLoader', 'APIService', 'WidgetService','ModalBoxService',
          function ($scope, $state , $translate, $translatePartialLoader, api, widget,modalBox) {
            // add multi-lang file
            $translatePartialLoader.addPart('financial_manage/account_posting');

            // get date
            api.accountPosting.getDate()
                    .success(function (data) {
                      $scope.searchForm = {
                        'year': data.year,
                        'month': data.month
                      };
                      $scope.$safeApply();
                    });


            function parseDataList(data) {
              var list = [];
              _.forEach(data, function (item) {
                list.push({
                  'id': item.id,
                  'code': item.code,
                  'name': item.name,
                  'debit': item.debit,
                  'credit': item.credit,
                  'initialBalance': item.initialBalance,
                  'finalBalance': item.balanceDirection === 0 ? Math.abs(item.debit - item.credit) : Math.abs(item.credit - item.debit)
                });
              });
              return list;
            }
            // get postingType
            api.accountPosting.getStatus()
                    .success(function (data) {
                      $scope.postingType = data.accountPostingType;
                      $scope.dataList = parseDataList(data.list);
                      $scope.$safeApply();
                    });

            // begin
            $scope.begin = function () {
              api.accountPosting.begin()
                      .success(function (data) {
                        $scope.postingType = data.accountPostingType;
                        $scope.dataList = parseDataList(data.list);
                        $scope.$safeApply();
                      });
            };

            // end
            $scope.end = function () {
              api.accountPosting.end()
                      .success(function () {
                        $scope.postingType = 0;
                        $scope.dataList = null;
                        $scope.$safeApply();
                      });
            };

            //create voucher
            $scope.createVoucher = function () {
              modalBox.openConfirmVoucher($scope.postingType)
                .result.then(function (refresh_state) {
                  if (refresh_state){
                    // get postingType
                    api.accountPosting.getStatus()
                            .success(function (data) {
                              $scope.postingType = data.accountPostingType;
                              $scope.dataList = parseDataList(data.list);
                              $scope.$safeApply();
                              // refresh account posttype state
                              setTimeout("$state.reload()",1000);
                            });
[]
                  }
                }, function(){

                });
            };
          }]);
