'use strict';

angular.module('concordyaApp')
  .config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.interceptors.push('HttpInterceptor');
  }])
  .factory('HttpInterceptor', ['$rootScope', '$q', '$location', 'StorageService', 'ConfigService',
    function ($rootScope, $q, $location, storageService, configService) {
      var needPrefixPath = true,
        filterPrefixPathList = ['http://', 'https://', 'i18n', 'views/', 'template', 'directives'],
        filterLoadingUrlList = ['i18n', 'views/', 'template', 'directives'];

      return {
        request: function (config) {
          needPrefixPath = true;

          // check if should add url-prefix
          for (var i = 0; i < filterPrefixPathList.length; i++) {
            if (config.url.indexOf(filterPrefixPathList[i]) !== -1) {
              needPrefixPath = false;
              break;
            }
          }

          if (needPrefixPath) {
            if (config.url === 'token') {
              config.url = configService.config.apiUrl + config.url;
            } else {
              config.url = configService.config.apiUrl + configService.config.apiVersion + '/' + config.url;

              // get access-token from cookie
              var token = storageService.getToken();

              if ($rootScope.currentUser && token && token.access_token) {
                config.headers.Authorization = 'bearer ' + token.access_token;
              }
            }
          }

          // check if should show loading mask
          for (var j = 0; j < filterLoadingUrlList.length; j++) {
            if (config.url.indexOf(filterLoadingUrlList[j]) !== -1) {
              needPrefixPath = false;
              break;
            }
          }

          $('#loading').show();

          return config || $q.when(config);
        },

        requestError: function (rejection) {
          return $q.reject(rejection);
        },

        response: function (response) {
          // check if should show loading mask
          for (var i = 0; i < filterLoadingUrlList.length; i++) {
            if (response.config.url.indexOf(filterLoadingUrlList[i]) !== -1) {
              needPrefixPath = false;
              break;
            }
          }

          if (response.config.url.indexOf('token') !== -1 || response.config.url.indexOf('register') !== -1) {
            var data = response.data;
            data.user = JSON.parse(data.user);
            response.data = data;
          }
          $('#loading').hide();

          return response;
        },

        responseError: function (rejection) {
          $('#loading').hide();
          return $q.reject(rejection);
        }
      };
    }]);
