describe('L.TileLayer.WMS.GetCapabilities', function () {

  describe('#GetCapabilities', function () {
    it('correct query', function () {

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
        '        <Format>text/plain</Format>' +
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

      var doneSpy = sinon.spy();
      var result = layer.getCapabilities({ done: doneSpy });

      expect(doneSpy.called).to.be.deep.equal(true);

      L.TileLayer.WMS.Util.AJAX = originaAJAX;
    });

    it('service ExceptionReport', function () {
      var originaAJAX = L.TileLayer.WMS.Util.AJAX;

      L.TileLayer.WMS.Util.AJAX = function(options) {
        var responseText = '' +
        '<?xmlversion="1.0"?>' +
        '<ServiceExceptionReport version="1.2.0">' +
        '  <ServiceException code="999" locator="INSERTSTMT01">' +
        '    parse error: missing closing tag for element WKB_GEOM' +
        '  </ServiceException>' +
        '</ServiceExceptionReport>';
        return options.done(responseText);
      };
      var layer = new L.TileLayer.WMS('http://test.ru', {
        version: '1.3.0',
      });

      var failSpy = sinon.spy();
      var result = layer.getCapabilities({ fail: failSpy });

      expect(failSpy.called).to.be.deep.equal(true);

      L.TileLayer.WMS.Util.AJAX = originaAJAX;
    });

    it('ows ExceptionReport', function () {

      var originaAJAX = L.TileLayer.WMS.Util.AJAX;

      L.TileLayer.WMS.Util.AJAX = function(options) {
        var responseText = '' +
        '<?xmlversion="1.0"?>' +
        '<ows:ExceptionReport version="1.3.0">' +
        '  <ows:Exception exceptionCode="XML getFeature request SAX parsing error" locator="test">' +
        '    <ows:ExceptionText>TEST text' +
        '    </ows:ExceptionText>' +
        '  </ows:Exception>' +
        '</ows:ExceptionReport>';
        return options.done(responseText);
      };

      var layer = new L.TileLayer.WMS('http://test.ru', {
        version: '1.3.0',
      });

      var failSpy = sinon.spy();
      var result = layer.getCapabilities({ fail: failSpy });

      expect(failSpy.called).to.be.deep.equal(true);

      L.TileLayer.WMS.Util.AJAX = originaAJAX;
    });

    it('404', function () {

      var originaAJAX = L.TileLayer.WMS.Util.AJAX;

      L.TileLayer.WMS.Util.AJAX = function(options) {
      var responseText = '' +
        '<?xml version="1.0" encoding="UTF-8"?>' +
        '<ExceptionReport version="1.0">' +
        '  <Exception exceptionCode="ResourceNotFound">' +
        '    <ExceptionText>Internal Server error.' +
        '    <ExceptionText>' +
        '  </Exception>' +
        '</ExceptionReport>';
        return options.done(responseText);
      };

      var layer = new L.TileLayer.WMS('http://test.ru', {
        version: '1.3.0',
      });

      var failSpy = sinon.spy();
      var result = layer.getCapabilities({ fail: failSpy });

      expect(failSpy.called).to.be.deep.equal(true);

      L.TileLayer.WMS.Util.AJAX = originaAJAX;
    });

    it('double correct query', function () {

      var originaAJAX = L.TileLayer.WMS.Util.AJAX;
      var callТumber = 0;
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
        '        <Format>text/plain</Format>' +
        '        <Format>application/vnd.ogc.gml</Format>' +
        '        <Format>application/vnd.ogc.gml/3.1.1</Format>' +
        '        <Format>text/html</Format>' +
        '        <Format>application/json</Format>' +
        '      </GetFeatureInfo>' +
        '    </Request>' +
        '  </Capability>' +
        '</WMS_Capabilities>';

        callТumber++;
        return options.done(responseText);
      };

      var layer = new L.TileLayer.WMS('http://test.ru', {
        version: '1.3.0',
      });

      var result = layer.getCapabilities();
      var result2 = layer.getCapabilities();

      expect(callТumber).to.be.deep.equal(1);

      L.TileLayer.WMS.Util.AJAX = originaAJAX;
    });
  });
});
