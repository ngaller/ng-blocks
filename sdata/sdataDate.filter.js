(function () {
  'use strict';

  // Formatting for a date returned by the sdata service (in ASP.NET format, i.e. \/Date(....)\/)
  angular.module('blocks.sdata')
    .factory('sdataDateFilter', SdataDateFilter);

  // service declaration
  function SdataDateFilter($filter) {
    var dateFilter = $filter('date');

    return function sdataDateFilter(input, format, timezone) {
      if (input) {
        var d = new Date(parseInt(input.substr(6)));
        return dateFilter(d, format, timezone);
      }
      return '';
    }
  }
})();
