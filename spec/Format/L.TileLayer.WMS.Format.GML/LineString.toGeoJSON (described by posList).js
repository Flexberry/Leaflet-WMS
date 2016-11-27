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
    it('parses gml:LineString described by gml:posList element with two coordinates & default srsDimension', function () {
      var responseText = '' +
        '<gml:LineString>' +
        '  <gml:posList>' +
        '    1.0 2.0 3.0 4.0' +
        '  </gml:posList>' +
        '</gml:LineString>';

      var format = L.TileLayer.WMS.Format['application/vnd.ogc.gml'];
      var point = format.toGeoJSON(responseText);

      expect(point).to.be.deep.equal({
        type: 'LineString',
        coordinates: [[1.0, 2.0], [3.0, 4.0]]
      });
    });

    it('parses gml:LineString described by gml:posList element with two coordinates & srsDimension equals to 2', function () {
      var responseText = '' +
        '<gml:LineString>' +
        '  <gml:posList srsDimension="2">' +
        '    1.0 2.0 3.0 4.0 5.0 6.0' +
        '  </gml:posList>' +
        '</gml:LineString>';

      var format = L.TileLayer.WMS.Format['application/vnd.ogc.gml'];
      var point = format.toGeoJSON(responseText);

      expect(point).to.be.deep.equal({
        type: 'LineString',
        coordinates: [[1.0, 2.0], [3.0, 4.0], [5.0, 6.0]]
      });
    });

    it('parses gml:LineString described by gml:posList element with three coordinates & srsDimension equals to 3', function () {
      var responseText = '' +
        '<gml:LineString>' +
        '  <gml:posList srsDimension="3">' +
        '    1.0 2.0 3.0 4.0 5.0 6.0' +
        '  </gml:posList>' +
        '</gml:LineString>';

      var format = L.TileLayer.WMS.Format['application/vnd.ogc.gml'];
      var point = format.toGeoJSON(responseText);

      expect(point).to.be.deep.equal({
        type: 'LineString',
        coordinates: [[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]]
      });
    });

    it('parses gml:LineString described by gml:posList element with three coordinates & dimension equals to 3', function () {
      var responseText = '' +
        '<gml:LineString>' +
        '  <gml:posList dimension="3">' +
        '    1.0 2.0 3.0 4.0 5.0 6.0' +
        '  </gml:posList>' +
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
