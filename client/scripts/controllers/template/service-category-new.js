
'use strict';

angular.module('concordyaApp')
  .controller('TemplateNewServiceCategoryCtrl', ['$scope','$modalInstance',  'APIService', 'WidgetService', 'UtilityService', 'ModalBoxService','itemEditing','$state',
    function ($scope,$modalInstance,api, widget, utility, modalBox,itemEditing,$state) {
      // add multi-lang file for new_category modal page
      widget.hideMessage();

      if(itemEditing)
      {
        $scope.servicecategory = _.cloneDeep(itemEditing);
        console.log($scope.servicecategory);
      }else {
        //作用域内定义对象
        $scope.servicecategory = {
          id:null,
          code:'自动生成',
          name:null,
          description:null
        };
        $scope.$safeApply();
      }

      //save
      $scope.save = function(form){
        if(form.$valid){
          var servicecategory ={};

          servicecategory.code = $scope.servicecategory.code;
          servicecategory.name = $scope.servicecategory.name;
          servicecategory.description = $scope.servicecategory.description;
          console.log(servicecategory);

          if(itemEditing){
            servicecategory.id   = $scope.servicecategory.id;
            api.serviceCategory.update(servicecategory).success(function(){
              $modalInstance.close();
              //$state.go('settings/service-category',{isshow:true,message:'修改成功'});
              //$state.go('business/petty_cashs', {isshow: true,message:$translate.instant("PETTY_CASH.MESSAGE_SUBMIT_SUCCESS")});
            });
          }else{
            api.serviceCategory.create(servicecategory)
            .success(function () {
              $modalInstance.close();
              //$state.go('settings/service-category',{isshow:true,message:'修改成功'});
            });
          }
        }else{
          utility.addErrorClass(form);
        }
      };
      //取消事件
      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    }]);
