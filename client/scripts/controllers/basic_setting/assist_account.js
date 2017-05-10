/**
 * Created by shansong on 2015/7/8.
 */
'use strict';

angular.module('concordyaApp')
    .controller('AssistAccountCtrl', ['$scope', '$filter', '$translate', '$translatePartialLoader', 'APIService', 'UtilityService', 'WidgetService', 'ModalBoxService', 'StorageService', 'CONSTANT.PAGE_SIZE',
        function ($scope, $filter, $translate, $translatePartialLoader, api, utility, widget, modalBox, storage, PAGE_SIZE) {
            $translatePartialLoader.addPart('basic_setting/assist_account');

            var currentUser = storage.getCurrentUser();
            var companyId = currentUser.currentCompanyId;

            // page object
            $scope.page = {
                index: 1,
                size: PAGE_SIZE,
                total: 0
            };

            // �ɱ༭
            $scope.enableEditCategoryId = null;

            $scope.category = {
                name: null
            };

            // get category list
            function getDataList(params) {
                params = utility.checkParams($scope, params);
                var categoryId = $scope.categoryId;
                api.assistAccount.getCategoryItems(categoryId, params)
                    .success(function (data) {
                        $scope.dataList = data.list;
                        $scope.page.total = data.totalCount;
                        $scope.$safeApply();
                    });
            }

            // watch page.index
            utility.watchPageIndex($scope, function (newIndex) {
                getDataList({
                    'pageIndex': newIndex,
                    'pageSize': $scope.page.size
                });
            });

            //���ݸ����������ͣ����ظ���������
            $scope.loadCategoryItems = function (categoryId) {
                widget.hideMessage();
                $scope.enableEditCategoryId = categoryId;
                $scope.categoryId = categoryId;
                var params = {
                    'pageIndex': 1,
                    'pageSize': $scope.page.size
                };
                getDataList(params);
            }

            // �������еĸ�����������
            function loadAssistCategories(companyId, categoryId) {
                _.forEach($scope.assistCategories, function(item){
                  item.active = false;
                });
                api.assistAccount.getAssistCategories(companyId)
                    .success(function (data) {
                        var flag = false;
                        _.forEach(data, function (item) {
                            if (categoryId && (item.id === categoryId)){
                                item.active = true;
                                flag = true;
                            }
                        });
                        if (flag === false) {
                            if (data && data[0]) {
                                data[0].active = true
                            }
                        }

                        //data = $filter('orderBy')(data, 'id');
                        $scope.assistCategories = data;
                        $scope.$safeApply();
                    });
            }

            loadAssistCategories(companyId);

            // ����ָ��������������
            $scope.addCategoryType = function () {
                modalBox.openAddCategoryType(companyId, loadAssistCategories);
            };

            // ɾ��������������
            $scope.removeCategoryType = function (category) {
                modalBox.openRemoveCategory(category)
                    .result.then(function () {
                        api.assistAccount.removeCategory(category.id)
                            .success(function () {
                                loadAssistCategories(companyId);
                            });
                    });

            };

            // �༭������������
            $scope.editCategoryType = function (category) {
                modalBox.openEditCategoryType(category, companyId, loadAssistCategories);
            };

            // trigger contact selected status
            $scope.triggerItem = function (item) {
                utility.triggerSelect(item, $scope.dataList);
            };

            // trigger contact selected status
            $scope.addTypes = function () {
                $scope.enableEditCategoryId = null;
            };

            // add new category item
            $scope.addNew = function (categoryType) {

                modalBox.openNewCategory(categoryType)
                    .result.then(function () {
                        widget.showSuccess($translate.instant('ASSIST_ACCOUNT.MESSAGE_NEW_SUCCESS'));
                        getDataList();
                    });
            };

            // ɾ��ĳһ�������������µ���Ŀ
            $scope.delete = function (categoryId) {
                var ids = utility.getSelectedIds($scope.dataList);
                if (ids && ids.length > 0) {
                    api.assistAccount.removeCategoryItems(categoryId, ids)
                        .success(function (data, status) {
                            if (status === 200) {
                                widget.showSuccess($translate.instant('ASSIST_ACCOUNT.MESSAGE_DELETE_SUCCESS'));
                                getDataList();
                            }
                        });
                } else {
                    widget.showError($translate.instant('COMMON.SELECT_OPERATE_ITEM'));
                }
            };

        }]);
