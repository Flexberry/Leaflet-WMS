describe('L.TileLayer.WMS.Format[\'application/vnd.ogc.wms_xml\']', function () {
  // HTML received from ArcGIS Server.
  var responseText = '' +
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<FeatureInfoResponse xmlns:esri_wms="http://www.esri.com/wms" xmlns="http://www.esri.com/wms">' +
    '  <FIELDS name="feature1" weight="1"></FIELDS>' +
    '  <FIELDS name="feature2" weight=""></FIELDS>' +
    '</FeatureInfoResponse>';

  describe('#toGeoJSON', function () {
    it('parses FeatureInfoResponse', function () {
      var format = L.TileLayer.WMS.Format['application/vnd.ogc.wms_xml'];
      var featureCollection = format.toGeoJSON(responseText);

      expect(featureCollection).to.be.deep.equal({
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: null,
          properties: { name: 'feature1', weight: '1' }
        }, {
          type: 'Feature',
          geometry: null,
          properties: { name: 'feature2', weight: null }
        }]
      });
    });
  });
});
