'use strict';

angular.module('concordyaApp')
    .controller('SettingCompanyCtrl', ['$scope', '$state', '$translate', '$translatePartialLoader', 'APIService', 'UtilityService', 'WidgetService', 'StorageService',
        function ($scope, $state, $translate, $translatePartialLoader, api, utility, widget, storage) {
            $translatePartialLoader.addPart('initialize/setting_company');

            $scope.company = {
                name: null,
                companyNature: {
                  id: 0, //default value
                  name:'小规模企业'
                },
                companyCategory: null,
                province: null,
                city: null,
                area: null,
                accountCategoryType: 1,
                openingYear: null,
                openingMonth: null
            };

            var currentUser = storage.getCurrentUser();
            if (currentUser) {
                $scope.disabledSetting = currentUser.systemEnable ? true : !currentUser.isAccoundant;

                // get company info
                api.company.get(currentUser.currentCompanyId + '?isGuide=true')
                    .success(function (data) {
                        if (data.name) {
                            $scope.company.name = data.name;
                        }
                        if (data.province && data.province.id) {
                            $scope.company.province = data.province;
                        }
                        if (data.city && data.city.id) {
                            $scope.company.city = data.city;
                        }
                        if (data.area && data.area.id) {
                            $scope.company.area = data.area;
                        }
                        if (data.companyNature && data.companyNature.id) {
                            $scope.company.companyNature = data.companyNature;
                        }
                        if (data.accountCategoryType && data.accountCategoryType.id) {
                            $scope.company.accountCategoryType = data.accountCategoryType;
                        }
                        if (data.openingYear) {
                            $scope.company.openingYear = {
                                id: data.openingYear,
                                name: data.openingYear
                            };
                        }
                        if (data.openingMonth) {
                            $scope.company.openingMonth = {
                                id: data.openingMonth,
                                name: data.openingMonth
                            };
                        }
                    });

                // get province list
                if (!$scope.disabledSetting) {
                    api.area.get()
                        .success(function (data) {
                            $scope.provinceList = data;
                            $scope.$safeApply();
                        });
                }

                // get year list
                api.date.getYearList()
                    .success(function (data) {
                        $scope.yearList = data;
                        $scope.company.openingYear = data[0];
                        $scope.$safeApply();
                    });

                // get month list
                api.date.getMonthList()
                    .success(function (data) {
                        $scope.monthList = data;
                        $scope.company.openingMonth = data[0];
                        $scope.$safeApply();
                    });
            }

            // get city list
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

            // get area list
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
                if ($scope.disabledSetting) {
                    if ($state.is('setup/setting_company')) {
                        $state.go('setup/setting_category');
                    }
                } else {
                    if (form.$valid) {
                        var company = $scope.company;
                        api.company.update({
                            'id': currentUser.currentCompanyId,
                            'name': company.name,
                            'companyNature': parseInt(company.companyNature.id),
                            'companyCategoryId': company.companyCategory && company.companyCategory.id,
                            'provinceId': company.province && company.province.id,
                            'cityId': company.city && company.city.id,
                            'areaId': company.area && company.area.id,
                            'accountCategoryType': company.accountCategoryType,
                            'openingYear': company.openingYear && company.openingYear.id,
                            'openingMonth': company.openingMonth && company.openingMonth.id
                        }).success(function () {
                            currentUser.systemGuide = 2;
                            storage.updateUser(currentUser);
                            $state.go('setup/setting_category');
                        });
                    } else {
                        utility.addErrorClass(form);
                    }
                }
            };

            $scope.cancel = function (form) {
                utility.removeErrorClass(form);
            };
        }]);
