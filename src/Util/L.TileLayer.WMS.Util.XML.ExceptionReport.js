L.TileLayer.WMS.Util.XML.ExceptionReport = {
  getExisting: function() {
    var existingExceptionReports = [];
    var exceptionReportNameSpace = L.TileLayer.WMS.Util.XML.ExceptionReport;

    // Retrieve all implemented parsers for different types of exception reports.
    for (var key in exceptionReportNameSpace) {
      var exceptionReport = exceptionReportNameSpace.hasOwnProperty(key) ? exceptionReportNameSpace[key] : null;
      if (exceptionReport && typeof exceptionReport === 'object' && typeof exceptionReport.parse === 'function') {
        existingExceptionReports.push(exceptionReport);
      }
    }

    return existingExceptionReports;
  },

  parse: function(xmlString) {
    var existingExceptionReports = L.TileLayer.WMS.Util.XML.ExceptionReport.getExisting();

    // Try to parse exception report with implemented parsers.
    var parsedExceptionReport = null;
    for (var i = 0, len = existingExceptionReports.length; i < len; i++) {
      var exceptionReport = existingExceptionReports[i];
      parsedExceptionReport = exceptionReport.parse(xmlString);
      
      if (parsedExceptionReport) {
        break;
      }
    }

    return parsedExceptionReport;
  }
};
