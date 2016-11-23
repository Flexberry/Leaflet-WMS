L.TileLayer.WMS.Format['text/xml'] = {
  priority: 5,

  toGeoJSON: function(responseText) {
    // Format is same as application/vnd.ogc.wms_xml', but is preferred in IE & Netscape because of simplicity of it's mime.
    return L.TileLayer.WMS.Format['application/vnd.ogc.wms_xml'].toGeoJSON(responseText);
  }
};
