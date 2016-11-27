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
    it('parses gml:MultiPoint described by single gml:pointMembers & gml:coordinates elements with two coordinates', function () {
      var responseText = '' +
        '<gml:MultiPoint>' +
        '  <gml:pointMembers>' +
        '    <gml:Point>' +
        '      <gml:coordinates>' +
        '        1.0,2.0' +
        '      </gml:coordinates>' +
        '    </gml:Point>' +
        '    <gml:Point>' +
        '      <gml:coordinates>' +
        '        3.0,4.0' +
        '      </gml:coordinates>' +
        '    </gml:Point>' +
        '  </gml:pointMembers>' +
        '</gml:MultiPoint>';

      var format = L.TileLayer.WMS.Format['application/vnd.ogc.gml'];
      var point = format.toGeoJSON(responseText);

      expect(point).to.be.deep.equal({
        type: 'MultiPoint',
        coordinates: [[1.0, 2.0], [3.0, 4.0]]
      });
    });

    it('parses gml:MultiPoint described by single gml:pointMembers gml:coordinates elements with three coordinates', function () {
      var responseText = '' +
        '<gml:MultiPoint>' +
        '  <gml:pointMembers>' +
        '    <gml:Point>' +
        '      <gml:coordinates>' +
        '        1.0,2.0,3.0' +
        '      </gml:coordinates>' +
        '    </gml:Point>' +
        '    <gml:Point>' +
        '      <gml:coordinates>' +
        '        4.0,5.0,6.0' +
        '      </gml:coordinates>' +
        '    </gml:Point>' +
        '  </gml:pointMembers>' +
        '</gml:MultiPoint>';

      var format = L.TileLayer.WMS.Format['application/vnd.ogc.gml'];
      var point = format.toGeoJSON(responseText);

      expect(point).to.be.deep.equal({
        type: 'MultiPoint',
        coordinates: [[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]]
      });
    });

    it('parses gml:MultiPoint described by single gml:pointMembers & gml:coordinates elements with custom separators', function () {
      var responseText = '' +
        '<gml:MultiPoint>' +
        '  <gml:pointMembers>' +
        '    <gml:Point>' +
        '      <gml:coordinates decimal="," cs="-" ts=" ">' +
        '        1,0 - 2,0 - 3,0' +
        '      </gml:coordinates>' +
        '    </gml:Point>' +
        '    <gml:Point>' +
        '      <gml:coordinates decimal="," cs="-" ts=" ">' +
        '        4,0 - 5,0 - 6,0' +
        '      </gml:coordinates>' +
        '    </gml:Point>' +
        '  </gml:pointMembers>' +
        '</gml:MultiPoint>';

      var format = L.TileLayer.WMS.Format['application/vnd.ogc.gml'];
      var point = format.toGeoJSON(responseText);

      expect(point).to.be.deep.equal({
        type: 'MultiPoint',
        coordinates: [[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]]
      });
    });

    it('parses gml:MultiPoint described by multiple gml:pointMember & gml:coordinates elements with two coordinates', function () {
      var responseText = '' +
        '<gml:MultiPoint>' +
        '  <gml:pointMember>' +
        '    <gml:Point>' +
        '      <gml:coordinates>' +
        '        1.0,2.0' +
        '      </gml:coordinates>' +
        '    </gml:Point>' +
        '  </gml:pointMember>' +
        '  <gml:pointMember>' +
        '    <gml:Point>' +
        '      <gml:coordinates>' +
        '        3.0,4.0' +
        '      </gml:coordinates>' +
        '    </gml:Point>' +
        '  </gml:pointMember>' +
        '</gml:MultiPoint>';

      var format = L.TileLayer.WMS.Format['application/vnd.ogc.gml'];
      var point = format.toGeoJSON(responseText);

      expect(point).to.be.deep.equal({
        type: 'MultiPoint',
        coordinates: [[1.0, 2.0], [3.0, 4.0]]
      });
    });

    it('parses gml:MultiPoint described by multiple gml:pointMember gml:coordinates elements with three coordinates', function () {
      var responseText = '' +
        '<gml:MultiPoint>' +
        '  <gml:pointMember>' +
        '    <gml:Point>' +
        '      <gml:coordinates>' +
        '        1.0,2.0,3.0' +
        '      </gml:coordinates>' +
        '    </gml:Point>' +
        '  </gml:pointMember>' +
        '  <gml:pointMember>' +
        '    <gml:Point>' +
        '      <gml:coordinates>' +
        '        4.0,5.0,6.0' +
        '      </gml:coordinates>' +
        '    </gml:Point>' +
        '  </gml:pointMember>' +
        '</gml:MultiPoint>';

      var format = L.TileLayer.WMS.Format['application/vnd.ogc.gml'];
      var point = format.toGeoJSON(responseText);

      expect(point).to.be.deep.equal({
        type: 'MultiPoint',
        coordinates: [[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]]
      });
    });

    it('parses gml:MultiPoint described by multiple gml:pointMember & gml:coordinates elements with custom separators', function () {
      var responseText = '' +
        '<gml:MultiPoint>' +
        '  <gml:pointMember>' +
        '    <gml:Point>' +
        '      <gml:coordinates decimal="," cs="-" ts=" ">' +
        '        1,0 - 2,0 - 3,0' +
        '      </gml:coordinates>' +
        '    </gml:Point>' +
        '  </gml:pointMember>' +
        '  <gml:pointMember>' +
        '    <gml:Point>' +
        '      <gml:coordinates decimal="," cs="-" ts=" ">' +
        '        4,0 - 5,0 - 6,0' +
        '      </gml:coordinates>' +
        '    </gml:Point>' +
        '  </gml:pointMember>' +
        '</gml:MultiPoint>';

      var format = L.TileLayer.WMS.Format['application/vnd.ogc.gml'];
      var point = format.toGeoJSON(responseText);

      expect(point).to.be.deep.equal({
        type: 'MultiPoint',
        coordinates: [[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]]
      });
    });
  });
});
