/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires plugins/Tool.js
 * @requires widgets/form/WFSSearch<ComboBox.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = WFSSearchBox
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: WFSSearchBox(config)
 *
 *    Plugin for adding a a custom searchbox to a viewer. 
 *    The WFSSearchBoxComboBox tool can be configured by setting this tool's 
 *    ``outputConfig`` property.
 */
 
 gxp.plugins.WFSSearchBox = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_searchbox */
    ptype: "gxp_wfssearchbox",
    /** api: config[markerName]
     *  ``String`` Layer Name
     */
   markerName: "WFSSearch",
     /** api: config[updateField]
     *  ``String`` The field of the Model of the combo box
     *  to use as geometry.
     */
	updateField: "geometry",
    ////////////////////////////////////////////////////////////
    // respectivily the Sizes, grafic sources and offsets of
    // the marker and it's background (typically shadow).
    ////////////////////////////////////////////////////////////
    pointRadiusMarkers: 14,
    externalGraphicMarkers: 'theme/app/img/markers/star_red.png',
    backgroundGraphicMarkers: 'theme/app/img/markers/markers_shadow.png',
    externalGraphicXOffsetMarkers:-13,
    externalGraphicYOffsetMarkers:-28,
    backgroundXOffsetMarkers: -7,
    backgroundYOffsetMarkers: -30,
  
    
    init: function(target) {

        var combo = new gxp.form.WFSSearchComboBox(Ext.apply({
				listeners: {
					'select': this.onComboSelect,
					scope: this
				},target:target 
			}, this.outputConfig)
		);
        
        // remove marker 
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
        
        this.combo = combo;
        this.removeMarkerBtn = removeMarkerBtn;
        
        return gxp.plugins.WFSSearchBox.superclass.init.apply(this, arguments);

    },

    /** api: method[addOutput]
     */
    addOutput: function(config) {
        return gxp.plugins.WFSSearchBox.superclass.addOutput.call(this, ['-',this.removeMarkerBtn,'-',this.combo]);
    },
    
    /** private: method[onComboSelect]
     *  Listener for combo's select event.
     */
    onComboSelect: function(combo, record) {
        if (this.updateField) {
            var map = this.target.mapPanel.map;
            var location = record.get(this.updateField)
			location = new OpenLayers.Format.GeoJSON().read(location,"Geometry");
			//TODO OL Point clone and transform
			var projcode = combo.crs.type+":"+combo.crs.properties.code;
			var location = location.clone().transform(
                new OpenLayers.Projection(projcode),
                map.getProjectionObject()
            );
			var points = location;
			
			
            if (location) {
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
				var center;
                if(location instanceof OpenLayers.Bounds){
					center = location.getCenterLonLat();
					points = new OpenLayers.Geometry.Point(center.lon,center.lat);
				}else{
					points =location;
					center = location.clone();
					center = new OpenLayers.LonLat(center.x,center.y);
					
				}
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
                }
				map.addLayer(markers);
				markers.addFeatures(markers_feature);
				if(location instanceof OpenLayers.Bounds){
					map.zoomToExtent(location, true);
				}else{
					map.setCenter(center,18);
				}
            }
        }
    }
	
	
});

Ext.preg(gxp.plugins.WFSSearchBox.prototype.ptype, gxp.plugins.WFSSearchBox);