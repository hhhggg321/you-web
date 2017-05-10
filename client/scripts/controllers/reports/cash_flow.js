'use strict';

angular.module('concordyaApp')
        .controller('ReportCashFlowCtrl', ['$scope', '$translatePartialLoader', '$stateParams', 'APIService',
          function ($scope, $translatePartialLoader, $stateParams, api) {
            // add multi-lang file
            $translatePartialLoader.addPart('reports/cash_flow');

            $scope.cashflow = {
              'id': $stateParams.id,
              'report': null
            };

            if ($stateParams && $stateParams.id) {
              api.accountReport.get($stateParams.id)
                      .success(function (data) {
                        $scope.cashflow.report = data;
                        $scope.$safeApply();
                      });
            }

            $scope.print = function () {
              if ($scope.cashflow.report.singleAccountReportDetailBaseModels.length > 0) {
                window.print();
              }
            };
          }]);