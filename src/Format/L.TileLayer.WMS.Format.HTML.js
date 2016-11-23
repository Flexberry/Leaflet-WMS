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
