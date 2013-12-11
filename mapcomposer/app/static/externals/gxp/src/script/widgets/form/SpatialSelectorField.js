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
 * @author Alessio Fabiani
 */
Ext.namespace('gxp.widgets.form');
gxp.widgets.form.SpatialSelectorField = Ext.extend(Ext.form.FieldSet, {

	xtype : 'gxp_spatial_selector_field',

	/** api: config[mapPanel]
	 *  ``Object``
	 *  The MapStore viewport object reference.
	 */
	mapPanel : null,
	/** Private **/
	map : null,
	currentExtent : null,

	/** api: config[showSelectionSummary]
	 *  ``Boolean``
	 *  Whether we want to show or not the selection summary as a pop-up on the map.
	 */
	showSelectionSummary : true,

	/** api: config[bufferOptions]
	 *  ``Object``
	 * Buffer spatial selector options.
	 */
	bufferOptions : {
		"minValue": 1,
		"maxValue": 1000,
		"decimalPrecision": 2,
		"distanceUnits": "m"
	 },

	/** api: config[geodesic]
	 *  ``Boolean``
	 * Whether to use geodesic area adjustement or not.
	 */
	geodesic : true,

	/** api: config[spatialSelectors]
	 *  ``Object``
	 * Enable/disable spatial selectors options.
	 */
	spatialSelectors : [{
		name  : 'BBOX',
		label : 'Bounding Box',
		value : 'bbox'
	}, {
		name  : 'Polygon',
		label : 'Polygon',
		value : 'polygon'
	}, {
		name  : 'Circle',
		label : 'Circle',
		value : 'circle'
	}, {
		name  : 'Buffer',
		label : 'Buffer',
		value : 'buffer'
	}, {
		name  : 'GeoCoder',
		label : 'Administrative Areas',
		value : 'geocoder'
	}],

	/** api: config[spatialFilterOptions]
	 *  ``String``
	 * The target CRS used to transform the geometry selection.
	 * If null no transformation will be applied.
	 */
	spatialSourceCRS : 'EPSG:4326',

	/** api: config[spatialFilterOptions ]
	 *  ``Object``
	 * Default CRS limits if not selection has been made. Must be compliant with the map CRS.
	 */
	spatialFilterOptions : {
		lonMax : 20037508.34, //90,
		lonMin : -20037508.34, //-90,
		latMax : 20037508.34, //180,
		latMin : -20037508.34 //-180
	},

	/** api: config[defaultStyle]
	 *  ``Object``
	 */
	defaultStyle : {
		"strokeColor" : "#ee9900",
		"fillColor" : "#ee9900",
		"fillOpacity" : 0.4,
		"strokeWidth" : 1
	},

	/** api: config[selectStyle]
	 *  ``Object``
	 */
	selectStyle : {
		"strokeColor" : "#ee9900",
		"fillColor" : "#ee9900",
		"fillOpacity" : 0.4,
		"strokeWidth" : 1
	},

	/** api: config[temporaryStyle]
	 *  ``Object``
	 */
	temporaryStyle : {
		"pointRadius" : 6,
		"fillColor" : "#FF00FF",
		"strokeColor" : "#FF00FF",
		"label" : "Select",
		"graphicZIndex" : 2
	},

	// Begin pluggable services.
	/** api: config[wpsManagerID]
	 *  ``String``
	 *  WPS Manager Plugin ID .
	 */
	wpsManagerID : null,

	/** api: config[wpsUnionProcessID]
	 *  ``String``
	 *  ID of the WPS Union Process .
	 */
	wpsUnionProcessID : 'JTS:union',

	/** api: config[wpsBufferProcessID]
	 *  ``String``
	 *  ID of the WPS Buffer Process .
	 */
	wpsBufferProcessID : 'JTS:buffer',

	/** api: config[wpsBaseURL]
	 *  ``String``
	 *  WPS Base URL .
	 */
	wpsBaseURL : null,

	/** api: config[wfsBaseURL]
	 *  ``String``
	 *  WFS Base URL .
	 */
	wfsBaseURL : null,
	// End pluggable services.

	// Begin default FieldSet layout config.
	autoHeight : true,
	hidden : false,
	autoWidth : true,
	collapsed : false,
	checkboxToggle : true,
	autoHeight : true,
	layout : 'table',
	bodyCssClass : 'aoi-fields',
	layoutConfig : {
		columns : 1
	},
	// End default FieldSet layout config.

	// Begin i18n.
	/** api: config[title]
	 * ``String``
	 * Text for ROI FieldSet Title (i18n).
	 */
	title : "Region Of Interest",

	/** api: config[title]
	 * ``String``
	 * Text for ROI FieldSet Title (i18n).
	 */
	selectionMethodLabel : "Selection Method",

	/** api: config[comboEmptyText]
	 * ``String``
	 * Text for empty Combo Selection Method (i18n).
	 */
	comboEmptyText : "Select a method..",

	/** api: config[comboSelectionMethodLabel]
	 * ``String``
	 * Text for Label Combo Selection Method (i18n).
	 */
	comboSelectionMethodLabel : "Selection",

	/** api: config[northLabel]
	 * ``String``
	 * Text for Label North (i18n).
	 */
	northLabel : "North",

	/** api: config[westLabel]
	 * ``String``
	 * Text for Label West (i18n).
	 */
	westLabel : "West",

	/** api: config[eastLabel]
	 * ``String``
	 * Text for Label East (i18n).
	 */
	eastLabel : "East",

	/** api: config[southLabel]
	 * ``String``
	 * Text for Label South (i18n).
	 */
	southLabel : "South",

	/** api: config[setAoiTitle]
	 * ``String``
	 * Text for Bounding Box fieldset (i18n).
	 */
	setAoiTitle : "Bounding Box",

	/** api: config[setAoiText]
	 * ``String``
	 * Text for Bounding Box Draw button (i18n).
	 */
	setAoiText : "Draw Box",

	/** api: config[setAoiTooltip]
	 * ``String``
	 * Text for empty Combo Selection Method (i18n).
	 */
	setAoiTooltip : 'Enable the SetBox control to draw a ROI (Bounding Box) on the map',

	/** api: config[areaLabel]
	 * ``String``
	 * Text for the Selection Summary Area Label (i18n).
	 */
	areaLabel : "Area",

	/** api: config[perimeterLabel]
	 * ``String``
	 * Text for the Selection Summary Perimeter Label (i18n).
	 */
	perimeterLabel : "Perimeter",

	/** api: config[radiusLabel]
	 * ``String``
	 * Text for the Selection Summary Radius Label (i18n).
	 */
	radiusLabel : "Radius",

	/** api: config[centroidLabel]
	 * ``String``
	 * Text for the Selection Summary Centroid Label (i18n).
	 */
	centroidLabel : "Centroid",
	
     /**
     * Property: latitudeEmptyText
     * {string} emptyText of the latitude field
     */
     latitudeEmptyText : 'Y',
	 
    /**
     * Property: longitudeEmptyText
     * {string} emptyText of the longitude field
     */
     longitudeEmptyText : 'X',
	

	/** api: config[selectionSummary]
	 * ``String``
	 * Text for the Selection Summary (i18n).
	 */
	selectionSummary : "Selection Summary",

	// End i18n.

	initComponent : function() {
		// ///////////////////
		// Initialize data
		// ///////////////////
		var me = this;

		// the map
		me.map = me.mapPanel.map;
		me.map.enebaleMapEvent = true;
		
		// default extent
		me.currentExtent = me.map.getExtent().toGeometry();

		// ///////////////////////////////////////////
		// Spatial AOI Selector FieldSet
		// ///////////////////////////////////////////
		var confbbox = {
            map: this.map,
            outputSRS : this.map.projection,
            spatialFilterOptions: this.spatialFilterOptions,
            checkboxToggle: false,
            ref: "spatialFieldset",
            title: this.setAoiTitle,
            id: me.id + "_bbox",
            defaultStyle: this.defaultStyle,
            selectStyle: this.selectStyle,
            temporaryStyle: this.temporaryStyle,
		
		    // start i18n
		    northLabel:this.northLabel,
		    westLabel:this.westLabel,
		    eastLabel:this.eastLabel,
		    southLabel:this.southLabel,
		    setAoiText: this.setAoiText,
		    waitEPSGMsg: "Please Wait...",
		    setAoiTooltip: this.setAoiTooltip,
		    title: this.setAoiTitle,
		    listeners : {
		    	"onChangeAOI" : function(bounds) {
					me.addFeatureSummary('bbox', bounds);
					me.setCurrentExtent('bbox', bounds);
		    	}
		    }
        };
        
        this.spatialFieldSet = new gxp.form.BBOXFieldset(confbbox);
		
		// ///////////////////////////////////////////
		// Spatial Buffer Selector FieldSet
		// ///////////////////////////////////////////
		this.bufferFieldSet = new gxp.widgets.form.BufferFieldset({
			anchor: '100%',
			ref: "bufferFieldset",
			collapsed : false,
			hidden: true,
			map: this.map,
			minValue: this.bufferOptions.minValue,
            maxValue: this.bufferOptions.maxValue,
		    decimalPrecision: this.bufferOptions.decimalPrecision,
			outputSRS: this.map.projection,
			selectStyle: this.selectStyle,
			geodesic: this.geodesic,
			latitudeEmptyText: this.latitudeEmptyText,
			longitudeEmptyText: this.longitudeEmptyText,
			listeners: {
				disable: function(){
					this.hide();
				},
				enable: function(){
					this.show();
				}
			}
		});
		this.bufferFieldSet.on("bufferadded", function(evt, feature){
			this.addFeatureSummary('buffer', feature);
		}, this);
		
	    this.bufferFieldSet.on("bufferremoved", function(evt, feature){
			this.removeFeatureSummary();
		}, this);
		
		// //////////////////////////////////////////////////////////
		//
		// Items
		//
		// //////////////////////////////////////////////////////////
		me.items = [{
			title : this.selectionMethodLabel,
			xtype : 'fieldset',
			autoWidth : true,
			layout : 'form',
			defaultType : 'numberfield',
			bodyStyle : 'padding:5px',
			defaults : {
				width : 255
			},
			items : [{
				xtype : 'combo',
				anchor : '100%',
				id : 'selectionMethod_id',
				ref : '../outputType',
				fieldLabel : this.comboSelectionMethodLabel,
				typeAhead : true,
				triggerAction : 'all',
				lazyRender : false,
				mode : 'local',
				name : 'roiSelectionMethod',
				forceSelected : true,
				emptyText : this.comboEmptyText,
				allowBlank : false,
				autoLoad : true,
				displayField : 'label',
				valueField : 'value',
				value : 'bbox',
				width : 255,
				editable : false,
				readOnly : false,
				store : new Ext.data.JsonStore({
					fields : [{
						name : 'name',
						dataIndex : 'name'
					}, {
						name : 'label',
						dataIndex : 'label'
					}, {
						name : 'value',
						dataIndex : 'value'
					}],
					data : this.spatialSelectors
				}),
				listeners : {
					select : function(c, record, index) {
						me.reset();
	
						// /////////////////////////
						// Must activate/deactivate
						//   the right controls...
						// /////////////////////////
						var outputValue = c.getValue();
						if (outputValue == 'bbox') {
							/**
							 * RESET State
							 */
							me.removeFeatureSummary();
							//							me.municipalitiesFieldSet.hide();
							//							me.municipalitiesFieldSet.disable();
	
							/**
							 * Enable Spatial Selector
							 */
							if(me.spatialFieldSet) {
								me.spatialFieldSet.show();
								me.spatialFieldSet.enable();
							}

							if(me.bufferFieldSet) {
								me.bufferFieldSet.resetPointSelection();
								me.bufferFieldSet.coordinatePicker.toggleButton(false);
								me.bufferFieldSet.hide();
								me.bufferFieldSet.disable();
							}
						} else if (outputValue == 'polygon') {
							/**
							 * RESET State
							 */
							me.removeFeatureSummary();
							
							if(me.spatialFieldSet) {
								me.spatialFieldSet.removeBBOXLayer();
								me.spatialFieldSet.hide();
								me.spatialFieldSet.disable();
							}
	
							if(me.bufferFieldSet) {
								me.bufferFieldSet.resetPointSelection();
								me.bufferFieldSet.coordinatePicker.toggleButton(false);
								me.bufferFieldSet.hide();
								me.bufferFieldSet.disable();
							}

							//							me.municipalitiesFieldSet.hide();
							//							me.municipalitiesFieldSet.disable();
	
							/**
							 * Create Polygon Selector
							 */
							me.drawings = new OpenLayers.Layer.Vector({}, {
								displayInLayerSwitcher : false,
								styleMap : new OpenLayers.StyleMap({
									"default" : this.defaultStyle,
									"select" : this.selectStyle,
									"temporary" : this.temporaryStyle
								})
							});
	
							me.map.addLayer(me.drawings);
	
							me.draw = new OpenLayers.Control.DrawFeature(me.drawings, OpenLayers.Handler.Polygon);
	
							// disable pan while drawing
							// TODO: make it configurable
							me.draw.handler.stopDown = true;
							me.draw.handler.stopUp = true;
	
							me.map.addControl(me.draw);
	
							if (me.draw)
								me.draw.activate();
	
							me.drawings.events.on({
								"featureadded" : function(event) {
									me.filterPolygon = event.feature.geometry;
	
									me.addFeatureSummary(outputValue, event.feature);
									me.setCurrentExtent(outputValue, event.feature);
								},
								"beforefeatureadded" : function(event) {
									me.drawings.destroyFeatures();
								}
							});
						} else if(outputValue == 'circle') {
							/**
							 * RESET State
							 */
							me.removeFeatureSummary();
							
							if(me.spatialFieldSet) {
								me.spatialFieldSet.removeBBOXLayer();
								me.spatialFieldSet.hide();
								me.spatialFieldSet.disable();
							}
	
							if(me.bufferFieldSet) {
								me.bufferFieldSet.resetPointSelection();
								me.bufferFieldSet.coordinatePicker.toggleButton(false);
								me.bufferFieldSet.hide();
								me.bufferFieldSet.disable();
							}

							//							me.municipalitiesFieldSet.hide();
							//							me.municipalitiesFieldSet.disable();
	
							/**
							 * Create Polygon Selector
							 */
                            me.drawings = new OpenLayers.Layer.Vector({},
								{
									displayInLayerSwitcher:false,
									styleMap : new OpenLayers.StyleMap({
										"default" : this.defaultStyle,
										"select" : this.selectStyle,
										"temporary" : this.temporaryStyle
									})
								}
							);
                            
                            me.map.addLayer(me.drawings);
                            var polyOptions = {sides: 100};
                            
                            me.draw = new OpenLayers.Control.DrawFeature(
                                me.drawings,
                                OpenLayers.Handler.RegularPolygon,
                                {
                                    handlerOptions: polyOptions
                                }
                            );
                            
							// disable pan while drawing
							// TODO: make it configurable
							me.draw.handler.stopDown = true;
							me.draw.handler.stopUp = true;

                            me.map.addControl(me.draw);
                            me.draw.activate();

                            me.drawings.events.on({
                                "featureadded": function(event) {
                                    me.filterCircle = event.feature.geometry;    

									me.addFeatureSummary(outputValue, event.feature);
									me.setCurrentExtent(outputValue, event.feature);
                                },                                
                                "beforefeatureadded": function(event) {
                                    me.drawings.destroyFeatures();
                                }
                            });                                 
						} else if (outputValue == 'buffer') {
							/**
							 * RESET State
							 */
							me.removeFeatureSummary();
	
							if (me.draw)
								me.draw.deactivate();
	
							if(me.spatialFieldSet) {
								me.spatialFieldSet.removeBBOXLayer();
								me.spatialFieldSet.hide();
								me.spatialFieldSet.disable();
							}
	
							/**
							 * Enable Buffer Selector
							 */
							if(me.bufferFieldSet) {
								me.bufferFieldSet.enable();	
								
								if(Ext.isIE){
									me.bufferFieldSet.doLayout();
								}
							}
						
						} else if (outputValue == 'geocoder') {
							/**
							 * RESET State
							 */
							me.removeFeatureSummary();
	
							if (me.draw)
								me.draw.deactivate();
	
							if(me.spatialFieldSet) {
								me.spatialFieldSet.removeBBOXLayer();
								me.spatialFieldSet.hide();
								me.spatialFieldSet.disable();
							}
	
							if(me.bufferFieldSet) {
								me.bufferFieldSet.resetPointSelection();
								me.bufferFieldSet.coordinatePicker.toggleButton(false);
								me.bufferFieldSet.hide();
								me.bufferFieldSet.disable();
							}

							/**
							 * Enable GeoCoder
							 */
							
						} else {
							/**
							 * RESET State
							 */
							me.reset();
						}
					},
					scope : this
				}
			}]
		},
		me.spatialFieldSet,
		me.bufferFieldSet];

		// //////////////////////////////////////////////////////////
		//
		// Listeners
		//
		// //////////////////////////////////////////////////////////
		me.listeners = {
			scope : me,
			afterrender : function(cmp) {
				cmp.collapse(true);
			},
			collapse : function(cmp) {
				// //////////////////////////
				// Reset the previous control
				// //////////////////////////
				var aoiLayer = me.map.getLayersByName(me.spatialFieldSet.layerName)[0];

				if (aoiLayer)
					me.map.removeLayer(aoiLayer);

				me.spatialFieldSet.selectBBOX.deactivate();
				if (me.draw) {
					me.draw.deactivate();
				}
				if (me.drawings) {
					me.drawings.destroyFeatures();
				}
			}
		};

		return gxp.widgets.form.SpatialSelectorField.superclass.initComponent.call(this);
	},

	reset: function() {
		var me = this;
		// //////////////////////////
		// Reset the previous control
		// //////////////////////////
		var aoiLayer = me.map.getLayersByName(me.spatialFieldSet.layerName)[0];

		if (aoiLayer)
			me.map.removeLayer(aoiLayer);

		if (this.aoiButton && this.aoiButton.pressed) {
			this.aoiButton.toggle();
		}

		if(me.spatialFieldSet) {
			me.spatialFieldSet.removeBBOXLayer();
			me.spatialFieldSet.show();
			me.spatialFieldSet.enable();
		}

		if(me.bufferFieldSet) {
			me.bufferFieldSet.resetPointSelection();
			me.bufferFieldSet.coordinatePicker.toggleButton(false);
			me.bufferFieldSet.hide();
			me.bufferFieldSet.disable();
		}
		
		// //////////////////////////
		// Which control we selected?
		// //////////////////////////
		if (me.draw) {
			me.draw.deactivate();
		};
		if (me.drawings) {
			me.drawings.destroyFeatures();
		};
		if (me.filterCircle) {
			me.filterCircle = new OpenLayers.Filter.Spatial({});
		};
		if (me.filterPolygon) {
			me.filterPolygon = new OpenLayers.Filter.Spatial({});
		};		
	},
	
	//// //////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//// //////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////
	//// ROI Added Features Summary and Geometry Functions
	////
	//// //////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//// //////////////////////////////////////////////////////////////////////////////////////////////////////////////

	populateWFSStore : function() {
		var me = this;
		var wfsStore = null;
		this.getSchema(function(schema) {
			var countFeature = me.setTotalRecord();
			var featureFields = new Array();
			var geometryType = null;
			var geomRegex = /gml:((Multi)?(Point|Line|Polygon|Curve|Surface|Geometry)).*/;
			var types = {
				"xsd:boolean" : "boolean",
				"xsd:int" : "int",
				"xsd:integer" : "int",
				"xsd:short" : "int",
				"xsd:long" : "int",
				/*  "xsd:date": "date",
				 "xsd:dateTime": "date",*/
				"xsd:date" : "string",
				"xsd:dateTime" : "string",
				"xsd:string" : "string",
				"xsd:float" : "float",
				"xsd:double" : "float"
			};
			schema.each(function(r) {
				var match = geomRegex.exec(r.get("type"));
				if (match) {
					geometryName = r.get("name");
					geometryType = match[1];
				} else {
					var type = types[r.get("type")];
					var field = {
						name : r.get("name"),
						type : type
					};
					/* if (type == "date") {
					 field.dateFormat = "Y-m-d H:i:s";
					 }"format": "Y-m-d H:i:s"*/
					featureFields.push(field);
				}
			}, this);

			wfsStore = new GeoExt.data.FeatureStore({
				sortInfo : {
					field : "runEnd",
					direction : "DESC"
				},
				id : this.id + "_wfs_store",
				fields : featureFields,
				loadRecords : function(o, options, success) {
					if (this.isDestroyed === true) {
						return;
					}
					if (!o || success === false) {
						if (success !== false) {
							this.fireEvent('load', this, [], options);
						}
						if (options.callback) {
							options.callback.call(options.scope || this, [], options, false, o);
						}
						return;
					}
					o.totalRecords = countFeature;
					var r = o.records, t = o.totalRecords || r.length;
					if (!options || options.add !== true) {
						if (this.pruneModifiedRecords) {
							this.modified = [];
						}
						for (var i = 0, len = r.length; i < len; i++) {
							r[i].join(this);
						}
						if (this.snapshot) {
							this.data = this.snapshot;
							delete this.snapshot;
						}
						this.clearData();
						this.data.addAll(r);
						this.totalLength = t;
						this.applySort();
						this.fireEvent('datachanged', this);
					} else {
						this.totalLength = Math.max(t, this.data.length + r.length);
						this.add(r);
					}
					this.fireEvent('load', this, r, options);
					if (options.callback) {
						options.callback.call(options.scope || this, r, options, true);
					}
				},
				proxy : new GeoExt.data.ProtocolProxy({
					protocol : new OpenLayers.Protocol.WFS({
						url : 'http://localhost:8180/geoserver/wfs',
						featureType : 'changematrix',
						readFormat : new OpenLayers.Format.GeoJSON(),
						featureNS : 'http://www.geo-solutions.it',
						sortBy : {
							property : "runEnd",
							order : "DESC"
						},
						startIndex : 0,
						outputFormat : "application/json",
						srsName : 'EPSG:32632',
						version : '1.1.0'
					})
				}),
				autoLoad : true
			});
		}); debugger;
		return wfsStore;
	},

	setTotalRecord : function(callback) {
		var countFeature = null;
		var hitCountProtocol = new OpenLayers.Protocol.WFS({
			url : 'http://localhost:8180/geoserver/wfs',
			featureType : "changematrix",
			readOptions : {
				output : "object"
			},
			featureNS : 'http://www.geo-solutions.it',
			resultType : "hits",
			outputFormat : "application/json",
			srsName : 'EPSG:32632',
			version : '1.1.0'
		});

		hitCountProtocol.read({
			callback : function(response) {
				countFeature = response.numberOfFeatures;
				if (callback)
					callback.call();
			},
			scope : this
		});

		return countFeature;
	},

	getSchema : function(callback, scope) {
		var schema = new GeoExt.data.AttributeStore({
			url : 'http://localhost:8180/geoserver/wfs',
			baseParams : {
				SERVICE : "WFS",
				VERSION : "1.1.0",
				REQUEST : "DescribeFeatureType",
				TYPENAME : "changematrix"
			},
			autoLoad : true,
			listeners : {
				"load" : function() {
					callback.call(scope, schema);
				},
				scope : this
			}
		});
	},

	/**
	 * Method: getArea
	 *
	 * Parameters:
	 * geometry - {<OpenLayers.Geometry>}
	 * units - {String} Unit abbreviation
	 *
	 * Returns:
	 * {Float} The geometry area in the given units.
	 */
	getArea : function(geometry, units) {
		var area, geomUnits;
		area = geometry.getGeodesicArea(this.map.getProjectionObject());
		geomUnits = "m";

		var inPerDisplayUnit = OpenLayers.INCHES_PER_UNIT[units];
		if (inPerDisplayUnit) {
			var inPerMapUnit = OpenLayers.INCHES_PER_UNIT[geomUnits];
			area *= Math.pow((inPerMapUnit / inPerDisplayUnit), 2);
		}
		return area;
	},

	/**
	 * Method: getLength
	 *
	 * Parameters:
	 * geometry - {<OpenLayers.Geometry>}
	 * units - {String} Unit abbreviation
	 *
	 * Returns:
	 * {Float} The geometry length in the given units.
	 */
	getLength : function(geometry, units) {
		var length, geomUnits;
		length = geometry.getGeodesicLength(this.map.getProjectionObject());
		geomUnits = "m";

		var inPerDisplayUnit = OpenLayers.INCHES_PER_UNIT[units];
		if (inPerDisplayUnit) {
			var inPerMapUnit = OpenLayers.INCHES_PER_UNIT[geomUnits];
			length *= (inPerMapUnit / inPerDisplayUnit);
		}
		return length;
	},

	/**
	 * api: method[removeFeatureSummary]
	 */
	removeFeatureSummary : function() {
		if (this.featureSummary) {
			this.featureSummary.destroy();
		}

		var map = this.map;
		var layer = map.getLayersByName("bboxqf-circleCentroid")[0];
		if (layer) {
			map.removeLayer(layer);
		}
	},
	
	/**
	 * api: method[setCurrentExtent]
	 */
	setCurrentExtent : function(outputValue, obj) {
		var me = this;
		var geometry;
		if ( obj instanceof OpenLayers.Bounds) {
			geometry = obj.toGeometry();
		} else if ( obj instanceof OpenLayers.Feature.Vector) {
			geometry = obj.geometry;
		}

		if (outputValue == 'bbox') {
			var roi = new OpenLayers.Bounds(
				me.spatialFieldSet.westField.getValue() ? me.spatialFieldSet.westField.getValue() : me.spatialFilterOptions.lonMin, 
				me.spatialFieldSet.southField.getValue() ? me.spatialFieldSet.southField.getValue() : me.spatialFilterOptions.latMin, 
				me.spatialFieldSet.eastField.getValue() ? me.spatialFieldSet.eastField.getValue() : me.spatialFilterOptions.lonMax, 
				me.spatialFieldSet.northField.getValue() ? me.spatialFieldSet.northField.getValue() : me.spatialFilterOptions.latMax
			);

			var bbox = roi;
			if (!bbox)
				bbox = me.map.getExtent();

			me.currentExtent = bbox;

			//change the extent projection if it differs from 4326
			if (me.map.getProjection() != me.spatialSourceCRS) {
				me.currentExtent.transform(me.map.getProjectionObject(), new OpenLayers.Projection(me.spatialSourceCRS));
			}
			me.currentExtent = me.currentExtent.toGeometry();
		} else if (outputValue == 'polygon' && geometry) {
			me.currentExtent = geometry;

			//change the extent projection if it differs from 4326
			if (me.map.getProjection() != me.spatialSourceCRS) {
				me.currentExtent.transform(me.map.getProjectionObject(), new OpenLayers.Projection(me.spatialSourceCRS));
			}
		} else {
			me.currentExtent = me.map.getExtent();
			//change the extent projection if it differs from 4326
			if (me.map.getProjection() != me.spatialSourceCRS) {
				me.currentExtent.transform(me.map.getProjectionObject(), new OpenLayers.Projection(me.spatialSourceCRS));
			}
			me.currentExtent = me.currentExtent.toGeometry();
		}
		
	},
	
	/**
	 * api: method[addFeatureSummary]
	 */
	addFeatureSummary : function(outputValue, obj) {
		if (this.showSelectionSummary) {
			this.removeFeatureSummary();

			var geometry;
			if ( obj instanceof OpenLayers.Bounds) {
				geometry = obj.toGeometry();
			} else if ( obj instanceof OpenLayers.Feature.Vector) {
				geometry = obj.geometry;
			}

			var summary = "", metricUnit = "km";

			var area = this.getArea(geometry, metricUnit);
			if (area) {
				summary += this.areaLabel + ": " + area + " " + metricUnit + '<sup>2</sup>' + '<br />';
			}

			var selectionType = outputValue;
			switch(selectionType) {
				case 'polygon':
				case 'bbox':
					var perimeter = this.getLength(geometry, metricUnit);
					if (perimeter) {
						summary += this.perimeterLabel + ": " + perimeter + " " + metricUnit + '<br />';
					}
					break;
				case 'circle':
				case 'buffer':
					var radius = Math.sqrt(area / Math.PI);
					if (radius) {
						summary += this.radiusLabel + ": " + radius + " " + metricUnit + '<br />';
					}

					// //////////////////////////////////////////////////////////
					// Draw also the circle center as a part of summary report
					// //////////////////////////////////////////////////////////
					var circleSelectionCentroid = geometry.getCentroid();

					if (circleSelectionCentroid) {
						var lon = circleSelectionCentroid.x.toFixed(3);
						var lat = circleSelectionCentroid.y.toFixed(3);
						var xField = this.map.projection == "EPSG:4326" ? "Lon" : "X";
						var yField = this.map.projection == "EPSG:4326" ? "Lat" : "Y";
						summary += this.centroidLabel + ": " + lon + " ("+xField+") " + lat + " ("+yField+")" + '<br />';
					}

					if (selectionType == "circle") {
						var options = {};
						var centroidStyle = {
							pointRadius : 4,
							graphicName : "cross",
							fillColor : "#FFFFFF",
							strokeColor : "#FF0000",
							fillOpacity : 0.5,
							strokeWidth : 2
						};

						if (centroidStyle) {
							var style = new OpenLayers.Style(centroidStyle);
							var options = {
								styleMap : style
							};
						}

						var circleCentroidLayer = new OpenLayers.Layer.Vector("bboxqf-circleCentroid", options);

						var pointFeature = new OpenLayers.Feature.Vector(circleSelectionCentroid);
						circleCentroidLayer.addFeatures([pointFeature]);

						circleCentroidLayer.displayInLayerSwitcher = false;
						this.map.addLayer(circleCentroidLayer);
					}

					break;
			}

			this.featureSummary = new Ext.ToolTip({
				xtype : 'tooltip',
				target : Ext.getBody(),
				html : summary,
				title : this.selectionSummary,
				autoHide : false,
				closable : true,
				draggable : false,
				mouseOffset : [0, 0],
				showDelay : 1,
				listeners : {
					scope : this,
					hide : function(cmp) {
						this.featureSummary.destroy();
					}
				}
			});

			var vertex = geometry.getVertices();
			var point;
			if ( obj instanceof OpenLayers.Bounds) {
				point = vertex[1];
			} else if ( obj instanceof OpenLayers.Feature.Vector) {
				point = vertex[vertex.length - 1];
			}

			var px = this.map.getPixelFromLonLat(new OpenLayers.LonLat(point.x, point.y));
			var p0 = this.mapPanel.getPosition();

			this.featureSummary.targetXY = [p0[0] + px.x, p0[1] + px.y];
			this.featureSummary.show();
		}
	}
	//// //////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//// //////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////
	////
	////
	//// //////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//// //////////////////////////////////////////////////////////////////////////////////////////////////////////////
});
Ext.reg(gxp.widgets.form.SpatialSelectorField.prototype.xtype, gxp.widgets.form.SpatialSelectorField);
