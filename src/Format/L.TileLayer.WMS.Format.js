L.TileLayer.WMS.Format = {
  getExisting: function () {
    var existingFormatsNames = [];
    var formatNameSpace = L.TileLayer.WMS.Format;

    for (var key in formatNameSpace) {
      var format = formatNameSpace.hasOwnProperty(key) ? formatNameSpace[key] : null;
      if (format && typeof format === 'object' && typeof format.toGeoJSON === 'function') {
        existingFormatsNames.push(key);
      }
    }

    // Sort existing formats by their priority.
    existingFormatsNames.sort(function (name1, name2) {
      var format1 = L.TileLayer.WMS.Format[name1];
      var format2 = L.TileLayer.WMS.Format[name2];

      if (format1.priority > format2.priority) {
        return 1;
      }
      if (format1.priority < format2.priority) {
        return -1;
      }

      return 0;
    });

    return existingFormatsNames;
  },

  getAvailable: function (options) {
    options = L.Util.extend({
      fail: function (errorThrown) {
        throw errorThrown;
      }
    }, options || {});

    var done = function (capabilities, xhr) {
      if (typeof options.done === 'function') {
        options.done.call(window, capabilities, xhr);
      }

      if (typeof options.always === 'function') {
        options.always.call(window);
      }
    };

    var fail = function (errorThrown, xhr) {
      if (typeof options.fail === 'function') {
        options.fail.call(window, errorThrown, xhr);
      }

      if (typeof options.always === 'function') {
        options.always.call(window);
      }
    };

    // Try to send 'GetCapabilities' request.
    L.TileLayer.WMS.Util.AJAX({
      url: options.url,
      method: 'GET',
      content: {
        request: 'GetCapabilities',
        service: 'WMS',
        version: options.wmsParams ? options.wmsParams.version || '1.1.0' : '1.1.0'
      },

      done: function (responseText, xhr) {
        try {
          // If some exception occur, WMS-service can response successfully, but with some exception report,
          // and such situation must be handled as error.
          var exceptionReport = L.TileLayer.WMS.Util.XML.ExceptionReport.parse(responseText);
          if (exceptionReport) {
            throw new Error(exceptionReport.message);
          }

          // Parse received capabilities.
          var capabilities = L.TileLayer.WMS.Util.XML.parse(responseText);

          // Capable formats (supported by service).
          var capableFormats = L.TileLayer.WMS.Util.XML.extractInfoFormats(capabilities);

          // Existing formats (implemented in plugin) sorted by their priority.
          var existingFormats = L.TileLayer.WMS.Format.getExisting();

          // Available formats (both implemented in plugin and supported by service) sorted by their priority.
          var availableFormats = [];

          for (var i = 0; i < existingFormats.length; i++) {
            var format = existingFormats[i];
            if (capableFormats.indexOf(format) >= 0) {
              availableFormats.push(format);
            }
          }

          done(availableFormats, xhr);
        } catch (e) {
          fail(e, xhr);
        }
      },
      fail: fail
    });
  }
};