L.TileLayer.WMS.include({
  _capabilities: null,

  getCapabilities: function(options) {
    options = L.Util.extend({
      fail: function(errorThrown) {
        throw errorThrown;
      }
    }, options || {});

    var _this = this;
    var done = function(capabilities, xhr) {
      if (typeof options.done === 'function') {
        options.done.call(_this, capabilities, xhr);
      }

      if (typeof options.always === 'function') {
        options.always.call(_this);
      }
    };

    var fail = function(errorThrown, xhr) {
      if (typeof options.fail === 'function') {
        options.fail.call(_this, errorThrown, xhr);
      }

      if (typeof options.always === 'function') {
        options.always.call(_this);
      }
    };

    // Check if capabilities was already received & cached.
    var capabilities = _this._capabilities;
    if (capabilities) {
      done(capabilities);

      return;
    }

    // Try to send 'GetCapabilities' request & cache results.
    L.TileLayer.WMS.Util.AJAX({
      url: _this._url,
      method: 'GET',
      content: {
        request: 'GetCapabilities',
        service: 'WMS',
        version: _this.wmsParams.version
      },
      done: function(responseText, xhr) {
        try {
          // If some exception occur, WMS-service can response successfully, but with some exception report,
          // and such situation must be handled as error.
          var exceptionReport = L.TileLayer.WMS.Util.XML.ExceptionReport.parse(responseText);
          if (exceptionReport) {
            throw new Error(exceptionReport.message);
          }

          // Parse & cache received capabilities.
          var capabilities = L.TileLayer.WMS.Util.XML.parse(responseText);
          _this._capabilities = capabilities;

          done(capabilities, xhr);
        } catch (e) {
          fail(e, xhr);
        }
      },
      fail: fail
    });
  }
});
