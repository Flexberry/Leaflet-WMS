describe('L.TileLayer.WMS', function () {

  describe('#GetFeatureInfo', function () {
    it('None of available formats', function () {
      var originaAJAX = L.TileLayer.WMS.Util.AJAX;

      L.TileLayer.WMS.Util.AJAX = sinon.spy(function(options) {
        var responseText = '' +
        '<?xml version="1.0" encoding="UTF-8"?>' +
        '<WMS_Capabilities>' +
        '  <Capability>' +
        '    <Request>' +
        '      <GetFeatureInfo>' +
        '        <Format>format1</Format>' +
        '        <Format>format2</Format>' +
        '      </GetFeatureInfo>' +
        '    </Request>' +
        '  </Capability>' +
        '</WMS_Capabilities>';
        return options.done(responseText);
      });

      var layer = new L.TileLayer.WMS('http://test.ru', {
        version: '1.3.0',
      });

      var fail = sinon.spy(function(featureInfo) {
      });

      layer.getFeatureInfo({ fail: fail});

      expect(fail.called).to.be.deep.equal(true);
      expect(L.TileLayer.WMS.Util.AJAX.calledOnce).to.be.equal(true);
      var str = fail.firstCall.args[0].toString();
      expect(str.indexOf("Error: None of available formats for 'http://test.ru' 'GetFeatureInfo'" +
       " requests are not implemented in 'L.TileLayer.WMS'. 'GetFeatureInfo' request can't be performed.")).to.be.deep.equal(0);

      L.TileLayer.WMS.Util.AJAX = originaAJAX;
    });

    it('Format is not implemented', function () {
      var layer = new L.TileLayer.WMS('http://test.ru', {
        version: '1.3.0',
      });

      var fail = sinon.spy(function(featureInfo) {
      });

      layer.getFeatureInfo({ infoFormat: 'test', fail: fail});

      expect(fail.called).to.be.deep.equal(true);
      var str = fail.firstCall.args[0].toString();
      expect(str.indexOf("Error: Format 'test' ' is not implemented in 'L.TileLayer.WMS'. 'GetFeatureInfo' request can't be performed.")).to.be.deep.equal(0);
    });

    it('with the option', function () {

    });

    it('no option', function () {

    });

    it('version >= 1.3', function () {

    });

    it('version < 1.3', function () {

    });

    it('if xml then uses to GeoJSON', function () {

    });
  });
});
