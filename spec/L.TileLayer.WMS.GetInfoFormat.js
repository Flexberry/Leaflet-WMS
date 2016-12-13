describe('L.TileLayer.WMS', function () {

  describe('#GetInfoFormat', function () {
    it('returns the format with the highest priority when finding intersections', function () {
      var originaAJAX = L.TileLayer.WMS.Util.AJAX;

      L.TileLayer.WMS.Util.AJAX = sinon.spy(function(options) {
        var responseText = '' +
        '<?xml version="1.0" encoding="UTF-8"?>' +
        '<WMS_Capabilities>' +
        '  <Capability>' +
        '    <Request>' +
        '      <GetFeatureInfo>' +
        '        <Format>text/html</Format>' +
        '        <Format>application/json</Format>' +
        '        <Format>format3</Format>' +
        '        <Format>format4</Format>' +
        '      </GetFeatureInfo>' +
        '    </Request>' +
        '  </Capability>' +
        '</WMS_Capabilities>';
        return options.done(responseText);
      });

      var layer = new L.TileLayer.WMS('http://test.ru', {
        version: '1.3.0',
      });

      var done = sinon.spy(function(infoFormat) {
      });

      layer.getInfoFormat({ done: done });

      expect(done.calledOnce).to.be.equal(true);
      expect(L.TileLayer.WMS.Util.AJAX.calledOnce).to.be.equal(true);
      expect(done.firstCall.args[0]).to.be.deep.equal("application/json");

      L.TileLayer.WMS.Util.AJAX = originaAJAX;
    });

    it('returns null if not finding intersections', function () {
      var originaAJAX = L.TileLayer.WMS.Util.AJAX;

      L.TileLayer.WMS.Util.AJAX = sinon.spy(function(options) {
        var responseText = '' +
        '<?xml version="1.0" encoding="UTF-8"?>' +
        '<WMS_Capabilities>' +
        '  <Capability>' +
        '    <Request>' +
        '      <GetCapabilities>' +
        '        <Format>text/xml</Format>' +
        '      </GetCapabilities>' +
        '      <GetFeatureInfo>' +
        '        <Format>NeSushchestvuyushchijFormat</Format>' +
        '      </GetFeatureInfo>' +
        '    </Request>' +
        '  </Capability>' +
        '</WMS_Capabilities>';
        return options.done(responseText);
      });

      var layer = new L.TileLayer.WMS('http://test.ru', {
        version: '1.3.0',
      });

      var done = sinon.spy(function(infoFormat) {
      });

      layer.getInfoFormat({ done: done });

      expect(done.calledOnce).to.be.equal(true);
      expect(L.TileLayer.WMS.Util.AJAX.calledOnce).to.be.equal(true);
      expect(done.firstCall.args[0]).to.be.deep.equal(null);

      L.TileLayer.WMS.Util.AJAX = originaAJAX;
    });
  });
});
