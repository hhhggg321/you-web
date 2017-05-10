'use strict';

angular.module('concordyaApp')
        .controller('ContactCtrl', ['$scope', '$translate', '$translatePartialLoader', 'APIService', 'WidgetService', 'UtilityService', 'ModalBoxService', 'CONSTANT.PAGE_SIZE',
          function ($scope, $translate, $translatePartialLoader, api, widget, utility, modalBox, PAGE_SIZE) {
            // add multi-lang file for setting/contact page
            $translatePartialLoader.addPart('basic_setting/contact');

            // page object
            $scope.page = {
              index: 1,
              size: PAGE_SIZE,
              total: 0
            };

            // get contact list
            function getDataList(params) {
              params = utility.checkParams($scope, params);

              api.contact.getList(params)
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
              widget.hideMessage();
              getDataList();
            };

            // add new contact
            $scope.addNew = function () {
              modalBox.openNewContact()
                      .result.then(function () {
                        widget.showSuccess($translate.instant('CONTACT.MESSAGE_NEW_SUCCESS'));
                        getDataList();
                      });
            };

            $scope.edit = function (item) {
              modalBox.openNewContact(item)
                      .result.then(function () {
                        widget.showSuccess($translate.instant('CONTACT.MESSAGE_UPDATE_SUCCESS'));
                        getDataList();
                      });
            };

            // delete action
            $scope.delete = function () {
              var ids = utility.getSelectedIds($scope.dataList);
              if (ids && ids.length > 0){
                api.contact.delete(ids)
                        .success(function (data, status) {
                          if (status === 200) {
                            if(data.failedIds.length > 0){
                              widget.showError($translate.instant('COMMON.DELETE_ERROR')+data.failedIds.length+$translate.instant('COMMON.ITEM')+"    "+$translate.instant('COMMON.DELETE_SUCCESS')+data.successIds.length+$translate.instant('COMMON.ITEM'));
                              getDataList();
                            }else{
                              widget.showSuccess($translate.instant('CONTACT.MESSAGE_DELETE_SUCCESS'));
                              getDataList();
                            }
                          }
                        });
              } else {
                widget.showError($translate.instant('COMMON.SELECT_OPERATE_ITEM'));
              }
            };

            // trigger contact selected status
            $scope.triggerItem = function (item) {
              utility.triggerSelect(item, $scope.dataList);
            };
          }]);
