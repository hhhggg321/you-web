
'use strict';

angular.module('concordyaApp')
  .controller('TemplateNewDepartmentCtrl', ['$scope', '$modalInstance', '$translatePartialLoader','$translate', 'WidgetService', 'UtilityService', 'APIService','itemEditing',
    function ($scope, $modalInstance, $translatePartialLoader,$translate, widget, utility, api,itemEditing) {
      // add multi-lang file for new_category modal page
      $translatePartialLoader.addPart('basic_setting/department');
      widget.hideMessage();
      //unselected department
      var unselectedDepartment = {id : null, name : "--"};
      var params = null;
      $scope.categoryList=null;
      //getAccountingCategoryList();
      //get account category list
      function getAccountingCategoryList(){
        api.expenseAccountSetting.getAccountingCategoryList()
          .success(function(data){
            //$scope.categoryList = data;
            $scope.categoryList = [];
            _.forEach(data,function(item){
              $scope.categoryList.push({id:item.code,name:item.name,code:item.code});

            });
          });
      }
      getAccountingCategoryList();
      window.setTimeout(function(){

      },1000);
      //for update
      if(itemEditing){
        $scope.department = _.cloneDeep(itemEditing);
        $scope.department.category={'id':itemEditing.accountCategoryCode,'name':itemEditing.accountCategoryName,code:itemEditing.accountCategoryCode};
        params = {departmentId : itemEditing.id};
      }else{
        //for create
        $scope.department = {
          code : $translate.instant("COMMON.AUTOMATIC_GENERATION"),
          name : null,
          parentDepartment : {
            id : null,
            name : null
          },
          description : null,
          category : null,
          accountCategoryCode : null,
          accountCategoryName : null,
        };
        //set default superior department
        $scope.department.parentDepartment = unselectedDepartment;
        $scope.$safeApply();
      }
      //get department list
      api.department.getList(params)
        .success(function (data, status) {
          if (status === 200) {
            if(data){
              $scope.departmentList = data;
              $scope.departmentList.unshift(unselectedDepartment);
            }
            $scope.$safeApply();
          }
        });
      // save action
      $scope.save = function (form) {
        if (form.$valid) {
          var department = {};
          department.code = $scope.department.code;
          department.name = $scope.department.name;
          department.parentId = $scope.department.parentDepartment && $scope.department.parentDepartment.id;
          department.description = $scope.department.description;
          department.accountCategoryCode = $scope.department.category && $scope.department.category.id;
          console.log(department);

          //update
          if(itemEditing){
            api.department.update(itemEditing.id,department)
              .success(function (){
              $modalInstance.close();
            }).error(function(){
                $scope.department.parentDepartment = unselectedDepartment;
              });
          }else{
          //create
            api.department.create(department)
              .success(function () {
              $modalInstance.close();
            }).error(function(){
                $scope.department.parentDepartment = unselectedDepartment;
              });
          }
        } else {
          utility.addErrorClass(form);
        }
      };

      //enter key down
      $scope.enterKeyDown = function(event){
        if(event.keyCode === 13){
          $scope.save($scope.newDepartmentForm);
        }
      };
      // cancel action, reset account object
      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };

    }]);
