(function () {
    'use strict';

    // Interface with sdata job service.
    angular.module('blocks.sdata')
        .service('sdataJobService', SdataJobService);

    // service declaration
    function SdataJobService(sdataService) {

        var schedulingUrl = '/$app/scheduling/-/';

        /**
         * Trigger a job to be executed immediately.
         *
         * @param {string} jobId   Job definition id, e.g. 'Saleslogix.Reporting.Jobs.CrystalReportsJob'
         * @param {object} [params]   Object defining all parameters
         * @promises {string} trigger Id
         */
        this.triggerJob = function triggerJob(jobId, params) {
            var payload = {
                request: { parameters: [] }
            };
            if(params){
                for(var k in params){
                    if(params.hasOwnProperty(k)){
                        payload.request.parameters.push({
                            Name: k,
                            Value: params[k]
                        });
                    }
                }
            }
            var url = schedulingUrl + 'jobs(\'' + encodeURIComponent(jobId) + '\')/$service/trigger?format=json';
            return sdataService.executeRequest(url, 'POST', payload).then(function(data) {
                return data.response['triggerId'];
            });
        }

        /**
         * Retrieve execution status for a trigger.
         *
         * @param triggerId  id returned from the triggerJob call
         * @promises {object} execution status, or null if not found
         */
        this.getExecutionStatus = function getExecutionStatus(triggerId) {
            var url = schedulingUrl + 'executions(triggerId eq \'' + encodeURIComponent(triggerId) + '\')?format=json';
            return sdataService.executeRequest(url, 'GET');
        }
    }
})();
