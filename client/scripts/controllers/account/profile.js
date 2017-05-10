'use strict';

angular.module('concordyaApp')
        .controller('ProfileCtrl', ['$scope', '$translatePartialLoader', 'APIService', 'UtilityService', 'StorageService', 'WidgetService', '$translate',
          function ($scope, $translatePartialLoader, api, utility, storage, widget, $translate) {
            $translatePartialLoader.addPart('account/profile');

            $scope.user = storage.getCurrentUser();

            //头像应该加载页面的时候从user里面去的url，如果没有，则使用下面默认的url
            $scope.user.accountPhotoUrl = $scope.user.accountPhotoUrl || "images/account/account_photo.png";

            //上传头像
            $scope.attachment = function (files) {
              if (files && files.length) {
                api.attachment.create(files, {'title': "profile_photo", 'type': 5})
                        .then(function (res) {
                          widget.showSuccess($translate.instant('COMMON.ATTACHMENT_UPLOAD_SUCCESS'));

                          var data = res[0].data;
                          $scope.user.accountPhotoUrl = data.url;
                          $scope.$safeApply();
                        }, function () {
                          widget.showError($translate.instant('COMMON.ATTACHMENT_UPLOAD_FAILED'));
                        });
              } else {
                widget.showError($translate.instant('COMMON.ATTACHMENT_CHOOSE_UPLOAD_FILES'));
              }
            };

            $scope.save = function (form) {
              if (form.$valid) {
                api.account.update($scope.user.userId, {
                  displayName: $scope.user.displayName,
                  accountPhotoUrl: $scope.user.accountPhotoUrl
                }).success(function () {
                  storage.updateUser($scope.user);
                  widget.showSuccess($translate.instant('PROFILE.MESSAGE_UPDATE_PROFILE_SUCCESS'));
                });
              } else {
                utility.addErrorClass(form);
              }
            };

            $scope.cancel = function (form) {
              utility.removeErrorClass(form);
            };

            $scope.limit = 200;
            $scope.changeLimit = function () {
              $scope.limit = 200 - $scope.user.briefBio.length;
            };
          }
        ]);
