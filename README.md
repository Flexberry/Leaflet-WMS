# Leaflet-WMS
[![Travis master branch](https://img.shields.io/travis/Flexberry/Leaflet-WMS/master.svg?label=master%20build%20)](https://travis-ci.org/Flexberry/Leaflet-WMS)
[![Travis develop branch](https://img.shields.io/travis/Flexberry/Leaflet-WMS/develop.svg?label=develop%20build)](https://travis-ci.org/Flexberry/Leaflet-WMS/branches)
[![stability-stable](https://img.shields.io/badge/stability-stable-green.svg)](https://github.com/orangemug/stability-badges#stability-stable-green)

OGC WMS client layer for [leaflet](http://leafletjs.com).
Adds [GetFeatureInfo](http://docs.geoserver.org/latest/en/user/services/wms/reference.html#getfeatureinfo) requests support to leaflet's [L.TileLayer.WMS](http://leafletjs.com/reference-1.0.2.html#tilelayer-wms) layer.
Supports parsing of [GetFeatureInfo](http://docs.geoserver.org/latest/en/user/services/wms/reference.html#getfeatureinfo) responses into [GeoJSON](http://geojson.org/geojson-spec.html) format from a variety of other formats.

# Methods

## getCapabilities
Performs [GetCapabilities](http://docs.geoserver.org/latest/en/user/services/wms/reference.html#getcapabilities) request to WMS-service on which instance of leaflet's [L.TileLayer.WMS](http://leafletjs.com/reference-1.0.2.html#tilelayer-wms) layer is configured.
Returns [element](https://developer.mozilla.org/en-US/docs/Web/API/element) representing received XML-document describing WMS-service capabilities.
Real request will be perfermed only at first time call, all subsequent calls will return the cached document [element](https://developer.mozilla.org/en-US/docs/Web/API/element).

### Options
|Option name|Is required|Default value|Description|
|-----------|-----------|-------------|-----------|
|done|false|-|Callback which will be called if request succeeds|
|fail|false|```function(errorThrown) {throw errorThrown;}```|Callback which will be called if request will fail|
|always|false|-|Callback which will be called regardless of whether request succeed or not|

### Example
```javascript
// Create leaflet map.
var map = new L.Map('map').setView([-41.59490508367679, 146.77734375000003], 7);

// Create & add OSM layer.
var osm = new L.TileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

// Create & add WMS-layer.
var tasmania = new L.TileLayer.WMS('http://demo.opengeo.org/geoserver/wms', {
  layers: 'topp:tasmania',
  format: 'image/png',
  transparent: true,
  version: '1.3.0',
  crs: L.CRS.EPSG4326
}).addTo(map);

// Perform 'GetCapabilities' request.
tasmania.getCapabilities({
  done: function(capabilities) {
  console.log('getCapabilitiessucceed: ', capabilities);
  },
  fail: function(errorThrown) {
  console.log('getCapabilitiesfailed: ', errorThrown);
  },
  always: function() {
  console.log('getCapabilitiesfinished');
  }
});
```

## getInfoFormat
Performs [GetCapabilities](http://docs.geoserver.org/latest/en/user/services/wms/reference.html#getcapabilities) request to WMS-service on which instance of leaflet's [L.TileLayer.WMS](http://leafletjs.com/reference-1.0.2.html#tilelayer-wms) layer is configured, analyzes formats supported by WMS-service for [GetFeatureInfo](http://docs.geoserver.org/latest/en/user/services/wms/reference.html#getfeatureinfo) requests, compares them with the formats implemented in the plugin, and finally returns string representing most preferred format for [GetFeatureInfo](http://docs.geoserver.org/latest/en/user/services/wms/reference.html#getfeatureinfo) requests.
Real request will be perfermed only at first time call, all subsequent calls will return the cached string.

### Options
|Option name|Is required|Default value|Description|
|-----------|-----------|-------------|-----------|
|done|false|-|Callback which will be called if request succeeds|
|fail|false|```function(errorThrown) {throw errorThrown;}```|Callback which will be called if request will fail|
|always|false|-|Callback which will be called regardless of whether request succeed or not|
|map|false|-|Leaflet map object which will be used to define point's coordinates, needed if layer is not in leaflet map container|

### Example
```javascript
// Create leaflet map.
var map = new L.Map('map').setView([-41.59490508367679, 146.77734375000003], 7);

// Create & add OSM layer.
var osm = new L.TileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

// Create & add WMS-layer.
var tasmania = new L.TileLayer.WMS('http://demo.opengeo.org/geoserver/wms', {
  layers: 'topp:tasmania',
  format: 'image/png',
  transparent: true,
  version: '1.3.0',
  crs: L.CRS.EPSG4326
}).addTo(map);

// Request preferred info format.
tasmania.getInfoFormat({
  done: function(infoFormat) {
  console.log('getInfoFormat succeed: ', infoFormat);
  },
  fail: function(errorThrown) {
  console.log('getInfoFormat failed: ', errorThrown);
  },
  always: function() {
  console.log('getInfoFormat finished');
  }
});
```

## getFeatureInfo
Performs [GetFeatureInfo](http://docs.geoserver.org/latest/en/user/services/wms/reference.html#getfeatureinfo) requests.
Returns [GeoJSON FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects) representing received features info.
If preferred info format isn't defined in method options, call to getInfoFormat will be performed first.

### Options
|Option name|Is required|Default value|Description|
|-----------|-----------|-------------|-----------|
|latlng|true|-|Geographical point in which request must be performed. Must be instance of leaflet's [L.LatLng](http://leafletjs.com/reference#latlng)|
|infoFormat|false|-|String representing preferred info format. If option won't be defined,  call to getInfoFormat will be performed first & returned string will be used as info format|
|featureCount|false|1|Maximum number of features to return in response|
|done|false|-|Callback which will be called if request succeeds|
|fail|false|```function(errorThrown) {throw errorThrown;}```|Callback which will be called if request will fail|
|always|false|-|Callback which will be called regardless of whether request succeed or not|

### Supported formats
|Format|Priority|Description|
|------|--------|-----------|
|applicaion/geojson|1|Some GIS servers can respond directly in [GeoJSON](http://geojson.org/geojson-spec.html) format, so this format has the highest priority|
|'application/json'|2|Exists in GeoServer published WMS-services, also represents [GeoJSON](http://geojson.org/geojson-spec.html) format|
|'application/vnd.ogc.gml'|3|Some GIS servers can respond in [GML](http://www.gdmc.nl/events/GISday2004/relay/data/02-069_OpenGIS_Geography_Markup_Language_GML_Implementation_Specification_version_2.1.2.pdf) format which can describe features geometries & their attributive information as [GeoJSON](http://geojson.org/geojson-spec.html) format, but in XML notation|
|'application/vnd.ogc.gml/3.1.1'|4|Same as 'application/vnd.ogc.gml', but another version of the specification|
|'application/vnd.ogc.wms_xml'|5|Represents features attributive information in XML notation, but without geometries|
|'text/xml'|6|Same as 'application/vnd.ogc.wms_xml' but with another mime|
|'text/html'|7|Represents features attributive information as HTML-table, but without geometries|

### Example
```javascript
// Create leaflet map.
var map = new L.Map('map').setView([-41.59490508367679, 146.77734375000003], 7);

// Create & add OSM layer.
var osm = new L.TileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

// Create & add WMS-layer.
var tasmania = new L.TileLayer.WMS('http://demo.opengeo.org/geoserver/wms', {
  layers: 'topp:tasmania',
  format: 'image/png',
  transparent: true,
  version: '1.3.0',
  crs: L.CRS.EPSG4326
}).addTo(map);

// Perform 'GetFeatureInfo' request.
map.on('click', function(e) {
  tasmania.getFeatureInfo({
    latlng: e.latlng,
    done: function(featureCollection) {
    console.log('getFeatureInfosucceed: ', featureCollection);
  },
  fail: function(errorThrown) {
    console.log('getFeatureInfo failed: ', errorThrown);
  },
  always: function() {
      console.log('getFeatureInfo finished');
  }
  });
});
```

# Demo examples
* [Basic](http://flexberry.github.io/Leaflet-WMS/examples/basic.html)

# License
[MIT](https://github.com/Flexberry/Leaflet-WMS/blob/master/LICENSE.md)