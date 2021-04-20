L.TileLayer.WMS.include({
  drawCanvas: function (tile, coords, done) {
    var err;
    var ctx = tile.getContext('2d');

    var tileSize = this.getTileSize();
    tile.width = tileSize.x;
    tile.height = tileSize.y;

    var img = new Image();
    img.onload = function () {
      try {
        ctx.drawImage(img, 0, 0);
        tile.complete = true;
      } catch (e) {
        err = e;
      } finally {
        done(err, tile);
      }
    };
    var tileZoom = this._getZoomForUrl();
    img.crossOrigin = 'anonymous';
    img.src = isNaN(tileZoom) ? '' : this.getTileUrl(coords);
  },
  createTile: function (coords, done) {
    var tile = L.DomUtil.create('canvas', 'leaflet-tile');

    this.drawCanvas(tile, coords, done);

    return tile;
  },
});
