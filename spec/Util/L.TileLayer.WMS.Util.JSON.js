describe('L.TileLayer.WMS.Util.JSON', function () {
  describe('#parse', function () {
	var jsonString = '{ "a": 1 }';

    it('parses JSON string if window.JSON.parse is defined', function () {
	  if (!window.JSON) {
	    return;
	  }
		
      var json = L.TileLayer.WMS.Util.JSON.parse(jsonString);
	  expect(json.a).to.be.equal(1);
    });
	
	it('parses JSON string if window.JSON.parse is undefined', function () {
	  var originalJSON = window.JSON;
	  window.JSON = null;
		
      var json = L.TileLayer.WMS.Util.JSON.parse(jsonString);
	  expect(json.a).to.be.equal(1);
	  
	  window.JSON = originalJSON;
    });
  });
});
