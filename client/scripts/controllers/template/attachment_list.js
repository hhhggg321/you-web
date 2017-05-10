'use strict';

angular.module('concordyaApp')
  .controller('TemplateAttachmentListCtrl', ['$scope', '$translate', '$translatePartialLoader', 'APIService', 'WidgetService', '$modalInstance', 'sourceList', 'sourceId', 'sourceType', 'enable', 'updateAttachmentCount',
    function ($scope, $translate, $translatePartialLoader, api, widget, $modalInstance, sourceList, sourceId, sourceType, enable, updateAttachmentCount) {
      $translatePartialLoader.addPart('template/attachment_list');

      $scope.enable = enable;
      $scope.dataList = sourceList;

      var sourceListLength = sourceList ? sourceList.length : 0;

      // attachment for voucher
      $scope.attachment = function (files) {
        if (files && files.length) {
          api.attachment.create(files, {'type': sourceType, 'id': sourceId})
            .then(function (res) {
              var item = res[0].data;
              $scope.dataList.push(item);
              updateAttachmentCount && updateAttachmentCount($scope.dataList.length - sourceListLength);
              sourceListLength = sourceList.length;
              $scope.$safeApply();
              widget.showModalSuccess($translate.instant('COMMON.ATTACHMENT_UPLOAD_SUCCESS'));
            }, function () {
              widget.showModalError($translate.instant('COMMON.ATTACHMENT_UPLOAD_FAILED'));
            });
        } else {
          widget.showModalError($translate.instant('COMMON.ATTACHMENT_CHOOSE_UPLOAD_FILES'));
        }
      };

      $scope.delete = function (data) {
        _.remove($scope.dataList, function (item) {
          return item.id === data.id;
        });
      };

      $scope.ok = function () {
        $modalInstance.close($scope.dataList);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    }]);
