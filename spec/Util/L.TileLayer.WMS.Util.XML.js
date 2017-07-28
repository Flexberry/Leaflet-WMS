describe('L.TileLayer.WMS.Util.XML', function () {
  // XML string containing white spaces between elements.
  var xmlString = '' +
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '                                      ' +
    '<root>' +
    '      ' +
    '  <child>' +
    '         ' +
    '    <id>1</id>' +
    '              ' +
    '    <name>child1</name>' +
    '                       ' +
    '    <child>' +
    '           ' +
    '      <id>1_1</id>' +
    '                  ' +
    '      <name>child1_1</name>' +
    '                           ' +
    '    </child>' +
    '           ' +
    '  </child>' +
    '         ' +
    '  <child>' +
    '         ' +
    '    <id>2</id>' +
    '              ' +
    '    <name>child2</name>' +
    '                       ' +
    '  </child>' +
    '         ' +
    '</root>' +
    '       ';
  var responseText = '' +
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<WMS_Capabilities>' +
    '  <Capability>' +
    '    <Request>' +
    '      <GetFeatureInfo>' +
    '        <Format>format1</Format>' +
    '        <Format>format2</Format>' +
    '        <Format>format3</Format>' +
    '      </GetFeatureInfo>' +
    '    </Request>' +
    '  </Capability>' +
    '</WMS_Capabilities>';

  describe('#parse', function () {
    it('returns normalized document', function () {
      var root = L.TileLayer.WMS.Util.XML.parse(xmlString);
      expect(root).to.have.property('tagName', 'root');
      expect(root).to.have.property('childNodes').that.have.lengthOf(2);

      var child1 = root.firstChild;
      var child1Id = child1.childNodes[0];
      var child1Name = child1.childNodes[1];
      expect(child1.tagName).to.be.equal('child');
      expect(child1.childNodes).to.have.lengthOf(3);
      expect(child1Id.tagName).to.be.equal('id');
      expect(L.TileLayer.WMS.Util.XML.getElementText(child1Id)).to.be.equal('1');
      expect(child1Name.tagName).to.be.equal('name');
      expect(L.TileLayer.WMS.Util.XML.getElementText(child1Name)).to.be.equal('child1');

      var child1_1 = child1.lastChild;
      var child1_1Id = child1_1.firstChild;
      var child1_1Name = child1_1.lastChild;
      expect(child1_1.tagName).to.be.equal('child');
      expect(child1_1.childNodes).to.have.lengthOf(2);
      expect(child1_1Id.tagName).to.be.equal('id');
      expect(L.TileLayer.WMS.Util.XML.getElementText(child1_1Id)).to.be.equal('1_1');
      expect(child1_1Name.tagName).to.be.equal('name');
      expect(L.TileLayer.WMS.Util.XML.getElementText(child1_1Name)).to.be.equal('child1_1');

      var child2 = root.lastChild;
      var child2Id = child2.firstChild;
      var child2Name = child2.lastChild;
      expect(child2.tagName).to.be.equal('child');
      expect(child2.childNodes).to.have.lengthOf(2);
      expect(child2Id.tagName).to.be.equal('id');
      expect(L.TileLayer.WMS.Util.XML.getElementText(child2Id)).to.be.equal('2');
      expect(child2Name.tagName).to.be.equal('name');
      expect(L.TileLayer.WMS.Util.XML.getElementText(child2Name)).to.be.equal('child2');
    });
  });

  describe('#extractInfoFormats', function () {
    it('returns info formats from capabilities element', function () {
      // Parse GetCapabilities response
      var capabilities = L.TileLayer.WMS.Util.XML.parse(responseText);

      // Extract capable formats from capabilities node
      var capableFormats = L.TileLayer.WMS.Util.XML.extractInfoFormats(capabilities);

      // Check retrieved elements.
      expect(capableFormats).to.be.an('array');
      expect(capableFormats).to.have.lengthOf(3);
      expect(capableFormats).to.have.deep.property('[0]', 'format1');
      expect(capableFormats).to.have.deep.property('[1]', 'format2');
      expect(capableFormats).to.have.deep.property('[2]', 'format3');
    });
  });
});