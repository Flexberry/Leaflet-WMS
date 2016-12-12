describe('L.TileLayer.WMS.GetFeatureInfo', function () {

  describe('#GetFeatureInfo', function () {
    it('with the option', function () {

    });

    it('no option', function () {

    });

    it('version >= 1.3', function () {

    });

    it('version < 1.3', function () {

    });

    it('infoFormat = null', function () {
      var originaAJAX = L.TileLayer.WMS.Util.AJAX;

      L.TileLayer.WMS.Util.AJAX = function(options) {
        var responseText = '' +
        '<?xml version="1.0" encoding="UTF-8"?>' +
        '<WMS_Capabilities>' +
        '  <Capability>' +
        '    <Request>' +
        '      <GetCapabilities>' +
        '        <Format>text/xml</Format>' +
        '      </GetCapabilities>' +
        '      <GetFeatureInfo>' +
        '      </GetFeatureInfo>' +
        '    </Request>' +
        '  </Capability>' +
        '</WMS_Capabilities>';
        return options.done(responseText);
      };

      var layer = new L.TileLayer.WMS('http://test.ru', {
        version: '1.3.0',
      });

      var failSpy = sinon.spy();
      var result = layer.getFeatureInfo({ fail: failSpy});

      expect(failSpy.called).to.be.deep.equal(true);
      var str = failSpy.firstCall.args[0].toString();
      expect(str.indexOf("Error: None of available formats for 'http://test.ru' 'GetFeatureInfo' requests are not implemented in 'L.TileLayer.WMS'. 'GetFeatureInfo' request can't be performed.")).to.be.deep.equal(0);

      L.TileLayer.WMS.Util.AJAX = originaAJAX;
    });

    it('no intersection infoFormat', function () {
      var originaAJAX = L.TileLayer.WMS.Util.AJAX;

      L.TileLayer.WMS.Util.AJAX = function(options) {
        var responseText = '' +
        '<?xml version="1.0" encoding="UTF-8"?>' +
        '<WMS_Capabilities>' +
        '  <Capability>' +
        '    <Request>' +
        '      <GetCapabilities>' +
        '        <Format>text/xml</Format>' +
        '      </GetCapabilities>' +
        '      <GetFeatureInfo>' +
        '        <Format>application/vnd.ogc.gml</Format>' +
        '        <Format>application/vnd.ogc.gml/3.1.1</Format>' +
        '        <Format>text/html</Format>' +
        '        <Format>application/json</Format>' +
        '      </GetFeatureInfo>' +
        '    </Request>' +
        '  </Capability>' +
        '</WMS_Capabilities>';
        return options.done(responseText);
      };

      var layer = new L.TileLayer.WMS('http://test.ru', {
        version: '1.3.0',
      });

      var failSpy = sinon.spy();
      var result = layer.getFeatureInfo({ infoFormat: 'test', fail: failSpy});

      expect(failSpy.called).to.be.deep.equal(true);
      var str = failSpy.firstCall.args[0].toString();
      expect(str.indexOf("Error: Format 'test' ' is not implemented in 'L.TileLayer.WMS'. 'GetFeatureInfo' request can't be performed.")).to.be.deep.equal(0);

      L.TileLayer.WMS.Util.AJAX = originaAJAX;
    });

    it('if xml then uses to GeoJSON', function () {

    });

  });
});
