'use strict';

angular.module('concordyaApp')
        .controller('ReportProfitCtrl', ['$scope', '$translatePartialLoader', '$stateParams', 'APIService',
          function ($scope, $translatePartialLoader, $stateParams, api) {
            // add multi-lang file
            $translatePartialLoader.addPart('reports/profit');

            $scope.profit = {
              'id': $stateParams.id,
              'report': null
            };

            if ($stateParams && $stateParams.id) {
              api.accountReport.get($stateParams.id)
                      .success(function (data) {
                        $scope.profit.report = data;
                        $scope.$safeApply();
                      });
            }

            $scope.print = function () {
              if ($scope.profit.report.singleAccountReportDetailBaseModels.length > 0) {
                window.print();
              }
            };
          }]);