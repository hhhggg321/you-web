'use strict';

angular.module('concordyaApp')
  .controller('CompanyCtrl', ['$scope', '$rootScope', '$translate', '$translatePartialLoader', 'APIService', 'WidgetService', 'StorageService',
    function ($scope, $rootScope, $translate, $translatePartialLoader, api, widget, storage) {
      $translatePartialLoader.addPart('initialize/setting_company');
      var currentUser = storage.getCurrentUser();
      $scope.disabledSetting = currentUser.systemEnable ? true : !currentUser.isAccoundant;

      $scope.company = {
        name: null,
        companyNature: null,
        companyCategory: null,
        province: null,
        city: null,
        area: null,
        accountCategoryType: 1,
        openingYear: null,
        openingMonth: null
      };

      if (currentUser) {
        // get company info
        api.company.get(currentUser.currentCompanyId)
          .success(function (data) {
            $scope.company = data;
            getAreaList();
            $scope.$safeApply();
          });

        // get province list
        api.area.get()
          .success(function (data) {
            $scope.provinceList = data;
            $scope.$safeApply();
          });
      }

      function getAreaList() {
        var province = $scope.company.province,
          city = $scope.company.city;

        // get city list
        if (province && province.id) {
          api.area.get(province.id)
            .success(function (data) {
              $scope.cityList = data;
              $scope.$safeApply();
            });
        }

        // get area list
        if (city && city.id) {
          api.area.get(city.id)
            .success(function (data) {
              $scope.areaList = data;
              $scope.$safeApply();
            });
        }
      }

      $scope.expansion = function (item) {
        item.isExpansion = !item.isExpansion;
        var list = $scope.dataList;
        for (var i = 0, len = list.length; i < len; i++) {
          var code = list[i].code;
          if (code.indexOf(item.code) === 0 && code !== item.code) {
            list[i].show = item.isExpansion ? false : true;
            if (list[i].hasChildren) {
              list[i].isExpansion = false;
            }
          }
        }
      };
      // get city list when change province
      $scope.changeProvince = function () {
        var province = $scope.company.province;
        if (province && province.id) {
          api.area.get(province.id)
            .success(function (data) {
              $scope.cityList = data;
              $scope.company.city = data && data[0];
              $scope.changeCity();
              $scope.$safeApply();
            });
        }
      };

      // get area list when change city
      $scope.changeCity = function () {
        var city = $scope.company.city;
        if (city && city.id) {
          api.area.get(city.id)
            .success(function (data) {
              $scope.areaList = data;
              $scope.company.area = data && data[0];
              $scope.$safeApply();
            });
        }
      };

      $scope.save = function (form) {
        if (form.$valid) {
          var company = $scope.company;

          api.company.modify({
            'id': currentUser.currentCompanyId,
            'name': company.name,
            'companyNature': company.companyNature.id,
            'provinceId': company.province && company.province.id,
            'cityId': company.city && company.city.id,
            'areaId': company.area && company.area.id
          }).success(function () {
            $rootScope.currentCompanyName = company.name;
            $rootScope.$safeApply();
            widget.showSuccess('更新公司成功');
          });
        } else {
          utility.addErrorClass(form);
        }
      };

      function displayData(display) {
        var list = $scope.dataList;
        for (var i = 0, len = list.length; i < len; i++) {
          if (display) {
            list[i].isExpansion = false;
          }
          if (list[i].level > 1) {
            list[i].show = display;
          }
        }
      }
      // switch to 期初数据 tab
      $scope.switchToBalance = function(){
        // get account-category balance
        api.accountCategory.getBalanceSet()
          .success(function (data) {
            $scope.dataList = data;
            displayData(true);
            $scope.$safeApply();
          });
      }
    }]);
