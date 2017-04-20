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

    it('do getFeatureInfo through specified \'done\'', function () {
      var originaAJAX = L.TileLayer.WMS.Util.AJAX;

      L.TileLayer.WMS.Util.AJAX = sinon.spy(function(options) {
        var responseText = '{' +
          '"type": "FeatureCollection",' +
          '"features": [{' +
              '"type": "Feature",' +
              '"geometry": { "type": "Point", "coordinates": [1, 2] },' +
              '"properties": { "name": "feature1", "weight": 1 }' +
            '}, {' +
              '"type": "Feature2",' +
              '"geometry": { "type": "Point", "coordinates": [3, 4] },' +
              '"properties": { "name": "feature2", "weight": null }' +
            '}' +
          ']' +
        '}';
        return options.done(responseText);
      });

      var div = document.createElement('div');
      var map = new L.Map(div).setView([20, 20], 15);

      var layer = new L.TileLayer.WMS('', {
        version: '1.3.0'
      }).addTo(map);

      var done = sinon.spy(function(featureInfo) {
      });

      layer.getFeatureInfo({done: done, latlng: L.latLng(5, 5), infoFormat: 'application/json' });

      expect(done.called).to.be.deep.equal(true);
      expect(L.TileLayer.WMS.Util.AJAX.calledOnce).to.be.equal(true);
      L.TileLayer.WMS.Util.AJAX = originaAJAX;

    });

    it('use special options when version >= 1.3', function () {
      var originaAJAX = L.TileLayer.WMS.Util.AJAX;
      var content = null;

      L.TileLayer.WMS.Util.AJAX = sinon.spy(function(options) {
        content = options.content;
        var responseText = '{' +
          '"type": "FeatureCollection",' +
          '"features": [{' +
              '"type": "Feature",' +
              '"geometry": { "type": "Point", "coordinates": [1, 2] },' +
              '"properties": { "name": "feature1", "weight": 1 }' +
            '}, {' +
              '"type": "Feature2",' +
              '"geometry": { "type": "Point", "coordinates": [3, 4] },' +
              '"properties": { "name": "feature2", "weight": null }' +
            '}' +
          ']' +
        '}';
        return options.done(responseText);
      });

      var div = document.createElement('div');
      var map = new L.Map(div).setView([20, 20], 15);

      var layer = new L.TileLayer.WMS('', {
        version: '1.3.0',
        crs: L.CRS.EPSG4326
      }).addTo(map);

      var done = sinon.spy(function(featureInfo) {
      });

      layer.getFeatureInfo({done: done, latlng: L.latLng(5, 5), infoFormat: 'application/json' });

      var crs = layer.options.crs;
      var mapBounds = map.getBounds();
      var nw = crs.project(mapBounds.getNorthWest());
      var se = crs.project(mapBounds.getSouthEast());

      expect(done.called).to.be.deep.equal(true);
      expect(L.TileLayer.WMS.Util.AJAX.calledOnce).to.be.equal(true);
      expect(content.crs).to.not.equal(null);
      expect(content.i).to.not.equal(null);
      expect(content.j).to.not.equal(null);
      expect(content.srs).to.be.equal(undefined);
      expect(content.x).to.be.equal(undefined);
      expect(content.y).to.be.equal(undefined);
      expect(content.bbox).to.be.equal(se.y + ',' + nw.x + ',' + nw.y + ',' + se.x);
      expect(content.crs).to.be.equal('EPSG:4326');
      expect(content.i).to.be.equal(-349526);
      expect(content.j).to.be.equal(359140);

      L.TileLayer.WMS.Util.AJAX = originaAJAX;
    });

    it('use special options when version < 1.3', function () {
      var originaAJAX = L.TileLayer.WMS.Util.AJAX;
      var content = null;

      L.TileLayer.WMS.Util.AJAX = sinon.spy(function(options) {
        content = options.content;
        var responseText = '{' +
          '"type": "FeatureCollection",' +
          '"features": [{' +
              '"type": "Feature",' +
              '"geometry": { "type": "Point", "coordinates": [1, 2] },' +
              '"properties": { "name": "feature1", "weight": 1 }' +
            '}, {' +
              '"type": "Feature2",' +
              '"geometry": { "type": "Point", "coordinates": [3, 4] },' +
              '"properties": { "name": "feature2", "weight": null }' +
            '}' +
          ']' +
        '}';
        return options.done(responseText);
      });

      var div = document.createElement('div');
      var map = new L.Map(div).setView([20, 20], 15);

      var layer = new L.TileLayer.WMS('', {
        version: '1.1.0',
        crs: L.CRS.EPSG3857
      }).addTo(map);

      var done = sinon.spy(function(featureInfo) {
      });

      layer.getFeatureInfo({done: done, latlng: L.latLng(5, 5), infoFormat: 'application/json' });

      var crs = layer.options.crs;
      var mapBounds = map.getBounds();
      var nw = crs.project(mapBounds.getNorthWest());
      var se = crs.project(mapBounds.getSouthEast());

      expect(done.called).to.be.deep.equal(true);
      expect(L.TileLayer.WMS.Util.AJAX.calledOnce).to.be.equal(true);
      expect(content.srs).to.not.equal(null);
      expect(content.x).to.not.equal(null);
      expect(content.y).to.not.equal(null);
      expect(content.crs).to.be.equal(undefined);
      expect(content.i).to.be.equal(undefined);
      expect(content.j).to.be.equal(undefined);
      expect(content.bbox).to.be.equal(nw.x + ',' + se.y + ',' + se.x + ',' + nw.y);
      expect(content.srs).to.be.equal('EPSG:3857');
      expect(content.x).to.be.equal(-349526);
      expect(content.y).to.be.equal(359140);

      L.TileLayer.WMS.Util.AJAX = originaAJAX;
    });

    it('if xml then uses to GeoJSON', function () {
      var originaAJAX = L.TileLayer.WMS.Util.AJAX;

      L.TileLayer.WMS.Util.AJAX = sinon.spy(function(options) {
        var responseText = '' +
          '<?xml version="1.0" encoding="UTF-8"?>' +
          '<FeatureInfoResponse xmlns:esri_wms="http://www.esri.com/wms" xmlns="http://www.esri.com/wms">' +
          '  <FIELDS name="feature1" weight="1"></FIELDS>' +
          '  <FIELDS name="feature2" weight=""></FIELDS>' +
          '</FeatureInfoResponse>';
        return options.done(responseText);
      });

      var div = document.createElement('div');
      var map = new L.Map(div).setView([20, 20], 15);

      var layer = new L.TileLayer.WMS('', {
        version: '1.3.0'
      }).addTo(map);

      var done = sinon.spy(function(featureInfo) {
      });

      layer.getFeatureInfo({done: done, latlng: L.latLng(5, 5), infoFormat: 'text/xml' });

      expect(done.called).to.be.deep.equal(true);
      expect(L.TileLayer.WMS.Util.AJAX.calledOnce).to.be.equal(true);
      var element = done.getCall(0).args[0];
      expect(element.type).to.be.deep.equal('FeatureCollection');
      expect(element.features).to.be.deep.equal(
      [{
        type: 'Feature',
        geometry: null,
        properties: { name: 'feature1', weight: '1' }
      }, {
        type: 'Feature',
        geometry: null,
        properties: { name: 'feature2', weight: null }
      }]);

      L.TileLayer.WMS.Util.AJAX = originaAJAX;
    });
  });
});
