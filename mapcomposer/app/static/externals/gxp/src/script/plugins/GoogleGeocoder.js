/**
* Copyright (c) 2008-2011 The Open Planning Project
*
* Published under the GPL license.
* See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
* of the license.
*/

/**
 * @requires plugins/Tool.js
 * @requires widgets/form/GoogleGeocoderComboBox.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = GoogleGeocoder
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: GoogleGeocoder(config)
 *
 *    Plugin for adding a GoogleGeocoderComboBox to a viewer.  The underlying
 *    GoogleGeocoderComboBox can be configured by setting this tool's 
 *    ``outputConfig`` property.
 */
gxp.plugins.GoogleGeocoder = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_googlegeocoder */
    ptype: "gxp_googlegeocoder",

    /** api: config[updateField]
     *  ``String``
     *  If value is specified, when an item is selected in the combo, the map
     *  will be zoomed to the corresponding field value in the selected record.
     *  If ``null``, no map navigation will occur.  Valid values are the field
     *  names described for the :class:`gxp.form.GoogleGeocoderComboBox`.
     *  Default is "viewport".
     */
    updateField: "viewport",
    
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

        var combo = new gxp.form.GoogleGeocoderComboBox(Ext.apply({
            listeners: {
                select: this.onComboSelect,
                scope: this
            }
        }, this.outputConfig));
        
        // remove marker added by google geocoder plugin
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
            iconCls: "icon-removemarkers"
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
        
        return gxp.plugins.GoogleGeocoder.superclass.init.apply(this, arguments);

    },

    /** api: method[addOutput]
     */
    addOutput: function(config) {
        return gxp.plugins.GoogleGeocoder.superclass.addOutput.call(this, ['-',this.removeMarkerBtn,this.combo]);
    },
    
    /** private: method[onComboSelect]
     *  Listener for combo's select event.
     */
    onComboSelect: function(combo, record) {
        if (this.updateField) {
            var map = this.target.mapPanel.map;
            var location = record.get(this.updateField).clone().transform(
                new OpenLayers.Projection("EPSG:4326"),
                map.getProjectionObject()
            );
			var bgLayer = map.getLayersByName('Google Hybrid')[0];
			if(bgLayer){
				bgLayer.setVisibility(true); 
			}
            if (location instanceof OpenLayers.Bounds) {
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
                
                var center = location.getCenterLonLat();
                var points = new OpenLayers.Geometry.Point(center.lon,center.lat);
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
                    map.zoomToExtent(location, true);
                }else {
                    map.addLayer(markers);
                    markers.addFeatures(markers_feature);
                    map.zoomToExtent(location, true);
                }
            } else {
                map.setCenter(location);
            }
        }
    }

});

Ext.preg(gxp.plugins.GoogleGeocoder.prototype.ptype, gxp.plugins.GoogleGeocoder);
