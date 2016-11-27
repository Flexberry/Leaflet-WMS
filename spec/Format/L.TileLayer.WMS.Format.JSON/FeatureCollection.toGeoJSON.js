describe('L.TileLayer.WMS.Format[\'application/json\']', function () {
  var responseText = '{' +
    '"type": "FeatureCollection",' +
    '"features": [{' +
        '"type": "Feature",' +
        '"geometry": { "type": "Point", "coordinates": [1, 2] },' +
        '"properties": { "name": "feature1", "weight": 1 }' +
      '}, {' +
        '"type": "Feature",' +
        '"geometry": { "type": "Point", "coordinates": [3, 4] },' +
        '"properties": { "name": "feature2", "weight": null }' +
      '}' +
    ']' +
  '}';

  describe('#toGeoJSON', function () {
    it('parses FeatureCollection', function () {
      var format = L.TileLayer.WMS.Format['application/json'];
      var featureCollection = format.toGeoJSON(responseText);

      expect(featureCollection).to.be.deep.equal({
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [1, 2] },
          properties: { name: 'feature1', weight: 1 }
        }, {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [3, 4] },
          properties: { name: 'feature2', weight: null }
        }]
      });
    });
  });
});
