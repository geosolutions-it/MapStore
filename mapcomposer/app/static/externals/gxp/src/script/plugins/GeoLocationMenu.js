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
 *  class = GeoLocationMenu
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: GeoLocationMenu(config)
 *
 */   
gxp.plugins.GeoLocationMenu = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_wmsgetfeatureinfo_menu */
    ptype: "gxp_geolocationmenu",
    
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
    markerFadeoutDelay: 5,  
    
	/** api: config[georeferences]
     *  ``String``
     */
    georeferences:[],
	
	/** api: config[updateField]
     *  ``String``
     */
	updateField: "",	
    
	/** api: config[latField]
     *  ``String``
     */
	latField: "",
	
	/** api: config[lonField]
     *  ``String``
     */
	lonField: "",
	
	/** api: config[geocoderType]
     *  ``String``
     *  type of geocoder to use (google, nominatim, dynamic); defaults to dynamic
     */
	geocoderType: "dynamic",
	
	/** api: config[geoCoderEmptyText]
     *  ``String``
     */
	geoCoderEmptyText: "Geocoder",
	
	/** api: config[buttonText]
     *  ``String``
     *  text for the reverse geocoding button
     */
	buttonText: "Reverse GeoCoder",
	
	/** api: config[buttonText]
     *  ``String``
     *  text for the reverse geocoding button
     */
	reverseGeoCoderEmptyText: "Address...",
	
    /** api: config[buttonText]
     *  ``String``
     *  text for the reverse geocoding button
     */
	buttonText: "Address",
	
	/** api: config[errorMsg]
     *  ``String``
     *  error message shown if reverse geocoding fails
     */	 
	errorMsg: "Geocoder failed",
	
	/** api: config[waitMsg]
     *  ``String``
     *  message shown on map during reverse geocoding
     */
	waitMsg: "Wait please...",
	
	/** api: config[addressTitle]
     *  ``String``
     *  title of the popup box displayed on address found
     */
	addressTitle: "Address found",
	
	/** api: config[menuTooltip]
     *  ``String``
     */	 
	menuTooltip: "Geolocations",

	/** api: config[geolocate]
     *  ``String``
	 *
	 * Mandatory parameters to enable GeoLocation tool
     */	 
	geolocate: {
		/** api: config[geolocateMenuText]
		 *  ``String``
		 *  Text for geolocate menu item (i18n).
		 */
		geolocateMenuText: "Geolocate",

		/** api: config[trackMenuText]
		 *  ``String``
		 *  Text for Tracking menu item (i18n).
		 */
		trackMenuText: "Track Position",
		
		/** api: config[geolocateTooltip]
		 *  ``String``
		 *  Text for geolocate action tooltip (i18n).
		 */
		geolocateTooltip: "Locate my position",

		/** api: config[trackTooltip]
		 *  ``String``
		 *  Text for tracking action tooltip (i18n).
		 */
		trackTooltip: "Track my position",

		/**
		 * api: config[enableTracking]
		 * boolean
		 * set true to use tracking instead of single locating
		 */
		enableTracking: true,

		/**
		 * api: bind
		 * {Boolean} If true, map center will be set on location update.
		 */
		bind: true,

		/**
		 * api: zoom
		 * {Boolean} If true, map will be centered and zoomed on location update.
		 * (If true, overrides "bind" setting)
		 */
		zoom: true,

		/**
		 * api: config[layerName]
		 * ``String``
		 * Text to identify the positions markers layer
		 */
		layerName: "My Position",
		
		/**
		 * api: config[waitMsg]
		 * ``String``
		 * Text to show while waiting first geolocator response
		 */
		geolocateWaitMsg: "Locating...",

		/**
		 * api: config[errorMsg]
		 * ``String``
		 * Text to show when geolocation is not supported
		 */
		geolocateErrorMsg: "Geolocation is not supported by your browser",

		/**
		 * api: config[arrayGeolocationOptions]
		 * ``object``
		 * Options to pass to OpenLayers.Control.Geolocate
		 */
		geolocationOptions: {
			enableHighAccuracy: true,
			maximumAge: 0,
			timeout: 7000
		},
					
		/**
		 * api: displayInLayerSwitcher
		 * {Boolean} 
		 * Display in layerSwitcher the position layer
		 */ 
		displayInLayerSwitcher: false,
		
		/**
		 * api: config[geolocationStyles]
		 * ``object``
		 * Marker style {pointStyle, auraStyle}
		 * They are two styles to apply to OpenLayers.Feature.Vector istances
		 * a point and a regular poligon
		 * 
		 */
		geolocationStyles: {
			pointStyle:{
					fillOpacity: 0.3,
					fillColor: '#55b',
					strokeColor: '#00f',
					strokeOpacity: 0.6
			},
			auraStyle:{
					graphicName: 'circle',
					strokeColor: '#aaa',
					fillColor: '#11f',
					strokeWidth: 2,
					fillOpacity: 0.7,
					strokeOpacity: 0.6,
					pointRadius: 5                           
			}
		},
		
		geoLocationAreaVector: null
	},
	
	/** api: config[geoButtonsWidth]
     *  ``String``
     */	 
	geoButtonsWidth: 130,
	
	/** api: config[actionText]
     *  ``String``
     */	 
	actionText: "GeoLocations",

	/** private: method[constructor]
     */
    constructor: function(config) {
	    if(config.geolocate || config.enableDefaultGeolocate === true){
			this.enableGeoLocateTool = true;
		}
        
		gxp.plugins.GeoLocationMenu.superclass.constructor.apply(this, arguments);
    },
	
	/** api: method[init]
 	 *
	 * Initialize essential components
     */
	init: function(target) {		
		// //////////////////////////////////////
		// Initializing the GeoCoder Tool
		// //////////////////////////////////////
		this.comboContainer = new Ext.Container();        
       
		target.on({
			ready: function() {
				this.createOrUpdateCombo();	
				target.mapPanel.map.events.register('changelayer', this, this.createOrUpdateCombo);				
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
		
		// ////////////////////////////////////////
		// Initializing the ReverseGeoCoder Tool
		// ////////////////////////////////////////
		var me = this;
		
		// handles clicks on map when the geocoder is active
		this.handler = new OpenLayers.Handler.Click( this,
			{
				"click": function(evt) {
					target.mapPanel.getEl().mask(me.waitMsg);
					me.reverseGeocode.call(me,evt,function() {
						target.mapPanel.getEl().unmask();
					});
									
				}
			},{
				map: target.mapPanel.map
			}
		);
		
		// reverse geocoding toggle button
		var cfg = this.buttonConfig || {};
		
		this.reverseGeoCoderButton = new Ext.Button(
			Ext.apply({
				enableToggle: true,
				width: this.geoButtonsWidth,
				text: this.buttonText,
				tooltip: this.buttonText,
				iconCls: "gxp-icon-reversegeocoder",
				toggleHandler: function(btn,state) {
					if(state) {
						this.handler.activate();
					} else {
						this.handler.deactivate();
					}
					
				},
				scope:this
			}, cfg)
		);
		
		// initialize geocoder on ready
		target.on({
			ready: function() {
				this.updateGeocoderType();	
				target.mapPanel.map.events.register('changelayer', this, this.updateGeocoderType);								
			},
			scope:this
		});
		
        return gxp.plugins.GeoLocationMenu.superclass.init.apply(this, arguments);
    },
	
	/** api: method[addOutput]
     */
    addOutput: function(config) {
		var geoReferences = this.buildGeoRerencesAction();
		var reverseGeocoder = this.reverseGeoCoderButton;
		var dynamicGeocoder = this.comboContainer;
		
		var actions = [
			geoReferences,
			dynamicGeocoder
		];
		
		if(this.enableGeoLocateTool){
			var geolocate = this.buildGeoLocateTool();
			actions.push(geolocate);
		}
		
		actions.push(reverseGeocoder);
		
		this.menu = new Ext.menu.Menu({
			id: 'geolocationmenu',
		    style: {
				overflow: 'visible'     // For the Combo popup
			},
			items: actions
		});
		
		this.button = new Ext.Button({
		    //text: this.actionText,
            iconCls: "gxp-icon-geolocationmenu",
            tooltip: this.menuTooltip,
            menu: this.menu
        });

        return gxp.plugins.GeoLocationMenu.superclass.addOutput.call(this, [this.button]);
    },
	
    /** private: method[createGeolocateControl]
     * :param: enableTracking: boolean to enable Tracking
     * :param: geolocationOptions: array for :class:`OpenLayers.Control.Geolocate`
     * :param: geolocationStyles: styles for position's marker point and aura
     *
     * Convenience method for creating a :class:`OpenLayers.Control.Geolocate` control
     */
    createGeolocateControl: function() {        
        var appMap = this.target.mapPanel.map;
        var geostyles = this.geolocate.geolocationStyles;
        
        var geolocateControl = new OpenLayers.Control.Geolocate({            
            map: appMap,
            id: 'locate-control',
            geolocationOptions: this.geolocate.geolocationOptions,
            bind: (this.geolocate.zoom) ? false : this.geolocate.bind,
            watch: this.geolocate.enableTracking,
            eventListeners: {                                
                locationupdated: function(event){                    
                    this.target.mapPanel.getEl().unmask();
					
                    if(this.geolocate.geoLocationAreaVector){
                        appMap.removeLayer(this.geolocate.geoLocationAreaVector);
                    }
					
                    this.geolocate.geoLocationAreaVector = new OpenLayers.Layer.Vector(this.geolocate.layerName, 
						{displayInLayerSwitcher: this.geolocate.displayInLayerSwitcher}
					);    

                    appMap.addLayer(this.geolocate.geoLocationAreaVector);                   
                    
                    var position = event.position;
                    var point = event.point;
                    
                    this.geolocate.geoLocationAreaVector.addFeatures([
                        new OpenLayers.Feature.Vector(
                            event.point,
                            {},
                            geostyles.pointStyle
                        ),
                        new OpenLayers.Feature.Vector(
                            OpenLayers.Geometry.Polygon.createRegularPolygon(
                                new OpenLayers.Geometry.Point(event.point.x, event.point.y),
                                event.position.coords.accuracy / 2,
                                50,
                                0
                            ),
                            {},
                            geostyles.auraStyle
                        )                        
                    ]);
					
                    if(this.geolocate.zoom)
                        appMap.zoomToExtent(this.geolocate.geoLocationAreaVector.getDataExtent());        
                },
                locationfailed: function(event){
                    this.target.mapPanel.getEl().unmask();
                    if(!event.error || (event.error.code != event.error.TIMEOUT))
                        console.log(event);  
                },
                locationuncapable: function(event){
                    this.target.mapPanel.getEl().unmask();
                    Ext.Msg.show({
						title : "Geolocation",
						msg : this.errorMsg
					});
                },
                scope: this
            }
        });

        return geolocateControl;
    },
	
	/** api: method[buildGeoLocateTool]
 	 *
	 * Builds the GeoLocate Tool
     */
	buildGeoLocateTool: function(){
	    var me = this;
		
        var geolocate = new Ext.Button({
		    width: this.geoButtonsWidth,
		    text: this.geolocate.enableTracking ? this.geolocate.trackMenuText : this.geolocate.geolocateMenuText,
			menuText: this.geolocate.enableTracking ? this.geolocate.trackMenuText : this.geolocate.geolocateMenuText,
			tooltip: this.geolocate.enableTracking ? this.geolocate.trackTooltip : this.geolocate.geolocateTooltip,
			iconCls: "gxp-icon-geolocate",
			enableToggle: this.geolocate.enableTracking,
			handler: function() {
				if(!me.geolocate.enableTracking){
					me.target.mapPanel.getEl().mask(me.waitMsg);
					if(!this.control.active){
						this.control.activate();
					}else{
						this.control.getCurrentLocation();
					}							
				}
			},
			toggleHandler: function(button, state) {
				if(me.geolocate.enableTracking){
					if(state){
						me.target.mapPanel.getEl().mask(me.waitMsg);
						this.control.active = this.control.activate();
					} else {
						this.control.active = !this.control.deactivate();
						if(me.geolocate.geoLocationAreaVector){
						   me.target.mapPanel.map.removeLayer(me.geolocate.geoLocationAreaVector);
						   me.geolocate.geoLocationAreaVector = null;
						}      
					}
				}
			},
			map: this.target.mapPanel.map,
			control: this.createGeolocateControl()
		});
		
        return geolocate;
	},
	
	/** api: method[buildGeoRerencesAction]
 	 *
	 * Builds the GeoReferences Tool
     */
	buildGeoRerencesAction: function(){
		var georeferencesStore = new Ext.data.ArrayStore({
            fields: ['name', 'geometry'],
            data :  this.target.georeferences
        });
		
        var georeferencesSelector = new Ext.form.ComboBox({
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
			    scope: this,
                select: function(cb, record, index) {                
                    var center,
					bbox = new OpenLayers.Bounds.fromString(record.get('geometry')),      	
                    
                    bbox = bbox.transform(
                        new OpenLayers.Projection("EPSG:4326"),
                        new OpenLayers.Projection(this.target.mapPanel.map.projection)
					);
						 
					// //////////// Test Code /////////////////////////////////////
					// alert(bbox);
                    // var boxes  = new OpenLayers.Layer.Vector( "Boxes" );
					// box = new OpenLayers.Feature.Vector(bbox.toGeometry());
					// map.addLayer(boxes);
                    // boxes.addFeatures(box);
					// ////////////////////////////////////////////////////////////
					
                    if(this.showMarker === true){
						//optional "position" field (if not specified the marker goes on the bbox center). 
		            	if( record.get('position') ){
							//TODO implement 'position' field in config file: georeferences.js (http://goo.gl/3diTR)
							//
							//                    	var position = record.get('position');
							//						position = new OpenLayers.LonLat(position.lon, position.lat);
							//                    	center = position.transform(
							//                        new OpenLayers.Projection("EPSG:4326"),
							//                        new OpenLayers.Projection(map.projection));
							//						console.log('defined position');
		                } else {
			                center = bbox.getCenterLonLat();
						}
		                    
				        // Set the z-indexes of both graphics to make sure the background
				        // graphics stay in the background
				        var SHADOW_Z_INDEX = 10;
				        var MARKER_Z_INDEX = 11;
				        
				        var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
				        renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
				        
				        // Sets the style for the markers
				        var styleMarkers = new OpenLayers.StyleMap({
				            pointRadius: this.pointRadiusMarkers,
				            externalGraphic: this.externalGraphicMarkers,
							graphicXOffset: this.externalGraphicXOffsetMarkers,
							graphicYOffset: this.externalGraphicYOffsetMarkers,
				            backgroundGraphic: this.backgroundGraphicMarkers,
				            backgroundXOffset: this.backgroundXOffsetMarkers,
				            backgroundYOffset: this.backgroundYOffsetMarkers,
				            graphicZIndex: MARKER_Z_INDEX,
				            backgroundGraphicZIndex: SHADOW_Z_INDEX
				        });
					
				        var markers_feature = new OpenLayers.Feature.Vector( new OpenLayers.Geometry.Point(center.lon, center.lat) );
				
				        var markers = new OpenLayers.Layer.Vector(this.markerName, {
							styleMap: styleMarkers,
							displayInLayerSwitcher: false,
							rendererOptions: {yOrdering: true},
							renderers: renderer
						});
				
				        var markerLyr = this.target.mapPanel.map.getLayersByName(this.markerName);  
				        if (markerLyr.length) {
				            this.target.mapPanel.map.removeLayer(markerLyr[0]);	
				        }
				        
						this.target.mapPanel.map.addLayer(markers);
						markers.addFeatures(markers_feature);
						this.target.mapPanel.map.zoomToExtent(bbox);	
					
						Ext.get(markers.id).fadeOut({ endOpacity: 0.01, duration: this.markerFadeoutDelay});	//fadeout marker, no change 0.01
					} else {
						this.target.mapPanel.map.zoomToExtent(bbox);                    
					}
                }
            }
        });
        
        return georeferencesSelector;
	},
	
	/** private: method[onComboSelect]
     *  Listener for combo's select event.
     */
    onComboSelect: function(combo, record) {        
		var map = this.target.mapPanel.map,				
		geocoder = gxp.plugins.GeoLocationMenu.Geocoders[this.currentGeocoderType];
			
		// gets the location obj in the form {bounds:<bounds>,points:<points>}
		var location = geocoder.getLocation(map,record,this);
		
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
			
			// /////////////////////////////////
			// Fade out for the marker icon.
			// /////////////////////////////////
			Ext.get(markers.id).fadeOut({endOpacity: 0.01, duration: this.markerFadeoutDelay});	//fadeout marker, no change 0.01

		} else {
			map.setCenter(location.bounds);
		}        
    },
	
    /** private: method[createCombo]
     *  Creates a new *GeocoderCombo, using the given geocoder type.
     */
	createCombo: function(type) {			
		return gxp.plugins.GeoLocationMenu.Geocoders[type].createCombo(
			Ext.apply(
				{
				   listeners: {
						select: this.onComboSelect,
						scope: this
				   }
				}, Ext.apply({
					emptyText: this.geoCoderEmptyText
				}, this.outputConfig)
			)
		);			
	},
	
	/**private: method[createOrUpdateCombo]
     *  Creates a new GeocoderCombo or updates the existing one, using the current geocoder type.	 
	 */
	createOrUpdateCombo: function(force) {					
		var newType;
		var geocoders = gxp.plugins.GeoLocationMenu.Geocoders;
		if(this.geocoderType === 'dynamic') {
			var priority = -1;
			
			// ///////////////////////////////////////////////////////////////////
			// gets the best geocoder type given the current map configuration
			// ///////////////////////////////////////////////////////////////////
			for(var type in geocoders) {
				if(geocoders.hasOwnProperty(type)) {
					var geocoder = gxp.plugins.GeoLocationMenu.Geocoders[type];
					var geocoderPriority = geocoder.getRanking(this.target.mapPanel.map);
					if(geocoderPriority > priority) {
						priority = geocoderPriority;
						newType = type;
					}
				}
			}
		} else {
			newType = this.geocoderType;
		}
		
		if(force === true || (newType && newType !== this.currentGeocoderType)) {
			this.currentGeocoderType = newType;			
			var newCombo = this.createCombo(newType);
			
			if(this.combo) {
				this.comboContainer.remove(this.combo);
			}
			
			this.comboContainer.add(newCombo);
			this.comboContainer.doLayout();
			this.combo = newCombo;
		}
	},
	
	/**private: method[updateGeocoderType]
     *  Updates the current geocoder type.	 
	 */
	updateGeocoderType: function() {						
		var geocoders = gxp.plugins.GeoLocationMenu.ReverseGeocoders;
		if(this.geocoderType === 'dynamic') {
			var priority=-1;
			
			// ///////////////////////////////////////////////////////////////////
			// gets the best geocoder type given the current map configuration
			// ///////////////////////////////////////////////////////////////////
			for(var type in geocoders) {
				if(geocoders.hasOwnProperty(type)) {
					var geocoder = gxp.plugins.GeoLocationMenu.ReverseGeocoders[type];
					var geocoderPriority = geocoder.getRanking(this.target.mapPanel.map);
					if(geocoderPriority > priority) {
						priority = geocoderPriority;
						this.currentGeocoderType = type;
					}
				}
			}
		} else {
			this.currentGeocoderType = this.geocoderType;
		}
	},
	
	/** private: method[displayAddress]
	 * Show an address when it's found.
     */
	displayAddress: function(address) {
	    var me = this;
		Ext.Msg.show({
		   title: this.addressTitle,
		   msg: address,
		   closable: false,
		   buttons: Ext.Msg.OK,		
           fn: function(e){
				if(e === 'ok'){
					me.reverseGeoCoderButton.toggle(false);
				}
		   },		   
		   icon: Ext.MessageBox.INFO
		});
	},
	
    /** private: method[reverseGeocode]
	 * Gets the point coordinates and calls the reverse geocoding service.
     */
    reverseGeocode: function(evt,callback) {
		var map = this.target.mapPanel.map;
		
		var latlon = map.getLonLatFromViewPortPx(evt.xy).transform(
			map.getProjectionObject(),
			new OpenLayers.Projection("EPSG:4326")
		);	
		
		gxp.plugins.GeoLocationMenu.ReverseGeocoders[this.currentGeocoderType].reverseGeocode({
			latlon:latlon,
			onSuccess: function(address) {
				this.displayAddress(address);				
				if(callback) {
					callback.call();
				}
			},
			onError: function() {
				Ext.Msg.alert(this.errorMsg);
				if(callback) {
					callback.call();
				}
			},
			scope:this
		});			
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
gxp.plugins.GeoLocationMenu.Geocoders = {

};

gxp.plugins.GeoLocationMenu.Geocoders['google'] = {
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

gxp.plugins.GeoLocationMenu.Geocoders['nominatim'] = {
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

/**
 * Geocoder available implementations.
 * Each implementation should have the following methods:
 *  - reverseGeocode: gets and returns address for a given latlon point (the 
 *                    result is returned via the callbacks onSuccess and onError)
 *  - getRanking : gets the geocoder ranking in the "to be used" list 
 *                 given the current map configuration
 */
gxp.plugins.GeoLocationMenu.ReverseGeocoders = {

};

gxp.plugins.GeoLocationMenu.ReverseGeocoders['google'] = {
	reverseGeocode: function(params) {
		var googleCoords = new google.maps.LatLng(params.latlon.lat, params.latlon.lon);
		var geocoder=new google.maps.Geocoder();		
		geocoder.geocode({'latLng': googleCoords}, function(results, status) {
		  if (status == google.maps.GeocoderStatus.OK) {
				if(results && results.length && results.length>0 && params.onSuccess) {
					params.onSuccess.call(params.scope,results[0].formatted_address);				
				}
			} else if(params.onError) {
				params.onError.call(params.scope);
			}
		});	
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
	}
};

gxp.plugins.GeoLocationMenu.ReverseGeocoders['nominatim'] = {
	reverseGeocode: function(params) {
		var proxy = new Ext.data.ScriptTagProxy({
			api: {
				read : 'http://nominatim.openstreetmap.org/reverse'
			},
			url:'http://nominatim.openstreetmap.org',
			callbackParam:'json_callback'
		});
		var reader = {
			readRecords: function(record) {
				if(record && record.display_name && params.onSuccess) {
					params.onSuccess.call(params.scope,record["display_name"]);	
					return {success:true};
				}
				return {success:false};
			}
		};
		proxy.on('loadexception',function() {
			if(params.onError) {
				params.onError.call(params.scope);
			}
		});
		proxy.request('read',null,{
			format:'json',
			lon:params.latlon.lon,
			lat:params.latlon.lat
		},reader,function() {},this);				
	},
	
	getRanking: function(map) {
		return 0;
	}
};

Ext.preg(gxp.plugins.GeoLocationMenu.prototype.ptype, gxp.plugins.GeoLocationMenu);
