/**
 *  Copyright (C) 2007 - 2014 GeoSolutions S.A.S.
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
 * @requires widgets/form/spatialselector/SpatialSelectorMethod.js
 */
 
/**
 * @author Alejandro Diaz
 */

/** api: (define)
 *  module = gxp.plugins.spatialselector
 *  class = ReverseGeocoder
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace('gxp.plugins.spatialselector');

/** api: constructor
 *  .. class:: ReverseGeocoder(config)
 *
 *    Reverse Geocoder based on spatial selectors
 */
gxp.plugins.spatialselector.ReverseGeocoder = Ext.extend(gxp.plugins.Tool, {

	/* ptype = gxp_spatial_selector_reverse_geocoder */
	ptype : 'gxp_spatial_selector_reverse_geocoder',

	/** api: config[layoutConfig]
	 *  ``Object``
	 *  Configuration for the output layout.
	 */

	/** api: config[crossParameters]
	 *  ``Object``
	 *  Configuration for crossParameters by selectors. When you select a result for the first combo, 
	 *  it will enable the second or more comboboxes and copy the parameter configured in the second one
	 */
    crossParameters:{},

    /** api: config[searchBtnCls]
     * ``String``
     * Icon cls for the search button.
     */
	searchBtnCls: "gxp-icon-find",

    /** api: config[resetBtnCls]
     * ``String``
     * Icon cls for the search button.
     */
	resetBtnCls: "cancel",

	/** i18n **/
	/** api: config[titleText]
	 * ``String``
	 * Title for the output (i18n).
	 */
	titleText: "Reverse Geocoder",

	/** api: config[searchText]
	 * ``String``
	 * Search text (i18n).
	 */
	searchText: "Zoom",

	/** api: config[searchTpText]
	 * ``String``
	 * Search tooltip text (i18n).
	 */
	searchTpText: "Search selected location and zoom in on map",

	/** api: config[resetText]
	 * ``String``
	 * Reset text (i18n).
	 */
	resetText: "Reset",

	/** api: config[resetText]
	 * ``String``
	 * Reset text (i18n).
	 */
	resetTpText: "Reset location search",

	/** api: config[translatedKeys]
	 * ``String``
	 * Translated keys for spatial selectors (i18n).
	 */
	translatedKeys: {
		"name": "Street",
		"number": "Number"
	},

	gridStreetHeader: "Street Name",
	gridNumberHeader: "Street Number",
    locateTpText: "Select a location on the map clicking on it",
	radiusText: "Radius",
    radiusTpText: "Change the radius value on the selected location",
	/** EoF i18n **/

	/** api: config[selectStyle]
	 *  ``Object``
	 */
	selectStyle : {
        "fillColor"   : "#FFFFFF",
        "strokeColor" : "#FF0000",
        "fillOpacity" : 0.5,
        "strokeWidth" : 1
	},

	/** api: config[labelStyle]
	 *  ``Object``
	 *  Label style for the features founds.
	 */
    labelStyle: {
        fontColor: "#a52505",
        fontSize: "18px",
        fontFamily: "Courier New, monospace",
        fontWeight: "bold",
        label: "${label}",
        labelOutlineColor: "white",
        labelOutlineWidth: 5
    },

	/** TODO: More configs to be documented **/
	gridNumberSortable: true,
	gridStreetSortable: true,
    wfsVersion: "1.1.0",
    url: null,
    outputFormat: "json",
    typeName: null,
    streetPropertyName: null,
    numberPropertyName: null,
	featureNS: null,
    selectLayerName: "ReverseGeocoderLayer",
    centerText: "",
	bufferZoneText: "",

	/** api: method[constructor]
	 * Init spatialSelectors .
	 */
	constructor : function(config) {
		// default layout configuration
		this.layoutConfig = {
    		xtype: "panel",
    		layout: "form",
    		defaults:{
    			layout:"fieldset",
    			width: 100
    		}
		};

		// Apply config
		Ext.apply(this, config);
		
		return gxp.plugins.spatialselector.ReverseGeocoder.superclass.constructor.call(this, arguments);
	},

    /** api: method[addOutput]
     */
    addOutput: function() {

		// initialize spatial selectors
		this.spatialSelectors = {};
		this.spatialSelectorsItems = [];
		if(this.spatialSelectorsConfig){
			for (var key in this.spatialSelectorsConfig){
				var spConfig = this.spatialSelectorsConfig[key];
				spConfig.target = this.target;
				// Add i18n support by spatial selector 
				if(this.translatedKeys[key]){
					spConfig["name"] = this.translatedKeys[key];
				}
				var plugin = Ext.create(spConfig);
				if(this.target 
					&& this.target.tools){
					this.target.tools[spConfig.id] = plugin;
				}
				this.spatialSelectors[key] = plugin;
				var selectorItem = plugin.getSelectionMethodItem();
				selectorItem.value = key;
				this.spatialSelectorsItems.push(selectorItem);
			}	
		}

    	// prepare layout
    	var layout = {};
		Ext.apply(layout, this.layoutConfig);
		if(!layout.title){
			layout.title = this.titleText;
		}

		var store = new Ext.data.ArrayStore({
            fields: [
			   {name: 'street'},
			   {name: 'number'},
			   {name: "geometry"}
            ]
        });
	    layout.items = [{
			xtype: "fieldset",
			title: "Location form",
			items:[{
	            xtype   : "button",
	            text : "Locate on map",
	            tooltip : this.locateTpText,
				scope   : this,
    			anchor: "100%",
				handler : this.locate
			},{
	            xtype   : "numberfield",
	            ref: "../radiusField",
	            fieldLabel : this.radiusText,
	            tooltip : this.radiusTpText,
	            listeners: {
	            	"change": this.updateDrawings,
	            	scope: this
	            },
				value: 100
			}]
		},{
			xtype: "fieldset",
			title: "Location founds",
			items:[{
	            xtype: "grid",
	            layout: "fit",
	            ref: "../featureGrid",
	            store: store,
	            height: 150,
	            // title: this.geocodingPanelTitle,
	            columns: [
	            	{
	                    id       : 'street',
	                    header   : this.gridStreetHeader, 
	                    sortable : this.gridStreetSortable, 
	                    dataIndex: 'street'
	                }, {
	                    id       : 'number',
	                    header   : this.gridNumberHeader,
	                    sortable : this.gridNumberSortable, 
	                    dataIndex: 'number'
	                }
	            ],
	            listeners: {
	            	'rowclick': this.rowclick, 
		            scope: this
	            }
	        }]
		}]

	    layout.buttonAlign = "right";

	    layout.bbar = [
	    "->", 
	    {
            xtype   : "button",
            text : this.searchText,
            tooltip : this.searchTpText,
            iconCls: this.searchBtnCls,
			scope   : this,
			handler : this.search
		},{
            xtype   : "button",
            text : this.resetText,
            tooltip : this.resetTpText,
            iconCls: this.resetBtnCls,
			scope   : this,
			handler : this.reset
		}];

		var me = this;

		//create the click control
        var ClickControl = OpenLayers.Class(OpenLayers.Control, {                
            defaultHandlerOptions: {
                'single': true,
                'double': false,
                'pixelTolerance': 0,
                'stopSingle': false,
                'stopDouble': false
            },

            initialize: function(options) {
                this.handlerOptions = OpenLayers.Util.extend(
                    {}, this.defaultHandlerOptions
                );
                OpenLayers.Control.prototype.initialize.apply(
                    this, arguments
                ); 
                this.handler = new OpenLayers.Handler.Click(
                    me, {
                        'click': this.trigger
                    }, this.handlerOptions
                );
            }, 
            trigger: this.clickHandler,
            map:this.target.mapPanel.map
        });       
        
        this.selectLonLat = new ClickControl();
        this.target.mapPanel.map.addControl(this.selectLonLat);

	    var output = gxp.plugins.spatialselector.Geocoder.superclass.addOutput.call(this, layout);

    	return output;
    },

    addFeatureOnClick: true,

    rowclick: function(grid, rowIndex, columnIndex, e) {
    	var record = grid.store.getAt(rowIndex);
		this.geometry = record.get("geometry");
		var geometry = this.geometry;
		var label = record.data.street + " - " + record.data.number;
		var attributes = {name: label, label: label};
		this.featureData = attributes;
		if(this.addFeatureOnClick){
		    if(this.lastFeature){
		    	this.layer.removeFeatures([this.lastFeature]);
		    }
		    this.lastFeature = new OpenLayers.Feature.Vector(geometry, attributes);
		    this.layer.addFeatures([this.lastFeature]);
		}
    },

    locate: function(){
      	this.selectLonLat.activate();

    },
	
	/** event handler for the ClickControl click event*/
    clickHandler: function(e){
      	this.selectLonLat.deactivate();
        //get lon lat
        var map = this.target.mapPanel.map;
        var lonlat = map.getLonLatFromPixel(e.xy);
        //
        var geoJsonPoint = lonlat.clone();
        geoJsonPoint.transform(map.getProjectionObject(),new OpenLayers.Projection(this.outputSRS));
        this.updateMapPoint(lonlat);
    },
	
	/** private point update */
    updateMapPoint:function(lonlat){
    	this.lonlat = lonlat;
        if(this.selectStyle){
            this.resetMapPoint();
            var style = new OpenLayers.Style(this.selectStyle);
            Ext.applyIf(style, this.labelStyle);
            if(!this.layer){
            	var vector_style = (JSON.parse(JSON.stringify(this.selectStyle)));
				Ext.applyIf(vector_style, this.labelStyle);
		        this.layer = new OpenLayers.Layer.Vector(this.selectLayerName,
					{
						displayInLayerSwitcher:false,
						styleMap : new OpenLayers.StyleMap({
							"default"   : vector_style,
							"select"    : vector_style
						})
					}
				);
		    }else{
		    	this.layer.removeAllFeatures();
		    }
            var point = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);
			var attributes = {name: this.centerText, label: this.centerText};
            var pointFeature = new OpenLayers.Feature.Vector(point, attributes);
            this.layer.addFeatures([pointFeature]);
            this.layer.displayInLayerSwitcher = this.displayInLayerSwitcher;
            this.target.mapPanel.map.addLayer(this.layer);
        }
        var bv = this.output[0].radiusField.isValid();
		if(bv){                                 
            var point = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);
            
            var regularPolygon = OpenLayers.Geometry.Polygon.createRegularPolygon(
                point,
                this.output[0].radiusField.getValue(),
                100, 
                null
            );
            
            this.drawBuffer(regularPolygon);

            this.getLocateWFSStore(this.typeName, this.geometryName, this.featureNS, regularPolygon);
        }
    },

    updateDrawings: function(){
    	this.lonlat && this.updateMapPoint(this.lonlat);
    },
	
	/**
	 * Remove the point displayed in the map 
	 */
    resetMapPoint:function(){
        var map = this.target.mapPanel.map;
		if(this.selectStyle){
			var layer = map.getLayersByName(this.selectLayerName)[0];
            if(layer){
                map.removeLayer(layer);
            }
		}
    },
	
	resetBuffer: function(){
        var map = this.target.mapPanel.map;
		if(this.selectStyle){
			var layer = map.getLayersByName(this.selectLayerName)[0];
            if(layer){
                map.removeLayer(layer);
            }
			
			this.fireEvent('bufferremoved', this);
		}
	},
	
    drawBuffer: function(regularPolygon){
        if(this.selectStyle){
            this.resetBuffer();

            if(!this.layer){
            	var vector_style = (JSON.parse(JSON.stringify(this.selectStyle)));
				Ext.applyIf(vector_style, this.labelStyle);
		        this.layer = new OpenLayers.Layer.Vector(this.selectLayerName,
					{
						displayInLayerSwitcher:false,
						styleMap : new OpenLayers.StyleMap({
							"default"   : vector_style,
							"select"    : vector_style
						})
					}
				);
		    }
			this.bufferLayer = this.layer;
			var attributes = {name: this.bufferZoneText, label: this.bufferZoneText};
            var bufferFeature = new OpenLayers.Feature.Vector(regularPolygon, attributes);
            this.bufferLayer.addFeatures([bufferFeature]);
			
            this.bufferLayer.displayInLayerSwitcher = this.displayInLayerSwitcher;
            this.target.mapPanel.map.addLayer(this.bufferLayer);  
			
			this.fireEvent('bufferadded', this, bufferFeature);
        }    
    },

	/** api: method[reset]
	 * Search action.
	 */
    search: function(){

    	var geometry = this.geometry;
    	var featureData = this.featureData;

		if (geometry && geometry.getBounds) {
			if(!this.addFeatureOnClick){
		    	this.layer.addFeatures([new OpenLayers.Feature.Vector(geometry, featureData)]);
		    }
			var dataExtent = geometry.getBounds();
			this.target.mapPanel.map.zoomToExtent(dataExtent, closest=false);
		}
    },

	/** api: method[reset]
	 * Reset the state of the Geocoder.
	 */
    reset: function(){
    	this.geometry = null;
    	if(this.layer){
	    	this.layer.removeAllFeatures();
    	}
    	this.output[0].featureGrid.store.clearData();
    	this.output[0].featureGrid.view.refresh();
    },

    getLocateWFSStore: function(typeName, filterGeometryName, featureNS, currentGeometry){

        var protocolOptions = {
        	version: this.wfsVersion,
            srsName: this.target.mapPanel.map.getProjection(),
            url: this.url,
            featureType: typeName,
            featureNS: featureNS,
            geometryName: filterGeometryName,
            readOptions: {
            	output: "object",
            	ignoreExtraDims: true
            },
            resultType: "hits"
        };
        var featureStore = new gxp.data.WFSFeatureStore(Ext.apply({
            fields: [
            	{name: this.streetPropertyName, type: "string"},
            	{name: this.numberPropertyName, type: "string"}
        	],
            proxy: {
                protocol: {
                    outputFormat: this.outputFormat 
                }
            },
            maxFeatures: this.maxFeatures,
            // layer: typeName,
            ogcFilter: new OpenLayers.Filter.Spatial({
				type: OpenLayers.Filter.Spatial.INTERSECTS,
				property:  filterGeometryName,
				value: currentGeometry,
				bounds: currentGeometry.getBounds()
			}),
            autoLoad: true,
            autoSave: false
        }, protocolOptions));

        featureStore.on("load", function(){
        	this.me.parseWFSData(this.store, this.typeName);
        }, {
        	me: this,
        	store: featureStore,
        	typeName: typeName
        });

        return featureStore;
    },

    parseWFSData:function(store, typeName){
    	var range = store.getRange();
    	var count = store.getCount();
    	var targetStore = this.output[0].featureGrid.store;
    	targetStore.clearData();
    	for(var i = 0; i < count; i++){
    		targetStore.add(new targetStore.recordType({
    			street: store.getAt(i).get(this.streetPropertyName), 
    			number: store.getAt(i).get(this.numberPropertyName), 
    			geometry: store.getAt(i).get("feature").geometry
    		}));	
    	}
    	this.output[0].featureGrid.view.refresh();
    }

});

Ext.preg(gxp.plugins.spatialselector.ReverseGeocoder.prototype.ptype, gxp.plugins.spatialselector.ReverseGeocoder);