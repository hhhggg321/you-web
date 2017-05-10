/**
 * Created by shansong on 2015/7/14.
 */
'use strict';

angular.module('concordyaApp')
    .controller('TemplateNewCategoryCtrl', ['$scope', '$translatePartialLoader', 'APIService', 'WidgetService', 'UtilityService', '$modalInstance', 'categoryType',
        function ($scope, $translatePartialLoader, api, widget, utility, $modalInstance, categoryType) {
            // add multi-lang file for setting/contact page
            $translatePartialLoader.addPart('basic_setting/assist_account');

            var categoryTypeId = categoryType.id;
            widget.hideMessage();

            $scope.newCategory = {
                code: null,
                name: null
            };
            $scope.categoryTypeName = categoryType.name;
            // save action
            $scope.save = function (form) {
                if (form.$valid) {
                    var newCategory = $scope.newCategory;
                    api.assistAccount.createCategoryItem(categoryTypeId, newCategory)
                        .success(function () {
                            $modalInstance.close();
                        });
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
            };
        }]);
