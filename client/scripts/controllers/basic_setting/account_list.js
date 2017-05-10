'use strict';

angular.module('concordyaApp')
        .controller('AccountListCtrl', ['$scope', '$translate', '$translatePartialLoader', 'APIService', 'UtilityService', 'AuthorityService', 'ModalBoxService', 'WidgetService', 'CONSTANT.PAGE_SIZE',
          function ($scope, $translate, $translatePartialLoader, api, utility, authority, modalBox, widget, PAGE_SIZE) {
            $translatePartialLoader.addPart('basic_setting/account_list');

            // page object
            $scope.page = {
              index: 1,
              size: PAGE_SIZE,
              total: 0
            };
            //get departmentList
            api.department.getList()
              .success(function (data, status) {
                if (status === 200) {
                  $scope.departmentList = data;
                  $scope.$safeApply();
                }
              });
            // get enabled enum
            api.account.getEnabledEnum()
                    .success(function (data) {
                      $scope.enabledEnumList = data;
                      $scope.$safeApply();
                    });

            // get role enum
            $scope.roleList=[];
            api.account.getRoleEnum()
                    .success(function (data) {
                      $scope.roleList = data;
                      $scope.$safeApply();
                    });

            $scope.searchForm = {
              name: null,
              enabled: null,
              roles: [  // everyone has a default user role
                //{
                //  "id": 0,
                //  "name" : "普通用户"
                //}
              ]
            };

            function getSearchFormParams(params) {
              var searchForm = $scope.searchForm;
              if (searchForm.name) {
                params.name = searchForm.name;
              }
              if (searchForm.enabled && searchForm.enabled.id !== -1) {
                params.enabled = searchForm.enabled.id === 0 ? true : false;
              }
              if (searchForm.roles) {
                params.roles = '';
                _.forEach(searchForm.roles, function (item) {
                  params.roles += item.id + ',';
                });
                params.roles = params.roles.substring(0, params.roles.length - 1);
              }
            }

            function getDataList(params) {
              params = utility.checkParams($scope, params);
              getSearchFormParams(params);

              api.account.getList(params)
                      .success(function (data, status) {
                        if (status === 200) {
                          var dataList = data.list;
                          for (var i = 0; i < dataList.length; i++) {
                            if (dataList[i].roles) {
                              dataList[i].role = authority.getRoleDisplayName(dataList[i].roles);
                            }
                          }
                          $scope.dataList = dataList;
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

            // get account list
            $scope.search = function () {
              widget.hideMessage();
              getDataList();
            };

            // invitate account
            $scope.invitation = function () {
              modalBox.openAccountInvitation()
                      .result.then(function () {
                        widget.showSuccess($translate.instant('ACCOUNT_LIST.MESSAGE_INVITATION_USER_SUCCESS'));
                        getDataList();
                      });
            };

            // edit account
            $scope.edit = function (id) {
              modalBox.openAccountInfo(id)
                      .result.then(function () {
                        widget.showSuccess($translate.instant('ACCOUNT_LIST.MESSAGE_UPDATE_USER_SUCCESS'));
                        getDataList();
                      });
            };

            // enable account
            $scope.enable = function () {
              var ids = utility.getSelectedIds($scope.dataList);
              if (ids && ids.length > 0){
                api.account.enable(ids, true)
                        .success(function (data, status) {
                          if (status === 200) {
                            widget.showSuccess($translate.instant('ACCOUNT_LIST.MESSAGE_ENABLE_USER_SUCCESS'));
                            getDataList();
                          }
                        });
              } else {
                widget.showError($translate.instant('COMMON.SELECT_OPERATE_ITEM'));
              }
            };

            // disable account
            $scope.disable = function () {
              var ids = utility.getSelectedIds($scope.dataList);
              if (ids && ids.length > 0){
                api.account.enable(ids, false)
                        .success(function (data, status) {
                          if (status === 200) {
                            widget.showSuccess($translate.instant('ACCOUNT_LIST.MESSAGE_DISABLE_USER_SUCCESS'));
                            getDataList();
                          }
                        });
              } else {
                widget.showError($translate.instant('COMMON.SELECT_OPERATE_ITEM'));
              }
            };

            // delete account
            $scope.delete = function () {
              var ids = utility.getSelectedIds($scope.dataList);
              if (ids && ids.length > 0){
                api.account.delete(ids)
                        .success(function (data, status) {
                          if (status === 200) {
                            if(data.failedIds.length > 0){
                              widget.showError($translate.instant('COMMON.DELETE_ERROR')+data.failedIds.length+$translate.instant('COMMON.ITEM')+"    "+$translate.instant('COMMON.DELETE_SUCCESS')+data.successIds.length+$translate.instant('COMMON.ITEM'));
                              getDataList();
                            }else{
                              widget.showSuccess($translate.instant('ACCOUNT_LIST.MESSAGE_DELETE_USER_SUCCESS'));
                              getDataList();
                            }
                          }
                        });
              } else {
                widget.showError($translate.instant('COMMON.SELECT_OPERATE_ITEM'));
              }
            };

            //enter key down
            $scope.enterKeyDown = function (event) {
              if(event.keyCode === 13){
                $scope.search();
              }
            };
            // trigger account selected status
            $scope.triggerItem = function (item) {
              $scope.curSelectItem = item;
              utility.triggerSelect(item, $scope.dataList);
            };

            $scope.sendMailAgain = function(){
              var ids = utility.getSelectedIds($scope.dataList);
              if (ids && ids.length > 0){
                if(ids.length === 1){
                  var destination = $scope.curSelectItem.email;
                  api.assistAccount.reSendMail(destination)
                        .success(function(data, status){
                            if (status === 200) {
                                widget.showSuccess($translate.instant('ACCOUNT_LIST.MESSAGE_REEMAIL_SUCCESS'));
                            }
                        });
                }else{
                  widget.showError($translate.instant('COMMON.SELECT_MORE_ITEM'));
                }
              } else {
                widget.showError($translate.instant('COMMON.SELECT_OPERATE_ITEM'));
              }
            };

          }]);
