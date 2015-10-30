/*
 * APIMethod: createGeodesicPolygon
 * Create a regular polygon around a radius. Useful for creating circles
 * and the like.
 *
 * Parameters:
 * origin - {<OpenLayers.Geometry.Point>} center of polygon.
 * radius - {Float} distance to vertex, in map units.
 * sides - {Integer} Number of sides. 20 approximates a circle.
 * rotation - {Float} original angle of rotation, in degrees.
 * projection - {<OpenLayers.Projection>} the map's projection
 */
OpenLayers.Geometry.Polygon.createGeodesicPolygon = function(origin, radius, sides, rotation, projection){
	if (projection.getCode() !== "EPSG:4326") {
		origin.transform(projection, new OpenLayers.Projection("EPSG:4326"));
	}
	var latlon = new OpenLayers.LonLat(origin.x, origin.y);
	
	var angle;
	var new_lonlat, geom_point;
	var points = [];
	
	for (var i = 0; i < sides; i++) {
		angle = (i * 360 / sides) + rotation;
		new_lonlat = OpenLayers.Util.destinationVincenty(latlon, angle, radius);
		new_lonlat.transform(new OpenLayers.Projection("EPSG:4326"), projection);
		geom_point = new OpenLayers.Geometry.Point(new_lonlat.lon, new_lonlat.lat);
		points.push(geom_point);
	}
	var ring = new OpenLayers.Geometry.LinearRing(points);
	return new OpenLayers.Geometry.Polygon([ring]);
};