'use strict';

angular.module('concordyaApp')
        .controller('FixedAssetCtrl', ['$scope', '$translatePartialLoader', 'APIService', 'UtilityService', 'CONSTANT.PAGE_SIZE',
          function ($scope, $translatePartialLoader, api, utility, PAGE_SIZE) {
            $translatePartialLoader.addPart('financial_manage/fixed_asset');

            // page object
            $scope.page = {
              index: 1,
              size: PAGE_SIZE,
              total: 0
            };

            // get fixedAsset list
            function getDataList(params) {
              params = utility.checkParams($scope, params);
              api.fixedAsset.getList(params)
                      .success(function (data, status) {
                        if (status === 200) {
                          $scope.dataList = data.list;
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
          }]);