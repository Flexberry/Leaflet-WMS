L.TileLayer.WMS.include({
  _boundingBoxes: null,

  getBoundingBoxes: function(options) {
    var optionsCopy = Object.assign({}, options);
    var _this = this;

    optionsCopy.done = function(capabilities, xhr) {
      var boundingBoxes = L.TileLayer.WMS.Util.XML.getElementsByPath(capabilities, 'Capability/Layer/BoundingBox');
      var crs = _this.options.crs || _this._map.options.crs;
      var result;
      
      for (var i = 0; i < boundingBoxes.length; i++) {
        var bbox = boundingBoxes[i];

        if (bbox.getAttribute('CRS') === crs.code || bbox.getAttribute('SRS') === crs.code) {
          var corner1 = L.latLng(bbox.getAttribute('minx'), bbox.getAttribute('miny')),
            corner2 = L.latLng(bbox.getAttribute('maxx'), bbox.getAttribute('maxy'));

          result = L.latLngBounds(corner1, corner2);

          break;
        }
      }

      if (typeof options.done === 'function') {
        options.done.call(_this, result, xhr);
      }

      if (typeof options.always === 'function') {
        options.always.call(_this);
      }
    };

    optionsCopy.fail = function(errorThrown, xhr) {
      if (typeof options.fail === 'function') {
        options.fail.call(_this, errorThrown, xhr);
      }

      if (typeof options.always === 'function') {
        options.always.call(_this);
      }
    };

    // Check if bounding boxes was already received & cached.
    var boundingBoxes = _this._boundingBoxes;
    if (boundingBoxes) {
      options.done.call(_this, boundingBoxes);

      return;
    }

    // Try to send 'GetCapabilities' request & cache results for extracting bounding boxes.
    _this.getCapabilities(optionsCopy);
  }
});
