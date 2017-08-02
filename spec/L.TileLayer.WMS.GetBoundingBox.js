describe('L.TileLayer.WMS', function () {

    describe('#GetBoundingBox', function () {
        it('returns bounding box for single specified layer (wms version = 1.3.0)', function () {
            var originaAJAX = L.TileLayer.WMS.Util.AJAX;

            L.TileLayer.WMS.Util.AJAX = sinon.spy(function (options) {
                var responseText = '' +
                    '<?xml version="1.0" encoding="UTF-8"?>' +
                    '<WMS_Capabilities>' +
                    '  <Capability>' +
                    '    <Layer>' +
                    '      <Title>GeoServer Web Map Service</Title>' +
                    '      <EX_GeographicBoundingBox>' +
                    '        <westBoundLongitude>39.0</westBoundLongitude>' +
                    '        <eastBoundLongitude>59.4000255784893</eastBoundLongitude>' +
                    '        <southBoundLatitude>42.0</southBoundLatitude>' +
                    '        <northBoundLatitude>61.489845980256874</northBoundLatitude>' +
                    '      </EX_GeographicBoundingBox>' +
                    '      <Layer>' +
                    '        <Name>zayavki</Name>' +
                    '        <EX_GeographicBoundingBox>' +
                    '          <westBoundLongitude>39.0</westBoundLongitude>' +
                    '          <eastBoundLongitude>41.0</eastBoundLongitude>' +
                    '          <southBoundLatitude>42.0</southBoundLatitude>' +
                    '          <northBoundLatitude>45.0</northBoundLatitude>' +
                    '        </EX_GeographicBoundingBox>' +
                    '      </Layer>' +
                    '      <Layer>' +
                    '        <Name>perm_water_polygon</Name>' +
                    '        <EX_GeographicBoundingBox>' +
                    '          <westBoundLongitude>39.0</westBoundLongitude>' +
                    '          <eastBoundLongitude>41.0</eastBoundLongitude>' +
                    '          <southBoundLatitude>42.0</southBoundLatitude>' +
                    '          <northBoundLatitude>45.0</northBoundLatitude>' +
                    '        </EX_GeographicBoundingBox>' +
                    '      </Layer>' +
                    '    </Layer>' +
                    '  </Capability>' +
                    '</WMS_Capabilities>';
                return options.done(responseText);
            });

            var layer = new L.TileLayer.WMS('http://test.ru', {
                version: '1.3.0',
                layers: 'ics:zayavki'
            });

            var done = sinon.spy(function (boundingBox) {});

            layer.getBoundingBox({
                done: done
            });

            var bounds = L.latLngBounds(L.latLng(42, 39), L.latLng(45, 41));

            expect(done.calledOnce).to.be.equal(true);
            expect(L.TileLayer.WMS.Util.AJAX.calledOnce).to.be.equal(true);
            expect(done.firstCall.args[0]).to.be.deep.equal(bounds);

            L.TileLayer.WMS.Util.AJAX = originaAJAX;
        });
        it('returns bounding box for multiple specified layers (wms version = 1.3.0)', function () {
            var originaAJAX = L.TileLayer.WMS.Util.AJAX;

            L.TileLayer.WMS.Util.AJAX = sinon.spy(function (options) {
                var responseText = '' +
                    '<?xml version="1.0" encoding="UTF-8"?>' +
                    '<WMS_Capabilities>' +
                    '  <Capability>' +
                    '    <Layer>' +
                    '      <Title>GeoServer Web Map Service</Title>' +
                    '      <EX_GeographicBoundingBox>' +
                    '        <westBoundLongitude>39.0</westBoundLongitude>' +
                    '        <eastBoundLongitude>59.4000255784893</eastBoundLongitude>' +
                    '        <southBoundLatitude>42.0</southBoundLatitude>' +
                    '        <northBoundLatitude>61.489845980256874</northBoundLatitude>' +
                    '      </EX_GeographicBoundingBox>' +
                    '      <Layer>' +
                    '        <Name>zayavki</Name>' +
                    '        <EX_GeographicBoundingBox>' +
                    '          <westBoundLongitude>39.0</westBoundLongitude>' +
                    '          <eastBoundLongitude>41.0</eastBoundLongitude>' +
                    '          <southBoundLatitude>42.0</southBoundLatitude>' +
                    '          <northBoundLatitude>45.0</northBoundLatitude>' +
                    '        </EX_GeographicBoundingBox>' +
                    '      </Layer>' +
                    '      <Layer>' +
                    '        <Name>perm_water_polygon</Name>' +
                    '        <EX_GeographicBoundingBox>' +
                    '          <westBoundLongitude>48.0</westBoundLongitude>' +
                    '          <eastBoundLongitude>41.0</eastBoundLongitude>' +
                    '          <southBoundLatitude>50.0</southBoundLatitude>' +
                    '          <northBoundLatitude>45.0</northBoundLatitude>' +
                    '        </EX_GeographicBoundingBox>' +
                    '      </Layer>' +
                    '    </Layer>' +
                    '  </Capability>' +
                    '</WMS_Capabilities>';
                return options.done(responseText);
            });

            var layer = new L.TileLayer.WMS('http://test.ru', {
                version: '1.3.0',
                layers: 'ics:zayavki,ics:perm_water_polygon'
            });

            var done = sinon.spy(function (boundingBox) {});

            layer.getBoundingBox({
                done: done
            });

            var boundingBox = L.latLngBounds(L.latLng(42, 39), L.latLng(45, 41));

            var bounds = L.latLngBounds(L.latLng(50, 48), L.latLng(45, 41));

            boundingBox = boundingBox.extend(bounds);

            expect(done.calledOnce).to.be.equal(true);
            expect(L.TileLayer.WMS.Util.AJAX.calledOnce).to.be.equal(true);
            expect(done.firstCall.args[0]).to.be.deep.equal(boundingBox);

            L.TileLayer.WMS.Util.AJAX = originaAJAX;
        });
        it('returns bounding box for service root layer, if no layers option specified (wms version = 1.3.0)', function () {
            var originaAJAX = L.TileLayer.WMS.Util.AJAX;

            L.TileLayer.WMS.Util.AJAX = sinon.spy(function (options) {
                var responseText = '' +
                    '<?xml version="1.0" encoding="UTF-8"?>' +
                    '<WMS_Capabilities>' +
                    '  <Capability>' +
                    '    <Layer>' +
                    '      <Title>GeoServer Web Map Service</Title>' +
                    '      <EX_GeographicBoundingBox>' +
                    '        <westBoundLongitude>39.0</westBoundLongitude>' +
                    '        <eastBoundLongitude>59.4000255784893</eastBoundLongitude>' +
                    '        <southBoundLatitude>42.0</southBoundLatitude>' +
                    '        <northBoundLatitude>61.489845980256874</northBoundLatitude>' +
                    '      </EX_GeographicBoundingBox>' +
                    '    </Layer>' +
                    '  </Capability>' +
                    '</WMS_Capabilities>';
                return options.done(responseText);
            });

            var layer = new L.TileLayer.WMS('http://test.ru', {
                version: '1.3.0'
            });

            var done = sinon.spy(function (boundingBox) {});

            layer.getBoundingBox({
                done: done
            });

            var bounds = L.latLngBounds(L.latLng(42, 39), L.latLng(61.489845980256874, 59.4000255784893));

            expect(done.calledOnce).to.be.equal(true);
            expect(L.TileLayer.WMS.Util.AJAX.calledOnce).to.be.equal(true);
            expect(done.firstCall.args[0]).to.be.deep.equal(bounds);

            L.TileLayer.WMS.Util.AJAX = originaAJAX;
        });

        it('returns bounding box for single specified layer (wms version = 1.1.0)', function () {
            var originaAJAX = L.TileLayer.WMS.Util.AJAX;

            L.TileLayer.WMS.Util.AJAX = sinon.spy(function (options) {
                var responseText = '' +
                    '<?xml version="1.0" encoding="UTF-8"?>' +
                    '<WMS_Capabilities>' +
                    '  <Capability>' +
                    '    <Layer>' +
                    '      <Title>GeoServer Web Map Service</Title>' +
                    '      <LatLonBoundingBox minx="39.0" miny="42.0" maxx="59.4000255784893" maxy="61.489845980256874"/>' +
                    '      <Layer>' +
                    '        <Name>perm_water_polygon</Name>' +
                    '        <LatLonBoundingBox minx="-103.87791475407893" miny="44.37246687108142" maxx="-103.62278893469492" maxy="44.50235105543566"/>' +
                    '      </Layer>' +
                    '      <Layer>' +
                    '        <Name>zayavki</Name>' +
                    '        <LatLonBoundingBox minx="39.0" miny="42.0" maxx="41.0" maxy="45.0"/>' +
                    '      </Layer>' +
                    '    </Layer>' +
                    '  </Capability>' +
                    '</WMS_Capabilities>';
                return options.done(responseText);
            });

            var layer = new L.TileLayer.WMS('http://test.ru', {
                version: '1.1.0',
                layers: 'ics:zayavki'
            });

            var done = sinon.spy(function (boundingBox) {});

            layer.getBoundingBox({
                done: done
            });

            var bounds = L.latLngBounds(L.latLng(42, 39), L.latLng(45, 41));

            expect(done.calledOnce).to.be.equal(true);
            expect(L.TileLayer.WMS.Util.AJAX.calledOnce).to.be.equal(true);
            expect(done.firstCall.args[0]).to.be.deep.equal(bounds);

            L.TileLayer.WMS.Util.AJAX = originaAJAX;
        });
        it('returns bounding box for multiple specified layers (wms version = 1.1.0)', function () {
            var originaAJAX = L.TileLayer.WMS.Util.AJAX;

            L.TileLayer.WMS.Util.AJAX = sinon.spy(function (options) {
                var responseText = '' +
                    '<?xml version="1.0" encoding="UTF-8"?>' +
                    '<WMS_Capabilities>' +
                    '  <Capability>' +
                    '    <Layer>' +
                    '      <Title>GeoServer Web Map Service</Title>' +
                    '      <LatLonBoundingBox minx="39.0" miny="42.0" maxx="59.4000255784893" maxy="61.489845980256874"/>' +
                    '      <Layer>' +
                    '        <Name>perm_water_polygon</Name>' +
                    '        <LatLonBoundingBox minx="-103.87791475407893" miny="44.37246687108142" maxx="-103.62278893469492" maxy="44.50235105543566"/>' +
                    '      </Layer>' +
                    '      <Layer>' +
                    '        <Name>zayavki</Name>' +
                    '        <LatLonBoundingBox minx="39.0" miny="42.0" maxx="41.0" maxy="45.0"/>' +
                    '      </Layer>' +
                    '    </Layer>' +
                    '  </Capability>' +
                    '</WMS_Capabilities>';
                return options.done(responseText);
            });

            var layer = new L.TileLayer.WMS('http://test.ru', {
                version: '1.1.0',
                layers: 'ics:zayavki,ics:perm_water_polygon'
            });

            var done = sinon.spy(function (boundingBox) {});

            layer.getBoundingBox({
                done: done
            });

            var boundingBox = L.latLngBounds(L.latLng(44.37246687108142, -103.87791475407893), L.latLng(44.50235105543566, -103.62278893469492));

            var bounds = L.latLngBounds(L.latLng(42, 39), L.latLng(45, 41));

            boundingBox = boundingBox.extend(bounds);

            expect(done.calledOnce).to.be.equal(true);
            expect(L.TileLayer.WMS.Util.AJAX.calledOnce).to.be.equal(true);
            expect(done.firstCall.args[0]).to.be.deep.equal(boundingBox);

            L.TileLayer.WMS.Util.AJAX = originaAJAX;
        });
        it('returns bounding box for service root layer, if no layers option specified (wms version = 1.1.0)', function () {
            var originaAJAX = L.TileLayer.WMS.Util.AJAX;

            L.TileLayer.WMS.Util.AJAX = sinon.spy(function (options) {
                var responseText = '' +
                    '<?xml version="1.0" encoding="UTF-8"?>' +
                    '<WMS_Capabilities>' +
                    '  <Capability>' +
                    '    <Layer>' +
                    '      <Title>GeoServer Web Map Service</Title>' +
                    '      <LatLonBoundingBox minx="39.0" miny="42.0" maxx="59.4000255784893" maxy="61.489845980256874"/>' +
                    '      <Layer>' +
                    '        <Name>perm_water_polygon</Name>' +
                    '        <LatLonBoundingBox minx="-103.87791475407893" miny="44.37246687108142" maxx="-103.62278893469492" maxy="44.50235105543566"/>' +
                    '      </Layer>' +
                    '      <Layer>' +
                    '        <Name>zayavki</Name>' +
                    '        <LatLonBoundingBox minx="39.0" miny="42.0" maxx="41.0" maxy="45.0"/>' +
                    '      </Layer>' +
                    '    </Layer>' +
                    '  </Capability>' +
                    '</WMS_Capabilities>';
                return options.done(responseText);
            });

            var layer = new L.TileLayer.WMS('http://test.ru', {
                version: '1.1.0'
            });

            var done = sinon.spy(function (boundingBox) {});

            layer.getBoundingBox({
                done: done
            });

            var bounds = L.latLngBounds(L.latLng(42, 39), L.latLng(61.489845980256874, 59.4000255784893));

            expect(done.calledOnce).to.be.equal(true);
            expect(L.TileLayer.WMS.Util.AJAX.calledOnce).to.be.equal(true);
            expect(done.firstCall.args[0]).to.be.deep.equal(bounds);

            L.TileLayer.WMS.Util.AJAX = originaAJAX;
        });
    });
});