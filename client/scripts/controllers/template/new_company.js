'use strict';

angular.module('concordyaApp')
  .controller('TemplateNewCompanyCtrl', ['$scope', '$modalInstance', '$translatePartialLoader', '$state', 'WidgetService', 'UtilityService', 'APIService', 'StorageService',
    function ($scope, $modalInstance, $translatePartialLoader, $state, widget, utility, api, storage) {
      // add multi-lang file for new_category modal page
      $translatePartialLoader.addPart('header');
      widget.hideMessage();

      $scope.newCompanyName = '';
      $scope.confirm = function (form) {
        if (form.$valid) {
          var companyName = $scope.newCompanyName;
          companyName=companyName.toString().replace(/\s+/g,"");
          api.company.addNewCompany(encodeURI(companyName))
            .success(function(){
              $modalInstance.close();
            });
        } else {
          utility.addErrorClass(form);
        }
      };

      //Enter key down
      $scope.enterKeyDown = function(event){
        if(event.keyCode === 13){
          $scope.confirm($scope.newCompanyForm);
        }
      };

      // cancel action, reset account object
      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    }]);

