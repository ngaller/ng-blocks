(function () {
    'use strict';

    angular.module('blocks.sdata')
        .factory('sdataAuthenticationService', sdataAuthenticationService);

    function sdataAuthenticationService($q, sdataService) {
        var service = {
            isAuthenticated: isAuthenticated,
            clearAuthentication: clearAuthentication,
            login: login
        };

        //////////

        var _isAuthenticated = false;

        function login(username, password) {
            sdataService.setAuthenticationParameters(username, password);
            return sdataService.executeRequest('/slx/system/-/$service/getCurrentUser?format=json', 'POST')
                .then(function () {
                    _isAuthenticated = true;
                }, function () {
                    _isAuthenticated = false;
                    return $q.reject('Login failed');
                });
        }

        function clearAuthentication() {
            sdataService.setAuthenticationParameters(null, null);
            _isAuthenticated = false;
        }

        function isAuthenticated() {
            return _isAuthenticated;
        }

        return service;
    }
})();
