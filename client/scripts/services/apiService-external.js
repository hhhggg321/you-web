'use strict';
angular.module('concordyaApp')
  .factory('APIService', ['$http', '$httpParamSerializer',
    function ($http, $httpParamSerializer) {
      var api = {
        // account
        account: {
          //login
          login: function (data) {
            var postConfig = { headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
                }};
            return $http.post('token', $httpParamSerializer(data), postConfig);
          },
          //register
          register: function (data) {
            return $http.post('account/register', data);
          },
          //accept-invitation
          confirmInvitation: function (data) {
            return $http.post('account/confirminvitation', data);
          },
          //verify-email
          verifyEmail: function(data) {
            return $http.post('account/confirmemail',data);
          },
          resetPassword: function(data) {
            return $http.post('account/passwordreset',data);
          },
          //accept-invitation
          setPassword: function (data, token) {
            var req = {
              method: 'POST',
              url: 'account/setpassword',
              headers: {
                'Authorization': 'bearer ' + token
              },
              data: data
            };
            return $http(req);
          },
          //register
          verifyPhone: function (phoneNumber, captchaChallenge, captchaValidate, captchaSeccode) {
            return $http.get('account/verifyphone/' + phoneNumber + '?captchaChallenge=' + captchaChallenge + '&captchaValidate=' + captchaValidate + '&captchaSeccode=' + captchaSeccode);
          },
          //register
          getGTServerStatus: function () { // get captcha server status
            return $http.get('captcha/status');
          }
        },
        // company
        company: {
          //login
          getStatus: function (id) {
            return $http.get('company/status/' + id);
          }
        }
      };

      return api;
    }
  ]);
