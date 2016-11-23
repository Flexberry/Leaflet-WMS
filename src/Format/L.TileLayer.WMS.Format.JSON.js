L.TileLayer.WMS.Format['application/json'] = {
  priority: 2,

  toGeoJSON: function(responseText) {
  	// When info format is set to 'application/json' geoserver returns GeoJSON.
  	return L.TileLayer.WMS.Format['application/geojson'].toGeoJSON(responseText);
  }
};
