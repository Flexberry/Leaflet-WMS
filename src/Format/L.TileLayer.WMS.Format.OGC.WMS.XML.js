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
          geometry: null,
          properties: {
          }
        };

        var fieldElement = fieldElements[i];
        var attributes = fieldElement.attributes;
        for (var j in attributes) {
          if (attributes.hasOwnProperty(j)) {
            var attribute = attributes[j];
            if (attribute && attribute.name) {
              feature.properties[attribute.name] = attribute.value || null;
            }
          }
        }

        featureCollection.features.push(feature);
    }

    return featureCollection;
  }
};
