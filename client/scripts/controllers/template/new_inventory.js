'use strict';

angular.module('concordyaApp')
        .controller('TemplateNewInventoryCtrl', ['$scope', '$translatePartialLoader','$translate', 'APIService', 'WidgetService', 'UtilityService', '$modalInstance', 'itemEditing',
          function ($scope, $translatePartialLoader, $translate,api, widget, utility, $modalInstance, itemEditing) {
            // add multi-lang file for setting/inventory page
            $translatePartialLoader.addPart('basic_setting/inventory');
            widget.hideMessage();

            $scope.newInventory = {
              code: null,
              name: null,
              description: null,
              isForBuy: true,
              isForSell: false,
              accountingCategoryModel: null,
              taxRate: null
            };

            api.inventoryItem.getTypeEnum()
                    .success(function (data) {
                      $scope.typeList = data;
                    });

            // get category list
            api.accountCategory.getHasTaxList()
                    .success(function (data) {
                      $scope.categoryList = data;
                      $scope.$safeApply();
                    });

            // get taxrate list
            api.taxRate.getAllList()
                    .success(function (data) {
                      $scope.taxRateList = data;
                      $scope.$safeApply();
                    });

            if (itemEditing) {
              api.inventoryItem.get(itemEditing.id)
                      .success(function (data) {
                        var list = [],
                                typeList = $scope.typeList;
                        for (var i = 0; i < typeList.length; i++) {
                          if (data.isForBuy && typeList[i].id === 0
                                  || data.isForSell && typeList[i].id === 1) {
                            typeList[i].checked = true;
                            list.push(typeList[i]);
                          }
                        }
                        $scope.selectTypes = list;

                        itemEditing = data;
                        $scope.newInventory = _.cloneDeep(itemEditing);
                        $scope.$safeApply();
                      });
            }else{
              $scope.newInventory.code = $translate.instant("COMMON.AUTOMATIC_GENERATION");
            }


            // get cancel-watch function
            var cancelWatch = $scope.$watch('selectTypes', function (newVal) {
              if (newVal) {
                var newInventory = $scope.newInventory;
                newInventory.isForBuy = false;
                newInventory.isForSell = false;
                for (var i = 0; i < newVal.length; i++) {
                  if (newVal[i].checked) {
                    if (newVal[i].id === 0) {
                      newInventory.isForBuy = true;
                    } else if (newVal[i].id === 1) {
                      newInventory.isForSell = true;
                    }
                  }
                }
                if (!newInventory.isForSell) {
                  newInventory.accountingCategoryModel = null;
                  newInventory.taxRate = null;
                }
              }
            }, true);
            // remove watch on state-change for performance reason
            $scope.$on('$stateChangeStart', function () {
              cancelWatch();
            });

            // save action
            $scope.save = function (form) {
              if (form.$valid) {
                var newInventory = $scope.newInventory;
                newInventory.accountingCategoryId = newInventory.accountingCategoryModel && newInventory.accountingCategoryModel.id || null;
                newInventory.taxRateId = newInventory.taxRate && newInventory.taxRate.id || null;
                if (itemEditing) {
                  var data = utility.getDiff(itemEditing, newInventory);
                  if (data) {
                    api.inventoryItem.update(itemEditing.id, data)
                            .success(function () {
                              $modalInstance.close();
                            });
                  }
                } else {
                  api.inventoryItem.create(newInventory)
                          .success(function () {
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
                $scope.save($scope.newInventoryForm)
              }
            };
            // cancel action, reset new-inventory object
            $scope.cancel = function () {
              $modalInstance.dismiss('cancel');
            };
          }]);
