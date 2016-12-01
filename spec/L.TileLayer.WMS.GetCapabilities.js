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

    });

    it('ows ExceptionReport', function () {

    });

    it('404', function () {

    });

  });
});