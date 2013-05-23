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
 *  class = Geolocate
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: (config)
 *
 *    Provides tools to expose browser Geolocation funcionality.
 */
gxp.plugins.Geolocate = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_geolocate */
    ptype: "gxp_geolocate",

    /** api: config[outputTarget]
     *  ``String`` Popups created by this tool are added to the map by default.
     */
    outputTarget: "map",

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
    waitMsg: "Locating...",

    /**
     * api: config[errorMsg]
     * ``String``
     * Text to show when geolocation is not supported
     */
    errorMsg: "Geolocation is not supported by your browser",

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
        
    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.Geolocate.superclass.constructor.apply(this, arguments);
    },

    /** private: method[destroy]
     */
    destroy: function() {
        this.button = null;
        gxp.plugins.Geolocate.superclass.destroy.apply(this, arguments);
    },

    geoLocationAreaVector: null,
    /** private: method[createGeolocateControl]
     * :param: enableTracking: boolean to enable Tracking
     * :param: geolocationOptions: array for :class:`OpenLayers.Control.Geolocate`
     * :param: geolocationStyles: styles for position's marker point and aura
     *
     * Convenience method for creating a :class:`OpenLayers.Control.Geolocate`
     * control
     */
    createGeolocateControl: function() {        
        var appMap = this.target.mapPanel.map;
        var geostyles = this.geolocationStyles;
        
        var geolocateControl = new OpenLayers.Control.Geolocate({            
            map: appMap,
            id: 'locate-control',
            geolocationOptions: this.geolocationOptions ,
            bind: (this.zoom)?false:this.bind,
            watch: this.enableTracking,
            eventListeners: {
                                
                locationupdated: function(event){                    
                    this.target.mapPanel.getEl().unmask();
					
                    if(this.geoLocationAreaVector){
                        appMap.removeLayer(this.geoLocationAreaVector);
                    }
					
                    this.geoLocationAreaVector=new OpenLayers.Layer.Vector( this.layerName , {displayInLayerSwitcher: this.displayInLayerSwitcher});    

                    appMap.addLayer(this.geoLocationAreaVector);                   
                    
                    var position = event.position;
                    var point = event.point;
                    
                    this.geoLocationAreaVector.addFeatures([
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
                    if(this.zoom)
                        appMap.zoomToExtent(this.geoLocationAreaVector.getDataExtent());
        
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
	
    /** api: method[addActions]
     *  This action can act as a button or as a toggle based on "enableTracking" value
     */
    addActions: function() {
        var me = this;
        var actions = [{
			menuText: this.enableTracking ? this.trackMenuText : this.geolocateMenuText,
			tooltip: this.enableTracking ? this.trackTooltip : this.geolocateTooltip,
			iconCls: "gxp-icon-geolocate",
			enableToggle: this.enableTracking,
			handler: function() {
					if(!me.enableTracking){
						me.target.mapPanel.getEl().mask(me.waitMsg);
						if(!this.control.active){
							this.control.activate();
							}
						else
							this.control.getCurrentLocation();
						}
			},
			toggleHandler: function(button, state) {
					if(me.enableTracking)
						if(state)
						{
							me.target.mapPanel.getEl().mask(me.waitMsg);
							this.control.active = this.control.activate();
						}
						else
						{
							this.control.active = !this.control.deactivate();
							if(me.geoLocationAreaVector)
							   {
								   me.target.mapPanel.map.removeLayer(me.geoLocationAreaVector);
								   me.geoLocationAreaVector = null;
							   }      
						}
			},
			map: this.target.mapPanel.map,
			control: this.createGeolocateControl()
		}];
		
        return gxp.plugins.Geolocate.superclass.addActions.apply(this, [actions]);
    }        
});

Ext.preg(gxp.plugins.Geolocate.prototype.ptype, gxp.plugins.Geolocate);
