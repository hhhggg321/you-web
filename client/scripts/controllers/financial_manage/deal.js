'use strict';

angular.module('concordyaApp')
        .controller('DealCtrl', ['$scope', '$translate', '$translatePartialLoader', 'APIService', 'WidgetService', 'UtilityService', 'CONSTANT.PAGE_SIZE',
          function ($scope, $translate, $translatePartialLoader, api, widget, utility, PAGE_SIZE) {
            $translatePartialLoader.addPart('financial_manage/deal_receivable');

            // page object
            $scope.page = {
              index: 1,
              size: PAGE_SIZE,
              total: 0
            };

            var originalList;
            // get deal list
            function getDataList(params) {
              params = utility.checkParams($scope, params);
              api.deal.getList(params)
                      .success(function (data, status) {
                        if (status === 200) {
                          $scope.dataList = data.list;
                          originalList = _.cloneDeep(data.list);
                          $scope.page.total = data.totalCount;
                          $scope.$safeApply();
                        }
                      });
            }

            // watch page.index
            utility.watchPageIndex($scope, function (newIndex) {
              getDataList({
                'pageIndex': newIndex,
                'pageSize': $scope.page.size
              });
            });

            // search
            $scope.search = function () {
              getDataList();
            };

            // save
            $scope.save = function () {
              var diff = utility.getDiff(originalList, $scope.dataList);
              if (diff && diff.length > 0) {
                var data = [];
                _.forEach(diff, function (item) {
                  data.push({
                    'id': item.id,
                    'amount': item.amount,
                    'documentNumber': item.documentNumber,
                    'number': item.number,
                    'paymentDateTime': item.paymentDateTime ? moment(item.paymentDateTime).valueOf() : null,
                    'paymentAmount': item.paymentAmount,
                    'nextPaymentDateTime': item.nextPaymentDateTime ? moment(item.nextPaymentDateTime).valueOf() : null,
                    'nextPaymentAmount': item.nextPaymentAmount
                  });
                });
                api.deal.update(data)
                        .success(function () {
                          widget.showSuccess($translate.instant('DEAL.MESSAGE_UPDATE_SUCCESS'));
                          getDataList();
                        });
              }
            };

            // cancel
            $scope.cancel = function () {
              $scope.dataList = originalList;
              widget.hideMessage();
            };

            // trigger date-picker
            $scope.triggerPicker = function ($event, item, type) {
              $event.preventDefault();
              $event.stopPropagation();
              item[type] = true;
            };
          }]);