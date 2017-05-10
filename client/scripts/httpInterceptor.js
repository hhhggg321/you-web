'use strict';

angular.module('concordyaApp')
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.interceptors.push('HttpInterceptor');
  }])
  .factory('HttpInterceptor', ['$rootScope', '$q', '$location', 'StorageService', 'WidgetService', 'ConfigService',
    function($rootScope, $q, $location, storageService, widget, configService) {
      var needPrefixPath = true,
        needShowLoading = true,
        filterPrefixPathList = ['http://', 'https://', 'i18n', 'views/', 'template', 'directives', 'selectize', 'bootstrap'],
        filterLoadingUrlList = ['i18n', 'views/', 'template', 'directives', 'selectize', 'bootstrap'],
        apiUrlPrefix = configService.config.apiUrl;

      $rootScope.apiUrlPrefix = apiUrlPrefix;

      return {
        request: function(config) {
          needPrefixPath = true;
          needShowLoading = true;

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

          if (needShowLoading) {
            widget.showLoading();
            widget.increaseAjaxCount();
          }

          return config || $q.when(config);
        },
        requestError: function(rejection) {
          widget.cleanAjaxCount();
          widget.hideLoading();
          return $q.reject(rejection);
        },
        response: function(response) {
          needShowLoading = true;
          // check if should show loading mask
          for (var i = 0; i < filterLoadingUrlList.length; i++) {
            if (response.config.url.indexOf(filterLoadingUrlList[i]) !== -1) {
              needPrefixPath = false;
              break;
            }
          }

          if (response.config.url.indexOf('token') !== -1) {
            var data = response.data;
            data.user = JSON.parse(data.user);
            response.data = data;
          }

          if (needShowLoading) {
            if (widget.decreaseAjaxCount() === 0) {
              widget.hideLoading();
            }
          }
          return response;
        },
        responseError: function(rejection) {
          widget.cleanAjaxCount();
          widget.hideLoading();

          if (rejection) {
            var requestUrl = rejection.config && rejection.config.url;

            var urls = ['/account/companies'];
            for (var i = 0; i < urls.length; i++) {
              // there is trick, to go to password reset state when not login in ,
              if (requestUrl.indexOf(urls[i]) !== -1) {
                return;
              }
            }
            // login and register will handle error by themselves
            if (requestUrl && requestUrl.indexOf('token') === -1 && requestUrl.indexOf('/account/register') === -1
              && requestUrl.indexOf('/account/passwordreset') === -1) {
              // show error message
              // error handling depends on http status
              if (rejection.status === 401) {
                $location.path('/');
              } else {
                var msg = null;
                if (rejection.status === 400) {
                  msg = "请求无效";
                  var detail = "";
                  if (rejection.data && rejection.data.message) {
                    switch (rejection.data.message) {
                      case 'The request is invalid.':
                        detail = '访问请求错误！';
                        break;
                      case 'An error has occurred.':
                        detail = '发生错误！';
                        break;

                      default:
                        detail = rejection.data.message
                    }
                    msg += ': ' + detail;
                  }
                }
                if ($('.alert.modal-alert').length > 0) {
                  widget.showModalError(msg);
                } else {
                  widget.showError(msg);
                }
              }
            }
          }

          return $q.reject(rejection);
        }
      };
    }
  ]);
