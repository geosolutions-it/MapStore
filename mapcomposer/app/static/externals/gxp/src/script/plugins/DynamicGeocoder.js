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
 * @requires widgets/form/GoogleGeocoderComboBox.js
 * @requires widgets/form/NominatimGeocoderComboBox.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = DynamicGeocoder
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: DynamicGeocoder(config)
 *
 *    Plugin for adding a *GeocoderComboBox to a viewer (the type of geocoder is choosen 
 *    through the ``geocoderType`` property; this property can have the 'google', 'nominatim' or 'dynamic'
 *    values. If 'dynamic' is chosen then the type of geocoder depends on the current map background.
 *    The underlying *GeocoderComboBox can be configured by setting this tool's 
 *    ``outputConfig`` property.
 */
gxp.plugins.DynamicGeocoder = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_dynamicgeocoder */
    ptype: "gxp_dynamicgeocoder",
    
    updateField: "",	
    latField: "",
	lonField: "",
    
    /** api: config[addMarkerTooltip]
     *  ``String``
     *  tooltip for addMarker button
     */
    addMarkerTooltip: "Reset Marker",

    /** api: config[markerName]
     *  ``String``
     *  tooltip for addMarker button
     */
    markerName: "Marker_DYN_Geocoder",
	pointRadiusMarkers: 14,
    externalGraphicMarkers: 'theme/app/img/markers/star_red.png',
    backgroundGraphicMarkers: 'theme/app/img/markers/markers_shadow.png',
    externalGraphicXOffsetMarkers:-13,
    externalGraphicYOffsetMarkers:-28,
    backgroundXOffsetMarkers: -7,
    backgroundYOffsetMarkers: -22,
	
	/** api: config[geocoderType]
     *  ``String``
     *  type of geocoder to use (google, nominatim, dynamic); defaults to dynamic
     */
	geocoderType: "dynamic",
	
	/** api: delay for fadeOut marker
	 *  duration in seconds
	 */
    markerFadeoutDelay: 5,  
    
	/** private: method[createCombo]
     *  Creates a new *GeocoderCombo, using the given geocoder type.
     */
	createCombo: function(type) {			
		return gxp.plugins.DynamicGeocoder.Geocoders[type].createCombo(Ext.apply({
            listeners: {
                select: this.onComboSelect,
                scope: this
            }
        }, Ext.apply({emptyText:this.emptyText},this.outputConfig)));			
	},
	
	/**private: method[createOrUpdateCombo]
     *  Creates a new *GeocoderCombo or updates the existing one, using the current geocoder type.	 
	 */
	createOrUpdateCombo: function(force) {					
		var newType;
		var geocoders = gxp.plugins.DynamicGeocoder.Geocoders;
		
		if(this.geocoderType === 'dynamic') {
			var priority=-1;
			// gets the best geocoder type given the current map configuration
			for(var type in geocoders) {
				if(geocoders.hasOwnProperty(type)) {
					var geocoder=gxp.plugins.DynamicGeocoder.Geocoders[type];
					var geocoderPriority=geocoder.getRanking(this.target.mapPanel.map);
					if(geocoderPriority>priority) {
						priority=geocoderPriority;
						newType=type;
					}
				}
			}
		} else {
			newType = this.geocoderType;
		}
		
		if(force === true || (newType && newType !== this.currentGeocoderType)) {
			this.currentGeocoderType = newType;			
			var newCombo=this.createCombo(newType);
			if(this.combo) {
				this.comboContainer.remove(this.combo);
			}
			this.comboContainer.add(newCombo);
			this.comboContainer.doLayout();
			this.combo=newCombo;
		}
	},
	
    init: function(target) {		
        /*/ remove marker added by geocoder plugin
        var removeMarkerBtn = new Ext.Button({
            tooltip: this.addMarkerTooltip,
            handler: function() {
                var markerLyr = this.target.mapPanel.map.getLayersByName(this.markerName);  
                if (markerLyr.length){
                    this.target.mapPanel.map.removeLayer(markerLyr[0]);
                }
                this.combo.reset();
            },
            scope: this,
            iconCls: "icon-removemarkers"
        });*/
		
        this.target = target;		
		this.comboContainer = new Ext.Container();        
        
		//this.removeMarkerBtn = removeMarkerBtn;
        
		// initialize combo on ready
		target.on({
			ready: function() {
				this.createOrUpdateCombo();	
				target.mapPanel.map.events.register('changelayer',this,this.createOrUpdateCombo);				
				var bounds = target.mapPanel.map.restrictedExtent;				
				if (bounds && this.combo && !this.combo.bounds) {						
					this.combo.bounds = bounds.clone().transform(
						target.mapPanel.map.getProjectionObject(),
						new OpenLayers.Projection("EPSG:4326")
					);						
				}
			},
			scope:this
		});
		
        return gxp.plugins.DynamicGeocoder.superclass.init.apply(this, arguments);
    },

    /** api: method[addOutput]
     */
    addOutput: function(config) {
        return gxp.plugins.DynamicGeocoder.superclass.addOutput.call(this, ['-',/*this.removeMarkerBtn,*/this.comboContainer]);
    },
    
    /** private: method[onComboSelect]
     *  Listener for combo's select event.
     */
    onComboSelect: function(combo, record) {
        
		var map = this.target.mapPanel.map,				
			geocoder=gxp.plugins.DynamicGeocoder.Geocoders[this.currentGeocoderType];
			
		// gets the location obj in the form {bounds:<bounds>,points:<points>}
		var location=geocoder.getLocation(map,record,this);
		
		if (location && location.bounds) {
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
										
			var markers_feature = new OpenLayers.Feature.Vector(location.points);
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
				map.zoomToExtent(location.bounds, true);
			}else {
				map.addLayer(markers);
				markers.addFeatures(markers_feature);
				map.zoomToExtent(location.bounds, true);
			}
			
			//
			// Fade out for the marker icon.
			//
			Ext.get(markers.id).fadeOut({ endOpacity: 0.01, duration: this.markerFadeoutDelay});	//fadeout marker, no change 0.01

		} else {
			map.setCenter(location.bounds);
		}        
    }

});

