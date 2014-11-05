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
 *  module = gxp.widgets.form.spatialselector
 *  class = GeocoderSpatialSelectorMethod
 */

/** api: (extends)
 *  widgets/form/spatialselector/SpatialSelectorMethod.js
 */
Ext.namespace('gxp.widgets.form.spatialselector');

/** api: constructor
 *  .. class:: GeocoderSpatialSelectorMethod(config)
 *
 *    Plugin for spatial selection based on WFS search combobox
 */
gxp.widgets.form.spatialselector.GeocoderSpatialSelectorMethod = Ext.extend(gxp.widgets.form.spatialselector.SpatialSelectorMethod, {

	/* xtype = gxp_spatial_geocoding_selector */
	xtype : 'gxp_spatial_geocoding_selector',

	/** api: config[name]
	 *  ``String``
	 *  Name to show on the combo box of the spatial selected.
	 */
	name  : 'Geocoding',

	/** api: config[label]
	 *  ``String``
	 *  Label to show on the combo box of the spatial selected.
	 */
	label : 'Geocoding',

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

	/** api: config[wfsBaseURL]
	 *  ``String``
	 *  WFS Base URL .
	 */
	wfsBaseURL : "http://localhost:8080/geoserver/wfs?",

	/** api: config[geocoderTypeName]
	 *  ``String``
	 *  geocoderTypeName .
	 */
	geocoderTypeName : "it.geosolutions:geocoder_limits",

	/** api: config[geocoderTypeTpl]
	 *  ``String``
	 *  geocoderTypeTpl .
	 */
	geocoderTypeTpl : "<tpl for=\".\"><hr><div class=\"search-item\"><h3>{name}</span></h3>{custom}</div></tpl>",

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

	parentLocations:{},

	/** api: config[wpsUnionProcessID]
	 *  ``String``
	 *  ID of the WPS Union Process .
	 */
	wpsUnionProcessID : 'JTS:union',

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

	/** api: config[wpsManagerID]
	 *  ``String``
	 *  Id of the WPS Manager to be used for the union. If it's null, or the tool is not found, it will disable the multiple selection
	 */
	wpsManagerID: "wpsManager",

	/** api: config[multipleSelection]
	 *  ``Boolean``
	 *  Append a grid and allow multiple WFS record selections. It needs a WPS manager configured.
	 */
	multipleSelection: true,

	/** api: config[searchComboOutputFormat]
	 *  ``String``
	 *  Output format for the WFS search combo request
	 */
	searchComboOutputFormat: 'application/json',

    /** api: method[initComponent]
     */
    initComponent: function() {

    	var me = this;

    	this.wpsManager = this.target.tools[this.wpsManagerID];

    	if(!this.wpsManager){
    		this.multipleSelection = false;
    	}

    	me.map = me.target.mapPanel.map;

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

		// if the multipleSelection is disabled, we don't need the geocodingPanel
        if(this.multipleSelection){
			//
	        // The Location Grid Panel
	        //
			this.geocodingPanel = new Ext.grid.GridPanel({
	            // layout: 'fit',
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
											//var vector_style = (JSON.parse(JSON.stringify(this.defaultStyle)));
											var vector_style = this.defaultStyle;
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
															//var vector_style = (JSON.parse(JSON.stringify(this.defaultStyle)));
															var vector_style = this.defaultStyle;
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

												this.setCurrentExtent('geocoder', store);
											} 
										},
									   icon: Ext.MessageBox.WARNING,
									   scope: this
									});              
								}
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
        }

		//
        // The GeoCoder Search Field
        //
        var wfssearchboxConf = {
		    outputConfig:{
		    	mapPanel:this.target.mapPanel,
			 	url:this.wfsBaseURL,
			 	emptyText:this.geocodingFieldEmptyText,
			 	typeName:this.geocoderTypeName,
			 	recordModel:this.geocoderTypeRecordModel,
			 	sortBy:this.geocoderTypeSortBy,
			 	queriableAttributes:this.geocoderTypeQueriableAttributes,
			 	displayField:this.geocoderTypeDisplayField,
			 	pageSize:this.geocoderTypePageSize,
			 	tpl:this.geocoderTypeTpl,
			 	outputFormat:this.searchComboOutputFormat
		  	}
        };
		var wfsComboBox = new gxp.form.WFSSearchComboBox(Ext.apply({
			listeners : {
				scope : this
			}
		}, wfssearchboxConf.outputConfig)); 
		this.wfsComboBox = wfsComboBox;

		if(this.multipleSelection){
			this.geocodingField = new Ext.form.CompositeField({
	        	// layout: 'form',
				labelWidth: 110,
				items: [
	               wfsComboBox,
	                {
	                    xtype   : 'button',
	                    tooltip : this.geocodingFieldBtnAddTooltip,
	                    iconCls : "execution-cls",
	                    width   : 23,
						scope   : this,
						handler : this.onBtnAdd
					},{
	                    xtype   : 'button',
	                    tooltip : this.geocodingFieldBtnDelTooltip,
	                    iconCls : "execution-cls-delete",
	                    width   : 23,
						scope   : this,
						handler : function(){
							wfsComboBox.reset();
							if(!this.multipleSelection){
								this.reset();
							}
						}
					}
				]
			});	
		}else{
			this.geocodingField = new Ext.form.CompositeField({
				labelWidth: 110,
				items: [
	               wfsComboBox
				]
			});	
			this.geocodingField = wfsComboBox;
			wfsComboBox.on("select", this.onBtnAdd, this);
		}
        

        // items could be the geocoding combo or this one and the geocodingPanel if the multiple selection is enabled
		var items = [this.geocodingField]
		var layout = null;
		if(this.multipleSelection){
			items.push(this.geocodingPanel);
			layout = "anchor";
		}else{
			layout = "fit";
		}

	    //
	    // The Full GeoCoder FieldSet
	    //
	    this.geocodingFieldSet = new Ext.form.FieldSet({
            title: this.name,
			collapsed: false,
			layout: layout,
			listeners: {
				disable: function(){
					this.hide();
				},
				enable: function(){
					this.show();
				}
			},
			items: items
        });

        this.output = this.geocodingFieldSet;

    	this.items = [this.output];

        gxp.widgets.form.spatialselector.GeocoderSpatialSelectorMethod.superclass.initComponent.call(this);
    },

	/**
	 * api: method[onBtnAdd]
	 * Handler for add button of the WFS combo box.
	 */
    onBtnAdd: function(){
    	var wfsComboBox = this.wfsComboBox;
		var store = wfsComboBox.store;
		var records = store.getRange();
		var size = store.getCount();

		var sameRecords = [];
		for(var i=0; i<size; i++){
			var record = records[i];

			var location = record.get("geometry");								

			// save parent
			var parent = record.get("custom");
			this.parentLocations[location] = parent;

			if(location === wfsComboBox.getValue()){
				sameRecords.push(record);
			}
		}

		if (sameRecords.length == 0) {
			var data = {
				location : wfsComboBox.getValue(),
				custom   : wfsComboBox.getCustom ? wfsComboBox.getCustom(): null,
				geometry : wfsComboBox.getGeometry()
			};
			if (wfsComboBox.getValue() && wfsComboBox.getGeometry()) {
				if(this.multipleSelection){
					this.geocodingPanel.store.add(new store.recordType(data));
					wfsComboBox.geometry = null;
					this.setCurrentExtent('geocoder', this.geocodingPanel.store);
				}else{
					// clean selected areas
					this.selectedAreas = [];
					var wktGeometry = data.geometry;
					if(!this.geocoderDrawings) {
						//var vector_style = (JSON.parse(JSON.stringify(this.defaultStyle)));
						var vector_style = this.defaultStyle;
						Ext.applyIf(vector_style, this.labelStyle);

				        this.geocoderDrawings = new OpenLayers.Layer.Vector("geocoder",
							{
								displayInLayerSwitcher:false,
								styleMap : new OpenLayers.StyleMap({
									"default"   : vector_style,
									"select"    : vector_style,
									"temporary" : this.temporaryStyle
								})
							}
						);
						this.geocoderDrawings.refresh({force:true});

				        this.map.addLayer(this.geocoderDrawings);
					}else{
						this.geocoderDrawings.removeAllFeatures();
					}

	                // create some attributes for the feature
					var attributes = {name: data.location, label: data.location};

					var geometry = new OpenLayers.Format.WKT().read(wktGeometry).geometry;

					// save element data
					this.selectedAreas.push(data);

	                this.geocoderDrawings.addFeatures([new OpenLayers.Feature.Vector(geometry.clone(), attributes)]);

	                // set current Geometry
					this.setCurrentGeometry(geometry);
				}
			}
		}
    },

	/**
	 * api: method[setCurrentExtent]
	 */
	setCurrentExtent : function(outputValue, obj) {

		var me = this;
		var geometry;
		if (outputValue == 'geocoder' && obj) {
			// clean selected areas
			this.selectedAreas = [];

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
						//var vector_style = (JSON.parse(JSON.stringify(this.defaultStyle)));
						var vector_style = this.defaultStyle;
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

	                // set current Geometry
					this.setCurrentGeometry(new OpenLayers.Format.WKT().read(record.data.geometry).geometry);
				}
			} else {
				var geoms = [];
				for(var i=0; i<size; i++){
					var record = records[i];
					if (record && record.data.geometry) {
						var feature = OpenLayers.Geometry.fromWKT(record.data.geometry);
						geoms.push(feature);

						if(!me.geocoderDrawings) {
							//var vector_style = (JSON.parse(JSON.stringify(this.defaultStyle)));
							var vector_style = this.defaultStyle;
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
	},

	/**
	 *
	 */
	handleRequestStart : function() {
		if (!this.loadingMask && this.loadingMaskId)
			this.loadingMask = new Ext.LoadMask(Ext.get(this.loadingMaskId), 'Loading..');
		if (this.loadingMask)
			this.loadingMask.show();
	},

	/**
	 *
	 */
	handleRequestStop : function() {
		if (!this.loadingMask && this.loadingMaskId)
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

		me.wpsManager.execute(me.wpsUnionProcessID, requestObject, me.setUnionExtent, null, this);
	},

 	/**
	 *
	 */
	setUnionExtent : function(responseText) {
		this.handleRequestStop();

		this.setCurrentGeometry(new OpenLayers.Format.WKT().read(responseText).geometry);
	},

	/** api: method[deactivate]
     *  Trigger action when deactivate the plugin
	 */
	deactivate: function(){
		gxp.widgets.form.spatialselector.GeocoderSpatialSelectorMethod.superclass.deactivate.call(this);
		if(this.geocoderDrawings){
			this.geocoderDrawings.removeAllFeatures();
		}
	},						

    // Reset method
    reset: function(){
		gxp.widgets.form.spatialselector.GeocoderSpatialSelectorMethod.superclass.reset.call(this);
		if(this.geocoderDrawings){
			this.geocoderDrawings.removeAllFeatures();
		}
		this.setCurrentGeometry(null);
    }
});

Ext.reg(gxp.widgets.form.spatialselector.GeocoderSpatialSelectorMethod.prototype.xtype, gxp.widgets.form.spatialselector.GeocoderSpatialSelectorMethod);