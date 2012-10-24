/**
 *  Copyright (C) 2007 - 2012 GeoSolutions S.A.S.
 *  http://www.geo-solutions.it
 *
 *  GPLv3 + Classpath exception
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @requires plugins/Tool.js
 * @requires widgets/form/NominatimGeocoderComboBox.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = NominatimGeocoder
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: NominatimGeocoder(config)
 *
 *    Plugin for adding a NominatimGeocoderComboBox to a viewer.  The underlying
 *    NominatimGeocoderComboBox can be configured by setting this tool's 
 *    ``outputConfig`` property.
 */
gxp.plugins.NominatimGeocoder = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_nominatimgeocoder */
    ptype: "gxp_nominatimgeocoder",

    /** api: config[bboxField]
     *  ``String``
     *  If value is specified, when an item is selected in the combo, the map
     *  will be zoomed to the corresponding field value in the selected record.
     *  If ``null``, no map navigation will occur.  Valid values are the field
     *  names described for the :class:`gxp.form.NominatimGeocoderComboBox`.
     *  Default is "viewport".
     */
    bboxField: "boundingbox",
    latField: "lat",
	lonField: "lon",
    /** api: config[addMarkerTooltip]
     *  ``String``
     *  tooltip for addMarker button
     */
    addMarkerTooltip: "Reset Marker",

    /** api: config[markerName]
     *  ``String``
     *  tooltip for addMarker button
     */
    markerName: "Marker",
    pointRadiusMarkers: 14,
    externalGraphicMarkers: 'theme/app/img/markers/star_red.png',
    backgroundGraphicMarkers: 'theme/app/img/markers/markers_shadow.png',
    externalGraphicXOffsetMarkers:-13,
    externalGraphicYOffsetMarkers:-28,
    backgroundXOffsetMarkers: -7,
    backgroundYOffsetMarkers: -22,
    
    init: function(target) {

        var combo = new gxp.form.NominatimGeocoderComboBox(Ext.apply({
            listeners: {
                select: this.onComboSelect,
                scope: this
            }
        }, this.outputConfig));
        
        // remove marker added by Nominatim geocoder plugin
        var removeMarkerBtn = new Ext.Button({
            tooltip: this.addMarkerTooltip,
            handler: function() {
                var markerLyr = app.mapPanel.map.getLayersByName(this.markerName);  
                if (markerLyr.length){
                    app.mapPanel.map.removeLayer(markerLyr[0]);
                }
                this.combo.reset();
            },
            scope: this,
            iconCls: "icon-removeominatimmarkers"
        });
        
        var bounds = target.mapPanel.map.restrictedExtent;
        if (bounds && !combo.bounds) {
            target.on({
                ready: function() {
                    combo.bounds = bounds.clone().transform(
                        target.mapPanel.map.getProjectionObject(),
                        new OpenLayers.Projection("EPSG:4326")
                    );
                }
            });
        }
        this.combo = combo;
        this.removeMarkerBtn = removeMarkerBtn;
        
        return gxp.plugins.NominatimGeocoder.superclass.init.apply(this, arguments);

    },

    /** api: method[addOutput]
     */
    addOutput: function(config) {
        return gxp.plugins.NominatimGeocoder.superclass.addOutput.call(this, ['-',this.removeMarkerBtn,'-',this.combo]);
    },
    
    /** private: method[onComboSelect]
     *  Listener for combo's select event.
     */
    onComboSelect: function(combo, record) {
        if (this.bboxField && this.latField && this.lonField ) {
            var map = this.target.mapPanel.map;var gg = new OpenLayers.Projection("EPSG:4326");
		    var boundingBox =record.get(this.bboxField);
			var points =  new OpenLayers.Geometry.Point( record.get(this.lonField),record.get(this.latField) ).transform( gg, map.getProjectionObject() );
			if(boundingBox){
				var bounds =  new OpenLayers.Bounds();
				
				
				bounds.extend(new OpenLayers.LonLat(boundingBox[3],boundingBox[1]).transform( gg, map.getProjectionObject() ));
				bounds.extend(new OpenLayers.LonLat(boundingBox[2],boundingBox[0]).transform( gg, map.getProjectionObject() ));
				//map.zoomToExtent(bounds,true);
				
				/*
				var location = record.get(this.updateField).clone().transform(
					new OpenLayers.Projection("EPSG:4326"),
					map.getProjectionObject()
				);*/
				
				/*.tranform(
					new OpenLayers.Projection("EPSG:4326"),
					map.getProjectionObject()
				);*/;
				
				// Set the z-indexes of both graphics to make sure the background
				// graphics stay in the background
				var SHADOW_Z_INDEX = 10;
				var MARKER_Z_INDEX = 11;
				
				// allow testing of specific renderers via "?renderer=Canvas", etc
				var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
				renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
				
                // Sets the style for the markers
                var styleMarkers = new OpenLayers.StyleMap({
                    pointRadius: this.pointRadiusMarkers,
                    externalGraphic: this.externalGraphicMarkers,
					graphicXOffset:this.externalGraphicXOffsetMarkers,
					graphicYOffset:this.externalGraphicYOffsetMarkers,
                    backgroundGraphic: this.backgroundGraphicMarkers,
                    backgroundXOffset: this.backgroundXOffsetMarkers,
                    backgroundYOffset: this.backgroundYOffsetMarkers,
                    graphicZIndex: MARKER_Z_INDEX,
                    backgroundGraphicZIndex: SHADOW_Z_INDEX
                });

				var markers_feature = new OpenLayers.Feature.Vector(points);
				var markers = new OpenLayers.Layer.Vector( this.markerName, {
										styleMap: styleMarkers,
										displayInLayerSwitcher: false,
										rendererOptions: {yOrdering: true},
										renderers: renderer
									});
				var markerLyr = map.getLayersByName(this.markerName);  
				if (markerLyr.length){
					map.removeLayer(markerLyr[0]);
					map.addLayer(markers);
					markers.addFeatures(markers_feature);
					map.zoomToExtent(bounds, true);
				}else {
					map.addLayer(markers);
					markers.addFeatures(markers_feature);
					map.zoomToExtent(bounds, true);
				}
			}else{
				map.setCenter(points);
			}
        }
    }

});

Ext.preg(gxp.plugins.NominatimGeocoder.prototype.ptype, gxp.plugins.NominatimGeocoder);
