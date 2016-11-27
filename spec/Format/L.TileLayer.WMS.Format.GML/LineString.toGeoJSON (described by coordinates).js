describe('L.TileLayer.WMS.Format[\'application/vnd.ogc.gml\']', function () {
  var originalXmlParse;

  before(function() {
    originalXmlParse = L.TileLayer.WMS.Util.XML.parse;

    // Modify method to make possible to parse short GML strings.
    L.TileLayer.WMS.Util.XML.parse = function(gmlString) {
      var fullGmlString = '' +
        '<?xml version="1.0" encoding="UTF-8"?>' +
        '<root xmlns:gml="http://www.opengis.net/gml">' + gmlString + '</root>';

      return originalXmlParse(fullGmlString).firstChild;
    };
  });

  after(function() {
    // Restore original method.
    L.TileLayer.WMS.Util.XML.parse = originalXmlParse;
  });

  describe('#toGeoJSON', function () {
    it('parses gml:LineString described by gml:coordinates element with two coordinates', function () {
      var responseText = '' +
        '<gml:LineString>' +
        '  <gml:coordinates>' +
        '    1.0,2.0 3.0,4.0' +
        '  </gml:coordinates>' +
        '</gml:LineString>';

      var format = L.TileLayer.WMS.Format['application/vnd.ogc.gml'];
      var point = format.toGeoJSON(responseText);

      expect(point).to.be.deep.equal({
        type: 'LineString',
        coordinates: [[1.0, 2.0], [3.0, 4.0]]
      });
    });

    it('parses gml:LineString described by gml:coordinates element with three coordinates', function () {
      var responseText = '' +
        '<gml:LineString>' +
        '  <gml:coordinates>' +
        '    1.0,2.0,3.0 4.0,5.0,6.0' +
        '  </gml:coordinates>' +
        '</gml:LineString>';

      var format = L.TileLayer.WMS.Format['application/vnd.ogc.gml'];
      var point = format.toGeoJSON(responseText);

      expect(point).to.be.deep.equal({
        type: 'LineString',
        coordinates: [[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]]
      });
    });

    it('parses gml:LineString described by gml:coordinates element with custom separators', function () {
      var responseText = '' +
        '<gml:LineString>' +
        '  <gml:coordinates decimal="," cs="-" ts="|">' +
        '    1,0 - 2,0 - 3.0 | 4,0 - 5,0 - 6,0' +
        '  </gml:coordinates>' +
        '</gml:LineString>';

      var format = L.TileLayer.WMS.Format['application/vnd.ogc.gml'];
      var point = format.toGeoJSON(responseText);

      expect(point).to.be.deep.equal({
        type: 'LineString',
        coordinates: [[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]]
      });
    });
  });
});
