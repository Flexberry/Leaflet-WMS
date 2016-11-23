L.TileLayer.WMS.Format['application/vnd.ogc.gml/3.1.1'] = {
    priority: 3,

    toGeoJSON: function(responseText) {
      return L.TileLayer.WMS.Format['application/vnd.ogc.gml'].toGeoJSON(responseText);
    }
  };
