'use strict';

angular.module('concordyaApp')
        .factory('TranslateService', ['$http', '$translate', 'uibDatepickerPopupConfig',
          function ($http, $translate, datepickerPopupConfig) {
            return {
              // change 'Accept-Language' of http header
              changeHttpHeader: function () {
                $http.defaults.headers.common['Accept-Language'] = $translate.use();
              },
              // change uib-datepicker-popup-config, when switch language
              changeDatePickerConfig: function () {
                datepickerPopupConfig.clearText = $translate.instant('CLEAR');
                datepickerPopupConfig.closeText = $translate.instant('DONE');
                datepickerPopupConfig.currentText = $translate.instant('TODAY');
              }
            };
          }]);
