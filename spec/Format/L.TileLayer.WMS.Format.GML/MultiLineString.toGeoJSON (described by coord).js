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
    it('parses gml:MultiLineString described by gml:coord elements with two coordinates', function () {
      var responseText = '' +
        '<gml:MultiLineString>' +
        '  <gml:lineStringMember>' +
        '    <gml:LineString>' +
        '      <gml:coord>' +
        '        <gml:X>1</gml:X>' +
        '        <gml:Y>2</gml:Y>' +
        '      </gml:coord>' +
        '      <gml:coord>' +
        '        <gml:X>3</gml:X>' +
        '        <gml:Y>4</gml:Y>' +
        '      </gml:coord>' +
        '    </gml:LineString>' +
        '  </gml:lineStringMember>' +
        '  <gml:lineStringMember>' +
        '    <gml:LineString>' +
        '      <gml:coord>' +
        '        <gml:X>5</gml:X>' +
        '        <gml:Y>6</gml:Y>' +
        '      </gml:coord>' +
        '      <gml:coord>' +
        '         <gml:X>7</gml:X>' +
        '         <gml:Y>8</gml:Y>' +
        '      </gml:coord>' +
        '    </gml:LineString>' +
        '  </gml:lineStringMember>' +
        '</gml:MultiLineString>';

      var format = L.TileLayer.WMS.Format['application/vnd.ogc.gml'];
      var point = format.toGeoJSON(responseText);

      expect(point).to.be.deep.equal({
        type: 'MultiLineString',
        coordinates: [[[1.0, 2.0], [3.0, 4.0]], [[5.0, 6.0], [7.0, 8.0]]]
      });
    });

    it('parses gml:MultiLineString described by gml:coord elements with three coordinates', function () {
      var responseText = '' +
        '<gml:MultiLineString>' +
        '  <gml:lineStringMember>' +
        '    <gml:LineString>' +
        '      <gml:coord>' +
        '        <gml:X>1</gml:X>' +
        '        <gml:Y>2</gml:Y>' +
        '        <gml:Z>3</gml:Z>' +
        '      </gml:coord>' +
        '      <gml:coord>' +
        '        <gml:X>4</gml:X>' +
        '        <gml:Y>5</gml:Y>' +
        '        <gml:Z>6</gml:Z>' +
        '      </gml:coord>' +
        '    </gml:LineString>' +
        '  </gml:lineStringMember>' +
        '  <gml:lineStringMember>' +
        '    <gml:LineString>' +
        '      <gml:coord>' +
        '        <gml:X>7</gml:X>' +
        '        <gml:Y>8</gml:Y>' +
        '        <gml:Z>9</gml:Z>' +
        '      </gml:coord>' +
        '      <gml:coord>' +
        '        <gml:X>10</gml:X>' +
        '        <gml:Y>11</gml:Y>' +
        '        <gml:Z>12</gml:Z>' +
        '      </gml:coord>' +
        '    </gml:LineString>' +
        '  </gml:lineStringMember>' +
        '</gml:MultiLineString>';

      var format = L.TileLayer.WMS.Format['application/vnd.ogc.gml'];
      var point = format.toGeoJSON(responseText);

      expect(point).to.be.deep.equal({
        type: 'MultiLineString',
        coordinates: [[[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]], [[7.0, 8.0, 9.0], [10.0, 11.0, 12.0]]]
      });
    });

    it('parses gml:MultiLineString described by single gml:lineStringMember & gml:coord elements with two coordinates', function () {
      var responseText = '' +
      '<gml:MultiLineString>' +
      '  <gml:lineStringMember>' +
      '    <gml:LineString>' +
      '      <gml:coord>' +
      '        <gml:X>1</gml:X>' +
      '        <gml:Y>2</gml:Y>' +
      '      </gml:coord>' +
      '      <gml:coord>' +
      '        <gml:X>3</gml:X>' +
      '        <gml:Y>4</gml:Y>' +
      '      </gml:coord>' +
      '    </gml:LineString>' +
      '    <gml:LineString>' +
      '      <gml:coord>' +
      '        <gml:X>5</gml:X>' +
      '        <gml:Y>6</gml:Y>' +
      '      </gml:coord>' +
      '      <gml:coord>' +
      '         <gml:X>7</gml:X>' +
      '         <gml:Y>8</gml:Y>' +
      '      </gml:coord>' +
      '    </gml:LineString>' +
      '  </gml:lineStringMember>' +
      '</gml:MultiLineString>';

      var format = L.TileLayer.WMS.Format['application/vnd.ogc.gml'];
      var point = format.toGeoJSON(responseText);

      expect(point).to.be.deep.equal({
        type: 'MultiLineString',
        coordinates: [[[1.0, 2.0], [3.0, 4.0]], [[5.0, 6.0], [7.0, 8.0]]]
      });
    });

    it('parses gml:MultiLineString described by single gml:lineStringMember gml:coord elements with three coordinates', function () {
      var responseText = '' +
      '<gml:MultiLineString>' +
      '  <gml:lineStringMember>' +
      '    <gml:LineString>' +
      '      <gml:coord>' +
      '        <gml:X>1</gml:X>' +
      '        <gml:Y>2</gml:Y>' +
      '        <gml:Z>3</gml:Z>' +
      '      </gml:coord>' +
      '      <gml:coord>' +
      '        <gml:X>4</gml:X>' +
      '        <gml:Y>5</gml:Y>' +
      '        <gml:Z>6</gml:Z>' +
      '      </gml:coord>' +
      '    </gml:LineString>' +
      '    <gml:LineString>' +
      '      <gml:coord>' +
      '        <gml:X>7</gml:X>' +
      '        <gml:Y>8</gml:Y>' +
      '        <gml:Z>9</gml:Z>' +
      '      </gml:coord>' +
      '      <gml:coord>' +
      '        <gml:X>10</gml:X>' +
      '        <gml:Y>11</gml:Y>' +
      '        <gml:Z>12</gml:Z>' +
      '      </gml:coord>' +
      '    </gml:LineString>' +
      '  </gml:lineStringMember>' +
      '</gml:MultiLineString>';

      var format = L.TileLayer.WMS.Format['application/vnd.ogc.gml'];
      var point = format.toGeoJSON(responseText);

      expect(point).to.be.deep.equal({
        type: 'MultiLineString',
        coordinates: [[[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]], [[7.0, 8.0, 9.0], [10.0, 11.0, 12.0]]]
      });
    });
  });
});
