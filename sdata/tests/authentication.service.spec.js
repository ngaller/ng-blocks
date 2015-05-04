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
                read: $q.when([])
            });
            return sdataAuthenticationService.login('admin', '').then(function () {
                expect(sdataAuthenticationService.isAuthenticated()).to.be.true;
            });
        });

        it('should reject login error with "login failed"', function () {
            bard.mockService(sdataService, {
                read: $q.reject('Foo')
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
                read: $q.when([])
            });
            return sdataAuthenticationService.login('admin', '').then(function () {
                sdataAuthenticationService.clearAuthentication();
                expect(sdataAuthenticationService.isAuthenticated()).to.be.false;
            });
        });
    })
})
