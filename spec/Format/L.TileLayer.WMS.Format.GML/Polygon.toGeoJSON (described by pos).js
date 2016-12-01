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
    it('parses gml:Polygon described by gml:pos elements with two coordinates', function () {
      var responseText = '' +
      '<gml:Polygon>' +
      '  <gml:outerBoundaryIs>' +
      '    <gml:LinearRing>' +
      '      <gml:pos>' +
      '        1.0 2.0' +
      '      </gml:pos>' +
      '      <gml:pos>' +
      '        3.0 4.0' +
      '      </gml:pos>' +
      '      <gml:pos>' +
      '        5.0 6.0' +
      '      </gml:pos>' +
      '      <gml:pos>' +
      '        1.0 2.0' +
      '      </gml:pos>' +
      '    </gml:LinearRing>' +
      '  </gml:outerBoundaryIs>' +
      '  <gml:innerBoundaryIs>' +
      '    <gml:LinearRing>' +
      '      <gml:pos>' +
      '        2.0 3.0' +
      '      </gml:pos>' +
      '      <gml:pos>' +
      '        4.0 5.0' +
      '      </gml:pos>' +
      '      <gml:pos>' +
      '        6.0 7.0' +
      '      </gml:pos>' +
      '      <gml:pos>' +
      '        2.0 3.0' +
      '      </gml:pos>' +
      '    </gml:LinearRing>' +
      '  </gml:innerBoundaryIs>' +
      '  <gml:innerBoundaryIs>' +
      '    <gml:LinearRing>' +
      '      <gml:pos>' +
      '        3.0 4.0' +
      '      </gml:pos>' +
      '      <gml:pos>' +
      '        5.0 6.0' +
      '      </gml:pos>' +
      '      <gml:pos>' +
      '        7.0 8.0' +
      '      </gml:pos>' +
      '      <gml:pos>' +
      '        3.0 4.0' +
      '      </gml:pos>' +
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

    it('parses gml:Polygon described by gml:pos elements with three coordinates', function () {
      var responseText = '' +
      '<gml:Polygon>' +
      '  <gml:outerBoundaryIs>' +
      '    <gml:LinearRing>' +
      '      <gml:pos>' +
      '        1.0 2.0 2.0' +
      '      </gml:pos>' +
      '      <gml:pos>' +
      '        3.0 4.0 2.0' +
      '      </gml:pos>' +
      '      <gml:pos>' +
      '        5.0 6.0 2.0' +
      '      </gml:pos>' +
      '      <gml:pos>' +
      '        1.0 2.0 2.0' +
      '      </gml:pos>' +
      '    </gml:LinearRing>' +
      '  </gml:outerBoundaryIs>' +
      '  <gml:innerBoundaryIs>' +
      '    <gml:LinearRing>' +
      '      <gml:pos>' +
      '        2.0 3.0 2.0' +
      '      </gml:pos>' +
      '      <gml:pos>' +
      '        4.0 5.0 2.0' +
      '      </gml:pos>' +
      '      <gml:pos>' +
      '        6.0 7.0 2.0' +
      '      </gml:pos>' +
      '      <gml:pos>' +
      '        2.0 3.0 2.0' +
      '      </gml:pos>' +
      '    </gml:LinearRing>' +
      '  </gml:innerBoundaryIs>' +
      '  <gml:innerBoundaryIs>' +
      '    <gml:LinearRing>' +
      '      <gml:pos>' +
      '        3.0 4.0 2.0' +
      '      </gml:pos>' +
      '      <gml:pos>' +
      '        5.0 6.0 2.0' +
      '      </gml:pos>' +
      '      <gml:pos>' +
      '        7.0 8.0 2.0' +
      '      </gml:pos>' +
      '      <gml:pos>' +
      '        3.0 4.0 2.0' +
      '      </gml:pos>' +
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

    it('parses gml:Polygon(exterior) described by gml:pos elements with two coordinates', function () {
      var responseText = '' +
      '<gml:Polygon>' +
      '  <gml:exterior>' +
      '    <gml:LinearRing>' +
      '      <gml:pos>' +
      '        1.0 2.0' +
      '      </gml:pos>' +
      '      <gml:pos>' +
      '        3.0 4.0' +
      '      </gml:pos>' +
      '      <gml:pos>' +
      '        5.0 6.0' +
      '      </gml:pos>' +
      '      <gml:pos>' +
      '        1.0 2.0' +
      '      </gml:pos>' +
      '    </gml:LinearRing>' +
      '  </gml:exterior>' +
      '  <gml:interior>' +
      '    <gml:LinearRing>' +
      '      <gml:pos>' +
      '        2.0 3.0' +
      '      </gml:pos>' +
      '      <gml:pos>' +
      '        4.0 5.0' +
      '      </gml:pos>' +
      '      <gml:pos>' +
      '        6.0 7.0' +
      '      </gml:pos>' +
      '      <gml:pos>' +
      '        2.0 3.0' +
      '      </gml:pos>' +
      '    </gml:LinearRing>' +
      '  </gml:interior>' +
      '  <gml:interior>' +
      '    <gml:LinearRing>' +
      '      <gml:pos>' +
      '        3.0 4.0' +
      '      </gml:pos>' +
      '      <gml:pos>' +
      '        5.0 6.0' +
      '      </gml:pos>' +
      '      <gml:pos>' +
      '        7.0 8.0' +
      '      </gml:pos>' +
      '      <gml:pos>' +
      '        3.0 4.0' +
      '      </gml:pos>' +
      '    </gml:LinearRing>' +
      '  </gml:interior>' +
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

    it('parses gml:Polygon(exterior) described by gml:pos elements with three coordinates', function () {
      var responseText = '' +
      '<gml:Polygon>' +
      '  <gml:exterior>' +
      '    <gml:LinearRing>' +
      '      <gml:pos>' +
      '        1.0 2.0 2.0' +
      '      </gml:pos>' +
      '      <gml:pos>' +
      '        3.0 4.0 2.0' +
      '      </gml:pos>' +
      '      <gml:pos>' +
      '        5.0 6.0 2.0' +
      '      </gml:pos>' +
      '      <gml:pos>' +
      '        1.0 2.0 2.0' +
      '      </gml:pos>' +
      '    </gml:LinearRing>' +
      '  </gml:exterior>' +
      '  <gml:interior>' +
      '    <gml:LinearRing>' +
      '      <gml:pos>' +
      '        2.0 3.0 2.0' +
      '      </gml:pos>' +
      '      <gml:pos>' +
      '        4.0 5.0 2.0' +
      '      </gml:pos>' +
      '      <gml:pos>' +
      '        6.0 7.0 2.0' +
      '      </gml:pos>' +
      '      <gml:pos>' +
      '        2.0 3.0 2.0' +
      '      </gml:pos>' +
      '    </gml:LinearRing>' +
      '  </gml:interior>' +
      '  <gml:interior>' +
      '    <gml:LinearRing>' +
      '      <gml:pos>' +
      '        3.0 4.0 2.0' +
      '      </gml:pos>' +
      '      <gml:pos>' +
      '        5.0 6.0 2.0' +
      '      </gml:pos>' +
      '      <gml:pos>' +
      '        7.0 8.0 2.0' +
      '      </gml:pos>' +
      '      <gml:pos>' +
      '        3.0 4.0 2.0' +
      '      </gml:pos>' +
      '    </gml:LinearRing>' +
      '  </gml:interior>' +
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
