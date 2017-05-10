'use strict';

angular.module('concordyaApp')
        .controller('TemplateAccountInvitationCtrl', ['$scope', '$modalInstance', '$translatePartialLoader','$translate', 'WidgetService', 'UtilityService', 'APIService',
          function ($scope, $modalInstance, $translatePartialLoader,$translate, widget, utility, api) {
            // add multi-lang file for new_category modal page
            $translatePartialLoader.addPart('template/account_invitation');
            widget.hideMessage();
            //unselected department
            var unselectedDepartment = {id : null, name : "--"};
            $scope.account = {
              'code': $translate.instant("COMMON.AUTOMATIC_GENERATION"),
              'displayName': null,
              'email': null,
              'departmentId': null,
              'roleId': null,
              'message': null
            };
            api.account.getRoleEnum()
                    .success(function (data) {
                      _.forEach(data, function (item) {
                        if(item.id===0){
                          item.isdisable=true;
                          item.checked=true;
                        };
                      });
                      $scope.roleList = data;
                    });
            //get department list
            api.department.getList()
              .success(function (data, status) {
                if (status === 200) {
                  if(data){
                    $scope.departmentList = data;
                    $scope.departmentList.unshift(unselectedDepartment);
                  }
                  $scope.account.department = unselectedDepartment;
                  $scope.$safeApply();
                }
              });
            // save action
            $scope.save = function (form) {
              if (form.$valid) {
                var roleId = null;
                if (!$scope.selectRoles){
                  roleId = "0,"
                }else{
                  for (var i = 0; i < $scope.selectRoles.length; i++) {
                    if (i > 0) {
                      roleId += ',';
                    }
                    roleId += $scope.selectRoles[i].id;
                  }
                }

                api.account.invitation({
                  'code': $scope.account.code,
                  'displayName': $scope.account.displayName,
                  'email': $scope.account.email,
                  'departmentId': $scope.account.department.id,
                  'roleId': roleId,
                  'message': $scope.account.message
                }).success(function () {
                  $modalInstance.close();
                }).error(function(){
                  $scope.account.department = unselectedDepartment;
                });
              } else {
                utility.addErrorClass(form);
              }
            };

            // cancel action, reset account object
            $scope.cancel = function () {
              $modalInstance.dismiss('cancel');
            };

            //enter key down
            $scope.enterKeyDown = function(event){
              if(event.keyCode === 13){
                $scope.save($scope.invitationForm)
              }
            };
            //用于指令diCheckboxGroup调用。
            //由于checkbox点击后，父节点的$untouched不会变，只有采用这种方法手动将$touched设置为true。
            $scope.touched = function () {
              $scope.invitationForm.role.$setTouched(true);
            };
          }]);
