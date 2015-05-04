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
         * @param jobId {string}  Job definition id, e.g. 'Saleslogix.Reporting.Jobs.CrystalReportsJob'
         * @param params {object}
         * @promise {string} trigger Id
         */
        this.triggerJob = function triggerJob(jobId, params) {
            var payload = {};
            var url = schedulingUrl + '/jobs(\'' + jobId + '\')/$service/trigger?format=json';
            return sdataService.executeRequest(url, 'POST', payload).then(function(data) {
                return data.response['triggerId'];
            });
        }

        /**
         * Retrieve execution status for a trigger.
         *
         * @param triggerId  id returned from the triggerJob call
         * @promise {object} execution status, or null if not found
         */
        this.getExecutionStatus = function getExecutionStatus(triggerId) {

        }
    }
})();
