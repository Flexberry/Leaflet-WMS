describe('L.TileLayer.WMS.Format[\'application/vnd.ogc.gml\']', function () {
  // GML received from GeoServer.
  var responseText = '' +
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<wfs:FeatureCollection ' +
    '  xmlns="http://www.opengis.net/wfs" ' +
    '  xmlns:wfs="http://www.opengis.net/wfs" ' +
    '  xmlns:gml="http://www.opengis.net/gml" ' +
    '  xmlns:test_namespace="http://geoserver.test.ru" ' +
    '  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
    '  <gml:featureMember>' +
    '    <test_namespace:test_layer>' +
    '      <test_namespace:ogr_geometry>' +
    '        <gml:Point srsName="http://www.opengis.net/gml/srs/epsg.xml#4326">' +
    '          <gml:coordinates xmlns:gml="http://www.opengis.net/gml" decimal="." cs="," ts=" ">' +
    '            1,2' +
    '          </gml:coordinates>' +
    '        </gml:Point>' +
    '      </test_namespace:ogr_geometry>' +
    '      <test_namespace:name>feature1</test_namespace:name>' +
    '      <test_namespace:weight>1</test_namespace:weight>' +
    '    </test_namespace:test_layer>' +
    '  </gml:featureMember>' +
    '  <gml:featureMember>' +
    '    <test_namespace:test_layer>' +
    '      <test_namespace:ogr_geometry>' +
    '        <gml:Point srsName="http://www.opengis.net/gml/srs/epsg.xml#4326">' +
    '          <gml:coordinates xmlns:gml="http://www.opengis.net/gml" decimal="." cs="," ts=" ">' +
    '            3,4' +
    '          </gml:coordinates>' +
    '        </gml:Point>' +
    '      </test_namespace:ogr_geometry>' +
    '      <test_namespace:name>feature1</test_namespace:name>' +
    '      <test_namespace:weight></test_namespace:weight>' +
    '    </test_namespace:test_layer>' +
    '  </gml:featureMember>' +
    '</wfs:FeatureCollection>';

  describe('#toGeoJSON', function () {
    it('returns GeoJSON FeatureCollection', function () {
      var format = L.TileLayer.WMS.Format['application/vnd.ogc.gml'];
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
