'use strict';

angular.module('concordyaApp')
    .controller('TemplateReverseMessageCtrl', ['$scope', '$modalInstance', '$translatePartialLoader', 'APIService', 'number',
        function ($scope, $modalInstance, $translatePartialLoader, api, number) {
            $translatePartialLoader.addPart('financial_manage/checkout');

            $scope.number = number || 0;
            $scope.isrevert = { name: "false"};

            $scope.ok = function () {
                var isrevert = $scope.isrevert.name;
                api.accountPosting.setRollbackCheckout(isrevert)
                    .success(function (data) { $modalInstance.close(data); })
                    .error(function () { $modalInstance.close({error: true}); });
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);
