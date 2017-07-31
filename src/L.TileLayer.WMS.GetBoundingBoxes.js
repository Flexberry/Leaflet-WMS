L.TileLayer.WMS.include({
  _boundingBox: null,

  getBoundingBox: function (options) {
    options = L.Util.extend({
      fail: function (errorThrown) {
        throw errorThrown;
      }
    }, options || {});

    var _this = this;
    var done = function (boundingBox, xhr) {
      if (typeof options.done === 'function') {
        options.done.call(_this, boundingBox, xhr);
      }

      if (typeof options.always === 'function') {
        options.always.call(_this);
      }
    };

    var fail = function (errorThrown, xhr) {
      if (typeof options.fail === 'function') {
        options.fail.call(_this, errorThrown, xhr);
      }

      if (typeof options.always === 'function') {
        options.always.call(_this);
      }
    };

    // Check if info format was already received & cached.
    var boundingBox = _this._boundingBox;
    if (boundingBox) {
      done(boundingBox);

      return;
    }

    // Try to send 'GetCapabilities' request & retrieve bounding box from capabilities.
    _this.getCapabilities({
      done: function (capabilities, xhr) {
        try {
          var leafletMap = _this._map || options.map;
          var crs = _this.options.crs || leafletMap.options.crs;

          var capabilityElement = capabilities.getElementsByTagName('Capability')[0];
          var layerElement = capabilityElement.getElementsByTagName('Layer')[0];
          var boundingBoxes = layerElement.getElementsByTagName('BoundingBox');

          var west;
          var east;
          var south;
          var north;
          var ne;
          var sw;

          if (_this.wmsParams.version >= 1.3) {
            // Every named Layer shall have exactly one <EX_GeographicBoundingBox> element... OGC® 06-042.
            var geographicBoundingBox = layerElement.getElementsByTagName('EX_GeographicBoundingBox')[0];

            // Extract latlongs.
            west = L.TileLayer.WMS.Util.XML.getElementText(geographicBoundingBox.getElementsByTagName()[0], 'westBoundLongitude');
            east = L.TileLayer.WMS.Util.XML.getElementText(geographicBoundingBox.getElementsByTagName()[0], 'eastBoundLongitude');
            south = L.TileLayer.WMS.Util.XML.getElementText(geographicBoundingBox.getElementsByTagName()[0], 'southBoundLatitude');
            north = L.TileLayer.WMS.Util.XML.getElementText(geographicBoundingBox.getElementsByTagName()[0], 'northBoundLatitude');
          } else {
            // Every Layer shall have exactly one <LatLonBoundingBox> element... OGC 01-068r3.
            var latLonBoundingBox = layerElement.getElementsByTagName('LatLonBoundingBox')[0];

            // Extract latlongs.
            west = latLonBoundingBox.getAttribute('minx');
            east = latLonBoundingBox.getAttribute('maxx');
            south = latLonBoundingBox.getAttribute('miny');
            north = latLonBoundingBox.getAttribute('maxy');
          }

          // Wrap it into latlng.
          ne = L.latLng(north, east);
          sw = L.latLng(south, west);


          var boundingBox = L.latLngBounds(ne, sw);

          // Cache retrieved format.
          _this._boundingBox = boundingBox;

          done(boundingBox, xhr);
        } catch (e) {
          fail(e, xhr);
        }
      },
      fail: fail
    });
  }
});