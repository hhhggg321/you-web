/**
 * Created by shansong on 2015/7/14.
 */
'use strict';

angular.module('concordyaApp')
    .controller('TemplateEditCategoryTypeCtrl', ['$scope', '$translatePartialLoader', 'APIService',
        'WidgetService', 'UtilityService', '$modalInstance', 'categoryType', 'companyId', 'successFn',
        function ($scope, $translatePartialLoader, api, widget, utility, $modalInstance, categoryType, companyId, successFn) {
            // add multi-lang file for setting/contact page
            $translatePartialLoader.addPart('basic_setting/assist_account');
            $scope.isEdit = false;
            var categoryTypeId = categoryType && categoryType.id;
            if (categoryTypeId) {
                $scope.isEdit = true;
            }
            $scope.categoryType = {
                name: categoryType && categoryType.name
            };
            widget.hideMessage();
            // save action
            $scope.save = function (form) {
                if (form.$valid) {
                    if (categoryTypeId) { //编辑
                        api.assistAccount.editCategoryType(categoryTypeId, $scope.categoryType)
                            .success(function () {
                                successFn(companyId, categoryTypeId);
                                $modalInstance.close();
                            });
                    } else {// 新增
                        api.assistAccount.saveCategory({name: $scope.categoryType.name})
                            .success(function (data) {
                                $modalInstance.close();
                                successFn(companyId, data.typeId);
                            });
                    }

                } else {
                    utility.addErrorClass(form);
                }
            };
          //enter key down
          $scope.enterKeyDown = function(event){
            if(event.keyCode === 13){
              $scope.save($scope.editCategoryTypeForm);
            }
          };
            // cancel action, reset new-contact object
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);
