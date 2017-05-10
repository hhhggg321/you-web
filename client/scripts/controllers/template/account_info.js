'use strict';

angular.module('concordyaApp')
        .controller('TemplateAccountInfoCtrl', ['$scope', '$q', '$modalInstance', '$translatePartialLoader', 'WidgetService','UtilityService', 'APIService', 'StorageService', 'accountId',
          function ($scope, $q, $modalInstance, $translatePartialLoader, widget,utility, api, storage, accountId) {
            // add multi-lang file for new_category modal page
            $translatePartialLoader.addPart('template/account_info');
            widget.hideMessage();
            $scope.user = storage.getCurrentUser();

            //unselected department
            var unselectedDepartment = {id : null, name : "--"};
            //get department list
            api.department.getList()
              .success(function (data, status) {
                if (status === 200) {
                  if(data){
                    $scope.departmentList = data;
                    $scope.departmentList.unshift(unselectedDepartment);
                  }
                  $scope.$safeApply();
                }
              });

            $scope.selectRoles = [];
            api.account.get(accountId)
                    .success(function (data) {
                      $scope.account = data;
                      if(!data.department){
                        $scope.account.department = unselectedDepartment;
                      }
                      var ids = $scope.account.roles && $scope.account.roles.split(',') || [];
                      var list = [];
                      for (var i = 0; i < ids.length; i++) {
                        for (var j = 0; j < $scope.roleList.length; j++) {
                          if (parseInt(ids[i]) === $scope.roleList[j].id) {
                            $scope.roleList[j].checked = true;
                            list.push($scope.roleList[j]);
                          };

                        }
                      }
                      $scope.selectRoles = list;
                      $scope.$safeApply();
                    });

            api.account.getRoleEnum()
                    .success(function (data) {
                      _.forEach(data, function (item) {
                        if(item.id===0){
                          item.isdisable=true;
                        };
                      });
                      $scope.roleList = data;
                      $scope.$safeApply();
                    });

            // save action
            $scope.save = function (form) {
              if (form.$valid) {
                var roleId = '';
                for (var i = 0; i < $scope.selectRoles.length; i++) {
                  roleId += $scope.selectRoles[i].id + ',';
                }

                var promises = [];
                var account = {};
                account.id = $scope.account.id;
                account.code = $scope.account.code;
                account.displayName = $scope.account.displayName;
                if($scope.account.department){
                  account.departmentId = $scope.account.department.id;
                }
                account.roles = roleId;
                promises.push(api.account.adminUpdate(account.id, account)
                  .success(function(){
                    if($scope.user.userId == account.id){
                      $scope.user.displayName = account.displayName;
                      $scope.user.department = $scope.account.department;
                      $scope.user.roles = roleId;
                      storage.setCurrentUser($scope.user);
                    }
                  })
                  .error(function(){
                    $scope.account.department = unselectedDepartment;
                  }));
                //promises.push(api.account.editRole(account.id, roleId));
                $q.all(promises)
                        .then(function () {
                          $modalInstance.close();
                        });
              } else {
                utility.addErrorClass(form);
              }
            };

            //enter key down
            $scope.enterKeyDown = function(event){
              if(event.keyCode === 13){
                $scope.save($scope.accountForm)
              }
            };
            // cancel action, reset account object
            $scope.cancel = function () {
              $modalInstance.dismiss('cancel');
            };
          }]);
