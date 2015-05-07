/* jshint -W117, -W030 */
describe('blocks.sdata', function () {
    describe('sdataReportingService', function () {

        beforeEach(function () {
            bard.appModule('blocks.sdata', function (sdataServiceProvider) {
                sdataServiceProvider.configure({sdataUri: 'fake server'});
            });
            bard.inject(this, ['$q', '$rootScope', '$interval', 'sdataReportingService', 'sdataJobService']);
        });

        it('should create job trigger and check execution status', function (done) {
            bard.mockService(sdataJobService, {
                triggerJob: $q.when('1234'),
                getExecutionStatus: $q.when({
                    status: 'Complete',
                    result: 'SlxAttachment://FAKEATTACHID'
                })
            });
            sdataReportingService.generateReportAndWait('TICKET:Ticket Details',
                '{TICKET.TICKETID} = "XXXXX"', 'Pdf').then(function (reportUrl) {
                    expect(reportUrl).to.equal('fake server/slx/system/-/attachments(\'FAKEATTACHID\')/file');
                    done();
                });
            $rootScope.$digest();
            $interval.flush(10000);
        });
    });
});