/* jshint -W117, -W030 */
describe('blocks.sdata', function() {
    describe('sdataJobService', function () {

        beforeEach(function() {
            bard.asyncModule('blocks.sdata', function(sdataServiceProvider) {
                sdataServiceProvider.configure({sdataUri: 'fake server'});
            });
            bard.inject(this, ['$q', 'sdataJobService', 'sdataService']);
        });

        it('should post trigger to sdata service', function() {
            bard.mockService(sdataService, {
                executeRequest: $q.when({
                    response: {
                        triggerId: '1234'
                    }
                })
            });
            return sdataJobService.triggerJob('Some Job', {param1: 'value1'}).then(function(triggerId) {
                expect(triggerId).to.equal('1234');
                expect(sdataService.executeRequest)
                    .to.be.calledWithMatch(/^\/\$app\/scheduling\/-\/jobs\('Some%20Job'\)/, 'POST', function(reqData) {
                        expect(reqData).to.have.deep.property('request.parameters[0].Name').that.equals('param1');
                        expect(reqData).to.have.deep.property('request.parameters[0].Value').that.equals('value1');
                        return true;
                    })
                    .once;
            })
        });

        it('should query job service for execution status', function() {
            bard.mockService(sdataService, {
                executeRequest: $q.when({})
            });
            return sdataJobService.getExecutionStatus('1234').then(function() {
                expect(sdataService.executeRequest)
                    .to.be.calledWithMatch(/^\/\$app\/scheduling\/-\/executions\(triggerId eq '1234'\)/, 'GET')
                    .once;
            });
        });
    });
});