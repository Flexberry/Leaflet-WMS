describe('L.TileLayer.WMS.Format[\'text/html\']', function () {
  // HTML received from GeoServer.
  var responseText = '' +
  '<html>' +
  '  <head>' +
  '    <title>GetFeatureInfo Output</title>' +
  '  </head>' +
  '  <style type="text/css">' +
  '    table.featureInfo, table.featureInfo td, table.featureInfo th {' +
  '      border:1px solid #ddd;' +
  '      border-collapse:collapse;' +
  '      margin:0;' +
  '      padding:0;' +
  '      font-size: 90%;' +
  '      padding:.2em .1em;' +
  '    }' +
  '    table.featureInfo th {' +
  '        padding:.2em .2em;' +
  '      font-weight:bold;' +
  '      background:#eee;' +
  '    }' +
  '    table.featureInfo td{' +
  '      background:#fff;' +
  '    }' +
  '    table.featureInfo tr.odd td{' +
  '      background:#eee;' +
  '    }' +
  '    table.featureInfo caption{' +
  '      text-align:left;' +
  '      font-size:100%;' +
  '      font-weight:bold;' +
  '      padding:.2em .2em;' +
  '    }' +
  '  </style>' +
  '  <body>' +
  '    <table class="featureInfo">' +
  '      <tr>' +
  '        <th>name</th>' +
  '        <th >weight</th>' +
  '      </tr>' +
  '      <tr>' +
  '        <td>feature1</td>' +
  '        <td>1</td>' +
  '      </tr>' +
  '      <tr>' +
  '        <td>feature2</td>' +
  '        <td></td>' +
  '      </tr>' +
  '    </table>' +
  '    <br/>' +
  '  </body>' +
  '</html>';

  describe('#toGeoJSON', function () {
    it('parses features table', function () {
      var format = L.TileLayer.WMS.Format['text/html'];
      var featureCollection = format.toGeoJSON(responseText);

      expect(featureCollection).to.be.deep.equal({
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: null,
          properties: { name: 'feature1', weight: '1' }
        }, {
          type: 'Feature',
          geometry: null,
          properties: { name: 'feature2', weight: null }
        }]
      });
    });
  });
});
