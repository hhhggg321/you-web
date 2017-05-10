'use strict';

angular.module('concordyaApp')
  .controller('ChoiceEntranceCtrl', ['$scope', '$state','$translate', '$translatePartialLoader', 'APIService', 'UtilityService', 'WidgetService', 'StorageService', 'AuthorityService',
    function ($scope, $state ,$translate, $translatePartialLoader, api, utility, widget, storage, authority) {
      $translatePartialLoader.addPart('initialize/choice_entrance');

      var userData = storage.getCurrentUser();

      //choose sample company
      $scope.chooseSample = function(){
        api.company.getSampleCompany(userData.currentCompanyId)
          .success(function(data, status){
            if (status == 200){
              userData.systemEnable = true;
              storage.updateUser(userData);
              $state.go('index');
            }
          })
      };

      // choose add new account
      $scope.addNewAccount = function(){
        //redirect to setting systemGuide
        userData.systemGuide = 1;
        storage.updateUser(userData);
        $state.go('setup/setting_company');
      }
    }]);
