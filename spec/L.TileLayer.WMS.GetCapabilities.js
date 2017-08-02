describe('L.TileLayer.WMS', function () {

  describe('#getCapabilities', function () {
    it('returns parsed capabilities through specified \'done\' callback', function () {
      // Stub AJAX util.
      var originaAJAX = L.TileLayer.WMS.Util.AJAX;
      L.TileLayer.WMS.Util.AJAX = sinon.spy(function (options) {
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

        return options.done(responseText);
      });

      // Prepare 'done' callback.
      var done = sinon.spy(function (capabilities) {});

      // Create WMS layer.
      var layer = new L.TileLayer.WMS('http://test.ru', {
        version: '1.3.0',
      });

      // Call to 'getCapabilities'.
      layer.getCapabilities({
        done: done
      });

      // Retrieve parsed capabilities from 'done' callback arguments.
      var capabilitiesElement = done.getCall(0).args[0];
      var capabilityElement = capabilitiesElement.getElementsByTagName('Capability')[0];
      var requestElement = capabilityElement.getElementsByTagName('Request')[0];
      var getFeatureInfoElement = requestElement.getElementsByTagName('GetFeatureInfo')[0];
      var formatElements = getFeatureInfoElement.getElementsByTagName('Format');

      // Check that 'done' & 'AJAX' were called only once.
      expect(done.calledOnce).to.be.equal(true);
      expect(L.TileLayer.WMS.Util.AJAX.calledOnce).to.be.equal(true);

      // Check retrieved elements.
      expect(capabilitiesElement.tagName).to.be.equal('WMS_Capabilities');
      expect(capabilityElement.tagName).to.be.equal('Capability');
      expect(requestElement.tagName).to.be.equal('Request');
      expect(getFeatureInfoElement.tagName).to.be.equal('GetFeatureInfo');
      expect(formatElements).to.have.lengthOf(3);
      expect(L.TileLayer.WMS.Util.XML.getElementText(formatElements[0])).to.be.equal('format1');
      expect(L.TileLayer.WMS.Util.XML.getElementText(formatElements[1])).to.be.equal('format2');
      expect(L.TileLayer.WMS.Util.XML.getElementText(formatElements[2])).to.be.equal('format3');

      // Call to 'getCapabilities' again to check that cached value will be returned & second AJAX request won't be sended.
      layer.getCapabilities({
        done: done
      });

      // Retrieve parsed capabilities from 'done' callback arguments.
      var capabilitiesElement2 = done.getCall(1).args[0];

      // Check that 'done' callback has been called again, but 'AJAX' hasn't been called again & capabilities are the same.
      expect(done.calledTwice).to.be.equal(true);
      expect(L.TileLayer.WMS.Util.AJAX.calledOnce).to.be.equal(true);
      expect(capabilitiesElement2 === capabilitiesElement).to.be.equal(true);

      // Restore stubbed AJAX util.
      L.TileLayer.WMS.Util.AJAX = originaAJAX;
    });

    it('returns exception through \'fail\' callback if AJAX request succeed with text containing \'ServiceExceptionReport\'', function () {
      var originaAJAX = L.TileLayer.WMS.Util.AJAX;

      L.TileLayer.WMS.Util.AJAX = sinon.spy(function (options) {
        var responseText = '' +
          '<?xml version="1.0"?>' +
          '<ServiceExceptionReport version="1.2.0">' +
          '  <ServiceException code="999" locator="INSERTSTMT01">' +
          '    parse error: missing closing tag for element WKB_GEOM' +
          '  </ServiceException>' +
          '</ServiceExceptionReport>';
        return options.done(responseText);
      });

      var layer = new L.TileLayer.WMS('http://test.ru', {
        version: '1.3.0',
      });

      var fail = sinon.spy(function (capabilities) {});

      layer.getCapabilities({
        fail: fail
      });

      expect(fail.calledOnce).to.be.equal(true);
      expect(L.TileLayer.WMS.Util.AJAX.calledOnce).to.be.equal(true);
      var str = fail.getCall(0).args[0].toString();
      expect(str.indexOf("Error: 999 - parse error: missing closing tag for element WKB_GEOM. ")).to.be.deep.equal(0);

      L.TileLayer.WMS.Util.AJAX = originaAJAX;
    });

    it('returns exception through \'fail\' callback if AJAX request succeed with text containing \'ows:ExceptionReport\'', function () {
      var originaAJAX = L.TileLayer.WMS.Util.AJAX;

      L.TileLayer.WMS.Util.AJAX = sinon.spy(function (options) {
        var responseText = '' +
          '<?xml version="1.0"?>' +
          '<ows:ExceptionReport xmlns:ows="http://www.opengis.net/ows" version="1.3.0">' +
          '  <ows:Exception exceptionCode="XML getFeature request SAX parsing error" locator="test">' +
          '    <ExceptionText>TEST text' +
          '    </ExceptionText>' +
          '  </ows:Exception>' +
          '</ows:ExceptionReport>';
        return options.done(responseText);
      });

      var layer = new L.TileLayer.WMS('http://test.ru', {
        version: '1.3.0',
      });

      var fail = sinon.spy(function (capabilities) {});

      layer.getCapabilities({
        fail: fail
      });

      expect(fail.calledOnce).to.be.equal(true);
      expect(L.TileLayer.WMS.Util.AJAX.calledOnce).to.be.equal(true);
      var str = fail.getCall(0).args[0].toString();
      expect(str.indexOf("Error: XML getFeature request SAX parsing error - TEST text. ")).to.be.deep.equal(0);

      L.TileLayer.WMS.Util.AJAX = originaAJAX;
    });

    it('returns exception through \'fail\' callback if AJAX request succeed with text containing \'ExceptionReport\'', function () {
      var originaAJAX = L.TileLayer.WMS.Util.AJAX;

      L.TileLayer.WMS.Util.AJAX = sinon.spy(function (options) {
        var responseText = '' +
          '<?xml version="1.0"?>' +
          '<ows:ExceptionReport xmlns:ows="http://www.opengis.net/ows" version="1.3.0">' +
          '  <ows:Exception exceptionCode="ResourceNotFound" locator="404">' +
          '    <ExceptionText>Internal Server error' +
          '    </ExceptionText>' +
          '  </ows:Exception>' +
          '</ows:ExceptionReport>';
        return options.done(responseText);
      });

      var layer = new L.TileLayer.WMS('http://test.ru', {
        version: '1.3.0',
      });

      var fail = sinon.spy(function (capabilities) {});

      layer.getCapabilities({
        fail: fail
      });

      expect(fail.calledOnce).to.be.equal(true);
      expect(L.TileLayer.WMS.Util.AJAX.calledOnce).to.be.equal(true);
      var str = fail.firstCall.args[0].toString();
      expect(str.indexOf("Error: ResourceNotFound - Internal Server error. ")).to.be.deep.equal(0);

      L.TileLayer.WMS.Util.AJAX = originaAJAX;
    });

    it('returns exception through \'fail\' callback if AJAX request fails with an error', function () {
      var server = sinon.fakeServer.create();

      server.respondWith(function (xhr) {
        xhr.respond(404, {
          'Content-Type': 'text/html'
        }, 'Not Found');
        return;
      });

      var layer = new L.TileLayer.WMS('http://test.ru', {});

      var fail = sinon.spy(function (capabilities) {});

      layer.getCapabilities({
        fail: fail
      });
      server.respond();

      // Check events handlers.
      expect(fail.calledOnce).to.be.equal(true);
      var str = fail.firstCall.args[0].toString();
      expect(str.indexOf("Error: 404 - Not Found")).to.be.deep.equal(0);
    });
  });
});