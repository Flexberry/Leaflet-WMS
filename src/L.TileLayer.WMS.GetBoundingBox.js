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

    // Check if bounding box was already received & cached.
    var boundingBox = _this._boundingBox;
    if (boundingBox) {
      done(boundingBox);

      return;
    }

    // Try to send 'GetCapabilities' request & retrieve bounding box from capabilities.
    _this.getCapabilities({
      done: function (capabilities, xhr) {
        try {
          var wmsLayers = options.layers || _this.wmsParams.layers;

          var capabilityElement = capabilities.getElementsByTagName('Capability')[0];
          var rootLayerElement = capabilityElement.getElementsByTagName('Layer')[0];
          var layersElements = rootLayerElement.getElementsByTagName('Layer');

          // Array of nodes containing to extract bounding boxes.
          var targetLayersElements = [];

          // If it is possible to get bounding boxes for specific layers.
          if (layersElements && layersElements.length > 0 && wmsLayers && wmsLayers.length > 0) {
            // Wms layers names array.
            var wmsLayersNames = wmsLayers.split(',');

            // Pure wms layers names array without namespace.
            var targetLayersNames = [];

            for (var i = 0, leni = wmsLayersNames.length; i < leni; i++) {
              var wmsLayer = wmsLayersNames[i];

              // Get rid off namespace.
              var name = wmsLayer.split(':');
              name = name[1] || name[0];

              targetLayersNames.push(name);
            }

            for (var j = 0, lenj = layersElements.length; j < lenj; j++) {
              var layerElement = layersElements[j];
              var layerName = L.TileLayer.WMS.Util.XML.getElementText(layerElement.getElementsByTagName('Name')[0]);

              // Put suitable layer nodes to array.
              if (targetLayersNames.indexOf(layerName) >= 0) {
                targetLayersElements.push(layerElement);
              }
            }
          } else {
            targetLayersElements.push(rootLayerElement);
          }

          for (var k = 0, lenk = targetLayersElements.length; k < lenk; k++) {
            var west;
            var east;
            var south;
            var north;

            var layer = targetLayersElements[k];

            if (!_this.wmsParams.version || _this.wmsParams.version >= 1.3 || _this.wmsParams.version === '1.3.0') {
              // Every named Layer shall have exactly one <EX_GeographicBoundingBox> element... (OGC® 06-042).
              var geographicBoundingBox = layer.getElementsByTagName('EX_GeographicBoundingBox')[0];

              // Extract latlongs.
              west = L.TileLayer.WMS.Util.XML.getElementText(geographicBoundingBox.getElementsByTagName('westBoundLongitude')[0]);
              east = L.TileLayer.WMS.Util.XML.getElementText(geographicBoundingBox.getElementsByTagName('eastBoundLongitude')[0]);
              south = L.TileLayer.WMS.Util.XML.getElementText(geographicBoundingBox.getElementsByTagName('southBoundLatitude')[0]);
              north = L.TileLayer.WMS.Util.XML.getElementText(geographicBoundingBox.getElementsByTagName('northBoundLatitude')[0]);
            } else {
              // Every Layer shall have exactly one <LatLonBoundingBox> element... (OGC 01-068r3).
              var latLonBoundingBox = layer.getElementsByTagName('LatLonBoundingBox')[0];

              // Extract latlongs.
              west = latLonBoundingBox.getAttribute('minx');
              east = latLonBoundingBox.getAttribute('maxx');
              south = latLonBoundingBox.getAttribute('miny');
              north = latLonBoundingBox.getAttribute('maxy');
            }

            // Wrap it into LatLngBounds.
            var bounds = L.latLngBounds(L.latLng(south, west), L.latLng(north, east));

            // If it is not the first iteration.
            if (boundingBox) {
              boundingBox = boundingBox.extend(bounds);
            } else {
              boundingBox = bounds;
            }
          }

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