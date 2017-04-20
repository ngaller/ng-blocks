/* jshint -W117, -W030 */
describe('blocks.sdata', function () {
  describe('sdataAuthenticationService', function () {
    beforeEach(function () {
      // use asyncModule otherwise we cannot return promises from tests
      bard.asyncModule('blocks.sdata', function (sdataServiceProvider) {
        sdataServiceProvider.configure({sdataUri: 'fake server'});
      });

      bard.inject(this, 'sdataAuthenticationService', 'sdataService', '$q', '$rootScope');

    });

    it('should login to sdata', function () {
      bard.mockService(sdataService, {
        executeRequest: $q.when({
          response: {
            userId: 'ADMIN',
            roles: []
          }
        })
      });
      return sdataAuthenticationService.login('admin', '').then(function () {
        expect(sdataAuthenticationService.isAuthenticated()).to.be.true;
      });
    });

    it('should reject login error with "login failed"', function () {
      bard.mockService(sdataService, {
        executeRequest: $q.reject('Foo')
      });
      return sdataAuthenticationService.login('admin', '').then(function () {
        assert.fail(0, 0, 'The login call should not succeed');
      }, function (error) {
        expect(error).to.equal('Login failed');
        expect(sdataAuthenticationService.isAuthenticated()).to.be.false;
      });
    });

    it('should logout when logout is called', function () {
      bard.mockService(sdataService, {
        executeRequest: $q.when({
          response: {
            userId: 'ADMIN',
            roles: []
          }
        })
      });
      return sdataAuthenticationService.login('admin', '').then(function () {
        sdataAuthenticationService.clearAuthentication();
        expect(sdataAuthenticationService.isAuthenticated()).to.be.false;
      });
    });

    it('should capture user roles when logging in', function() {
      bard.mockService(sdataService, {
        executeRequest: $q.when({
          response: {
            userId: 'ADMIN',
            roles: ['Standard User']
          }
        })
      });
      return sdataAuthenticationService.login('admin', '').then(function () {
        expect(sdataAuthenticationService.hasRole('Standard User')).to.be.true
      });
    })

    it('should capture secured actions when logging in', function() {
      bard.mockService(sdataService, {
        executeRequest: $q.when({
          response: {
            userId: 'ADMIN',
            securedActions: ['Entities/Account/Add']
          }
        })
      });
      return sdataAuthenticationService.login('admin', '').then(function () {
        expect(sdataAuthenticationService.hasSecuredAction('Entities/Account/Add')).to.be.true
      });
    })
  })
})
