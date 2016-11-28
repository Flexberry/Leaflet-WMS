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
    it('parses gml:Polygon described by gml:coordinates elements with two coordinates', function () {
      var responseText = '' +
      '<gml:Polygon>' +
      '  <gml:outerBoundaryIs>' +
      '    <gml:LinearRing>' +
      '      <gml:coordinates>1,2 3,4 5,6 1,2</gml:coordinates>' +
      '    </gml:LinearRing>' +
      '  </gml:outerBoundaryIs>' +
      '  <gml:innerBoundaryIs>' +
      '    <gml:LinearRing>' +
      '      <gml:coordinates>2,3 4,5 6,7 2,3</gml:coordinates>' +
      '    </gml:LinearRing>' +
      '  </gml:innerBoundaryIs>' +
      '  <gml:innerBoundaryIs>' +
      '    <gml:LinearRing>' +
      '      <gml:coordinates>3,4 5,6 7,8 3,4</gml:coordinates>' +
      '    </gml:LinearRing>' +
      '  </gml:innerBoundaryIs>' +
      '</gml:Polygon>';

      var format = L.TileLayer.WMS.Format['application/vnd.ogc.gml'];
      var point = format.toGeoJSON(responseText);

      expect(point).to.be.deep.equal({
        type: 'Polygon',
        coordinates: [[[1.0, 2.0], [3.0, 4.0], [5.0, 6.0], [1.0, 2.0]],
         [[2.0, 3.0], [4.0, 5.0], [6.0, 7.0], [2.0, 3.0]],
         [[3.0, 4.0], [5.0, 6.0], [7.0, 8.0], [3.0, 4.0]]]
      });
    });

    it('parses gml:Polygon described by gml:coordinates elements with three coordinates', function () {
      var responseText = '' +
      '<gml:Polygon>' +
      '  <gml:outerBoundaryIs>' +
      '    <gml:LinearRing>' +
      '      <gml:coordinates>1,2,2 3,4,2 5,6,2 1,2,2</gml:coordinates>' +
      '    </gml:LinearRing>' +
      '  </gml:outerBoundaryIs>' +
      '  <gml:innerBoundaryIs>' +
      '    <gml:LinearRing>' +
      '      <gml:coordinates>2,3,2 4,5,2 6,7,2 2,3,2</gml:coordinates>' +
      '    </gml:LinearRing>' +
      '  </gml:innerBoundaryIs>' +
      '  <gml:innerBoundaryIs>' +
      '    <gml:LinearRing>' +
      '      <gml:coordinates>3,4,2 5,6,2 7,8,2 3,4,2</gml:coordinates>' +
      '    </gml:LinearRing>' +
      '  </gml:innerBoundaryIs>' +
      '</gml:Polygon>';

      var format = L.TileLayer.WMS.Format['application/vnd.ogc.gml'];
      var point = format.toGeoJSON(responseText);

      expect(point).to.be.deep.equal({
        type: 'Polygon',
        coordinates: [[[1.0, 2.0, 2.0], [3.0, 4.0, 2.0], [5.0, 6.0, 2.0], [1.0, 2.0, 2.0]],
         [[2.0, 3.0, 2.0], [4.0, 5.0, 2.0], [6.0, 7.0, 2.0], [2.0, 3.0, 2.0]],
         [[3.0, 4.0, 2.0], [5.0, 6.0, 2.0], [7.0, 8.0, 2.0], [3.0, 4.0, 2.0]]]
      });
    });
  });
});
