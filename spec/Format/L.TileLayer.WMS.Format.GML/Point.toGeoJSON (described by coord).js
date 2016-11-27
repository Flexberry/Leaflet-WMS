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
    it('parses gml:Point described by gml:coord element with two coordinates', function () {
      var responseText = '' +
        '<gml:Point>' +
        '  <gml:coord>' +
        '    <gml:X>1.0</gml:X>' +
        '    <gml:Y>2.0</gml:Y>' +
        '  </gml:coord>' +
        '</gml:Point>';

      var format = L.TileLayer.WMS.Format['application/vnd.ogc.gml'];
      var point = format.toGeoJSON(responseText);

      expect(point).to.be.deep.equal({
        type: 'Point',
        coordinates: [1.0, 2.0]
      });
    });

    it('parses gml:Point described by gml:coord element with three coordinates', function () {
      var responseText = '' +
        '<gml:Point>' +
        '  <gml:coord>' +
        '    <gml:X>1.0</gml:X>' +
        '    <gml:Y>2.0</gml:Y>' +
        '    <gml:Z>3.0</gml:Z>' +
        '  </gml:coord>' +
        '</gml:Point>';

      var format = L.TileLayer.WMS.Format['application/vnd.ogc.gml'];
      var point = format.toGeoJSON(responseText);

      expect(point).to.be.deep.equal({
        type: 'Point',
        coordinates: [1.0, 2.0, 3.0]
      });
    });
  });
});
