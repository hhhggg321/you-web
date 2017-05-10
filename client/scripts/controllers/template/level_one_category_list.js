'use strict';

angular.module('concordyaApp')
        .controller('TemplateLevelOneCategoryListCtrl', ['$scope', '$translatePartialLoader', 'APIService', 'WidgetService', '$modalInstance',
          function ($scope, $translatePartialLoader, api, widget, $modalInstance) {
            // add multi-lang file for setting/category page
            $translatePartialLoader.addPart('financial_manage/category');
            widget.hideMessage();

            api.accountCategory.getTypeList()
                    .success(function (data) {
                      $scope.categoryTypeList = data;
                      $scope.$safeApply();
                    });

            $scope.levelOneCategoryList = [];
            // filter function
            $scope.filterLevelOne = function (type) {
              api.accountCategory.getLevelOneList({
                rootCategory: type
              }).success(function (data) {
                $scope.levelOneCategoryList = data;
                $scope.$safeApply();
              });
            };
            // choose level-one category
            $scope.chooseLevelOne = function (event, item) {
              $('.category-item').removeClass('active');
              $(event.currentTarget).addClass('active');
              $scope.selectedLevelOneCategory = item;
            };
            // click ok button
            $scope.chooseLevelOneOK = function () {
              $modalInstance.close($scope.selectedLevelOneCategory);
            };
            // cancel action, reset new-contact object
            $scope.cancel = function () {
              $modalInstance.dismiss('cancel');
            };
          }]);
