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

	/** api: config[loadingMaskId]
	 *  ``Object``
	 *  Super-panel ID for Loading Mask.
	 */
	loadingMaskId: null,
	
	/** api: config[showSelectionSummary]
	 *  ``Boolean``
	 *  Whether we want to show or not the selection summary as a pop-up on the map.
	 */
	showSelectionSummary : true,

	/** api: config[zoomToCurrentExtent]
	 *  ``Boolean``
	 *  Whether we want to automatically zoom to the current extent.
	 */
	zoomToCurrentExtent : true,

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
	spatialOutputCRS : 'EPSG:4326',

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

	/** api: config[labelStyle]
	 *  ``Object``
	 */
	labelStyle : {
		'fontColor': '#a52505',
		'fontSize': "14px",
		'fontFamily': "Courier New, monospace",
		'fontWeight': "bold",
		'label': '${label}',
		'labelOutlineColor': "white",
		'labelOutlineWidth': 5
	},
	
	// Begin pluggable services.
	/** api: config[wpsManager]
	 *  ``Object``
	 *  WPS Manager Plugin .
	 */
	wpsManager : null,

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

	/** api: config[wfsBaseURL]
	 *  ``String``
	 *  WFS Base URL .
	 */
	wfsBaseURL : "http://localhost:8180/geoserver/wfs?",
	// End pluggable services.

	// //////////////////////////////////////////////////////////////
	// GeoCoding Panel Config
	// //////////////////////////////////////////////////////////////
	
	/** api: config[geocoderTypeName]
	 *  ``String``
	 *  geocoderTypeName .
	 */
	geocoderTypeName : "it.geosolutions:geocoder_limits",

	/** api: config[geocoderTypeTpl]
	 *  ``String``
	 *  geocoderTypeTpl .
	 */
	geocoderTypeTpl : "<tpl for=\".\"><hr><div class=\"search-item\"><h3>{name}</span></h3>{name}</div></tpl>",
	
	/** api: config[geocoderTypeRecordModel]
	 *  ``Object``
	 *  geocoderTypeRecordModel .
	 */
	geocoderTypeRecordModel:[
 		{
		    name:"id",
		    mapping:"id"
		},
		{
	   		name:"name",
	   		mapping:"properties.name"
		},
		{
	   		name:"custom",
	   		mapping:"properties.parent"
		},
		{
	   		name:"geometry",
	   		mapping:"geometry"
		}
 	],

	/** api: config[geocoderTypeSortBy]
	 *  ``String``
	 *  geocoderTypeSortBy .
	 */
	geocoderTypeSortBy:"name",

	/** api: config[geocoderTypeQueriableAttributes]
	 *  ``Object``
	 *  geocoderTypeQueriableAttributes .
	 */
	geocoderTypeQueriableAttributes:[
		"name"
	],

	/** api: config[geocoderTypeDisplayField]
	 *  ``String``
	 *  geocoderTypeDisplayField .
	 */
	geocoderTypeDisplayField:"name",

	/** api: config[geocoderTypePageSize]
	 *  ``Integer``
	 *  geocoderTypePageSize .
	 */
	geocoderTypePageSize : 10,

	/** api: config[selectedAreasSeparator]
	 *  ``String``
	 *  Separator for return types 'list' or 'subs' between each element returned.
	 */
	selectedAreasSeparator: ",",

	/** api: config[selectedAreaParentSeparator]
	 *  ``String``
	 *  Separator for return types 'list' or 'subs' between each element name and his parent.
	 */
	selectedAreaParentSeparator: "_",
	
	// //////////////////////////////////////////////////////////////
	// END - GeoCoding Panel Config
	// //////////////////////////////////////////////////////////////

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
	
	/** api: config[geocoderSelectors]
	 *  ``Object``
	 *  Options for the geocoder return types selections.
	 */
 	geocoderSelectors : [{
		name  : 'Union',
		label : 'Geometry Union',
		value : 'default'
	}, {
		name  : 'List',
		label : 'Administrative Area List',
		value : 'list'
	}, {
		name  : 'Subs',
		label : 'Administrative Area Subs',
		value : 'subs'
	}],
	
	/** api: config[selectReturnType]
	 *  ``Boolean``
	 *  Allow return type on the geocoder.
	 */
	selectReturnType: false,
     
	// //////////////////////////////////////////////////////////////
	// GeoCoding Panel i18N
	// //////////////////////////////////////////////////////////////

	/** api: config[geocodingFieldSetTitle]
	 * ``String``
	 * Text for the Geocoding FieldSet Title (i18n).
	 */
	geocodingFieldSetTitle : "GeoCoder",
	
	/** api: config[geocodingPanelTitle]
	 * ``String``
	 * Text for the Geocoding Panel Title (i18n).
	 */
	geocodingPanelTitle : "Selected Locations",
	
	/** api: config[geocodingPanelBtnRefreshTxt]
	 * ``String``
	 * Text for the Geocoding Panel Button Refresh (i18n).
	 */
	geocodingPanelBtnRefreshTxt : "Show Geometries",
	
	/** api: config[geocodingPanelBtnDestroyTxt]
	 * ``String``
	 * Text for the Geocoding Panel Button Destroy (i18n).
	 */
	geocodingPanelBtnDestroyTxt : "Hide Geometries",
	
	/** api: config[geocodingPanelBtnDeleteTxt]
	 * ``String``
	 * Text for the Geocoding Panel Button Delete (i18n).
	 */
	geocodingPanelBtnDeleteTxt : "Delete Location",
	
	/** api: config[geocodingPanelLocationHeader]
	 * ``String``
	 * Text for the Geocoding Panel Location Column Header (i18n).
	 */
	geocodingPanelLocationHeader: "Location",
	geocodingPanelLocationSize:90,
	geocodingPanelLocationSortable:true,
	
	/** api: config[geocodingPanelCustomHeader]
	 * ``String``
	 * Text for the Geocoding Panel Custom Column Header (i18n).
	 */
	geocodingPanelCustomHeader: "Parent",
	geocodingPanelCustomSize:100,
	geocodingPanelCustomSortable:true,
	
	
	/** api: config[geocodingPanelGeometryHeader]
	 * ``String``
	 * Text for the Geocoding Panel Geometry Column Header (i18n).
	 */
	geocodingPanelGeometryHeader: "Geometry WKT",
	geocodingPanelGeometrySize:30,
	geocodingPanelGeometrySortable: false,
	
	/** api: config[geocodingPanelBtnSelectAllTxt]
	 * ``String``
	 * Text for the Geocoding Panel Button Select All (i18n).
	 */
	geocodingPanelBtnSelectAllTxt : "Check All", 

	/** api: config[geocodingPanelBtnDeSelectAllTxt]
	 * ``String``
	 * Text for the Geocoding Panel Button Select All (i18n).
	 */
	geocodingPanelBtnDeSelectAllTxt : "Uncheck All", 

	/** api: config[geocodingPanelMsgRemRunningTitle]
	 * ``String``
	 * Text for the Geocoding Panel Button Delete (i18n).
	 */
	geocodingPanelMsgRemRunningTitle : "Remove a Locations",

	/** api: config[geocodingPanelMsgRemRunningMsg]
	 * ``String``
	 * Text for the Geocoding Panel Button Delete (i18n).
	 */
	geocodingPanelMsgRemRunningMsg : "Would you like to remove the selected locations from the list?",
	
	/** api: config[geocodingFieldLabel]
	 * ``String``
	 * Text for the Geocoding Location Field Label (i18n).
	 */
	geocodingFieldLabel : "Search a Location",
	
	/** api: config[geocodingFieldEmptyText]
	 * ``String``
	 * Text for the Geocoding Location Field Empty-Text (i18n).
	 */
	geocodingFieldEmptyText : "Type Location here...",
	
	/** api: config[geocodingFieldBtnAddTooltip]
	 * ``String``
	 * Text for the Geocoding Location Field Button Add Tooltip (i18n).
	 */
	geocodingFieldBtnAddTooltip : "Add Location to the List",
	
	/** api: config[geocodingFieldBtnDelTooltip]
	 * ``String``
	 * Text for the Geocoding Location Field Button Delete Tooltip (i18n).
	 */
	geocodingFieldBtnDelTooltip : "Clear Field",

	/** api: config[selectionSummary]
	 * ``String``
	 * Text for the Selection Summary (i18n).
	 */
	selectionSummary : "Selection Summary",

	/** api: config[geocoderSelectorsLabels]
	 * ``Array`` of ``String``
	 * Label text for the return types selection (i18n).
	 */
	geocoderSelectorsLabels: ['Geometry Union', 'Administrative Area List', 'Administrative Area Subs'],

	/** api: config[selectionReturnTypeLabel]
	 * ``String``
	 * Text for the return type selection (i18n).
	 */
	selectionReturnTypeLabel: "Return Type",

	// End i18n.

	initComponent : function() {
		// ///////////////////
		// Initialize data
		// ///////////////////
		var me = this;

		// i18n for geocoderSelectors
		if(this.geocoderSelectorsLabels && this.geocoderSelectors){
			for(var i = 0; i < this.geocoderSelectorsLabels.length; i++){
				if(this.geocoderSelectors[i]){
					this.geocoderSelectors[i].label = this.geocoderSelectorsLabels[i];
				}
			}	
		}

		// the map
		me.map = me.mapPanel.map;
		me.map.enebaleMapEvent = true;
		
		// default extent
		me.currentExtent = me.map.getExtent().toGeometry();

		// Return type options
		this.returnTypeFieldSet = new Ext.form.FieldSet({
			title : this.selectionReturnTypeLabel,
			autoWidth : true,
			layout : 'form',
			hidden: true,
			defaultType : 'numberfield',
			bodyStyle : 'padding:5px',
			defaults : {
				width : 255
			},
			items : [{
				xtype : 'combo',
				anchor : '100%',
				id : me.id  +'_returnType_id',
				ref : '../returnType',
				fieldLabel : this.comboSelectionMethodLabel,
				typeAhead : true,
				triggerAction : 'all',
				lazyRender : false,
				mode : 'local',
				name : 'roiReturnMethod',
				forceSelected : true,
				emptyText : this.comboEmptyText,
				allowBlank : false,
				autoLoad : true,
				displayField : 'label',
				valueField : 'value',
				value : 'default',
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
					data : this.geocoderSelectors
				}),
				listeners:{
					select : function(c, record, index) {
						var returnType = c.getValue();
						if(returnType == "subs"){
							var store = me.geocodingPanel.getStore();
							// clean grid store and geocoder drawings if already selected more than one
							if(store.data.items.length > 1){
								store.removeAll();
								me.geocoderDrawings.destroyFeatures();
							}
						}
					}
				}
			}]
		});

		// Selection method combo
		var selectionMethodCombo = {
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

						// Disable returnTypeFieldSet
						if(me.returnTypeFieldSet) {
							me.returnTypeFieldSet.hide();
							me.returnTypeFieldSet.disable();
						}

						if (outputValue == 'bbox') {
							/**
							 * RESET State
							 */
							me.removeFeatureSummary();
	
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
							
							if(me.geocodingFieldSet) {
								me.geocodingFieldSet.hide();
								me.geocodingFieldSet.disable();
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

							if(me.geocodingFieldSet) {
								me.geocodingFieldSet.hide();
								me.geocodingFieldSet.disable();
							}
	
							/**
							 * Create Polygon Selector
							 */
							me.drawings = new OpenLayers.Layer.Vector({}, 
							{
								displayInLayerSwitcher : false,
								styleMap : new OpenLayers.StyleMap({
									"default" : this.defaultStyle,
									"select" : this.selectStyle,
									"temporary" : this.temporaryStyle
								})
							});

							me.drawings.events.on({
								"featureadded" : function(event) {
									me.addFeatureSummary(outputValue, event.feature);
									me.setCurrentExtent(outputValue, event.feature);
								},
								"beforefeatureadded" : function(event) {
									me.drawings.destroyFeatures();
								}
							});
	
							me.map.addLayer(me.drawings);
	
							me.draw = new OpenLayers.Control.DrawFeature(me.drawings, OpenLayers.Handler.Polygon);
	
							// disable pan while drawing
							// TODO: make it configurable
							me.draw.handler.stopDown = true;
							me.draw.handler.stopUp = true;
	
							me.map.addControl(me.draw);
							me.draw.activate();
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

							if(me.geocodingFieldSet) {
								me.geocodingFieldSet.hide();
								me.geocodingFieldSet.disable();
							}
	
							/**
							 * Create Circle Selector
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

                            me.drawings.events.on({
                                "featureadded": function(event) {
									me.addFeatureSummary(outputValue, event.feature);
									me.setCurrentExtent(outputValue, event.feature);
                                },                                
                                "beforefeatureadded": function(event) {
                                    me.drawings.destroyFeatures();
                                }
                            });                                 
                        
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
	
							if(me.geocodingFieldSet) {
								me.geocodingFieldSet.hide();
								me.geocodingFieldSet.disable();
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
							if(me.geocodingFieldSet) {
								me.geocodingFieldSet.show();
								me.geocodingFieldSet.enable();
							}

							// and return type
							if(me.selectReturnType && me.returnTypeFieldSet) {
								me.returnTypeFieldSet.show();
								me.returnTypeFieldSet.enable();
							}
							
						} else {
							/**
							 * RESET State
							 */
							me.reset();
						}
					},
					scope : this
				}
			};

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
			this.setCurrentExtent('buffer', feature);
		}, this);
		
	    this.bufferFieldSet.on("bufferremoved", function(evt, feature){
			this.removeFeatureSummary();
		}, this);

		// //////////////////////////////////////////////////////////
		// The GeoCoder FieldSet and Panel
		// //////////////////////////////////////////////////////////
			//
	        // Create the data store
	        //
			var store = new Ext.data.ArrayStore({
	            fields: [
				   {name: 'check', type: 'bool'},
				   {name: 'location'},
				   {name: 'custom'},
	               {name: 'geometry'}
	            ]
	        });

			//
	        // The Location Grid Panel
	        //
			this.geocodingPanel = new Ext.grid.GridPanel({
				ref: 'geocodingPanel',
	            layout: 'fit',
	            store: store,
				bbar: {
					xtype: 'toolbar',
					items: [
						{
							tooltip: this.geocodingPanelBtnSelectAllTxt,
							ref: 'selectAllButton',
							cls: 'x-btn-text-icon',
							icon : 'theme/app/img/silk/check_all.png',
							scope: this,
							handler: function() {
								var store = this.geocodingPanel.getStore();
								var records = store.getRange();
								var size = store.getCount();
								
								for (var i = 0; i < size; i++) {
									var record = records[i];
		
									var checked = record.get("check");
									if (!checked) {
										record.set("check", true);
									}
								}
							}
						},
						{
							tooltip: this.geocodingPanelBtnDeSelectAllTxt,
							ref: 'selectAllButton',
							cls: 'x-btn-text-icon',
							icon : 'theme/app/img/silk/un_check_all.png',
							scope: this,
							handler: function() {
								var store = this.geocodingPanel.getStore();
								var records = store.getRange();
								var size = store.getCount();
								
								for (var i = 0; i < size; i++) {
									var record = records[i];
		
									var checked = record.get("check");
									if (checked) {
										record.set("check", false);
									}
								}
							}
						},
						'-',
						'->',
						{
							tooltip: this.geocodingPanelBtnRefreshTxt,
							ref: 'refreshButton',
							cls: 'x-btn-text-icon',
							icon : 'theme/app/img/geosilk/vector_add.png',
							scope: this,
							handler: function() {
								var store = this.geocodingPanel.getStore();
								var records = store.getRange();
								var size = store.getCount();
								
								if(me.geocoderDrawings) me.geocoderDrawings.destroyFeatures();
								
								for (var i = 0; i < size; i++) {
									var record = records[i];
		
									if (record && record.data.geometry) {
										var feature = OpenLayers.Geometry.fromWKT(record.data.geometry);
				
										if(!me.geocoderDrawings) {
											var vector_style = (JSON.parse(JSON.stringify(this.defaultStyle)));
											Ext.applyIf(vector_style, this.labelStyle);
											
									        me.geocoderDrawings = new OpenLayers.Layer.Vector("geocoder",
												{
													displayInLayerSwitcher:false,
													styleMap : new OpenLayers.StyleMap({
														"default"   : vector_style,
														"select"    : vector_style,
														"temporary" : this.temporaryStyle
													})
												}
											);
											me.geocoderDrawings.refresh({force:true});
									
									        me.map.addLayer(me.geocoderDrawings);
										}
										
						                // create some attributes for the feature
										var attributes = {name: record.data.location, label: record.data.location};
						                me.geocoderDrawings.addFeatures([new OpenLayers.Feature.Vector(feature, attributes)]);
									}
								}
							}
						},
						{
							tooltip: this.geocodingPanelBtnDestroyTxt,
							ref: 'destroyButton',
							cls: 'x-btn-text-icon',
							icon : 'theme/app/img/geosilk/vector_delete.png',
							scope: this,
							handler: function() {
								if(me.geocoderDrawings) {
									me.geocoderDrawings.destroyFeatures();
								}								
							}
						},
						'-',
						{
							ref: 'deleteButton',
							tooltip: this.geocodingPanelBtnDeleteTxt,
							iconCls: 'delete',
							scope: this,
							handler: function() {
								var store = this.geocodingPanel.getStore();
								var records = store.getRange();
								var size = store.getCount();
								
								var checkedRecords = [];
								
								for (var i = 0; i < size; i++) {
									var record = records[i];
		
									var checked = record.get("check");
									if (checked) {
										checkedRecords.push(record);
									}
								}

								if(checkedRecords.length > 0){
									Ext.Msg.show({
									   title: this.geocodingPanelMsgRemRunningTitle,
									   msg: this.geocodingPanelMsgRemRunningMsg,
									   buttons: Ext.Msg.OKCANCEL,
									   fn: function(btn){
											if(btn == 'ok'){
												store.remove(checkedRecords);

												if(me.geocoderDrawings) {
													me.geocoderDrawings.destroyFeatures();
												}

												var records = store.getRange();
												var size = store.getCount();

												for (var i = 0; i < size; i++) {
													var record = records[i];
						
													if (record && record.data.geometry) {
														var feature = OpenLayers.Geometry.fromWKT(record.data.geometry);
								
														if(!me.geocoderDrawings) {
															var vector_style = (JSON.parse(JSON.stringify(this.defaultStyle)));
															Ext.applyIf(vector_style, this.labelStyle);
															
													        me.geocoderDrawings = new OpenLayers.Layer.Vector("geocoder",
																{
																	displayInLayerSwitcher:false,
																	styleMap : new OpenLayers.StyleMap({
																		"default"   : vector_style,
																		"select"    : vector_style,
																		"temporary" : this.temporaryStyle
																	})
																}
															);
															me.geocoderDrawings.refresh({force:true});
													
													        me.map.addLayer(me.geocoderDrawings);
														}
														
										                // create some attributes for the feature
														var attributes = {name: record.data.location, label: record.data.location};
										                me.geocoderDrawings.addFeatures([new OpenLayers.Feature.Vector(feature, attributes)]);
													}
												}
											} 
										},
									   icon: Ext.MessageBox.WARNING,
									   scope: this
									});              
								}
								
								this.setCurrentExtent('geocoder', store);
							}
						}
					]
				},
	            columns: [
					{
						xtype: 'checkcolumn',
						header: '',
						dataIndex: 'check',
						width: 20
					}, {
	                    id       : 'location',
	                    header   : this.geocodingPanelLocationHeader, 
	                    width    : this.geocodingPanelLocationSize, 
	                    sortable : this.geocodingPanelLocationSortable, 
	                    dataIndex: 'location'
	                }, {
	                    id       : 'custom',
	                    header   : this.geocodingPanelCustomHeader,
	                    width    : this.geocodingPanelCustomSize, 
	                    sortable : this.geocodingPanelCustomSortable, 
	                    dataIndex: 'custom'
	                }, {
	                    id       : 'geometry',
	                    header   : this.geocodingPanelGeometryHeader, 
	                    width    : this.geocodingPanelGeometrySize, 
	                    sortable : this.geocodingPanelGeometrySortable, 
	                    dataIndex: 'geometry'
	                }
	            ],
	            height: 300,
	            title: this.geocodingPanelTitle,
	            scope: this
	        });
	        
			//
	        // The GeoCoder Search Field
	        //
	        var wfssearchboxConf = {
			    outputConfig:{
			    	mapPanel:this.mapPanel,
				 	url:this.wfsBaseURL,
				 	emptyText:this.geocodingFieldEmptyText,
				 	typeName:this.geocoderTypeName,
				 	recordModel:this.geocoderTypeRecordModel,
				 	sortBy:this.geocoderTypeSortBy,
				 	queriableAttributes:this.geocoderTypeQueriableAttributes,
				 	displayField:this.geocoderTypeDisplayField,
				 	pageSize:this.geocoderTypePageSize,
				 	tpl:this.geocoderTypeTpl
			  	}
			  	
            };
			var wfsComboBox = new gxp.form.WFSSearchComboBox(Ext.apply({
				listeners : {
					scope : this
				}
			}, wfssearchboxConf.outputConfig)); 

            
	        this.geocodingField = new Ext.form.CompositeField({		
				labelWidth: 110,
				items: [
	                /*{
	                    xtype     : 'textfield',
						ref       : "geocodingLocationField",	
						width     : 140,
						fieldLabel: this.geocodingFieldLabel,
	                    emptyText : this.geocodingFieldEmptyText,
	                    flex: 1
	                }*/
	               wfsComboBox,
	                {
	                    xtype   : 'button',
	                    tooltip : this.geocodingFieldBtnAddTooltip,
	                    iconCls : "execution-cls",
	                    width   : 23,
						scope   : this,
						handler : function(){
							//var execId = this.geocodingField.geocodingLocationField.getValue();
							//console.log(wfsComboBox.getValue() + " [" + wfsComboBox.getGeometry() + "]");
							var store = this.geocodingPanel.getStore();
							var records = store.getRange();
							var size = store.getCount();

							// output and  return types
							var outputValue = this.outputType.getValue();
							var returnType = this.returnType.getValue();

							// clean gri
							if(outputValue == "geocoder" && returnType == "subs"){
								me.geocodingPanel.getStore().removeAll();
							}
							
							var sameRecords = [];
							for(var i=0; i<size; i++){
								var record = records[i];
								
								var location = record.get("location");								

								// save parent
								var parent = record.get("parent");
								me.parentLocations[location] = parent;

								if(location === wfsComboBox.getValue()){
									sameRecords.push(record);
								}
							}
							
							if (sameRecords.length == 0) {
								if (wfsComboBox.getValue() && wfsComboBox.getGeometry()) {
									store.add(new store.recordType({
										location : wfsComboBox.getValue(),
										custom   : wfsComboBox.getCustom(),
										geometry : wfsComboBox.getGeometry()
									}));
									
									wfsComboBox.geometry = null;
									
									me.setCurrentExtent('geocoder', store);
								}
							}
						}
	                },{
	                    xtype   : 'button',
	                    tooltip : this.geocodingFieldBtnDelTooltip,
	                    iconCls : "execution-cls-delete",
	                    width   : 23,
						scope   : this,
						handler : function(){
							//this.geocodingField.geocodingLocationField.reset();
							wfsComboBox.reset();
						}
					}
				]
			});
		    
		    //
		    // The Full GeoCoder FieldSet
		    //
		    this.geocodingFieldSet = new Ext.form.FieldSet({
	            title: this.geocodingFieldSetTitle,
				autoHeight: 342,
				collapsed: false,
				hidden: true,
				listeners: {
					disable: function(){
						this.hide();
					},
					enable: function(){
						this.show();
					}
				},
				items: [
				    this.geocodingField,
					this.geocodingPanel
				]
	        });
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
			items : [selectionMethodCombo]
		},
		me.returnTypeFieldSet,
		me.spatialFieldSet,
		me.bufferFieldSet,
		me.geocodingFieldSet];

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
				if(me.geocoderDrawings) {
					me.geocoderDrawings.destroyFeatures();
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

		if (me.aoiButton && me.aoiButton.pressed) {
			me.aoiButton.toggle();
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

		if(me.geocodingFieldSet) {
			me.geocodingFieldSet.hide();
			me.geocodingFieldSet.disable();
			me.geocodingPanel.getStore().loadData([],false);
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
		if(me.geocoderDrawings) {
			me.geocoderDrawings.destroyFeatures();
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
		});
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

	// selected areas
	selectedAreas:[],

	// parent locations
	parentLocations: {},
	
	/**
	 * api: method[setCurrentExtent]
	 */
	setCurrentExtent : function(outputValue, obj) {
		// clean selected areas
		this.selectedAreas = [];

		var me = this;
		var geometry;
		if ( obj instanceof OpenLayers.Bounds) {
			geometry = obj.toGeometry();
		} else if ( obj instanceof OpenLayers.Feature.Vector) {
			geometry = obj.geometry.clone();
		} else if (outputValue == 'geocoder' && obj) {
			var store = obj;
			var records = store.getRange();
			var size = store.getCount();
			
			if(me.geocoderDrawings) me.geocoderDrawings.destroyFeatures();

			if (size == 1) {
				var record = records[0];
				if (record && record.data.geometry) {
					var feature = OpenLayers.Geometry.fromWKT(record.data.geometry);
					geometry = feature;

					if(!me.geocoderDrawings) {
						var vector_style = (JSON.parse(JSON.stringify(this.defaultStyle)));
						Ext.applyIf(vector_style, this.labelStyle);
						
				        me.geocoderDrawings = new OpenLayers.Layer.Vector("geocoder",
							{
								displayInLayerSwitcher:false,
								styleMap : new OpenLayers.StyleMap({
									"default"   : vector_style,
									"select"    : vector_style,
									"temporary" : this.temporaryStyle
								})
							}
						);
						me.geocoderDrawings.refresh({force:true});
				
				        me.map.addLayer(me.geocoderDrawings);
					}
					
	                // create some attributes for the feature
					var attributes = {name: record.data.location, label: record.data.location};

					// save element data
					me.selectedAreas.push(record.data);

	                me.geocoderDrawings.addFeatures([new OpenLayers.Feature.Vector(geometry.clone(), attributes)]);
				}
			} else {
				var geoms = [];
				for(var i=0; i<size; i++){
					var record = records[i];
					if (record && record.data.geometry) {
						var feature = OpenLayers.Geometry.fromWKT(record.data.geometry);
						geoms.push(feature);

						if(!me.geocoderDrawings) {
							var vector_style = (JSON.parse(JSON.stringify(this.defaultStyle)));
							Ext.applyIf(vector_style, this.labelStyle);
							
					        me.geocoderDrawings = new OpenLayers.Layer.Vector("geocoder",
								{
									displayInLayerSwitcher:false,
									styleMap : new OpenLayers.StyleMap({
										"default"   : vector_style,
										"select"    : vector_style,
										"temporary" : this.temporaryStyle
									})
								}
							);
							me.geocoderDrawings.refresh({force:true});
					
					        me.map.addLayer(me.geocoderDrawings);
						}
						
		                // create some attributes for the feature
						var attributes = {name: record.data.location, label: record.data.location};

						// save element data
						me.selectedAreas.push(record.data);

		                me.geocoderDrawings.addFeatures([new OpenLayers.Feature.Vector(feature.clone(), attributes)]);
					}
				}
				
				geometry = null;
				me.WPSUnionGeometriesRequest(geoms);
				return;
			}
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

			if (me.zoomToCurrentExtent) {
				var dataExtent = me.currentExtent.toGeometry().getBounds();
				me.map.zoomToExtent(dataExtent, closest=false);
			}
			
			//change the extent projection if it differs from spatialOutputCRS
			if (me.map.getProjection() != me.spatialOutputCRS) {
				me.currentExtent.transform(me.map.getProjectionObject(), new OpenLayers.Projection(me.spatialOutputCRS));
			}
			me.currentExtent = me.currentExtent.toGeometry();
		} else if (geometry) {
			me.currentExtent = geometry;

			if (me.zoomToCurrentExtent || outputValue == 'geocoder' || outputValue == 'wps') {
				var dataExtent = me.currentExtent.getBounds();
				me.map.zoomToExtent(dataExtent, closest=false);
			}

			//change the extent projection if it differs from spatialOutputCRS
			if (me.map.getProjection() != me.spatialOutputCRS) {
				me.currentExtent.transform(me.map.getProjectionObject(), new OpenLayers.Projection(me.spatialOutputCRS));
			}
		} else {
			me.currentExtent = (JSON.parse(JSON.stringify(me.map.getExtent())));

			if (me.zoomToCurrentExtent) {
				var dataExtent = me.currentExtent.toGeometry().getBounds();
				me.map.zoomToExtent(dataExtent, closest=false);
			}

			//change the extent projection if it differs from spatialOutputCRS
			if (me.map.getProjection() != me.spatialOutputCRS) {
				me.currentExtent.transform(me.map.getProjectionObject(), new OpenLayers.Projection(me.spatialOutputCRS));
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
	},
	//// //////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//// //////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////
	////
	////
	//// //////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//// //////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 *
	 */
	handleRequestStart : function() {
		if (!this.loadingMask)
			this.loadingMask = new Ext.LoadMask(Ext.get(this.loadingMaskId), 'Loading..');
		if (this.loadingMask)
			this.loadingMask.show();
	},

	/**
	 *
	 */
	handleRequestStop : function() {
		if (!this.loadingMask)
			this.loadingMask = new Ext.LoadMask(Ext.get(this.loadingMaskId), 'Loading..');
		if (this.loadingMask)
			this.loadingMask.hide();
	},
	
	/**
	 * WPS Union Process Call...
	 */
	WPSUnionGeometriesRequest : function(geoms) {
		var me = this;

		var inputs = {
			geom : []
		};

		for (var i = 0; i < geoms.length; i++) {
			inputs.geom.push(new OpenLayers.WPSProcess.ComplexData({
				value : geoms[i].toString(),
				mimeType : 'application/wkt'
			}));
		}

		var requestObject = {
			type : "raw",
			inputs : inputs,
			outputs : [{
				identifier : "result",
				mimeType : "application/wkt"
			}]
		};
		
		me.handleRequestStart();
		
		me.wpsManager.execute(me.wpsUnionProcessID, requestObject, me.setUnionExtent, this);
	},
	
 	/**
	 *
	 */
	setUnionExtent : function(responseText) {
		this.handleRequestStop();

		this.setCurrentExtent('wps', new OpenLayers.Format.WKT().read(responseText));
	},
	
 	/**
	 * Obtain selected zone
	 */
	getSelectedAreas : function() {
		var selectedAreas = this.currentExtent;
		var outputValue = this.outputType.getValue();
		var returnType = this.returnType.getValue();
		if (outputValue == 'geocoder') {
			if(returnType == 'subs' || returnType == 'list'){
				selectedAreas = "";
				for(var i = 0; i< this.selectedAreas.length; i++){
					selectedAreas += this.selectedAreas[i].location + this.selectedAreaParentSeparator + this.selectedAreas[i].custom;
					if(i < this.selectedAreas.length -1){
						selectedAreas += this.selectedAreasSeparator;
					}
				}
			}
		}
		return selectedAreas;
	}
	
});
Ext.reg(gxp.widgets.form.SpatialSelectorField.prototype.xtype, gxp.widgets.form.SpatialSelectorField);
