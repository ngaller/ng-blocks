(function () {
  'use strict';

  angular.module('blocks.sdata')
    .factory('sdataAuthenticationService', sdataAuthenticationService);

  function sdataAuthenticationService($q, sdataService) {
    var service = {
      isAuthenticated: isAuthenticated,
      clearAuthentication: clearAuthentication,
      login: login,
      hasRole: hasRole,
      hasSecuredAction: hasSecuredAction
    };

    //////////

    var _isAuthenticated = false;
    var _roles = {};
    var _securedActions = {};
    var _userId = null;

    function login(username, password) {
      sdataService.setAuthenticationParameters(username, password);
      return sdataService.executeRequest('/slx/system/-/$service/getCurrentUser?format=json', 'POST', {})
        .then(function (data) {
          _isAuthenticated = true;
          console.log('GOT DATA', data);
          debugger
          // this returns the data in a response property
          cacheUserRoles(data.response);
          _userId = data.response.userId.trim();
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

    function hasSecuredAction(sa) {
      return isAuthenticated() && (_userId == 'ADMIN' || _securedActions[sa]);
    }

    function hasRole(role) {
      return isAuthenticated() && (_userId == 'ADMIN' || _roles[role]);
    }

    function cacheUserRoles(userData) {
      var r = userData.roles;
      _roles = {};
      if(r) {
        for (var i = 0; i < r.length; i++) {
          _roles[r[i]] = true;
        }
      }
      var sa = userData.securedActions;
      _securedActions = {};
      if(sa) {
        for (var j = 0; j < sa.length; j++) {
          _securedActions[sa[j]] = true;
        }
      }
    }

    return service;
  }
})();
