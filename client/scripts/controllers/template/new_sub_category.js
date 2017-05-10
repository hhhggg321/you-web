'use strict';

angular.module('concordyaApp')
        .controller('TemplateNewSubCategoryCtrl', ['$scope', '$translatePartialLoader', 'APIService', 'WidgetService', 'UtilityService', 'ModalBoxService', '$modalInstance', 'itemEditing',
          function ($scope, $translatePartialLoader, api, widget, utility, modalBox, $modalInstance, itemEditing) {
            // add multi-lang file for setting/category page
            $translatePartialLoader.addPart('financial_manage/category');
            widget.hideMessage();

            $scope.title = "CATEGORY.ADD_NEW_SUB_CATEGORY";
            $scope.newCategory = {};

            $scope.levelOneCategoryList = [];
            //获取一级科目列表
            api.accountCategory.getLevelOneList().success(function (data) {
              $scope.levelOneCategoryList = data;
              $scope.$safeApply();
            });

            //判断是否为修改
            if (itemEditing) {
              $scope.newCategory = itemEditing;
              $scope.newCategory.levelOneCategory = {};
              api.accountCategory.get(itemEditing.parentId)
                      .success(function (data) {
                        $scope.newCategory.levelOneCategory = data;
                      });
              $scope.title = "CATEGORY.EDIT_SUB_CATEGORY";
            }

            api.taxRate.getList()
                    .success(function (data) {
                      $scope.taxRateList = data;
                      $scope.$safeApply();
                    });

            // open level-one category modal box
            $scope.openLevelOneCategoryModal = function () {
              modalBox.openLevelOneCategoryList()
                      .result.then(function (selectedItem) {
                        $scope.newCategory.levelOneCategory = selectedItem;
                        $scope.$safeApply();
                      });
            };

            // watch level-one-category
            var cancelWatchLevelOneCategory = $scope.$watch('newCategory.levelOneCategory', function (newVal) {
              if (!itemEditing && newVal && newVal.id) {
                api.accountCategory.getMaxCodeOfSecondAccounting(newVal.id)
                        .success(function (data) {
                          $scope.newCategory.code = data;
                          $scope.$safeApply();
                        });
              }
            });
            // remove watch on state-change for performance reason
            $scope.$on('$stateChangeStart', function () {
              cancelWatchLevelOneCategory();
            });


            // save sub-category
            $scope.saveSubCategory = function (form) {
              if (form.$valid) {
                var category = $scope.newCategory;
                var data = {
                  'rootCategory': category.levelOneCategory && category.levelOneCategory.rootCategory,
                  'parentId': category.levelOneCategory && category.levelOneCategory.id,
                  'name': category.name,
                  'code': category.code,
                  'debit': category.debit,
                  'credit': category.credit,
                  'isCategory': category.levelOneCategory && category.levelOneCategory.isCategory,
                  'taxRateId': category.taxRate ? category.taxRate.id : null
                };
                if (itemEditing) {
                  api.accountCategory.update(itemEditing.id, data).success(function () {
                    $modalInstance.close();
                  });
                } else {
                  api.accountCategory.create(data).success(function () {
                    $modalInstance.close();
                  });
                }
              } else {
                utility.addErrorClass(form);
              }
            };

            //enter key down
            $scope.enterKeyDown = function(event){
              if(event.keyCode === 13){
                $scope.save($scope.newCategoryForm);
              }
            };
            // cancel action, reset new-contact object
            $scope.cancel = function () {
              $modalInstance.dismiss('cancel');
              $scope.newCategory = {};
            };
          }]);
