'use strict';

angular.module('concordyaApp')
        .controller('TemplateAssistAccountCtrl', ['$scope', '$rootScope', '$translate', '$translatePartialLoader', 'APIService', 'ModalBoxService', 'WidgetService', 'UtilityService', '$modalInstance', 'itemEditing', 'CONSTANT.PAGE_SIZE',
          function ($scope, $rootScope, $translate, $translatePartialLoader, api, modalBox, widget, utility, $modalInstance, itemEditing, PAGE_SIZE) {
            // add multi-lang file for setting/inventory page
            $translatePartialLoader.addPart('financial_manage/category');
            $scope.category = itemEditing;

            // page object
            $scope.page = {
                index: 1,
                size: PAGE_SIZE,
                total: 0
            };

            var companyId = $rootScope.currentUser.currentCompanyId;
            /*api.assistAccount.getAssistCategories(companyId).success(function(data){
              $scope.categoryList = data;
              $scope.$safeApply();
            });*/
            api.accountCategory.getAssistDetail($scope.category.id)
                .success(function(data){
                  $scope.assistList = data;
                  $scope.originalAssistList = assistCopy();
                  $scope.$safeApply();
                });

            function assistCopy(){
              var result = [];
              var list = $scope.assistList;
              for(var i = 0,len = list.length;i < len; i++){
                var obj = {};
                obj.id = list[i].id;
                obj.name = list[i].name;
                obj.selected = list[i].selected;
                result.push(obj);
              }
              return result;
            }

            $scope.cancel = function () {
              $modalInstance.dismiss('cancel');
            };

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

            utility.watchPageIndex($scope, function (newIndex) {
                getDataList({
                    'pageIndex': newIndex,
                    'pageSize': $scope.page.size
                });
            });

            $scope.loadCategoryItems = function (categoryId) {
                $scope.categoryId = categoryId;
                var params = {
                    'pageIndex': 1,
                    'pageSize': $scope.page.size
                };
                getDataList(params);
            };

            $scope.save = function(){
              var list = $scope.assistList;
              var originalList = $scope.originalAssistList;
              var params = [];

              for(var i = 0,len = list.length;i < len;i ++){
                var obj = {};
                if(list[i].selected === originalList[i].selected){
                  obj.action = "3";
                }
                if(list[i].selected && !originalList[i].selected){
                  obj.action = "0";
                }
                if(!list[i].selected && originalList[i].selected){
                  obj.action = "2";
                }
                obj.assistantaccountingTypeId = list[i].id;
                params.push(obj);
              }

              api.accountCategory.assistAccount($scope.category.id, params).success(function(data){
                $scope.$safeApply();
                $modalInstance.close();
              });

            };

            $scope.assistChange = function(item){
              var list = $scope.originalAssistList;
              var originalSelected = false;
              for(var i = 0,len = list.length;i < len;i ++){
                if(item.id === list[i].id){
                  originalSelected = list[i].selected ? true : false;
                  break;
                }
              }

              if(!item.selected && originalSelected){
                var msg = $translate.instant('CATEGORY.REMOVE_ASSIST_ITEM');
                modalBox.openConfirm(msg)
                        .result.then(function () {
                        },function(){
                          item.selected = true;
                        });
              }
            }

          }]);
