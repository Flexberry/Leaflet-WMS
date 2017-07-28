L.TileLayer.WMS.include({
  getFeatureInfo: function (options) {
    options = L.Util.extend({
      featureCount: 1,
      fail: function (errorThrown) {
        throw errorThrown;
      }
    }, options || {});

    var _this = this;
    var done = function (features, xhr) {
      if (typeof options.done === 'function') {
        options.done.call(_this, features, xhr);
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

    var getInfoFormat = options.infoFormat ? function (callbacks) {
      callbacks.done(options.infoFormat);
    } : _this.getInfoFormat;

    // Try to get info format for 'GetFeatureInfo' request & send request then.
    getInfoFormat.call(_this, {
      done: function (infoFormat, xhr) {
        var requestParamaters;

        try {
          var errorMessage;
          if (!infoFormat) {
            errorMessage = 'None of available formats for \'' + _this._url + '\' \'GetFeatureInfo\' requests ' +
              'are not implemented in \'L.TileLayer.WMS\'. ' +
              '\'GetFeatureInfo\' request can\'t be performed.';
            throw new Error(errorMessage);
          }

          if (!L.TileLayer.WMS.Format[infoFormat]) {
            errorMessage = 'Format \'' + infoFormat + '\' \' ' +
              'is not implemented in \'L.TileLayer.WMS\'. ' +
              '\'GetFeatureInfo\' request can\'t be performed.';
            throw new Error(errorMessage);
          }

          var leafletMap = _this._map || options.map;

          var latlng = options.latlng;
          var point = leafletMap.latLngToContainerPoint(latlng, leafletMap.getZoom());
          var size = leafletMap.getSize();
          var crs = _this.options.crs || leafletMap.options.crs;

          var mapBounds = leafletMap.getBounds();
          var nw = crs.project(mapBounds.getNorthWest());
          var se = crs.project(mapBounds.getSouthEast());

          var featureCount = options.featureCount || 1;

          // Defined request parameters.
          requestParamaters = {
            request: 'GetFeatureInfo',
            service: 'WMS',
            version: _this.wmsParams.version,
            layers: _this.wmsParams.layers,
            query_layers: _this.wmsParams.layers,
            info_format: infoFormat,
            feature_count: featureCount,
            height: size.y,
            width: size.x
          };

          // Define version-related request parameters.
          var version = window.parseFloat(_this.wmsParams.version);
          requestParamaters[version >= 1.3 ? 'crs' : 'srs'] = crs.code;
          requestParamaters['bbox'] = version >= 1.3 && crs === L.CRS.EPSG4326 ?
            se.y + ',' + nw.x + ',' + nw.y + ',' + se.x :
            nw.x + ',' + se.y + ',' + se.x + ',' + nw.y;
          requestParamaters[version >= 1.3 ? 'i' : 'x'] = point.x;
          requestParamaters[version >= 1.3 ? 'j' : 'y'] = point.y;
        } catch (e) {
          fail(e);

          return;
        }

        // Send 'GetFeatureInfo' request.
        L.TileLayer.WMS.Util.AJAX({
          url: _this._url,
          method: 'GET',
          content: requestParamaters,
          done: function (responseText, xhr) {
            try {
              // If some exception occur, WMS-service can response successfully, but with some exception report,
              // and such situation must be handled as error.
              var exceptionReport = L.TileLayer.WMS.Util.XML.ExceptionReport.parse(responseText);
              if (exceptionReport) {
                throw new Error(exceptionReport.message);
              }

              // Retrieve features.
              var features = L.TileLayer.WMS.Format[infoFormat].toGeoJSON(responseText);
              features.crs = crs;

              done(features, xhr);
            } catch (e) {
              fail(e, xhr);
            }
          },
          fail: fail
        });
      },
      fail: fail
    });
  }
});