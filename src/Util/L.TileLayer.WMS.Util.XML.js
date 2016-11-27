L.TileLayer.WMS.Util.XML = {
  normalize: function(node) {
    var childNode, nextNode;
    var regexBlank = /^\s*$/;

    switch (node.nodeType) {
      case 3: // Text node.
        if (regexBlank.test(node.nodeValue)) {
          node.parentNode.removeChild(node);
        }
        break;
      case 1: // Element node.
      case 9: // Document node.
        childNode = node.firstChild;

        while (childNode) {
          nextNode = childNode.nextSibling;
          L.TileLayer.WMS.Util.XML.normalize(childNode);
          childNode = nextNode;
        }
        break;
    }

    return node;
  },

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

    return L.TileLayer.WMS.Util.XML.normalize(xml.documentElement);
  },

  getElementText: function(element) {
    if (!element) {
      return '';
    }

    return element.innerText || element.textContent || element.text;
  }
};
