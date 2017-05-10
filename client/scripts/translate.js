'use strict';

angular.module('concordyaApp')
        .config(['$translateProvider','defaultI18nService', function ($translateProvider, defaultI18n) {
            $translateProvider
                    .useLoader('$translatePartialLoader', {
                      urlTemplate: '/i18n/{part}/{lang}.json'
                    })
                    .registerAvailableLanguageKeys(['en', 'zh_CN'], {
                      'en_US': 'en',
                      'en_UK': 'en',
                      'zh-CN': 'zh_CN'
                    })
                    .translations('zh_CN', defaultI18n.CZ)
                    .determinePreferredLanguage()
                    .fallbackLanguage('zh_CN')
                    .useLoaderCache(true)
                    .useSanitizeValueStrategy('escaped')
                    .preferredLanguage('zh_CN');
          }])
        .config(['tmhDynamicLocaleProvider', function (tmhDynamicLocaleProvider) {
            // reset locale location
            tmhDynamicLocaleProvider.localeLocationPattern('/i18n/angular-locale_{{locale}}.js');
          }])
        .run(['$rootScope', '$translate', '$translatePartialLoader', 'tmhDynamicLocale', 'TranslateService',
          function ($rootScope, $translate, $translatePartialLoader, tmhDynamicLocale, translateService) {
            // load common multi-language files
            $translatePartialLoader
                    .addPart('common')
                    .addPart('header')
                    .addPart('enum');

            $rootScope.$on('$translatePartialLoaderStructureChanged', function () {
              $translate.refresh($translate.use());
            });

            // change date-picker-config when loaded new language packet
            $rootScope.$on('$translateLoadingSuccess', function () {
              translateService.changeDatePickerConfig();
            });

            // load correct language parket
            tmhDynamicLocale.set($translate.use());
          }]);
