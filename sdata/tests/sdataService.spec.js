/* jshint -W117, -W030 */
describe('blocks.sdata', function () {
    describe('sdataService', function () {
        beforeEach(function () {
            bard.asyncModule('blocks.sdata', function(sdataServiceProvider) {
                // TODO: mock http calls?
                sdataServiceProvider.configure({sdataUri: 'http://vmng-slx81.sssworld-local.com:3012/sdata/slx/dynamic/-/'});
            });

            bard.inject(this, 'sdataService');
            sdataService.setAuthenticationParameters('admin', '');
        });

        this.timeout(5000);

        it('should retrieve accounts', function () {
            return sdataService.read('accounts', 'AccountName like \'A%\'').then(function (data) {
                expect(data).to.be.ok;
                expect(data).to.have.property('$totalResults');
                expect(data).to.have.property('$itemsPerPage');
                expect(data.$resources).to.have.length.above(0);
                expect(data.$resources[0]).to.have.property('AccountName');
            });
        });

        it('should call sdata business rule', function () {
            return sdataService.callBusinessRule('barrelOrderDetails', 'PrepareOSGProductionSchedule', 'QURIQA4RXAB7');
        });
    })
})
