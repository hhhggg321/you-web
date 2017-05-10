'use strict';

angular.module('concordyaApp')
        .controller('ReportAssetLiabilityCtrl', ['$scope', '$translatePartialLoader', '$stateParams', 'APIService',
          function ($scope, $translatePartialLoader, $stateParams, api) {
            // add multi-lang file
            $translatePartialLoader.addPart('reports/asset_liability');

            $scope.asset = {
              'id': $stateParams.id,
              'report': null
            };

            if ($stateParams && $stateParams.id) {
              api.accountReport.get($stateParams.id)
                      .success(function (data) {
                        $scope.asset.report = data;
                        $scope.$safeApply();
                      });
            }

            $scope.print = function () {
              if ($scope.asset.report.singleAccountReportDetailBaseModels.length > 0) {
                window.print();
              }
            };
          }]);