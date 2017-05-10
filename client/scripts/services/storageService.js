'use strict';

angular.module('concordyaApp')
  .factory('StorageService', ['$cookies', '$rootScope', 'CONSTANT.OAUTH_TOKEN',
      function($cookies, $rootScope, OAUTH_TOKEN) {
        var setCookie = function(key, value) {
          var expireDate = new Date();
          expireDate.setDate(expireDate.getDate() + 1);
          // Setting a cookie with expiration and secure
          //$cookies.put(key, value, {'expires': expireDate, 'secure': true});
          var cookieValue = JSON.stringify(value);
          $cookies.put(key, cookieValue, {'expires': expireDate});
        };

        var removeCookie = function(key) {
          $cookies.remove(key);
        };

        var getCookie = function(key) {
          return $cookies.get(key);
        };

        var setToken = function(oauthToken) {
          if (oauthToken) {
            var roles = oauthToken.user.role;

            oauthToken.user.isUser = false;
            oauthToken.user.isAccoundant = false;
            oauthToken.user.isCashier = false;
            oauthToken.user.isAdmin = false;
            oauthToken.user.isManager = false;
            oauthToken.user.isDepartmentManager = false;
            oauthToken.user.isFinancialManager = false;

            _.forEach(roles, function(role) {
                var roleEnum = parseInt(role.roleEnum);
                switch (roleEnum) {
                  case 0:
                    oauthToken.user.isUser = true;
                    break;
                  case 1:
                    oauthToken.user.isAccoundant = true;
                    break;
                  case 2:
                    oauthToken.user.isCashier = true;
                    break;
                  case 3:
                    oauthToken.user.isAdmin = true;
                    break;
                  case 4:
                    oauthToken.user.isManager = true;
                    break;
                  case 5:
                    oauthToken.user.isDepartmentManager = true;
                    break;
                  case 6:
                    oauthToken.user.isFinancialManager = true;
                    break;
                }
              });
              $rootScope.currentUser = oauthToken.user;
              setCookie(OAUTH_TOKEN, oauthToken);
              $rootScope.$broadcast('currentUserChanged', oauthToken.user);
            } else {
              removeCookie(OAUTH_TOKEN);
            }
          };

          var getToken = function() {
            var cookieString = getCookie(OAUTH_TOKEN);
            var token = null;
            if (cookieString) {
              token = JSON.parse(cookieString);
            }
            return token;
          };

          var getCurrentUser = function() {
            return getToken().user;
          };

          var updateUser = function(user) {
            var oauthToken = getToken();
            oauthToken.user = user;
            $rootScope.currentUser = oauthToken.user;
            setCookie(OAUTH_TOKEN, oauthToken);
          };

          return {
            // set cookie
            setCookie: setCookie,
            // get cookie
            getCookie: getCookie,

            removeCookie: removeCookie,

            getToken: getToken,

            setToken: setToken,

            getCurrentUser: getCurrentUser,

            updateUser: updateUser
          };
        }
      ]);
