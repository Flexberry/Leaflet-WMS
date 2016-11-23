L.TileLayer.WMS.Format = {
  getExisting: function() {
    var existingFormatsNames = [];
    var formatNameSpace = L.TileLayer.WMS.Format;

    for (var key in formatNameSpace) {
      var format = formatNameSpace.hasOwnProperty(key) ? formatNameSpace[key] : null;
      if (format && typeof format === 'object' && typeof format.toGeoJSON === 'function') {
        existingFormatsNames.push(key);
      }
    }

    // Sort existing formats by their priority.
    existingFormatsNames.sort(function(name1, name2) {
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
  }
};
