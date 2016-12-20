L.TileLayer.WMS.Util.XML.ExceptionReport.Exception = {
  parse: function(xmlString) {
    if (typeof xmlString !== 'string' || xmlString.indexOf('<ExceptionReport') < 0) {
      return null;
    }

    var exceptionReportElement = L.TileLayer.WMS.Util.XML.parse(xmlString);
    if (!exceptionReportElement || exceptionReportElement.tagName !== 'ExceptionReport') {
      return null;
    }

    var exceptionReport = {
      exceptions: [],
      message: ''
    };

    var exceptionsNodes = exceptionReportElement.getElementsByTagName('Exception');
    for (var i = 0, exceptionsNodesCount = exceptionsNodes.length; i < exceptionsNodesCount; i++) {
      var exceptionNode = exceptionsNodes[i];
      var exceptionCode = exceptionNode.getAttribute('exceptionCode');
      var exceptionsTextNodes = exceptionNode.getElementsByTagName('ExceptionText');
      var exception = {
        code: exceptionCode,
        text: ''
      };

      for (var j = 0, textNodesCount = exceptionsTextNodes.length; j < textNodesCount; j++) {
        var exceptionTextNode = exceptionsTextNodes[j];
        var exceptionText = L.TileLayer.WMS.Util.XML.getElementText(exceptionTextNode).trim();

        exception.text += exceptionText;
        if (j < textNodesCount - 1) {
          exception.text += ' ';
        }
      }

      exceptionReport.message += (exception.code ? exception.code + ' - ' : '') + exception.text + '. ';
      exceptionReport.exceptions.push(exception);
    }

    return exceptionReport;
  }
};
