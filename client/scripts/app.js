'use strict';

angular.module('concordyaApp', ['ngAnimate', 'ngCookies', 'ngMessages', 'ngSanitize', 'ui.select',
    'ui.bootstrap', 'ui.router', 'pascalprecht.translate', 'angularFileUpload', 'tmh.dynamicLocale'])
        .run(['$rootScope', '$window', '$state', 'StorageService', 'WidgetService', 'AuthorityService',
    function ($rootScope, $window, $state, storage, widget, authority) {

        $rootScope.currentUser = storage.getCurrentUser();
        // change current-location when $state changed
        $rootScope.$on('$stateChangeSuccess', function (event, toState, fromState) {
            widget.cleanAjaxCount();
            widget.hideMessage();
            // check current-user's request permission
            //authority.checkUrlPermission(storage.getCurrentUser(), $state.current.name);
            authority.checkUrlPermission(storage.getCurrentUser(), $state.current.name);
        });

        // inject safe-apply function on root-scope object
        $rootScope.$safeApply = function () {
            var $scope, fn, force = false;

            if (arguments.length === 1) {
                var arg = arguments[0];
                if (typeof arg === 'function') {
                    fn = arg;
                } else {
                    $scope = arg;
                }
            } else {
                $scope = arguments[0];
                fn = arguments[1];
                if (arguments.length === 3) {
                    force = !!arguments[2];
                }
            }

            $scope = $scope || this;

            fn = fn || function () {
            };

            if (force || !$scope.$$phase) {
                $scope.$apply(fn);
            } else {
                fn();
            }
        };
        // go back
        $rootScope.back = function () {
            $window.history.back();
        };
    }]);
