L.TileLayer.WMS.Util.XML.ExceptionReport.Service = {
  parse: function(xmlString) {
    if (typeof xmlString !== 'string' || xmlString.indexOf('<ServiceExceptionReport') < 0) {
      return null;
    }

    var exceptionReportElement = L.TileLayer.WMS.Util.XML.parse(xmlString);
    if (!exceptionReportElement || exceptionReportElement.tagName !== 'ServiceExceptionReport') {
      return null;
    }

    var exceptionReport = {
      exceptions: [],
      message: ''
    };

    var exceptionsNodes = exceptionReportElement.getElementsByTagName('ServiceException');
    for (var i = 0, exceptionsNodesCount = exceptionsNodes.length; i < exceptionsNodesCount; i++) {
      var exceptionNode = exceptionsNodes[i];
      var exceptionCode = exceptionNode.getAttribute('code');
      var exception = {
        code: exceptionCode,
        text: (exceptionCode ? exceptionCode + ' - ' : '') + L.TileLayer.WMS.Util.XML.getElementText(exceptionNode).trim() + '. '
      };

      exceptionReport.message += exception.text;
      exceptionReport.exceptions.push(exception);
    }

    return exceptionReport;
  }
};
