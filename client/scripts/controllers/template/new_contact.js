'use strict';

angular.module('concordyaApp')
        .controller('TemplateNewContactCtrl', ['$scope', '$translatePartialLoader', '$translate','APIService', 'WidgetService', 'UtilityService', '$modalInstance', 'itemEditing',
          function ($scope, $translatePartialLoader,$translate, api, widget, utility, $modalInstance, itemEditing) {
            // add multi-lang file for setting/contact page
            $translatePartialLoader.addPart('basic_setting/contact');
            widget.hideMessage();

            // address-list object
            $scope.addressList = {
              province: [],
              city: [],
              area: []
            };

            api.contact.getRoleEnum()
                    .success(function (data) {
                      $scope.roleList = data;
                    });

            if (itemEditing) {
              api.contact.get(itemEditing.id)
                      .success(function (data) {
                        if (data.address) {
                          var address = data.address;
                          address.province = {
                            id: address.provinceId,
                            name: address.provinceName
                          };
                          address.city = {
                            id: address.cityId,
                            name: address.cityName
                          };
                          address.area = {
                            id: address.areaId,
                            name: address.areaName
                          };
                        } else {
                          data.address = {
                            'province': null,
                            'city': null,
                            'area': null,
                            'street': null
                          };
                        }

                        var list = [],
                                roleList = $scope.roleList;
                        for (var i = 0; i < roleList.length; i++) {
                          if (data.isVendor && roleList[i].id === 0
                                  || data.isCustomer && roleList[i].id === 1) {
                            roleList[i].checked = true;
                            list.push(roleList[i]);
                          }
                        }
                        $scope.selectRoles = list;

                        itemEditing = data;
                        $scope.newContact = _.cloneDeep(data);
                        $scope.$safeApply();
                      });
            } else {
              $scope.newContact = {
                code: $translate.instant("COMMON.AUTOMATIC_GENERATION"),
                name: null,
                accountNumber: null,
                phone: null,
                accountName: null,
                email: null,
                taxpayerIdNumber: null,
                address: {
                  province: null,
                  city: null,
                  area: null,
                  street: null
                },
                isVendor: false,
                isCustomer: false
              };
            }

            // first get all province list
            api.area.get()
                    .success(function (data) {
                      $scope.addressList.province = data;
                      $scope.$safeApply();
                    });

            // change province, get city list
            $scope.changeProvince = function () {
              var address = $scope.newContact.address;
              if (address && address.province && address.province.id) {
                api.area.get(address.province.id)
                        .success(function (data) {
                          address.city = null;
                          address.area = null;
                          $scope.addressList.city = data;
                          $scope.addressList.area = [];
                          $scope.$safeApply();
                        });
              }
            };

            // change city, get area list
            $scope.changeCity = function () {
              var address = $scope.newContact.address;
              if (address && address.city && address.city.id) {
                api.area.get(address.city.id)
                        .success(function (data) {
                          address.area = null;
                          $scope.addressList.area = data;
                          $scope.$safeApply();
                        });
              }
            };

            // change address style
            function addressAdapter() {
              var address = $scope.newContact.address;
              if (address && address.province && address.city && address.area) {
                address.provinceId = address.province.id;
                address.provinceName = address.province.name;
                address.cityId = address.city.id;
                address.cityName = address.city.name;
                address.areaId = address.area.id;
                address.areaName = address.area.name;
              }
            }

            // save action
            $scope.save = function (form) {
              if (form.$valid) {
                addressAdapter();
                // check user's role
                var selectRoles = $scope.selectRoles,
                        newContact = $scope.newContact;
                newContact.isVendor = false;
                newContact.isCustomer = false;
                for (var i = 0; i < selectRoles.length; i++) {
                  if (selectRoles[i].id === 0) {
                    newContact.isVendor = true;
                  } else if (selectRoles[i].id === 1) {
                    newContact.isCustomer = true;
                  }
                }
                if (itemEditing) {
                  var data = utility.getDiff(itemEditing, newContact);
                  if (data) {
                    api.contact.update(itemEditing.id, data)
                            .success(function () {
                              $modalInstance.close();
                            });
                  }
                } else {
                  api.contact.create($scope.newContact)
                          .success(function () {
                            $modalInstance.close();
                          });
                }
              } else {
                utility.addErrorClass(form);
              }
            };

            // enter key down
            $scope.enterKeyDown = function(event){
              if(event.keyCode === 13){
                $scope.save($scope.newContactForm)
              }
            };
            // cancel action, reset new-contact object
            $scope.cancel = function () {
              $modalInstance.dismiss('cancel');
            };
          }]);
