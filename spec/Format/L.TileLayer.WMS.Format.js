describe('L.TileLayer.WMS.Format', function () {
  var originalFormat;

  before(function () {
    originalFormat = L.TileLayer.WMS.Format;

    // Stub existing formats.
    L.TileLayer.WMS.Format = {
      getExisting: originalFormat.getExisting,
      getAvailable: originalFormat.getAvailable,
      format5: {
        priority: 5,
        toGeoJSON: function () {}
      },
      format1: {
        priority: 1,
        toGeoJSON: function () {}
      },
      format3: {
        priority: 3,
        toGeoJSON: function () {}
      },
      format2: {
        priority: 2,
        toGeoJSON: function () {}
      },
      format4: {
        priority: 4,
        toGeoJSON: function () {}
      },

      format10: {
        priority: 10,
        toGeoJSON: {}
      },
      format6: {
        priority: 6,
        toGeoJSON: 1
      },
      format8: {
        priority: 8,
        toGeoJSON: '1'
      },
      format11: {
        priority: 11,
        toGeoJSON: true
      },
      format7: {
        priority: 7,
        toGeoJSON: null
      },
      format9: {
        priority: 9
      },
    };
  });

  after(function () {
    // Restore existing formats.
    L.TileLayer.WMS.Format = originalFormat;
  });

  describe('#getExisting', function () {
    it('returns implemented formats sorted by their priorities', function () {
      var existingFormats = L.TileLayer.WMS.Format.getExisting();

      expect(existingFormats).to.be.an('array');
      expect(existingFormats).to.have.lengthOf(5);
      expect(existingFormats).to.have.deep.property('[0]', 'format1');
      expect(existingFormats).to.have.deep.property('[1]', 'format2');
      expect(existingFormats).to.have.deep.property('[2]', 'format3');
      expect(existingFormats).to.have.deep.property('[3]', 'format4');
      expect(existingFormats).to.have.deep.property('[4]', 'format5');
    });
  });

  describe('#getAvailable', function () {
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
      var done = sinon.spy(function (availableFormats) {});

      // Call to 'getAvailable'.
      L.TileLayer.WMS.Format.getAvailable({
        url: 'http://test.ru',
        done: done
      });

      // Retrieve available formats from 'done' callback arguments.
      var availableFormats = done.getCall(0).args[0];

      // Check that 'done' & 'AJAX' were called only once.
      expect(done.calledOnce).to.be.equal(true);
      expect(L.TileLayer.WMS.Util.AJAX.calledOnce).to.be.equal(true);

      // Check retrieved elements.
      expect(availableFormats).to.be.an('array');
      expect(availableFormats).to.have.lengthOf(3);
      expect(availableFormats).to.have.deep.property('[0]', 'format1');
      expect(availableFormats).to.have.deep.property('[1]', 'format2');
      expect(availableFormats).to.have.deep.property('[2]', 'format3');

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

      var fail = sinon.spy(function (xhr) {});

      // Call to 'getAvailable'.
      L.TileLayer.WMS.Format.getAvailable({
        url: 'http://test.ru',
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

      var fail = sinon.spy(function (xhr) {});

      // Call to 'getAvailable'.
      L.TileLayer.WMS.Format.getAvailable({
        url: 'http://test.ru',
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
          '<ows:ExceptionReport xmlns:ows="http://www.opengis.net/ows"  version="1.3.0">' +
          '  <ows:Exception exceptionCode="ResourceNotFound" locator="404">' +
          '    <ExceptionText>Internal Server error' +
          '    </ExceptionText>' +
          '  </ows:Exception>' +
          '</ows:ExceptionReport >';
        return options.done(responseText);
      });

      var fail = sinon.spy(function (xhr) {});

      // Call to 'getAvailable'.
      L.TileLayer.WMS.Format.getAvailable({
        url: 'http://test.ru',
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

      var fail = sinon.spy(function (xhr) {});

      // Call to 'getAvailable'.
      L.TileLayer.WMS.Format.getAvailable({
        url: 'http://test.ru',
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