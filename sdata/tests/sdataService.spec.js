/* jshint -W117, -W030 */
describe('blocks.sdata', function () {
    // test sdata service against a live sdata server
    // TODO: create tests against mock data
    describe('sdataService - LIVE calls', function () {
        beforeEach(function () {
            bard.asyncModule('blocks.sdata', function (sdataServiceProvider) {
                // TODO: mock http calls?
                sdataServiceProvider.configure({sdataUri: 'http://vmng-slx81.sssworld-local.com:3012/sdata/'});
            });

            bard.inject(this, ['sdataService', '$rootScope']);
            sdataService.setAuthenticationParameters('admin', '');
        });

        this.timeout(10000);

        it('should retrieve accounts', function () {
            return sdataService.read('accounts', 'AccountName like \'A%\'').then(function (data) {
                expect(data).to.be.ok;
                expect(data).to.have.property('$totalResults');
                expect(data).to.have.property('$itemsPerPage');
                expect(data.$resources).to.have.length.above(0);
                expect(data.$resources[0]).to.have.property('AccountName');
            });
        });

        it('should create an account', function() {
            return sdataService.create('accounts', {
                AccountName: 'Foo'
            }).then(function(account) {
                return sdataService.delete('accounts', account.$key);
            });
        });

        it('should delete an account', function() {
            return sdataService.create('accounts', {
                AccountName: 'Foo'
            }).then(function(account) {
                return sdataService.delete('accounts', account.$key).then(function() {
                    return sdataService.read('accounts', 'Id eq \'' + account.$key + '\'').then(function(data) {
                        expect(data.$resources).to.be.empty;
                    });
                });
            });
        });

        it('should update an account', function() {
            return sdataService.create('accounts', {
                AccountName: 'Foo'
            }).then(function(account) {
                return sdataService.update('accounts', {
                    $key: account.$key,
                    AccountName: 'Fool'
                }).then(function(updatedAccount) {
                    expect(updatedAccount.AccountName).to.equal('Fool');
                    return sdataService.delete('accounts', account.$key);
                });
            });
        });

        it('should call sdata business rule', function () {
            return sdataService.callBusinessRule('barrelOrderDetails', 'PrepareOSGProductionSchedule', 'QURIQA4RXAB7');
        });
    })
})
