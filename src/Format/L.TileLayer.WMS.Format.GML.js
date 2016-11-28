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
            feature.properties[propertyName] = L.TileLayer.WMS.Util.XML.getElementText(propertyElement) || null;
          }
        }

        return feature;
      }
    },

    'gml:coord': {
      toGeoJSON: function(coordElement) {
        var coordinates = [];
        var pushCoordinate = function(coordinateElement) {
          var coordinate = window.parseFloat(L.TileLayer.WMS.Util.XML.getElementText(coordinateElement).trim());
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
          .trim()
          .replace(new RegExp('\\s*' + componentSeparator + '\\s*', 'gi'), componentSeparator)
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
          .trim()
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
        var dimensions = window.parseInt((attributes['srsDimension'] || attributes['dimension'] || {}).value, 10) || 2;

        var results = [];
        var coordinates = L.TileLayer.WMS.Util.XML.getElementText(posListElement)
          .trim()
          .split(tupleSeparator);
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
        return gmlElement['gml:LineString'].toGeoJSON(linearRingElement).coordinates;
      }
    },

    'gml:Polygon': {
      toGeoJSON: function(polygonElement) {
        var polygon = {
          type: 'Polygon',
          coordinates: []
        };

        // Exterior linear ring coordinates can be represented as single <gml:exterior> or <gml:outerBoundaryIs> elements.
        var exteriorElements = polygonElement.getElementsByTagNameNS(namespaces.gml, 'exterior');
        if (exteriorElements.length === 0) {
          exteriorElements = polygonElement.getElementsByTagNameNS(namespaces.gml, 'outerBoundaryIs');
        }
        
        var exteriorLinearRingElement = exteriorElements[0].getElementsByTagNameNS(namespaces.gml, 'LinearRing')[0];
        var exteriorLinearRingCoordinates = gmlElement.toGeoJSON(exteriorLinearRingElement);
        polygon.coordinates.push(exteriorLinearRingCoordinates);

        // Interior linear ring coordinates can be represented as multiple <gml:interior> or <gml:innerBoundaryIs> elements.
        var interiorElements = polygonElement.getElementsByTagNameNS(namespaces.gml, 'interior');
        if (interiorElements.length === 0) {
          interiorElements = polygonElement.getElementsByTagNameNS(namespaces.gml, 'innerBoundaryIs');
        }

        for (var i = 0, len = interiorElements.length; i < len; i++) {
          var interiorLinearRingElement = interiorElements[i].getElementsByTagNameNS(namespaces.gml, 'LinearRing')[0];
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
