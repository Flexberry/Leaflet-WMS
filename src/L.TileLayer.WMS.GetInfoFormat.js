L.TileLayer.WMS.include({
  _infoFormat: null,

  getInfoFormat: function(options) {
    options = L.Util.extend({
      fail: function(errorThrown) {
        throw errorThrown;
      }
    }, options || {});

    var done = function(preferredFormat, xhr) {
      if (typeof options.done === 'function') {
        options.done(preferredFormat, xhr);
      }

      if (typeof options.always === 'function') {
        options.always();
      }
    };

    var fail = function(errorThrown, xhr) {
      if (typeof options.fail === 'function') {
        options.fail(errorThrown, xhr);
      }

      if (typeof options.always === 'function') {
        options.always();
      }
    };

    // Check if info format was already received & cached.
    var _this = this;
    var infoFormat = _this._infoFormat;
    if (infoFormat) {
      done(infoFormat);

      return;
    }

    // Try to send 'GetCapabilities' request & retrieve preferred format from capabilities.
    _this.getCapabilities({
      done: function(capabilities, xhr) {
        try {
          // Existing formats (implemented in plugin) sorted by their priority.
          var existingFormats = L.TileLayer.WMS.Format.getExisting();

          // Capable formats (supported by service).
          var capableFormats = [];

          var capabilityElement = capabilities.getElementsByTagName('Capability')[0];
          var getFeatureInfoElement = capabilityElement.getElementsByTagName('GetFeatureInfo')[0];
          var formatElements = getFeatureInfoElement.getElementsByTagName('Format');
          for (var i = 0, len = formatElements.length; i < len; i++) {
            var formatElement = formatElements[i];
            capableFormats.push(L.TileLayer.WMS.Util.XML.getElementText(formatElement).trim().toLowerCase());
          }

          for (var j = 0, len2 = existingFormats.length; j < len2; j++) {
            var format = existingFormats[j];
            if (capableFormats.indexOf(format) >= 0) {
              infoFormat = format;

              break;
            }
          }

          // Cache retrieved format.
          _this._infoFormat = infoFormat;

          done(infoFormat, xhr);
        } catch(e) {
          fail(e, xhr);
        }
      },
      fail: fail
    });
  }
});
