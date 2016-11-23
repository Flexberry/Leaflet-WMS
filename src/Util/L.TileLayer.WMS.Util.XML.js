L.TileLayer.WMS.Util.XML = {
  parse: function(xmlString) {
    var xml;

    try {
      if (window.DOMParser) {
        var parser = new window.DOMParser();
        xml = parser.parseFromString(xmlString , 'text/xml');
      } else if (window.ActiveXObject){
        xml = new window.ActiveXObject('Microsoft.XMLDOM');
        xml.async = 'false';
        xml.loadXML(xmlString);
      }
    } catch(e) {
      xml = null;
    }

    if (!xml || !xml.documentElement) {
      throw new Error('Unable to parse specified \'xmlString\' it isn\'t valid');
    }

    var parseErrorElements = xml.getElementsByTagName('parsererror');
    if (parseErrorElements.length > 0) {
      var errorMessage = '';
      for (var i = 0, len = parseErrorElements.length; i < len; i++) {
        var parseErrorElement = parseErrorElements[i];
        errorMessage += L.TileLayer.WMS.Util.XML.getElementText(parseErrorElement).trim();

        if (i < len - 1) {
          errorMessage += ' ';
        }
      }

      throw new Error('Unable to parse specified \'xmlString\' it isn\'t valid: ' + errorMessage);
    }

    return xml.documentElement;
  },

  getElementText: function(element) {
    if (!element) {
      return '';
    }

    return element.innerText || element.textContent || element.text;
  }
};
