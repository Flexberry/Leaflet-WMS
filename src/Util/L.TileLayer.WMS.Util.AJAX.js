;(function() {
  var mergeObjects = function () {
    var i, len, key, src, dest;

    for (i = 0, len = arguments.length; i < len; i++) {
      src = arguments[i];
      dest = dest || {};

      for (key in src) {
        dest[key] = src[key];
      }
    }

    return dest;
  };

  var encodeUrlComponent = function(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
      return '%' + c.charCodeAt(0).toString(16);
    });
  };

  var encodeUrl = function (url, obj) {
    var params, key;
    obj = obj || {};
    params = [];

    for (key in obj) {
      params.push(encodeUrlComponent(key) + '=' + encodeUrlComponent(obj[key]));
    }

    url = url || '';
    return url + ((url.indexOf('?') === -1) ? '?' : '&') + params.join('&');
  };

  var isCrossDomainUrl = function(url) {
    if (typeof url !== 'string') {
      return false;
    }

    var currentLocation = window.location;
    var link = document.createElement('a');
    link.href = url;

    if (link.protocol !== '' && currentLocation.protocol !== link.protocol) {
      return true;
    }

    if (link.hostname !== '' && currentLocation.hostname !== link.hostname) {
      return true;
    }

    if (link.port !== '' && currentLocation.port !== link.port) {
      return true;
    }

    return false;
  };

  var XHR = function(url) {
    var xhr, xdr, error;

    // IE7 has XMLHttpRequest, but it can't request to local files,
    // also in IE7/IE8 XMLHttpRequest can be disabled, so we need an ActiveXObject instead of XMLHttpRequest.
    var isLowerThenInternetExplorer9 =  !document.addEventListener || !document.querySelector;
    if (window.ActiveXObject && (!window.XMLHttpRequest || isLowerThenInternetExplorer9)) {
      var activexRealizations = [
        'Msxml2.XMLHTTP.6.0',
        'Msxml2.XMLHTTP.3.0',
        'Msxml2.XMLHTTP',
        'Microsoft.XMLHTTP'
      ];

      for (var i=0, len=activexRealizations.length; i<len; i++) {
        try {
          xhr = new window.ActiveXObject(activexRealizations[i]);
        }
        catch(e) {}
      }
    } else if (window.XMLHttpRequest) {
      xhr = new window.XMLHttpRequest();
    }

    if (!xhr) {
      error = new Error('Your browser doesn\'t support neither \'XMLHttpRequest\' nor \'ActiveXObject\'');
    }

    // In IE8/IE9 XMLHttpRequest doesn't support cross domain requests,
    // but we can possibly use special XDomainRequest object.
    var xhrSupportsCrossDomainRequests = typeof xhr.withCredentials !== 'undefined';
    if (isCrossDomainUrl(url) && !xhrSupportsCrossDomainRequests) {
      if (window.XDomainRequest) {
        this.xdr = new window.XDomainRequest();
      } else {
        error = new Error('Your browser doesn\'t support cross-domain requests');
      }
    }

    this.url = url;
    this.xhr = xhr;
    this.xdr = xdr;
    this.error = error;
  };

  XHR.prototype.send = function(options) {
    options = mergeObjects({
      method: 'GET',
      headers: null,
      content: null,
      done: function(responseText, xhr) {
      },
      fail: function(errorThrown, xhr) {
        throw errorThrown;
      },
      always: function() {
      }
    }, options || {});

    // Prepare success & error handlers.
    var xhr = this.xdr || this.xhr;
    var done = function() {
      if (typeof options.done === 'function') {
        options.done(xhr.responseText, xhr);
      }

      if (typeof options.always === 'function') {
        options.always();
      }
    };

    var fail = function(errorThrown) {
      if (typeof options.fail === 'function') {
        options.fail(errorThrown, xhr);
      }

      if (typeof options.always === 'function') {
        options.always();
      }
    };

    // Call error handler if XHR wasn't constructed.
    if (this.error) {
      fail(this.error);

      return;
    }

    // Do some preparations.
    if (typeof options.method === 'string') {
      options.method = options.method.trim().toUpperCase();
    }

    if (options.method === 'GET' || options.method === 'DELETE') {
      this.url = encodeUrl(this.url, options.content);
      options.content = null;

      if (options.headers && options.headers['Content-type']) {
        delete options.headers['Content-type'];
      }
    }

    // Send request.
    if (xhr === this.xdr) {
      // Here we use XDomainRequest object.
      // Note that requests through XDomainRequest are always asynchronous & additional headers can't be assigned.
      xhr.open(options.method, this.url);
      xhr.onload = done;
      xhr.onerror = fail;

      xhr.send(options.content);
    } else {
      // Here we use XMLHttpRequest object.
      xhr.onreadystatechange = function() {
        var status, errorThrown;

        // In IE9, call to any property (e.g. status) of an aborted XHR will
        // cause an error 'Could not complete the operation due to error c00c023f'.
        // That's why we need try-catch here.
        try {
          if (xhr.readyState !== 4) {
            return;
          }

          status = xhr.status === 1223 ? 204 : xhr.status;
        } catch (e) {
          status = 0;
          errorThrown = e;
        }

        if (status >= 200 && status < 300) {
          done();
        } else {
          fail(errorThrown || new Error(status + ' - ' + xhr.responseText));
        }
      };

      xhr.open(options.method, this.url, true);

      if (options.headers) {
        for (var headerName in options.headers) {
          if (options.headers.hasOwnProperty(headerName)) {
            xhr.setRequestHeader(headerName, options.headers[headerName]);
          }
        }
      }

      xhr.send(options.content);
    }
  };

  L.TileLayer.WMS.Util.AJAX = function(options) {
    var xhr = new XHR(options.url);
    xhr.send(options);
  };
})();
