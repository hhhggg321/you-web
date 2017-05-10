'use strict';

angular.module('concordyaApp')
        .controller('CategoryCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$translatePartialLoader', 'APIService', 'UtilityService',
          function ($rootScope, $scope, $state, $stateParams, $translatePartialLoader, api, utility) {
            // add multi-lang file for setting/category page
            $translatePartialLoader.addPart('financial_manage/category');

            $scope.displayDetail = true;
            $scope.layout = 1;
            $scope.searchForm = {
              currentHappenDisabled: true,
              yearTotalDisabled: false,
              currentHappen: true,
              yearTotal: false,
              year: null,
              month: null
            };

            function buildDownloadUrl() {
              var form = $scope.searchForm,
                      showType = null;
              if (form.currentHappen && form.yearTotal) {
                showType = 3;
              } else if (form.currentHappenDisabled) {
                showType = 1;
              } else if (form.yearTotalDisabled) {
                showType = 2;
              }

              $scope.downloadUrl = $rootScope.apiUrlPrefix + 'accountcategory/download/' + form.year.id
                      + '/' + form.month.id + '/' + $scope.displayDetail
                      + '/' + showType + '/' + $rootScope.currentUser.currentCompanyId;
            }

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

            function getCategoryData() {
              api.accountCategory.getAllData($scope.searchForm.year.id, $scope.searchForm.month.id).
                      success(function (data) {
                        $scope.dataList = data;
                        if ($scope.displayDetail) {
                          displayData(true);
                        } else {
                          displayData(false);
                        }
                        buildDownloadUrl();
                        $scope.$safeApply();
                      });
            }

            api.company.getAccountingPeriod($rootScope.currentUser.currentCompanyId)
                    .success(function (data) {
                      $scope.accountPeriod = data;
                      $scope.yearList = utility.map(data.years);
                      $scope.searchForm.currentHappenDisabled=true;
                      $scope.searchForm.currentHappen=true;

                     //$scope.searchForm.
                      var currentYear = data.currentYear,
                              currentMonth = data.currentMonth,
                              periods = data.accountingPeriods;
                      var year = ($stateParams.year && $stateParams.year.id) || currentYear;
                      var month = ($stateParams.month && $stateParams.month.id) || currentMonth;

                      $scope.searchForm.year = {id: year, name: year};
                      $scope.searchForm.month = {id: month, name: month};

                      for (var i = 0, len = periods.length; i < len; i++) {
                        if (year === periods[i].year) {
                          $scope.monthList = utility.map(periods[i].months);
                          break;
                        }
                      }
                      getCategoryData();
                    });
            // year total or current happen
            $scope.changeLayout = function () {
              var form = $scope.searchForm;

              if (form.currentHappen && form.yearTotal) {
                form.currentHappenDisabled = false;
                form.yearTotalDisabled = false;
                $scope.layout = 3;
              } else if (form.currentHappen || form.yearTotal) {
                if (form.currentHappen) {
                  $scope.layout = 1;
                  form.currentHappenDisabled = true;
                } else {
                  $scope.layout = 2;
                  form.yearTotalDisabled = true;
                }
              }
              buildDownloadUrl();
            };

            function getMonthList(year) {
              var periods = $scope.accountPeriod.accountingPeriods;
              for (var i = 0, len = periods.length; i < len; i++) {
                if (year === periods[i].year) {
                  return utility.map(periods[i].months);
                }
              }
              return [];
            }

            $scope.toggleDisplay = function () {
              $scope.displayDetail = !$scope.displayDetail;
              if ($scope.displayDetail) {
                displayData(true);
              } else {
                displayData(false);
              }
              buildDownloadUrl();
            };

            $scope.expansion = function (item) {
              item.isExpansion = !item.isExpansion;
              var list = $scope.dataList;
              for (var i = 0, len = list.length; i < len; i++) {
                var code = list[i].code;
                if (code.indexOf(item.code) === 0 && code !== item.code) {
                  list[i].show = item.isExpansion ? false : true;
                  if(list[i].hasChildren){
                    list[i].isExpansion = false;
                  }
                }
              }
            };

            $scope.search = function () {
              getCategoryData();
            };

            $scope.selectCategory = function (item,event) {
              console.log(event);
              // ����ѡ�е���
              _.forEach($scope.dataList, function (data) {
                if (data !== item) {
                  data.selected = false;
                  data.isOpen = false;
                }
              });
              item.selected = !item.selected;
              item.isOpen = !item.isOpen;
              $scope.selectedItem = null;
              if (item.selected) {
                $scope.selectedItem = item;
              }
              var offsetX = $("#category").offset().left + 15;
              var offsetY = $("#category").offset().top;
              var x = event.pageX - offsetX;
              var y = event.pageY - offsetY;
              $(event.currentTarget).children("td").eq(0).children('ul').css({"left":x,"top":y});
            };


            $scope.gotoDetailAccount = function () {
              $state.go('finance/detail_account', {id: $scope.selectedItem.id});
            };

            $scope.gotoAssistAccount = function (item) {
                $state.go('finance/assistant_account',
                    {
                      accountCategory:{id: item.id, name: item.name, code: item.code},
                      year: $scope.searchForm.year,
                      month: $scope.searchForm.month,
                      assistantAccountType: item._option,
                      currentHappenDisabled: $scope.searchForm.currentHappenDisabled,
                      yearTotalDisabled: $scope.searchForm.yearTotalDisabled,
                      yearTotal: $scope.searchForm.yearTotal,
                      currentHappen: $scope.searchForm.currentHappen
                    });
            };

            $scope.changeYear = function () {
              var year = $scope.searchForm.year;
              if (year && year.id) {
                $scope.monthList = getMonthList(year.id);
                $scope.searchForm.month = $scope.monthList[0];
              }
            };

            $scope.itemBindAssistInfo = function (item) {
              if (item.bindedAssistantTypes) {
                var content = "";
                for (var i = 0, len = item.bindedAssistantTypes.length; i < len; i++) {
                  content += "," + item.bindedAssistantTypes[i].name;
                }
                return content.substring(1);
              }
            };

          }]);
