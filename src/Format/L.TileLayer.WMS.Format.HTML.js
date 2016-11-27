L.TileLayer.WMS.Format['text/html'] = {
  priority: 7,

  toGeoJSON: function(responseText) {
    var featureCollection = {
      type: 'FeatureCollection',
      features: []
    };

    var documentElement = L.TileLayer.WMS.Util.XML.parse(responseText);
    var tableElement = documentElement.getElementsByTagName('table')[0];
    if (!tableElement) {
      return featureCollection;
    }

    var propertiesNames = [];
    var thElements = tableElement.getElementsByTagName('th');
    for (var i = 0, headersCount = thElements.length; i < headersCount; i++) {
      var thElement = thElements[i];
      propertiesNames.push(L.TileLayer.WMS.Util.XML.getElementText(thElement));
    }

    var trElements = tableElement.getElementsByTagName('tr');
    for (var j = 0, rowsCount = trElements.length; j < rowsCount; j++) {
      var trElement = trElements[j];

      var tdElements = trElement.getElementsByTagName('td');
      if (tdElements.length !== propertiesNames.length) {
        // Skip table row containing headers.
        continue;
      }

      var feature = {
        type: 'Feature',
        geometry: null,
        properties: {
        }
      };

      for (var k = 0, cellsCount = tdElements.length; k < cellsCount; k++) {
        var tdElement = tdElements[k];
        feature.properties[propertiesNames[k]] = L.TileLayer.WMS.Util.XML.getElementText(tdElement) || null;
      }

      featureCollection.features.push(feature);
    }

    return featureCollection;
  }
};
