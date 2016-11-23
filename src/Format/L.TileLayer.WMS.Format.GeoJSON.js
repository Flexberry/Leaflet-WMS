L.TileLayer.WMS.Format['application/geojson'] = {
  priority: 1,

  toGeoJSON: function(responseText) {
  	return L.TileLayer.WMS.Util.JSON.parse(responseText);
  }
};
