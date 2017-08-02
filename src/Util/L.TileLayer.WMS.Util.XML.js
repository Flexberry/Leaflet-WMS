L.TileLayer.WMS.Util.XML = {
  parse: function (xmlString) {
    var xml;

    try {
      if (window.DOMParser) {
        var parser = new window.DOMParser();
        xml = parser.parseFromString(xmlString, 'text/xml');
      } else if (window.ActiveXObject) {
        xml = new window.ActiveXObject('Microsoft.XMLDOM');
        xml.async = 'false';
        xml.loadXML(xmlString);
      }
    } catch (e) {
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

    return L.TileLayer.WMS.Util.XML.normalizeElement(xml.documentElement);
  },

  getElementText: function (element) {
    if (!element) {
      return '';
    }

    return element.innerText || element.textContent || element.text;
  },

  normalizeElement: function (element) {
    // Remove empty <text></text> elements.
    if (element.nodeType === 3 && L.TileLayer.WMS.Util.XML.getElementText(element).trim() === '' && element.parentNode) {
      element.parentNode.removeChild(element);
    }

    var childElement, nextElement;

    // Recursively normalize child elements.
    childElement = element.firstChild;
    while (childElement) {
      nextElement = childElement.nextSibling;
      L.TileLayer.WMS.Util.XML.normalizeElement(childElement);
      childElement = nextElement;
    }

    return element;
  },

  extractInfoFormats: function (element) {
    var infoFormats = [];

    if (element) {
      var capabilityElement = element.getElementsByTagName('Capability')[0];
      var getFeatureInfoElement = capabilityElement.getElementsByTagName('GetFeatureInfo')[0];
      var formatElements = getFeatureInfoElement.getElementsByTagName('Format');
      for (var i = 0, len = formatElements.length; i < len; i++) {
        var formatElement = formatElements[i];
        infoFormats.push(L.TileLayer.WMS.Util.XML.getElementText(formatElement).trim().toLowerCase());
      }
    }

    return infoFormats;
  }
};