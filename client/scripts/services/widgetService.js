'use strict';

angular.module('concordyaApp')
        .factory('WidgetService', ['$rootScope', '$timeout',function ($rootScope, $timeout) {
            // ajax request count
            var ajaxRequestCount = 0,
                    isGoToping = false;

            return {
              // increate counter when an ajax request begin
              increaseAjaxCount: function () {
                return ajaxRequestCount++;
              },
              // decreate counter when an ajax request finish
              decreaseAjaxCount: function () {
                ajaxRequestCount--;
                return ajaxRequestCount > 0 ? ajaxRequestCount : 0;
              },
              // clean count when error happened
              cleanAjaxCount: function () {
                ajaxRequestCount = 0;
              },
              // show loading
              showLoading: function () {
                var $loading = $('#loading');
                $loading.show();
              },
              //hide loading
              hideLoading: function () {
                $('#loading').hide();
              },
              // show success dialog
              showSuccess: function (msg, callback) {
                $rootScope.message = {};
                $rootScope.message.success = msg || '成功！';
                this.goTop();
                if(callback && typeof callback === 'function'){
                  $timeout(callback, 3000);
                }
              },
              // show error dialog
              showError: function (msg) {
                $rootScope.message = {};
                $rootScope.message.error = msg || '发生异常！';
                this.goTop();
              },
              // show success dialog
              showModalSuccess: function (msg) {
                $rootScope.message = {};
                $rootScope.message.modalSuccess = msg || '成功！';
              },
              // show error dialog
              showModalError: function (msg) {
                $rootScope.message = {};
                $rootScope.message.modalError = msg || '发生异常！';
              },
              hideMessage: function () {
                $rootScope.message = {};
              },
              goTop: function () {
                if (!isGoToping) {
                  isGoToping = true;
                  $('html,body').animate({scrollTop: '0px'}, 1000, function () {
                    isGoToping = false;
                  });
                }
              }
            };
          }]);
