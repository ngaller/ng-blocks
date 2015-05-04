(function () {
    'use strict';

    // Convenience method for scheduling report executions
    angular.module('blocks.sdata')
        .service('sdataReportingService', SdataReportingService);

    // service declaration
    function SdataReportingService($q, sdataService, sdataJobService) {
        var CR_JOB_ID = 'Saleslogix.Reporting.Jobs.CrystalReportsJob';

        /**
         * Generate a report on the job service and return the report URL once it finishes exporting.
         *
         * @param {string} reportId  Report id in Family:Name format
         * @param {string} selectionFormula
         * @param {string} [outputType=Pdf]
         * @promise {string} report URL
         * @fail {string}  if the report generation fails, the promise will be rejected with the associated error message
         */
        this.generateReportAndWait = function generateReportAndWait(reportId, selectionFormula, outputType) {

            var nameParts = reportId.split(':');
            if (nameParts.length != 2)
                return $q.reject('Invalid report id');

            return sdataJobService.triggerJob(CR_JOB_ID, {
                PluginFamily: nameParts[0],
                PluginName: nameParts[1],
                RecordSelectionFormula: selectionFormula,
                OutputFormat: outputType || 'Pdf'
            }).then(function (triggerId) {
                return $q(function (resolve, reject) {
                    var i = setInterval(function () {
                        sdataJobService.getExecutionStatus(triggerId).then(function (status) {
                            if (status.status == 'Complete') {
                                clearInterval(i);
                                var result = status.result;
                                // this will return the attachment in the form of a URL: SlxAttachment://attachid
                                if (/^SlxAttachment:/.test(result)) {
                                    var attachId = result.split('://')[1];
                                    var url = 'slx/system/-/attachments(\'' + attachId + '\')/file';
                                    resolve(sdataService.getSdataUri() + url);
                                } else {
                                    reject('Unexpected response from report job: ' + result);
                                }
                            } else if (status.status != 'Running') {
                                reject('Report execution encountered an error');
                            }
                        }, reject);
                    }, 1000);
                });
            });
        }

    }
})();