/**
 * Geocoder available implementations.
 * Each implementation should have the following methods:
 *  - createCombo: creates the combo widget
 *  - getRanking : gets the geocoder ranking in the "to be used" list 
 *                 given the current map configuration
 *  - getLocation: gets the couple {bounds:<bounds>,points:<points>} for the
 *                 given geocoder results record
 */
gxp.plugins.DynamicGeocoder.Geocoders={
};

gxp.plugins.DynamicGeocoder.Geocoders['google']={
	createCombo: function(comboCfg) {
		return new gxp.form.GoogleGeocoderComboBox(comboCfg);
	},
	getRanking: function(map) {
		var found=false;
		var googleLayers=map.getLayersBy('CLASS_NAME','OpenLayers.Layer.Google');
		for(var count=0,l=googleLayers.length;count<l && !found;count++) {
			var layer=googleLayers[count];
			if(layer.visibility) {
				found=true;
			}
		}
		return found ? 10 : -1;
	},
	getLocation: function(map,record,cfg) {
		var location=record.get(cfg.updateField || 'viewport').clone().transform(
			new OpenLayers.Projection("EPSG:4326"),
			map.getProjectionObject()
		);
		var center = location.getCenterLonLat();
		var points = new OpenLayers.Geometry.Point(center.lon,center.lat);
		return {bounds:location,points:points};
	}
};

gxp.plugins.DynamicGeocoder.Geocoders['nominatim']={
	createCombo: function(comboCfg) {
		return new gxp.form.NominatimGeocoderComboBox(comboCfg);
	},
	getRanking: function(map) {
		return 0;
	},
	getLocation: function(map,record,cfg) {		
		var location;
		var gg=new OpenLayers.Projection("EPSG:4326");
		var boundingBox =record.get(cfg.updateField || 'boundingbox');
		if(boundingBox){
			location =  new OpenLayers.Bounds();			
			location.extend(new OpenLayers.LonLat(boundingBox[3],boundingBox[1]).transform( gg, map.getProjectionObject() ));
			location.extend(new OpenLayers.LonLat(boundingBox[2],boundingBox[0]).transform( gg, map.getProjectionObject() ));
		}
		var points = new OpenLayers.Geometry.Point( record.get(cfg.lonField || 'lon'),record.get(cfg.latField || 'lat') ).transform( gg, map.getProjectionObject() );			

		return {bounds:location,points:points};
	}
};

Ext.preg(gxp.plugins.DynamicGeocoder.prototype.ptype, gxp.plugins.DynamicGeocoder);
