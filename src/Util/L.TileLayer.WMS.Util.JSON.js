L.TileLayer.WMS.Util.JSON = {
  parse: window.JSON ? window.JSON.parse : function (jsonString) {
    return eval('(' + jsonString + ')');
  }
};
