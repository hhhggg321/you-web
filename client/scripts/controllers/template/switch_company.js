'use strict';

angular.module('concordyaApp')
        .controller('TemplateSwitchCompanyCtrl', ['$rootScope','$scope', '$modalInstance', '$translatePartialLoader', '$state', 'AuthorityService', 'WidgetService', 'UtilityService', 'APIService', 'StorageService', 'companyId', 'companyName',
          function ($rootScope, $scope, $modalInstance, $translatePartialLoader, $state, authority, widget, utility, api, storage, companyId, companyName) {
            // add multi-lang file for new_category modal page
            $translatePartialLoader.addPart('header');
            widget.hideMessage();

            $scope.password = '';
            $scope.username = $rootScope.currentUser.phoneNumber ? $rootScope.currentUser.phoneNumber : $rootScope.currentUser.email ;
            $scope.companyName = companyName;
            $scope.confirm = function (form) {
              if (form.$valid) {
                api.account.login({
                  'grant_type': 'password',
                  'username': $scope.username,
                  'password': $scope.password,
                  'company_id': companyId
                }).success(function (oauthToken) {

                  storage.setToken(oauthToken);
                  api.company.getStatus(oauthToken.user.currentCompanyId)
                    .success(function (data) {
                      oauthToken.user.systemEnable = data.enable;
                      oauthToken.user.systemGuide = data.systemGuide;
                        storage.setToken(oauthToken);
                        if (oauthToken.user.systemEnable) {
                            $state.go('index', {}, { reload: true });
                        } else {
                          var url = '';
                          switch (oauthToken.user.systemGuide) {
                            case null:
                            case 0 :
                              url = 'setup/choice_entrance';
                              break;
                            case 1:
                              url = 'setup/setting_company';
                              break;
                            case 2:
                              url = 'setup/setting_category';
                              break;
                            case 3:
                              url = 'setup/setting_category_balance';
                              break;
                            case 4:
                              url = 'setup/setting_finish';
                              break;
                          }
                          $state.go(url);
                        }
                        $modalInstance.close();
                    });

                }).error(function (data) {
                  $scope.errorMessage = data && data.error_description;
                  $scope.$safeApply();
                });
              } else {
                utility.addErrorClass(form);
              }
            };

            $scope.enterKeyDown = function(event){
              if(event.keyCode === 13){
                $scope.confirm($scope.approveForm);
              }
            };

            // cancel action, reset account object
            $scope.cancel = function () {
              $modalInstance.dismiss('cancel');
            };
          }]);
