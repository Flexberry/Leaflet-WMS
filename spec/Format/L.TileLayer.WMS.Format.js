describe('L.TileLayer.WMS.Format', function () {
  var originalFormat;

  before(function() {
    originalFormat = L.TileLayer.WMS.Format;

    // Stub existing formats.
    L.TileLayer.WMS.Format = {
      getExisting: originalFormat.getExisting,
      format5: { priority: 5, toGeoJSON: function() {} },
      format1: { priority: 1, toGeoJSON: function() {} },
      format3: { priority: 3, toGeoJSON: function() {} },
      format2: { priority: 2, toGeoJSON: function() {} },
      format4: { priority: 4, toGeoJSON: function() {} },

      format10: { priority: 10, toGeoJSON: {} },
      format6: { priority: 6, toGeoJSON: 1 },
      format8: { priority: 8, toGeoJSON: '1' },
      format11: { priority: 11, toGeoJSON: true },
      format7: { priority: 7, toGeoJSON: null },
      format9: { priority: 9 },
    };
  });

  after(function() {
    // Restore existing formats.
    L.TileLayer.WMS.Format = originalFormat;
  });

  describe('#getExisting', function () {
    it('returns implemented formats sorted by their priorities', function () {
      var existingFormats = L.TileLayer.WMS.Format.getExisting();
      
      expect(existingFormats).to.be.an('array');
      expect(existingFormats).to.have.lengthOf(5);
      expect(existingFormats).to.have.deep.property('[0]', 'format1');
      expect(existingFormats).to.have.deep.property('[1]', 'format2');
      expect(existingFormats).to.have.deep.property('[2]', 'format3');
      expect(existingFormats).to.have.deep.property('[3]', 'format4');
      expect(existingFormats).to.have.deep.property('[4]', 'format5');
    });
  });
});
