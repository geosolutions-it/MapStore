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
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = GeoReferences
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: GeoReferences(config)
 *
 *    Provides an action for zooming to an extent.  If not configured with a 
 *    specific extent, the action will zoom to the map's visible extent.
 */
gxp.plugins.GeoReferences = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_georeferences */
    ptype: "gxp_georeferences",

    /** api: config[markerName]
     *  ``String`` Layer Name
     */
	showMarker: true,
	    
    /** api: config[markerName]
     *  ``String`` Layer Name
     */
	markerName: "GeoRefMarker",
   
    /** api: config[initialText]
     *  ``String``
     *  Initial text for combo box (i18n).
     */
    initialText: "Select an area",
     
    /** api: config[menuText]
     *  ``String``
     *  Text for zoom menu item (i18n).
     */
    menuText: "Georeferences",

    /** api: config[tooltip]
     *  ``String``
     *  Text for zoom action tooltip (i18n).
     */
    tooltip: "Georeferences",

    ////////////////////////////////////////////////////////////
    // Respectivily the Sizes, grafic sources and offsets of
    // the marker and it's background (typically shadow).
    ////////////////////////////////////////////////////////////
    pointRadiusMarkers: 14,
    externalGraphicMarkers: 'theme/app/img/markers/star_red.png',
    backgroundGraphicMarkers: 'theme/app/img/markers/markers_shadow.png',
    externalGraphicXOffsetMarkers:-13,
    externalGraphicYOffsetMarkers:-28,
    backgroundXOffsetMarkers: -7,
    backgroundYOffsetMarkers: -22,  

	/** api: delay for fadeOut marker
	*  duration in seconds
	*/
    markerFadeoutDelay: 2,  
    
    georeferences:[],
    
    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.GeoReferences.superclass.constructor.apply(this, arguments);
    },

    /** api: method[addActions]
     */
    addActions: function() {
        var georeferencesStore = new Ext.data.ArrayStore({
            fields: ['name', 'geometry'],
            data :  this.target.georeferences
        });

        var map = this.target.mapPanel.map;
        var that = this;
		
		this.geoRefListener;
        this.georeferencesSelector = new Ext.form.ComboBox({
            store: georeferencesStore,
            displayField: 'name',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            emptyText: this.initialText,
            selectOnFocus:true,
            editable: true,
            resizable: true,
            listeners: {
                select: function(cb, record, index) {
                
					//
					// Every time a reference is selected clean the previous listener in order to avoid event queue
					//	
					if(this.geoRefListener){
						map.events.unregister("moveend", this, this.geoRefListener);
					}
					
                    var center,
                    	bbox = new OpenLayers.Bounds.fromString(record.get('geometry')),      	
                    
                    bbox = bbox.transform(
                        new OpenLayers.Projection("EPSG:4326"),
                        new OpenLayers.Projection(map.projection));
						 
					// //////////// Test Code /////////////////////////////////////
					// alert(bbox);
                    // var boxes  = new OpenLayers.Layer.Vector( "Boxes" );
					// box = new OpenLayers.Feature.Vector(bbox.toGeometry());
					// map.addLayer(boxes);
                    // boxes.addFeatures(box);
					// ////////////////////////////////////////////////////////////
					
                    if(that.showMarker===true)
                    {
						//optional "position" field (if not specified the marker goes on the bbox center). 
		            	if( record.get('position') )
		                {
							//TODO implement 'position' field in config file: georeferences.js (http://goo.gl/3diTR)
							//
							//                    	var position = record.get('position');
							//						position = new OpenLayers.LonLat(position.lon, position.lat);
							//                    	center = position.transform(
							//                        new OpenLayers.Projection("EPSG:4326"),
							//                        new OpenLayers.Projection(map.projection));
							//						console.log('defined position');
		                }
		                else
			                center = bbox.getCenterLonLat();
		                    
				        // Set the z-indexes of both graphics to make sure the background
				        // graphics stay in the background
				        var SHADOW_Z_INDEX = 10;
				        var MARKER_Z_INDEX = 11;
				        
				        var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
				        renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
				        
				        // Sets the style for the markers
				        var styleMarkers = new OpenLayers.StyleMap({
				            pointRadius: that.pointRadiusMarkers,
				            externalGraphic: that.externalGraphicMarkers,
							graphicXOffset: that.externalGraphicXOffsetMarkers,
							graphicYOffset: that.externalGraphicYOffsetMarkers,
				            backgroundGraphic: that.backgroundGraphicMarkers,
				            backgroundXOffset: that.backgroundXOffsetMarkers,
				            backgroundYOffset: that.backgroundYOffsetMarkers,
				            graphicZIndex: MARKER_Z_INDEX,
				            backgroundGraphicZIndex: SHADOW_Z_INDEX
				        });
					
				        var markers_feature = new OpenLayers.Feature.Vector( new OpenLayers.Geometry.Point(center.lon, center.lat) );
				
				        var markers = new OpenLayers.Layer.Vector( that.markerName, {
							styleMap: styleMarkers,
							displayInLayerSwitcher: false,
							rendererOptions: {yOrdering: true},
							renderers: renderer
						});
				
				        var markerLyr = map.getLayersByName(that.markerName);  
				        if (markerLyr.length) {
				            map.removeLayer(markerLyr[0]);	
				        }
				        
						map.addLayer(markers);
						markers.addFeatures(markers_feature);
						map.zoomToExtent(bbox);	
					
						Ext.get(markers.id).fadeOut({ endOpacity: 0.01, duration: that.markerFadeoutDelay});	//fadeout marker, no change 0.01
					} else {
						map.zoomToExtent(bbox);  
					}

					//
					// The georeference combo should be cleaned if the current extent change
					//						
					this.geoRefListener = function(){
						cb.reset();
					};
					
					map.events.register("moveend", this, this.geoRefListener);						
                }
            }
        });
		
		map.events.register("zoomend", this, function(){
			this.georeferencesSelector.reset();
		});
        
        var actions = [this.georeferencesSelector];
        return gxp.plugins.GeoReferences.superclass.addActions.apply(this, [actions]);
    }
});

Ext.preg(gxp.plugins.GeoReferences.prototype.ptype, gxp.plugins.GeoReferences);

