/*! Leaflet-WMS 1.0.0 2016-11-23 */
;(function(window, document, undefined) {
"use strict";
if (!String.prototype.trim) {
  String.prototype.trim = function() {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(searchElement, fromIndex) {
    var k;

    if (this == null) {
      throw new TypeError('\'this\' is null or not defined');
    }

    var o = Object(this);
    var len = o.length >>> 0;
    if (len === 0) {
      return -1;
    }

    var n = fromIndex | 0;
    if (n >= len) {
      return -1;
    }

    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
    while (k < len) {
      if (k in o && o[k] === searchElement) {
        return k;
      }
      k++;
    }
    return -1;
  };
}

if (!Array.prototype.map) {
  Array.prototype.map = function(callback, thisArg) {
    var T, A, k;

    if (this == null) {
      throw new TypeError('\'this\' is null or not defined');
    }

    var O = Object(this);
    var len = O.length >>> 0;
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }

    if (arguments.length > 1) {
      T = thisArg;
    }

    A = new Array(len);
    k = 0;
    while (k < len) {
      var kValue, mappedValue;
      if (k in O) {
        kValue = O[k];
        mappedValue = callback.call(T, kValue, k, O);
        A[k] = mappedValue;
      }

      k++;
    }

    return A;
  };
}

L.TileLayer.WMS.Util = {
};

L.TileLayer.WMS.Util.JSON = {
  parse: window.JSON ? window.JSON.parse : function (jsonString) {
    return eval('(' + jsonString + ')');
  }
};

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

L.TileLayer.WMS.Util.XML.ExceptionReport.OWS = {
  parse: function(xmlString) {
    if (typeof xmlString !== 'string' || xmlString.indexOf('<ows:ExceptionReport') < 0) {
      return null;
    }

    var exceptionReportElement = L.TileLayer.WMS.Util.XML.parse(xmlString);
    if (!exceptionReportElement || exceptionReportElement.tagName !== 'ows:ExceptionReport') {
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

;(function() {
  var mergeObjects = function () {
    var i, len, key, src, dest;

    for (i = 0, len = arguments.length; i < len; i++) {
      src = arguments[i];
      dest = dest || {};

      for (key in src) {
        dest[key] = src[key];
      }
    }

    return dest;
  };

  var encodeUrlComponent = function(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
      return '%' + c.charCodeAt(0).toString(16);
    });
  };

  var encodeUrl = function (url, obj) {
    var params, key;
    obj = obj || {};
    params = [];

    for (key in obj) {
      params.push(encodeUrlComponent(key) + '=' + encodeUrlComponent(obj[key]));
    }

    url = url || '';
    return url + ((url.indexOf('?') === -1) ? '?' : '&') + params.join('&');
  };

  var isCrossDomainUrl = function(url) {
    if (typeof url !== 'string') {
      return false;
    }

    var currentLocation = window.location;
    var link = document.createElement('a');
    link.href = url;

    if (link.protocol !== '' && currentLocation.protocol !== link.protocol) {
      return true;
    }

    if (link.hostname !== '' && currentLocation.hostname !== link.hostname) {
      return true;
    }

    if (link.port !== '' && currentLocation.port !== link.port) {
      return true;
    }

    return false;
  };

  var XHR = function(url) {
    var xhr, xdr, error;

    // IE7 has XMLHttpRequest, but it can't request to local files,
    // also in IE7/IE8 XMLHttpRequest can be disabled, so we need an ActiveXObject instead of XMLHttpRequest.
    var isLowerThenInternetExplorer9 =  !document.addEventListener || !document.querySelector;
    if (window.ActiveXObject && (!window.XMLHttpRequest || isLowerThenInternetExplorer9)) {
      var activexRealizations = [
        'Msxml2.XMLHTTP.6.0',
        'Msxml2.XMLHTTP.3.0',
        'Msxml2.XMLHTTP',
        'Microsoft.XMLHTTP'
      ];

      for (var i=0, len=activexRealizations.length; i<len; i++) {
        try {
          xhr = new window.ActiveXObject(activexRealizations[i]);
        }
        catch(e) {}
      }
    } else if (window.XMLHttpRequest) {
      xhr = new window.XMLHttpRequest();
    }

    if (!xhr) {
      error = new Error('Your browser doesn\'t support neither \'XMLHttpRequest\' nor \'ActiveXObject\'');
    }

    // In IE8/IE9 XMLHttpRequest doesn't support cross domain requests,
    // but we can possibly use special XDomainRequest object.
    var xhrSupportsCrossDomainRequests = typeof xhr.withCredentials !== 'undefined';
    if (isCrossDomainUrl(url) && !xhrSupportsCrossDomainRequests) {
      if (window.XDomainRequest) {
        this.xdr = new window.XDomainRequest();
      } else {
        error = new Error('Your browser doesn\'t support cross-domain requests');
      }
    }

    this.url = url;
    this.xhr = xhr;
    this.xdr = xdr;
    this.error = error;
  };

  XHR.prototype.send = function(options) {
    options = mergeObjects({
      method: 'GET',
      headers: null,
      content: null,
      done: function(responseText, xhr) {
      },
      fail: function(errorThrown, xhr) {
        throw errorThrown;
      },
      always: function() {
      }
    }, options || {});

    // Prepare success & error handlers.
    var xhr = this.xdr || this.xhr;
    var done = function() {
      if (typeof options.done === 'function') {
        options.done(xhr.responseText, xhr);
      }

      if (typeof options.always === 'function') {
        options.always();
      }
    };

    var fail = function(errorThrown) {
      if (typeof options.fail === 'function') {
        options.fail(errorThrown, xhr);
      }

      if (typeof options.always === 'function') {
        options.always();
      }
    };

    // Call error handler if XHR wasn't constructed.
    if (this.error) {
      fail(this.error);

      return;
    }

    // Do some preparations.
    if (typeof options.method === 'string') {
      options.method = options.method.trim().toUpperCase();
    }

    if (options.method === 'GET' || options.method === 'DELETE') {
      this.url = encodeUrl(this.url, options.content);
      options.content = null;

      if (options.headers && options.headers['Content-type']) {
        delete options.headers['Content-type'];
      }
    }

    // Send request.
    if (xhr === this.xdr) {
      // Here we use XDomainRequest object.
      // Note that requests through XDomainRequest are always asynchronous & additional headers can't be assigned.
      xhr.open(options.method, this.url);
      xhr.onload = done;
      xhr.onerror = fail;

      xhr.send(options.content);
    } else {
      // Here we use XMLHttpRequest object.
      xhr.onreadystatechange = function() {
        var status, errorThrown;

        // In IE9, call to any property (e.g. status) of an aborted XHR will
        // cause an error 'Could not complete the operation due to error c00c023f'.
        // That's why we need try-catch here.
        try {
          if (xhr.readyState !== 4) {
            return;
          }

          status = xhr.status === 1223 ? 204 : xhr.status;
        } catch (e) {
          status = 0;
          errorThrown = e;
        }

        if (status >= 200 && status < 300) {
          done();
        } else {
          fail(errorThrown || new Error(status + ' - ' + xhr.responseText));
        }
      };

      xhr.open(options.method, this.url, true);

      if (options.headers) {
        for (var headerName in options.headers) {
          if (options.headers.hasOwnProperty(headerName)) {
            xhr.setRequestHeader(headerName, options.headers[headerName]);
          }
        }
      }

      xhr.send(options.content);
    }
  };

  L.TileLayer.WMS.Util.AJAX = function(options) {
    var xhr = new XHR(options.url);
    xhr.send(options);
  };
})();

L.TileLayer.WMS.Format = {
  getExisting: function() {
    var existingFormatsNames = [];
    var formatNameSpace = L.TileLayer.WMS.Format;

    for (var key in formatNameSpace) {
      var format = formatNameSpace.hasOwnProperty(key) ? formatNameSpace[key] : null;
      if (format && typeof format === 'object' && typeof format.toGeoJSON === 'function') {
        existingFormatsNames.push(key);
      }
    }

    // Sort existing formats by their priority.
    existingFormatsNames.sort(function(name1, name2) {
      var format1 = L.TileLayer.WMS.Format[name1];
      var format2 = L.TileLayer.WMS.Format[name2];

      if (format1.priority > format2.priority) {
        return 1;
      }
      if (format1.priority < format2.priority) {
        return -1;
      }

      return 0;
    });

    return existingFormatsNames;
  }
};

L.TileLayer.WMS.Format['application/geojson'] = {
  priority: 1,

  toGeoJSON: function(responseText) {
  	return L.TileLayer.WMS.Util.JSON.parse(responseText);
  }
};

L.TileLayer.WMS.Format['application/json'] = {
  priority: 2,

  toGeoJSON: function(responseText) {
  	// When info format is set to 'application/json' geoserver returns GeoJSON.
  	return L.TileLayer.WMS.Format['application/geojson'].toGeoJSON(responseText);
  }
};

L.TileLayer.WMS.Format['application/vnd.ogc.gml/3.1.1'] = {
    priority: 3,

    toGeoJSON: function(responseText) {
      return L.TileLayer.WMS.Format['application/vnd.ogc.gml'].toGeoJSON(responseText);
    }
  };

;(function() {
  var namespaces = {
    gml: 'http://www.opengis.net/gml'
  };

  var separators = {
    decimal: '.',
    component: ',',
    tuple: ' '
  };

  var gmlGeometryElementsTagNames = [
    'gml:Point',
    'gml:MultiPoint',
    'gml:LineString',
    'gml:MultiLineString',
    'gml:Polygon',
    'gml:MultiPolygon'
  ];

  var gmlElement = {
    toGeoJSON: function(element) {
      return gmlElement[element.tagName].toGeoJSON(element);
    },

    'wfs:FeatureCollection': {
      toGeoJSON: function(featureCollectionElement) {
        return gmlElement['gml:featureCollection'].toGeoJSON(featureCollectionElement);
      }
    },

    'gml:featureCollection': {
      toGeoJSON: function(featureCollectionElement) {
        var featureCollection = {
          type: 'FeatureCollection',
          features: []
        };

        var featureMemberElements = featureCollectionElement.getElementsByTagNameNS(namespaces.gml, 'featureMember');
        for (var i = 0, len = featureMemberElements.length; i < len; i++) {
          var featureMemberElement = featureMemberElements[i];
          var feature = gmlElement.toGeoJSON(featureMemberElement);

          featureCollection.features.push(feature);
        }

        return featureCollection;
      }
    },

    'gml:featureMember': {
      toGeoJSON: function(featureMemberElement) {
        var feature = {
          type: 'Feature',
          id: null,
          geometry: null,
          properties: {
          }
        };

        var featureElement = featureMemberElement.firstChild;
        var propertyElements = featureElement.childNodes;

        for (var i = 0, len = propertyElements.length; i < len; i++) {
          var propertyElement = propertyElements[i];
          var propertyName = propertyElement.tagName.split(':')[1];
          var propertyChildElement = propertyElement.firstChild;

          if (propertyChildElement && gmlGeometryElementsTagNames.indexOf(propertyChildElement.tagName) >= 0) {
            feature.geometry = gmlElement.toGeoJSON(propertyChildElement);
          } else {
            feature.properties[propertyName] = L.TileLayer.WMS.Util.XML.getElementText(propertyElement);
          }
        }

        return feature;
      }
    },

    'gml:coord': {
      toGeoJSON: function(coordElement) {
        var coordinates = [];
        var pushCoordinate = function(coordinateElement) {
          var coordinate = window.parseFloat(L.TileLayer.WMS.Util.XML.getElementText(coordinateElement));
          coordinates.push(coordinate);
        };

        var xElement = coordElement.getElementsByTagNameNS(namespaces.gml, 'X')[0];
        pushCoordinate(xElement);

        var yElement = coordElement.getElementsByTagNameNS(namespaces.gml, 'Y')[0];
        pushCoordinate(yElement);

        var zElement = coordElement.getElementsByTagNameNS(namespaces.gml, 'Z')[0];
        if (zElement) {
          pushCoordinate(zElement);
        }

        return coordinates;
      }
    },

    'gml:coordinates': {
      toGeoJSON: function(coordinatesElement) {
        var attributes = coordinatesElement.attributes;
        var decimalSeparator = attributes.decimal && attributes.decimal.value || separators.decimal;
        var componentSeparator = attributes.cs && attributes.cs.value || separators.component;
        var tupleSeparator = attributes.ts && attributes.ts.value || separators.tuple;

        var results = [];
        var coordinates = L.TileLayer.WMS.Util.XML.getElementText(coordinatesElement)
          .replace(new RegExp('\s*' + componentSeparator + '\s*', 'g'), componentSeparator)
          .split(tupleSeparator);

        var parseCoordinate = function(coordinate) {
          if (decimalSeparator !== '.') {
            coordinate = coordinate.replace(decimalSeparator, '.');
          }

          return window.parseFloat(coordinate);
        };

        for (var i = 0, len = coordinates.length; i < len; i++) {
          var component = coordinates[i].split(componentSeparator).map(parseCoordinate);

          results.push(component);
        }

        return results.length > 1 ? results : results[0];
      }
    },

    'gml:pos': {
      toGeoJSON: function(posElement) {
        var attributes = posElement.attributes;
        var decimalSeparator = attributes.decimal && attributes.decimal.value || separators.decimal;
        var tupleSeparator = attributes.ts && attributes.ts.value || separators.tuple;

        return L.TileLayer.WMS.Util.XML.getElementText(posElement)
          .split(tupleSeparator)
          .map(function(coordinate) {
            if (decimalSeparator !== '.') {
              coordinate = coordinate.replace(decimalSeparator, '.');
            }

            return window.parseFloat(coordinate);
          });
      }
    },

    'gml:posList': {
      toGeoJSON: function(posListElement) {
        var attributes = posListElement.attributes;
        var decimalSeparator = attributes.decimal && attributes.decimal.value || separators.decimal;
        var tupleSeparator = attributes.ts && attributes.ts.value || separators.tuple;
        var dimensions = window.parseInt(attributes.srsDimension || attributes.dimension, 10) || 2;

        var results = [];
        var coordinates = L.TileLayer.WMS.Util.XML.getElementText(posListElement).split(tupleSeparator);
        for (var i = 0, len = coordinates.length; i < len; i += dimensions) {
          var component = [];
          for (var j = i, len2 = i + dimensions; j < len2; j++) {
            var coordinate = coordinates[j];
            if (decimalSeparator !== '.') {
              coordinate = coordinate.replace(decimalSeparator, '.');
            }

            component.push(window.parseFloat(coordinate));
          }

          results.push(component);
        }

        return results;
      }
    },

    'gml:Point': {
      toGeoJSON: function(pointElement) {
        var point = {
          type: 'Point',
          coordinates: []
        };

        // Coordinates can be represented as <gml:coordinates> or <gml:pos> or <gml:coord> elements.
        var coordinatesElement = pointElement.firstChild;
        point.coordinates = gmlElement.toGeoJSON(coordinatesElement);

        return point;
      }
    },

    'gml:MultiPoint': {
      toGeoJSON: function(multiPointElement) {
        var multiPoint = {
          type: 'MultiPoint',
          coordinates: []
        };

        var pointElements = multiPointElement.getElementsByTagNameNS(namespaces.gml, 'Point');
        for (var i = 0, len = pointElements.length; i < len; i++) {
          var pointElement = pointElements[i];
          var coordinates = gmlElement.toGeoJSON(pointElement).coordinates;

          multiPoint.coordinates.push(coordinates);
        }

        return multiPoint;
      }
    },

    'gml:LineString': {
      toGeoJSON: function(lineStringElement) {
        var lineString = {
          type: 'LineString',
          coordinates: []
        };

        var childNodes = lineStringElement.childNodes;
        var coordinatesElement;
        if (childNodes.length === 1) {
          // Coordinates can be represented as single <gml:coordinates> or <gml:posList> element.
          coordinatesElement = childNodes[0];
          lineString.coordinates = gmlElement.toGeoJSON(coordinatesElement);
        } else {
          // Coordinates can be represented as multiple <gml:pos> or <gml:coord> elements.
          for (var i = 0, len = childNodes.length; i < len; i++) {
            coordinatesElement = childNodes[i];
            lineString.coordinates.push(gmlElement.toGeoJSON(coordinatesElement));
          }
        }        

        return lineString;
      }
    },

    'gml:MultiLineString': {
      toGeoJSON: function(multiLineStringElement) {
        var multiLineString = {
          type: 'MultiLineString',
          coordinates: []
        };

        var lineStringElements = multiLineStringElement.getElementsByTagNameNS(namespaces.gml, 'LineString');
        for (var i = 0, len = lineStringElements.length; i < len; i++) {
          var lineStringElement = lineStringElements[i];
          var coordinates = gmlElement.toGeoJSON(lineStringElement).coordinates;

          multiLineString.coordinates.push(coordinates);
        }

        return multiLineString;
      }
    },

    'gml:LinearRing': {
      toGeoJSON: function(linearRingElement) {
        // LinearRing coordinates are represented by the same structure as LineString, but first & last coordinate are always equal.
        return gmlElement['gml:lineString'].toGeoJSON(linearRingElement).coordinates;
      }
    },

    'gml:Polygon': {
      toGeoJSON: function(polygonElement) {
        var polygon = {
          type: 'Polygon',
          coordinates: []
        };

        // Exterior linear ring coordinates can be represented as single <gml:exterior> or <gml:outerBoundaryIs> elements.
        var exteriorLinearRingElements = polygonElement.getElementsByTagNameNS(namespaces.gml, 'exterior');
        if (exteriorLinearRingElements.length === 0) {
          exteriorLinearRingElements = polygonElement.getElementsByTagNameNS(namespaces.gml, 'outerBoundaryIs');
        }
        
        var exteriorLinearRingElement = exteriorLinearRingElements[0];
        var exteriorLinearRingCoordinates = gmlElement.toGeoJSON(exteriorLinearRingElement);
        polygon.coordinates.push(exteriorLinearRingCoordinates);

        // Interior linear ring coordinates can be represented as multiple <gml:interior> or <gml:innerBoundaryIs> elements.
        var interiorLinearRingElements = polygonElement.getElementsByTagNameNS(namespaces.gml, 'interior');
        if (interiorLinearRingElements.length === 0) {
          interiorLinearRingElements = polygonElement.getElementsByTagNameNS(namespaces.gml, 'innerBoundaryIs');
        }

        for (var i = 0, len = interiorLinearRingElements.length; i < len; i++) {
          var interiorLinearRingElement = interiorLinearRingElements[i];
          var interiorLinearRingCoordinates = gmlElement.toGeoJSON(interiorLinearRingElement);
          polygon.coordinates.push(interiorLinearRingCoordinates);
        }

        return polygon;
      }
    },

    'gml:MultiPolygon': {
      toGeoJSON: function(multiPolygonElement) {
        var multiPolygon = {
          type: 'MultiPolygon',
          coordinates: []
        };

        var polygonElements = multiPolygonElement.getElementsByTagNameNS(namespaces.gml, 'Polygon');
        for (var i = 0, len = polygonElements.length; i < len; i++) {
          var polygonElement = polygonElements[i];
          var coordinates = gmlElement.toGeoJSON(polygonElement).coordinates;

          multiPolygon.coordinates.push(coordinates);
        }

        return multiPolygon;
      }
    }
  };

  L.TileLayer.WMS.Format['application/vnd.ogc.gml'] = {
    priority: 4,

    toGeoJSON: function(responseText) {
      var featureCollectionElement = L.TileLayer.WMS.Util.XML.parse(responseText);

      return gmlElement.toGeoJSON(featureCollectionElement);
    }
  };
})();

L.TileLayer.WMS.Format['text/xml'] = {
  priority: 5,

  toGeoJSON: function(responseText) {
    // Format is same as application/vnd.ogc.wms_xml', but is preferred in IE & Netscape because of simplicity of it's mime.
    return L.TileLayer.WMS.Format['application/vnd.ogc.wms_xml'].toGeoJSON(responseText);
  }
};

L.TileLayer.WMS.Format['application/vnd.ogc.wms_xml'] = {
  priority: 6,

  toGeoJSON: function(responseText) {
    var featureCollection = {
      type: 'FeatureCollection',
      features: []
    };

    var featureInfoResponseElement = L.TileLayer.WMS.Util.XML.parse(responseText);
    var fieldElements = featureInfoResponseElement.getElementsByTagName('FIELDS');
    for (var i = 0, fieldsCount = fieldElements.length; i < fieldsCount; i++) {
        var feature = {
          type: 'Feature',
          id: null,
          geometry: null,
          properties: {
          }
        };

        var fieldElement = fieldElements[i];
        var attributes = fieldElement.attributes;
        for (var j in attributes) {
          var attribute = attributes[j];

          feature.properties[attribute.name] = attribute.value || null;
        }

        featureCollection.features.push(feature);
    }

    return featureCollection;
  }
};

L.TileLayer.WMS.Format['text/html'] = {
  priority: 7,

  toGeoJSON: function(responseText) {
    var featureCollection = {
      type: 'FeatureCollection',
      features: []
    };

    var documentElement = L.TileLayer.WMS.Util.XML.parse(responseText);
    var tableElements = documentElement.getElementsByTagName('table');
    for (var i = 0, tablesCount = tableElements.length; i < tablesCount; i++) {
      var tableElement = tableElements[i];

      var propertiesNames = [];
      var thElements = tableElement.getElementsByTagName('th');
      for (var j = 0, headersCount = thElements.length; j < headersCount; j++) {
        var thElement = thElements[j];
        propertiesNames.push(L.TileLayer.WMS.Util.XML.getElementText(thElement));
      }

      var trElements = tableElement.getElementsByTagName('tr');
      for (var k = 0, rowsCount = trElements.length; k < rowsCount; k++) {
        var trElement = trElements[k];

        var tdElements = trElement.getElementsByTagName('td');
        if (tdElements.length !== propertiesNames.length) {
          // Skip table row containing headers.
          continue;
        }

        var feature = {
          type: 'Feature',
          id: null,
          geometry: null,
          properties: {
          }
        };

        for (var l = 0, cellsCount = tdElements.length; l < cellsCount; l++) {
          var tdElement = tdElements[l];
          feature.properties[propertiesNames[l]] = L.TileLayer.WMS.Util.XML.getElementText(tdElement) || null;
        }

        featureCollection.features.push(feature);
      }
    }

    return featureCollection;
  }
};

L.TileLayer.WMS.include({
  _capabilities: null,

  getCapabilities: function(options) {
    options = L.Util.extend({
      fail: function(errorThrown) {
        throw errorThrown;
      }
    }, options || {});

    var done = function(capabilities, xhr) {
      if (typeof options.done === 'function') {
        options.done(capabilities, xhr);
      }

      if (typeof options.always === 'function') {
        options.always();
      }
    };

    var fail = function(errorThrown, xhr) {
      if (typeof options.fail === 'function') {
        options.fail(errorThrown, xhr);
      }

      if (typeof options.always === 'function') {
        options.always();
      }
    };

    // Check if capabilities was already received & cached.
    var _this = this;
    var capabilities = _this._capabilities;
    if (capabilities) {
      done(capabilities);

      return;
    }

    // Try to send 'GetCapabilities' request & cache results.
    L.TileLayer.WMS.Util.AJAX({
      url: _this._url,
      method: 'GET',
      content: {
        request: 'GetCapabilities',
        service: 'WMS',
        version: _this.wmsParams.version
      },
      done: function(responseText, xhr) {
        try {
          // If some exception occur, WMS-service can response successfully, but with some exception report,
          // and such situation must be handled as error.
          var exceptionReport = L.TileLayer.WMS.Util.XML.ExceptionReport.parse(responseText);
          if (exceptionReport) {
            throw new Error(exceptionReport.message);
          }

          // Parse & cache received capabilities.
          var capabilities = L.TileLayer.WMS.Util.XML.parse(responseText);
          _this._capabilities = capabilities;

          done(capabilities, xhr);
        } catch (e) {
          fail(e, xhr);
        }
      },
      fail: fail
    });
  }
});

L.TileLayer.WMS.include({
  _infoFormat: null,

  getInfoFormat: function(options) {
    options = L.Util.extend({
      fail: function(errorThrown) {
        throw errorThrown;
      }
    }, options || {});

    var done = function(preferredFormat, xhr) {
      if (typeof options.done === 'function') {
        options.done(preferredFormat, xhr);
      }

      if (typeof options.always === 'function') {
        options.always();
      }
    };

    var fail = function(errorThrown, xhr) {
      if (typeof options.fail === 'function') {
        options.fail(errorThrown, xhr);
      }

      if (typeof options.always === 'function') {
        options.always();
      }
    };

    // Check if info format was already received & cached.
    var _this = this;
    var infoFormat = _this._infoFormat;
    if (infoFormat) {
      done(infoFormat);

      return;
    }

    // Try to send 'GetCapabilities' request & retrieve preferred format from capabilities.
    _this.getCapabilities({
      done: function(capabilities, xhr) {
        try {
          // Existing formats (implemented in plugin) sorted by their priority.
          var existingFormats = L.TileLayer.WMS.Format.getExisting();

          // Capable formats (supported by service).
          var capableFormats = [];

          var capabilityElement = capabilities.getElementsByTagName('Capability')[0];
          var getFeatureInfoElement = capabilityElement.getElementsByTagName('GetFeatureInfo')[0];
          var formatElements = getFeatureInfoElement.getElementsByTagName('Format');
          for (var i = 0, len = formatElements.length; i < len; i++) {
            var formatElement = formatElements[i];
            capableFormats.push(L.TileLayer.WMS.Util.XML.getElementText(formatElement).trim().toLowerCase());
          }

          for (var j = 0, len2 = existingFormats.length; j < len2; j++) {
            var format = existingFormats[j];
            if (capableFormats.indexOf(format) >= 0) {
              infoFormat = format;

              break;
            }
          }

          // Cache retrieved format.
          _this._infoFormat = infoFormat;

          done(infoFormat, xhr);
        } catch(e) {
          fail(e, xhr);
        }
      },
      fail: fail
    });
  }
});

L.TileLayer.WMS.include({
  getFeatureInfo: function(options) {
    options = L.Util.extend({
      fail: function(errorThrown) {
        throw errorThrown;
      }
    }, options || {});

    var done = function(features, xhr) {
      if (typeof options.done === 'function') {
        options.done(features, xhr);
      }

      if (typeof options.always === 'function') {
        options.always();
      }
    };

    var fail = function(errorThrown, xhr) {
      if (typeof options.fail === 'function') {
        options.fail(errorThrown, xhr);
      }

      if (typeof options.always === 'function') {
        options.always();
      }
    };

    var _this = this;
    var getInfoFormat = options.infoFormat ? function(callbacks) {
      callbacks.done(options.infoFormat);
    } : _this.getInfoFormat;

    // Try to get info format for 'GetFeatureInfo' request & send request then.
    getInfoFormat.call(_this, {
      done: function(infoFormat, xhr) {
        var requestParamaters;

        try {
          var errorMessage;
          if (!infoFormat) {
            errorMessage = 'None of available formats for \'' + _this._url + '\' \'GetFeatureInfo\' requests ' +
              'are not implemented in \'L.TileLayer.WMS\'. ' +
              '\'GetFeatureInfo\' request can\'t be performed.';
            throw new Error(errorMessage);
          }

          if (!L.TileLayer.WMS.Format[infoFormat]) {
            errorMessage = 'Format \'' + infoFormat + '\' \' ' +
              'is not implemented in \'L.TileLayer.WMS\'. ' +
              '\'GetFeatureInfo\' request can\'t be performed.';
            throw new Error(errorMessage);
          }

          var leafletMap = _this._map;

          var latlng = options.latlng;
          var point = leafletMap.latLngToContainerPoint(latlng, leafletMap.getZoom());
          var size = leafletMap.getSize();
          var crs = _this.options.crs || leafletMap.options.crs;

          var mapBounds = leafletMap.getBounds();
          var nw = crs.project(mapBounds.getNorthWest());
          var se = crs.project(mapBounds.getSouthEast());

          // Defined request parameters.
          requestParamaters = {
            request: 'GetFeatureInfo',
            service: 'WMS',
            version: _this.wmsParams.version,
            layers: _this.wmsParams.layers,
            query_layers: _this.wmsParams.layers,
            info_format: infoFormat,
            height: size.y,
            width: size.x
          };

          // Define version-related request parameters.
          var version = window.parseFloat(_this.wmsParams.version);
          requestParamaters[version >= 1.3 ? 'crs' : 'srs'] = crs.code;
          requestParamaters['bbox'] = version >= 1.3 && crs === L.CRS.EPSG4326 ?
            se.y + ',' + nw.x + ',' + nw.y + ',' + se.x :
            nw.x + ',' + se.y + ',' + se.x + ',' + nw.y;
          requestParamaters[requestParamaters.version === '1.3.0' ? 'i' : 'x'] = point.x;
          requestParamaters[requestParamaters.version === '1.3.0' ? 'j' : 'y'] = point.y;
        } catch(e) {
          fail(e);

          return;
        }

        // Send 'GetFeatureInfo' request.
        L.TileLayer.WMS.Util.AJAX({
          url: _this._url,
          method: 'GET',
          content: requestParamaters,
          done: function(responseText, xhr) {
            try {
              // If some exception occur, WMS-service can response successfully, but with some exception report,
              // and such situation must be handled as error.
              var exceptionReport = L.TileLayer.WMS.Util.XML.ExceptionReport.parse(responseText);
              if (exceptionReport) {
                throw new Error(exceptionReport.message);
              }

              // Retrieve features.
              var features = L.TileLayer.WMS.Format[infoFormat].toGeoJSON(responseText);
              features.crs = crs;

              done(features, xhr);
            } catch (e) {
              fail(e, xhr);
            }
          },
          fail: fail
        });
      },
      fail: fail
    });
  }
});

})(window, document);