/*  Copyright (C) 2007 - 2012 GeoSolutions S.A.S.
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
 *  class = ChangeMatrix
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: ChangeMatrix(config)
 *
 *    Show a change matrix of changes between two rasters
 */
gxp.plugins.ChangeMatrix = Ext.extend(gxp.plugins.Tool, {

	/** api: ptype = gxp_changematrix */
	ptype : "gxp_changematrix",

	/** api: config[id]
	 *  ``String``
	 *
	 */
	id : "changeMatrixTool",
	
	/** api: config[changeMatrixMenuText]
	 *  ``String``
	 *  Text for add menu item (i18n).
	 */
	//changeMatrixMenuText: "Add Group", // serve?

	/** api: config[changeMatrixActionTip]
	 *  ``String``
	 *  Text for add action tooltip (i18n).
	 */
	changeMatrixActionTip : "Get a change matrix for a raster layer",

	/** api: config[changeMatrixDialogTitle]
	 *  ``String``
	 *  Title of the changeMatrix form window (i18n).
	 */
	changeMatrixDialogTitle : "Change matrix",

	/** api: config[changeMatrixClassesFieldLabel]
	 *  ``String``
	 *  Text for the Classes field label (i18n).
	 */
	changeMatrixClassesFieldLabel : "Classes",

	/** api: config[changeMatrixRasterFieldLabel]
	 *  ``String``
	 *  Text for the Raster field label (i18n).
	 */
	changeMatrixRasterFieldLabel : "Raster Layer",

	/** api: config[changeMatrixCQLFilterT0FieldLabel]
	 *  ``String``
	 *  Text for the CQL Filter T0 field label (i18n).
	 */
	changeMatrixCQLFilterT0FieldLabel : "Time Filter (reference)",

	/** api: config[changeMatrixCQLFilterT1FieldLabel]
	 *  ``String``
	 *  Text for the CQL Filter T1 field label (i18n).
	 */
	changeMatrixCQLFilterT1FieldLabel : "Time Filter (current)",

	/** api: config[changeMatrixResetButtonText]
	 *  ``String``
	 *  Text for the changeMatrix form submit button (i18n).
	 */
	changeMatrixSubmitButtonText : "Submit",

	/** api: config[changeMatrixResetButtonText]
	 *  ``String``
	 *  Text for the changeMatrix form reset button (i18n).
	 */
	changeMatrixResetButtonText : "Reset",

	/** api: config[changeMatrixResultsTitle]
	 *  ``String``
	 *  Text for the changeMatrix results container (i18n).
	 */
	changeMatrixResultsTitle : "Change Matrix",

	// form errors
	/** api: config[changeMatrixEmptyLayer]
	 *  ``String``
	 *  Form validation messages: No layers selected (i18n).
	 */
	changeMatrixEmptyLayer : "Please select a raster layer",

	/** api: config[changeMatrixEmptyFilter]
	 *  ``String``
	 *  Form validation messages: Empty filter (i18n).
	 */
	changeMatrixEmptyFilter : "Please specify both time filters",

	/** api: config[changeMatrixEmptyClassesDialogTitle]
	 *  ``String``
	 *  Form validation messages: No classes selected (dialog title) (i18n).
	 */
	changeMatrixEmptyClassesDialogTitle : "Error",

	/** api: config[changeMatrixEmptyClassesDialogText]
	 *  ``String``
	 *  Form validation messages: No classes selected (dialog content) (i18n).
	 */
	changeMatrixEmptyClassesDialogText : "Please select at least one class",

	/** api: config[changeMatrixEmptyClassesDialogTitle]
	 *  ``String``
	 *  Form validation messages: No classes selected (dialog title) (i18n).
	 */
	changeMatrixInvalidFormDialogTitle : "Error",

	/** api: config[changeMatrixInvalidFormDialogText]
	 *  ``String``
	 *  Form validation messages: No classes selected (dialog content) (i18n).
	 */
	changeMatrixInvalidFormDialogText : "All ChangeMatrix Inputs are mandatory!",

	/** api: config[changeMatrixTimeoutDialogTitle]
	 *  ``String``
	 *  Form validation messages: No classes selected (dialog content) (i18n).
	 */
	changeMatrixTimeoutDialogTitle : "Timeout",

	/** api: config[changeMatrixTimeoutDialogText]
	 *  ``String``
	 *  Form validation messages: No classes selected (dialog content) (i18n).
	 */
	changeMatrixTimeoutDialogText : "Request Timeout",

	/** api: config[changeMatrixResponseErrorDialogTitle]
	 *  ``String``
	 *  Error parsing the JSON response from the wps service (dialog title) (i18n).
	 */
	changeMatrixResponseErrorDialogTitle : "Error",

	/** api: config[changeMatrixResponseErrorDialogText]
	 *  ``String``
	 *  Error parsing the JSON response from the wps service (dialog content) (i18n).
	 */
	changeMatrixResponseErrorDialogText : "There was an error processing the request.",

	/** api: config[renderToTab]
	 *  ``Boolean``
	 *  Whether or not render to a Tab. Applies only on Tab enabled View (see MapStore config)
	 */
	renderToTab : true,
	
	/** api: config[wfsChangeMatrisGridPanel]
	 *  ``String``
	 *  Timeout for the WPS request
	 */
	wfsChangeMatrisGridPanel: null,
	
	/** api: config[requestTimeout]
	 *  ``Integer``
	 *  Timeout for the WPS request
	 */
	requestTimeout : 5000,

	/** api: config[rasterLayers]
	 *  ``String[]``
	 *  Array of available raster layers.
	 */
	rasterLayers : null,

	/** api: config[classesIndexes]
	 *  ``String[]``
	 *  Array of classesIndexes.
	 */
	classesIndexes : null,

	/** api: config[classes]
	 *  ``Object``
	 *  Array of classes.
	 */
	classes : null,

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

	/** api: config[wfsBaseURL]
	 *  ``String``
	 *  WFS Base URL .
	 */
	wfsBaseURL : "http://localhost:8180/geoserver/wfs?",

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
	
	// //////////////////////////////////////////////////////////////
	// END - GeoCoding Panel Config
	// //////////////////////////////////////////////////////////////
			
	/** api: config[storeName]
	 *  ``String``
	 *  Store Name for WFS logging on Change Matrix Process .
	 */
	storeName : null,
	
	/** api: config[typeName]
	 *  ``String``
	 *  Type Name for WFS logging on Change Matrix Process .
	 */
	typeName : null,
	
	/** api: config[jiffleStyle]
	 *  ``String``
	 *  Jiffle Style for the Raster returned by the Change Matrix Process .
	 */
	jiffleStyle : null,
	
	//private

	/** api: config[layerStore]
	 *  ``Object``
	 */
	layerStore : null,

	/** api: config[timeValuesStore]
	 *  ``Object``
	 */
	timeValuesStore : null,

	/** api: config[selectedLayer]
	 *  ``Object``
	 */
	selectedLayer : null,
	
	/** api: config[showSelectionSummary]
	 *  ``Boolean``
	 */
	showSelectionSummary: true,

	/** api: config[zoomToCurrentExtent]
	 *  ``Boolean``
	 */
	zoomToCurrentExtent: true,

	/** api: config[geodesic]
	 *  ``Boolean``
	 */
	geodesic: true,
	
	/** api: config[spatialOutputCRS]
	 *  ``String``
	 */
	spatialOutputCRS: "EPSG:4326",
	
	/** api: config[style]
	 *  ``Object``
	 */
	defaultStyle : {
	  "strokeColor": "#ee9900",
	  "fillColor": "#ee9900",
	  "fillOpacity": 0.4,
	  "strokeWidth": 1
	},
	
	/** api: config[selectStyle]
	 *  ``Object``
	 */
	selectStyle : {
	  "strokeColor": "#ee9900",
	  "fillColor": "#ee9900",
	  "fillOpacity": 0.4,
	  "strokeWidth": 1
	},

	temporaryStyle : {
		"pointRadius": 6,
		"fillColor": "#FF00FF",
		"strokeColor": "#FF00FF",
		"label": "Select",
		"graphicZIndex": 2
	},

	labelStyle : {
		'fontColor': '#a52505',
		'fontSize': "14px",
		'fontFamily': "Courier New, monospace",
		'fontWeight': "bold",
		'label': '${label}',
		'labelOutlineColor': "white",
		'labelOutlineWidth': 5
	},
	
	// Begin i18n.

	/** api: config[chgMatrixFieldSetTitle]
	 * ``String``
	 * Text for empty Combo Selection Method (i18n).
	 */
	chgMatrixFieldSetTitle : 'Change Matrix Inputs',

	/** api: config[scatterChartTabTitle]
	 * ``String``
	 * Text for Scatter Chart Tab Panel (i18n).
	 */
	scatterChartTabTitle : "Scatter Chart",

	/** api: config[pieChartMenuLabel]
	 * ``String``
	 * Text for the Change Matrix Grid Menu Label (i18n).
	 */
	pieChartMenuLabel : "Print Pie Chart",
	
	/** api: config[interactiveChgMatrixLabel]
	 * ``String``
	 * Text for the Change Matrix Menu Label (i18n).
	 */
	interactiveChgMatrixLabel : "Interactive Change Matrix",
	
	/** api: config[pieChartTabTitle]
	 * ``String``
	 * Text for Pie Chart Tab Panel (i18n).
	 */
	pieChartTabTitle : "Pie Chart",
	
	/** api: config[scatterChartTitle]
	 * ``String``
	 * Text for Scatter Chart Main Title (i18n).
	 */
	scatterChartTitle : "Reference Versus Current Classes",

	/** api: config[scatterChartSubTitle]
	 * ``String``
	 * Text for Scatter Chart Sub Title (i18n).
	 */
	scatterChartSubTitle : " - ChangeMatrix Process - ",

	/** api: config[scatterChartYAxisLabel]
	 * ``String``
	 * Text for Scatter Chart Y-Axis (i18n).
	 */
	scatterChartYAxisLabel : "Current",

	/** api: config[scatterChartXAxisLabel]
	 * ``String``
	 * Text for Scatter Chart X-Axis (i18n).
	 */
	scatterChartXAxisLabel : "Reference",
	
	// End i18n.

	win : null,
	formPanel : null,
	wpsManager : null,
	resultWin : null,
	loadingMask : null,
	errorTimer : null,
	roiFieldSet : null,

	/**
	 *
	 */
	init : function(target) {
		//get a reference to the wpsManager
		this.wpsManager = target.tools[this.wpsManagerID];

		return gxp.plugins.ChangeMatrix.superclass.init.apply(this, arguments);

	},

	/** private: method[addOutput]
	 *  :arg config: ``Object``
	 */
	addOutput : function(config) {
		// /////////////////////////////////////
		// Stores Array stores definitions.
		// /////////////////////////////////////
		this.layerStore = new Ext.data.ArrayStore({
			fields : ["source", "title", "name", "olid", "crs", "uuid", "times", {
				name : "isLayerGroup",
				type : 'boolean'
			}],
			data : []
		});

		this.timeValuesStore = new Ext.data.ArrayStore({
			fields : ["time"],
			data : []
		});

		// ///////////////////
		// Initialize data
		// ///////////////////
		var me = this;

		/*var rasterLayersStoreData = [];
		for(var i = 0; i < this.rasterLayers.length; i++) {
		rasterLayersStoreData.push([this.rasterLayers[i]]);
		}*/

		// ///////////////
		// ItemSelector
		// ///////////////
		/*var classesData = [];
		for(var i = 0; i < this.classes.length; i++) {
		classesData.push([this.classes[i]]);
		}
		var classesStore = new Ext.data.ArrayStore({
		fields: ['name'],
		data: classesData,
		sortInfo: {
		field: 'name',
		direction: 'ASC'
		}
		});
		var selectedClassesStore = new Ext.data.ArrayStore({
		fields: ['name'],
		data: [],
		sortInfo: {
		field: 'name',
		direction: 'ASC'
		}
		});*/

		// ///////////////
		// ItemSelector Ex
		// ///////////////
		var data = [];

		// the map
		var map = this.target.mapPanel.map;
		map.enebaleMapEvent = true;

		me.roiFieldSet = {
				ref: 'roiFieldSet',
				xtype:'gxp_spatial_selector_field',
				mapPanel: this.target.mapPanel,
				loadingMaskId: 'change-matrix-form-panel',
				wpsManager: this.wpsManager,
				wpsUnionProcessID: this.wpsUnionProcessID,
				wpsBufferProcessID: this.wpsBufferProcessID,
				wfsBaseURL: this.wfsBaseURL,
				spatialOutputCRS: this.spatialOutputCRS,
				showSelectionSummary: this.showSelectionSummary,
				zoomToCurrentExtent: this.zoomToCurrentExtent,
				defaultStyle: this.defaultStyle,
				selectStyle: this.selectStyle,
				temporaryStyle: this.temporaryStyle,
				labelStyle: this.labelStyle,
				bufferOptions: this.bufferOptions,
				geocoderTypeName: this.geocoderTypeName,
				geocoderTypeTpl: this.geocoderTypeTpl,
				geocoderTypeRecordModel: this.geocoderTypeRecordModel,
				geocoderTypeSortBy: this.geocoderTypeSortBy,
				geocoderTypeQueriableAttributes: this.geocoderTypeQueriableAttributes,
				geocoderTypeDisplayField: this.geocoderTypeDisplayField,
				geocoderTypePageSize: this.geocoderTypePageSize
		};
		
		// ///////////////////
		// The main form
		// ///////////////////
		this.chgMatrixForm = new Ext.form.FormPanel({
			id : 'change-matrix-form-panel',
			width : 355,
			height : 380,
			autoScroll : true,
			labelAlign : 'top',
			
			items : [{
				title : this.chgMatrixFieldSetTitle,
				xtype : 'fieldset',
				autoWidth : true,
				collapsible : true,
				layout : 'form',
				defaultType : 'numberfield',
				bodyStyle : 'padding:5px',
				defaults : {
					width : 200
				},
				items : [{
					xtype : "combo",
					id   : 'rasterComboBox',
					name : 'raster',
					fieldLabel : this.changeMatrixRasterFieldLabel,
					lazyInit : true,
					mode : 'local',
					triggerAction : 'all',
					store : this.layerStore,
					emptyText : "Select an item ...",
					labelSeparator : ':' + '<span style="color: #918E8F; padding-left: 2px;">*</span>',
					editable : true,
					resizable : true,
					allowBlank : false,
					readOnly : false,
					valueField : 'name',
					displayField : 'title',
					validator : function(value) {
						if (Ext.isEmpty(value))
							return me.changeMatrixEmptyLayer;
						return true;
					},
					listeners : {
						scope : this,
						keyup : function(field) {
							var me = this, value = field.getValue();

							/*if (me.layerTimeout)
								clearTimeout(me.layerTimeout);*/

							if (value) {
								me.layerTimeout = setTimeout(function() {
									me.layerStore.filterBy(function(rec, recId) {
										var name = rec.get("name").trim().toLowerCase();
										if (name.indexOf(value) > -1) {
											me.formPanel.layerCombo.expand();
											return true;
										} else {
											return false;
										}
									});
								}, 100);
							} else {
								me.layerStore.clearFilter();
							}
						},
						beforeselect : function(combo, record, index) {
							me.chgMatrixForm.roiFieldSet.removeFeatureSummary();
							me.chgMatrixForm.roiFieldSet.reset();
							me.chgMatrixForm.roiFieldSet.collapse();
							me.chgMatrixForm.getForm().reset();
						},
						select : function(combo, record, index) {
							// //////////////////////////////////////////////////
							// Populate time filters combo boxes.
							// //////////////////////////////////////////////////
							var data = [];
							if (record.get('times') && !Ext.isEmpty(record.get('times'))) {
								var times = record.get('times').split(',');
								for (var i = 0; i < times.length; i++) {
									var recordData = ["time = '" + times[i] + "'"];
									data.push(recordData);
								}
							}

							this.timeValuesStore.removeAll();
							this.timeValuesStore.loadData(data, false);

							// //////////////////////////////////////////////////
							// Populate the itemselector classes
							// //////////////////////////////////////////////////
							var itemClassSelector = Ext.getCmp('classesselector');
							itemClassSelector.storeTo.removeAll();
							itemClassSelector.storeFrom.removeAll();
							var classDataIndex = 0;
							for ( classDataIndex = 0; classDataIndex < me.classes.length; classDataIndex++) {
								if (me.classes[classDataIndex].layer == record.get('name'))
									break;
							}
							if (classDataIndex < me.classes.length) {
								var classesDataStore = [];

								for (var cc=0;cc<me.classes[classDataIndex].values.length;cc++) {
									for (var ci=0;ci<me.classesIndexes[me.classes[classDataIndex].level-1][1].length;ci++) {
										if (me.classesIndexes[me.classes[classDataIndex].level-1][1][ci][0] == me.classes[classDataIndex].values[cc])
											classesDataStore.push(me.classesIndexes[me.classes[classDataIndex].level-1][1][ci]);
									}
								}

								itemClassSelector.storeFrom.loadData(classesDataStore, false);
							}
						},
						beforequery : function() {
							this.reloadLayers();
						}
					}
				}, {
					xtype : "combo",
					id   : 'filterT0ComboBox',
					name : 'filterT0',
					fieldLabel : this.changeMatrixCQLFilterT0FieldLabel,
					lazyInit : true,
					mode : 'local',
					triggerAction : 'all',
					store : this.timeValuesStore,
					emptyText : "Select one time instant ...",
					labelSeparator : ':' + '<span style="color: #918E8F; padding-left: 2px;">*</span>',
					editable : true,
					resizable : true,
					allowBlank : false,
					readOnly : false,
					displayField : 'time',
					validator : function(value) {
						if (Ext.isEmpty(value))
							return me.changeMatrixEmptyFilter;
						return true;
					}
				}, {
					xtype : "combo",
					id   : 'filterT1ComboBox',
					name : 'filterT1',
					fieldLabel : this.changeMatrixCQLFilterT1FieldLabel,
					lazyInit : true,
					mode : 'local',
					triggerAction : 'all',
					store : this.timeValuesStore,
					emptyText : "Select one time instant ...",
					labelSeparator : ':' + '<span style="color: #918E8F; padding-left: 2px;">*</span>',
					editable : true,
					resizable : true,
					allowBlank : false,
					readOnly : false,
					displayField : 'time',
					validator : function(value) {
						if (Ext.isEmpty(value))
							return me.changeMatrixEmptyFilter;
						return true;
					}
				}, {
					// ///////////////
					// ItemSelector
					// ///////////////
					// xtype: 'itemselector',

					// ///////////////
					// ItemSelector Ex
					// ///////////////
					xtype : 'itemselectorex',
					fieldLabel : this.changeMatrixClassesFieldLabel,

					// ///////////////
					// ItemSelector
					// ///////////////
					//imagePath: 'theme/app/img/ux/',

					// ///////////////
					// ItemSelector Ex
					// ///////////////
					imagesDir : 'theme/app/img/ux/',
					id : 'classesselector',
					name : 'classesselector',
					anchor : '100%',

					// ///////////////
					// ItemSelector Ex
					// ///////////////
					store : storeFrom = new Ext.data.ArrayStore({
						idIndex : 0,
						data : [],
						fields : ['value', 'text'],
						autoDestroy : true
					})

					// ///////////////
					// ItemSelector
					// ///////////////
					/* drawUpIcon: false,
					 iconDown: 'selectall2.gif',
					 drawTopIcon: false,
					 iconBottom: 'deselectall2.gif',
					 height: 350,
					 multiselects: [{
					 flex: 1,
					 store: classesStore,
					 ddReorder: true,
					 height: 350,
					 valueField: 'name',
					 displayField: 'name'
					 },{
					 flex: 1,
					 store: selectedClassesStore,
					 ddReorder: true,
					 height: 350,
					 valueField: 'name',
					 displayField: 'name'
					 }],
					 down: function() {
					 var leftMultiSelect = this.fromMultiselect,
					 rightMultiSelect = this.toMultiselect;

					 leftMultiSelect.view.selectRange(0, classesStore.getCount());
					 this.fromTo();

					 leftMultiSelect.view.clearSelections();
					 rightMultiSelect.view.clearSelections();
					 },
					 toBottom: function() {
					 var leftMultiSelect = this.fromMultiselect,
					 rightMultiSelect = this.toMultiselect;

					 rightMultiSelect.view.selectRange(0, selectedClassesStore.getCount());
					 this.toFrom();

					 leftMultiSelect.view.clearSelections();
					 rightMultiSelect.view.clearSelections();
					 }*/
				}]
			}, 
			me.roiFieldSet],
			bbar : new Ext.Toolbar({
				items : ["->", {
					text : this.changeMatrixResetButtonText,
					iconCls : 'gxp-icon-removelayers',
					handler : function() {
						me.chgMatrixForm.roiFieldSet.removeFeatureSummary();
						me.chgMatrixForm.roiFieldSet.reset();
						me.chgMatrixForm.roiFieldSet.collapse();
						me.chgMatrixForm.getForm().reset();
					}
				}, {
					text : this.changeMatrixSubmitButtonText,
					iconCls : 'gxp-icon-zoom-next',
					id : 'change-matrix-submit-button',
					handler : function() {
						var form = me.chgMatrixForm.getForm();
						var formIsValid = true;
						
						for (var itm = 0; itm < form.items.items.length; itm++) {
							switch (form.items.items[itm].id) {
								case "rasterComboBox":
								case "filterT0ComboBox":
								case "filterT1ComboBox":
									if (!form.items.items[itm].getValue() || form.items.items[itm].getValue() === "") {
										formIsValid = false;
									}
								default:
									continue;
							}
						}
						
						if (!formIsValid) {
							//return Ext.Msg.alert(me.changeMatrixInvalidFormDialogTitle, me.changeMatrixInvalidFormDialogText);
							return Ext.Msg.show({
									   title: me.changeMatrixInvalidFormDialogTitle,
									   msg: me.changeMatrixInvalidFormDialogText,
									   buttons: Ext.Msg.OK,
									   icon: Ext.MessageBox.WARNING,
									   scope: me
									});
						}
						
						me.chgMatrixForm.roiFieldSet.removeFeatureSummary();

						// get form params
						var params = form.getFieldValues();

						//get an array of the selected classes from the CheckBoxGroup
						// ///////////////
						// ItemSelector
						// ///////////////
						/*if(selectedClassesStore.getCount() == 0) {
						return Ext.Msg.alert(me.changeMatrixEmptyClassesDialogTitle, me.changeMatrixEmptyClassesDialogText);
						}
						var selectedClasses = [];
						selectedClassesStore.each(function(record) {
						selectedClasses.push(record.get('name'));
						});*/

						// ///////////////
						// ItemSelector Ex
						// ///////////////
						var classesSelectorExStore = Ext.getCmp("classesselector").storeTo;
						if (classesSelectorExStore.getCount() == 0) {
							//return Ext.Msg.alert(me.changeMatrixEmptyClassesDialogTitle, me.changeMatrixEmptyClassesDialogText);
							return Ext.Msg.show({
									   title: me.changeMatrixEmptyClassesDialogTitle,
									   msg: me.changeMatrixEmptyClassesDialogText,
									   buttons: Ext.Msg.OK,
									   icon: Ext.MessageBox.WARNING,
									   scope: me
									});
						}
						var selectedClasses = [];
						classesSelectorExStore.each(function(record) {
							selectedClasses.push(record.get('field1') ? record.get('field1') : record.get('value'));
						});

						params.classes = selectedClasses;

						//get the current extent
						var map = me.target.mapPanel.map;
						var currentExtent = map.getExtent();
						//transform to a Geometry (instead of Bounds)
						if (me.chgMatrixForm.roiFieldSet.collapsed !== true) {
							/*var outputValue = me.roiFieldSet.get('selectionMethod_id').getValue();

							if (outputValue == 'bbox') {
								var roi = new OpenLayers.Bounds(me.westField.getValue() ? me.westField.getValue() : me.spatialFilterOptions.lonMin, me.southField.getValue() ? me.southField.getValue() : me.spatialFilterOptions.latMin, me.eastField.getValue() ? me.eastField.getValue() : me.spatialFilterOptions.lonMax, me.northField.getValue() ? me.northField.getValue() : me.spatialFilterOptions.latMax);

								var bbox = roi;
								if (!bbox)
									bbox = map.getExtent();

								currentExtent = bbox;

								//change the extent projection if it differs from 4326
								if (map.getProjection() != 'EPSG:4326') {
									currentExtent.transform(map.getProjectionObject(), new OpenLayers.Projection('EPSG:4326'));
								}
								// set ROI parameter
								params.roi = currentExtent.toGeometry();
							} else if (outputValue == 'polygon' && me.filterPolygon) {
								currentExtent = me.filterPolygon;

								//change the extent projection if it differs from 4326
								if (map.getProjection() != 'EPSG:4326') {
									currentExtent.transform(map.getProjectionObject(), new OpenLayers.Projection('EPSG:4326'));
								}
								// set ROI parameter
								params.roi = currentExtent;
							} else {
								//change the extent projection if it differs from 4326
								if (map.getProjection() != 'EPSG:4326') {
									currentExtent.transform(map.getProjectionObject(), new OpenLayers.Projection('EPSG:4326'));
								}
								// set ROI parameter
								params.roi = currentExtent.toGeometry();
							}*/
							params.roi = me.chgMatrixForm.roiFieldSet.currentExtent;
						} else {
							//change the extent projection if it differs from 4326
							if (map.getProjection() != 'EPSG:4326') {
								currentExtent.transform(map.getProjectionObject(), new OpenLayers.Projection('EPSG:4326'));
							}
							// set ROI parameter
							params.roi = currentExtent.toGeometry();
						}

						me.startWPSRequest(params);
					}
				}]
			})
		});

		// ///////////////////
		// Create the control panel
		// ///////////////////
		var cpanel = new Ext.Panel({
			border : false,
			layout : "fit",
			disabled : false,
			autoScroll : true,
			title : this.title,
			items : [this.chgMatrixForm]
		});
		config = Ext.apply(cpanel, config || {});

		// ///////////////////
		// Call super class addOutput method and return the panel instance
		// ///////////////////
		return gxp.plugins.ChangeMatrix.superclass.addOutput.call(this, config);
	},

	/** private: method[reloadLayers]
	 *
	 *  When the Layers Combo Box is expanded the function provides the Store
	 *  synchronization with other WMS possibly added in the meantime.
	 */
	reloadLayers : function(callback) {
		var data = [];
		if (this.layersFromAllCapabilities) {
			// /////////////////////////////////////////////////
			// The code below allows layers selection from all
			// loaded sources of type 'gxp_wmssource'.
			// /////////////////////////////////////////////////

			var source;
			var layerSources = this.target.layerSources;

			for (var id in layerSources) {
				source = layerSources[id];

				// //////////////////////////////////////////////
				// Slide the array of WMS and concatenates the
				// layers Records for the Store
				// //////////////////////////////////////////////
				switch(source.ptype) {
					case "gxp_mapquestsource":
						continue;
					case "gxp_osmsource":
						continue;
					case "gxp_googlesource":
						continue;
					case "gxp_bingsource":
						continue;
					case "gxp_olsource":
						continue;
					case "gxp_wmssource":
						var store = source.store;
						if (store) {
							var records = store.getRange();

							var size = store.getCount();
							for (var i = 0; i < size; i++) {
								var record = records[i];
								var sourceId = id;
								data = this.buildLayerRecord(data, record, sourceId);
							}
						}
				}
			}
		} else {
			// /////////////////////////////////////////////////
			// The code below allows layers selection only from
			// overlays in layetree.
			// /////////////////////////////////////////////////

			var overlays = this.target.mapPanel.layers;
			var size = overlays.getCount();
			var records = overlays.getRange();

			for (var i = 0; i < size; i++) {
				var record = records[i];

				var group = record.get("group");
				var name = record.get("name");
				var sourceId = record.data.source;

				if (group !== "background" && name) {
					data = this.buildLayerRecord(data, record, sourceId);
				}
			}
		}

		this.layerStore.removeAll();
		this.layerStore.loadData(data, false);
	},

	/** private: method[buildLayerRecord]
	 *
	 *  Create the layer record for layers combobox.
	 */
	buildLayerRecord : function(data, record, sourceId) {
		if (record) {
			var bbox = record.get("bbox");

			var srs;
			for (var crs in bbox) {
				srs = bbox[crs].srs;
				break;
			}

			var recordData = [sourceId, record.data.title, record.data.name, record.id, srs, record.data.uuid, record.data.times, record.data.gnURL];

			// ////////////////////////////////////////////////////
			// The keyword control is necessary in order         //
			// to markup a layers as Raster or Vector in order   //
			// to set a proper format in the 'Format' combo box. //
			// ////////////////////////////////////////////////////

			var keywords = record.get("keywords");
			if (keywords) {
				if (keywords.length == 0) {
					recordData.push(false);
					// wcs
					recordData.push(false);
					// wfs
					recordData.push(false);
					// wpsdownload
					recordData.push(true);
					// isLayerGroup
				} else {
					for (var k = 0; k < keywords.length; k++) {
						var keyword = keywords[k].value || keywords[k];

						if (keyword.indexOf("WCS") != -1) {
							recordData.push(true);
							break;
						}
					}
				}
			}
			data.push(recordData);
		}

		return data;
	},

	/**
	 *
	 */
	startWPSRequest : function(params) {
		var me = this;

		var classDataIndex = 0;
		for ( classDataIndex = 0; classDataIndex < me.classes.length; classDataIndex++) {
			if (me.classes[classDataIndex].layer == params.raster)
				break;
		}
		
		var layerLevel = "";
		if (classDataIndex < me.classes.length) {
			layerLevel = "_L" + me.classes[classDataIndex].level;
		}
		var jiffleStyle = me.jiffleStyle + layerLevel;
		
		var inputs = {
			name : new OpenLayers.WPSProcess.LiteralData({
				value : params.raster
			}),
			defaultStyle : new OpenLayers.WPSProcess.LiteralData({
				value : jiffleStyle
			}),
			storeName : new OpenLayers.WPSProcess.LiteralData({
				value : me.storeName
			}),
			typeName : new OpenLayers.WPSProcess.LiteralData({
				value : me.typeName
			}),
			referenceFilter : new OpenLayers.WPSProcess.ComplexData({
				value : params.filterT0,
				mimeType : 'text/plain; subtype=cql'
			}),
			nowFilter : new OpenLayers.WPSProcess.ComplexData({
				value : params.filterT1,
				mimeType : 'text/plain; subtype=cql'
			}),
			ROI : new OpenLayers.WPSProcess.ComplexData({
				value : params.roi.toString(),
				mimeType : 'application/wkt'
			}),
			classes : []
		};

		for (var i = 0; i < params.classes.length; i++) {
			inputs.classes.push(new OpenLayers.WPSProcess.LiteralData({
				value : params.classes[i]
			}));
		}

		var requestObject = {
			type : "raw",
			inputs : inputs,
			outputs : [{
				identifier : "result",
				mimeType : "application/json"
			}]
		};

		me.handleRequestStart();

		me.wpsManager.execute('gs:ChangeMatrix', requestObject, me.showResultsGrid, this);
		
		//me.handleRequestStop();
	},

	/**
	 *
	 */
	showResultsGrid : function(responseText) {
		//this.handleRequestStop();

		var wfsGrid = Ext.getCmp('wfsChangeMatrisGridPanel');
		if(wfsGrid) {
			var lastOptions = wfsGrid.store.lastOptions;
         	wfsGrid.store.reload(lastOptions);
         	wfsGrid.getView().refresh();
		}
		
		try {
			var responseData = Ext.util.JSON.decode(responseText);
		} catch(e) {
			return Ext.Msg.alert(this.changeMatrixResponseErrorDialogTitle, this.changeMatrixResponseErrorDialogText);
		}
		
		if (!responseData.referenceName) {
			return;
		}
		
		var grid = this.createResultsGrid(responseData.changeMatrix, responseData.rasterName, responseData.referenceName);

		/*
		 * Check if tabs exists and if we are allowed to render to a tab or a floating window
		 */
		var hasTabPanel = false;
		if (this.target.renderToTab && this.renderToTab) {
			var container = Ext.getCmp(this.target.renderToTab);
			if (container.isXType('tabpanel'))
				hasTabPanel = true;
		}

		if (hasTabPanel) {
			if (this.win)
				this.win.destroy();
			var now = new Date();
			grid.title += ' - ' + Ext.util.Format.date(now, 'H:i:s');
			container.add(grid);
			container.setActiveTab(container.items.length - 1);
		} else {
			if (this.resultWin)
				this.resultWin.destroy();

			//remove title to avoid double header
			grid.title = undefined;

			this.resultWin = new Ext.Window({
				width : 450,
				height : 450,
				layout : 'fit',
				title : this.changeMatrixResultsTitle,
				constrainHeader : true,
				renderTo : this.target.mapPanel.body,
				items : [grid]
			});
			this.resultWin.show();
		}
		//if(this.win) this.win.destroy();
		grid.doLayout();
	},

	/**
	 *
	 * @param {Object} data
	 */
	guessIndexes : function(data, classDataIndex) {
		var changeMatrix = data;
		var xs = [], ys = [];
		axisy = [], axisx = [];
		var dim = Math.sqrt(data.length);

		//create output matrix
		var matrix = new Array(dim + 1);
		for (var i = 0; i < dim + 1; i++) {
			matrix[i] = new Array(dim + 1);
		}
		var xAttribute = "now";
		var yAttribute = "ref";
		var dataAttribute = "pixels";

		for (var i = 0; i < changeMatrix.length; i++) {
			var el = changeMatrix[i];
			if (axisx.indexOf(el[xAttribute]) < 0) {
				axisx.push(el[xAttribute]);
			}

		}
		axisx.sort(function(a, b) {
			return parseInt(a) - parseInt(b)
		});
		for (var i = 0; i < changeMatrix.length; i++) {
			var el = changeMatrix[i];
			var x = axisx.indexOf(el[xAttribute]);
			var y = axisx.indexOf(el[yAttribute]);
			matrix[x][y + 1] = el[dataAttribute];

			// Partial Sum
			matrix[x][matrix.length] = (matrix[x][matrix.length] && !isNaN(matrix[x][matrix.length]) ? matrix[x][matrix.length] : 0) + el[dataAttribute];
			matrix[matrix.length-1][y + 1] = (matrix[matrix.length-1][y + 1] && !isNaN(matrix[matrix.length-1][y + 1]) ? matrix[matrix.length-1][y + 1] : 0) + el[dataAttribute];

			// Total Sum
			matrix[matrix.length-1][matrix.length] = (matrix[matrix.length-1][matrix.length] && !isNaN(matrix[matrix.length-1][matrix.length]) ? matrix[matrix.length-1][matrix.length] : 0) + el[dataAttribute];
		}

		for (var i = 0; i < matrix.length - 1; i++) {
			// ////////////////////
			// To be changed with this.classes values
			// ////////////////////
			matrix[i][0] = this.classesIndexes[this.classes[classDataIndex].level-1][1][axisx[i]-1][1];
			axisx[i] = axisx[i] + "";

			// ///////////////////
			// Adding Pie Chart buttons
			// ///////////////////
			matrix[i][matrix.length]       = "<img src='theme/app/img/silk/information.png' style='vertical-align: middle;width: 16px;'/> " + matrix[i][matrix.length];
			matrix[matrix.length-1][i + 1] = "<img src='theme/app/img/silk/information.png' style='vertical-align: middle;width: 16px;'/> " + matrix[matrix.length-1][i + 1];
		}
		
		matrix[matrix.length-1][0] = "[Sum]";
		axisx[matrix.length - 1] = "[Sum]";

		// descending x
		// ascending y
		//axisy.sort(function(a,b){return parseInt(b)-parseInt(a)});
		var fields = [];
		fields.push(" ");
		for (var i = 0; i < axisx.length; i++) {
			fields.push(axisx[i]);
		}
		return {
			fields : fields,
			data : matrix
		};

	},

	/**
	 *
	 * @param {Object} data
	 */
	createResultsGrid : function(data, rasterName, referenceName) {
		var me = this;
		
		//layer level
		var classDataIndex = 0;
		for ( classDataIndex = 0; classDataIndex < me.classes.length; classDataIndex++) {
			if (me.classes[classDataIndex].layer == referenceName)
				break;
		}
		if (classDataIndex >= me.classes.length) {
			return;
		}
		
		var settings = this.guessIndexes(data, classDataIndex);

		//store
		var changeMatrixStore = new Ext.data.ArrayStore({
			storeId : 'changeMatrixStore',
			autoLoad : false,
			fields : settings.fields,
			data : settings.data
		});

		//calculate min/max values, to scale values down to a 0-100 range
		var min, max;
		changeMatrixStore.each(function(record) {
			if (min == null || record.get('pixels') < min)
				min = record.get('pixels');
			if (max == null || record.get('pixels') > max)
				max = record.get('pixels');
		});

		var colmodel = [];
		for (var i = 0; i < settings.fields.length - 1; i++) {
			// ////////////////////
			// To be changed with this.classes values
			// ////////////////////
			colmodel.push({
				header : (typeof parseInt(settings.fields[i]) === 'number' && parseInt(settings.fields[i]) % 1 == 0?this.classesIndexes[me.classes[classDataIndex].level-1][1][parseInt(settings.fields[i])-1][1]:settings.fields[i]),
				dataIndex : settings.fields[i]
			});
		}
		colmodel.push({
			header : settings.fields[settings.fields.length - 1],
			dataIndex : settings.fields[settings.fields.length - 1]
		});

		colmodel[0].id = 'leftaxis';
		// to assign css
		colmodel[0].header = '-';

		// ///////////////////////////////////////
		// Grid Panel
		// ///////////////////////////////////////
		var changeMatrixGridPanel = new Ext.grid.GridPanel({
			title : this.changeMatrixResultsTitle,
			store : changeMatrixStore,
			height : 300,
			width : 300,
			columns : colmodel,
			viewConfig : {
				getRowClass : function(record, index, rowParams) {
					// calculate the percentage
					var percentValue = Math.round(((record.get('pixels') - min) / max) * 100);

					// calculate color (0 = green, 100 = red)
					var r = Math.round((255 * percentValue) / 100);
					var g = Math.round((255 * (100 - percentValue)) / 100);
					var b = 0;

					// add inline styles to the row
					rowParams.tstyle = 'width:' + this.getTotalWidth() + ';';
					rowParams.tstyle += "background-color: rgb(" + r + "," + g + "," + b + ");";
				}
			},
			sm : new Ext.grid.CellSelectionModel(),
			listeners : {
				cellclick : function(grid, rowIndex, columnIndex, e) {
					var record = grid.getStore().getAt(rowIndex);
					// Get the Record
					var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
					// Get field name
					var data = record.get(fieldName);
					
					/**
					 * Checks on row click. Either print a Pie-Chart or load interactive matrix on the map.
					 */
					var gridRowLabel = record.json[0];
					var gridColLabel = grid.getColumnModel().getColumnHeader(columnIndex);
					//console.log(gridRowLabel + " / " + gridColLabel + " : [" + data + "]");
					
					// ///////////////////////////////////////////
					// If the Row or Column Labels match the wordi
					// ng '[Sum]', we are at an extrema of the gri
					// d. In this case we need to collect data for
					// a new Pie Chart to be loaded in the Tab Pan
					// el.
					// ///////////////////////////////////////////
					if ((gridRowLabel && gridRowLabel == '[Sum]') || (gridColLabel && gridColLabel == '[Sum]')) {
						if (!(gridRowLabel == '[Sum]' && gridColLabel == '[Sum]')) {
							var menu_grid = new Ext.menu.Menu({
								items : [{
									iconCls : 'icon-piechart',
									text : me.pieChartMenuLabel,
									handler : function() {
										//console.log("Print Pie Chart -> " + gridRowLabel + " / " + gridColLabel + " : [" + data + "]");
										// //////////////////////////////
										// Creating the pie chart series
										// //////////////////////////////
										var pieChartTitle = null;
										var pieChartSubTitle = null;
										var dataSeries = [];
										// Check if either a row or a column has been clicked
										if (gridColLabel == '[Sum]') { // Row
											/**
											 * Reference -> Current
											 */
											pieChartTitle = me.scatterChartXAxisLabel + " -> " + me.scatterChartYAxisLabel;
											pieChartSubTitle = " - " + gridRowLabel + " - ";
											
											/**
											 * Populate the data series by selecting the row dataset
											 */
											var total = data.substring(data.indexOf("> ")+2);
											for (var r=1;r<record.json.length-1;r++) {
												var dataItem = [];
												dataItem.push(me.classesIndexes[me.classes[classDataIndex].level-1][1][grid.getColumnModel().getDataIndex(r)-1][1]);
												dataItem.push(parseFloat(record.json[r])*100/parseFloat(total));
												dataSeries.push(dataItem);
											}
											
											/**
											 * Dynamically create the chart
											 */
											addPieChartToTabPanel(me.pieChartTabTitle, pieChartTitle, pieChartSubTitle, dataSeries);
										}
										else if (gridRowLabel == '[Sum]') { // Column
											/**
											 * Reference -> Current
											 */
											pieChartTitle = me.scatterChartYAxisLabel + " -> " + me.scatterChartXAxisLabel;
											pieChartSubTitle = " - " + gridColLabel + " - ";
											
											/**
											 * Populate the data series by selecting the column dataset
											 */
											var total = data.substring(data.indexOf("> ")+2);
											for (var r=1;r<record.json.length-1;r++) {
												var dataItem = [];
												var row = grid.getStore().getAt(r-1);
												dataItem.push(row.json[0]);
												dataItem.push(parseFloat(row.json[columnIndex])*100/parseFloat(total));
												dataSeries.push(dataItem);
											}
											
											/**
											 * Dynamically create the chart
											 */
											addPieChartToTabPanel(me.pieChartTabTitle, pieChartTitle, pieChartSubTitle, dataSeries);
										}
									}
								}, {
									iconCls : 'data-table',
									text : me.interactiveChgMatrixLabel,
									//disabled: true,
									handler : function() {
										//console.log("Interactive Change Matrix ("+rasterName+") -> " + gridRowLabel + " / " + gridColLabel + " : [" + data + "]");
										// Check if either a row or a column has been clicked
										var map = me.target.mapPanel.map;
										
										if (gridColLabel == '[Sum]') { // Row
											/**
											 * Style ENV Parameter
											 */
											var referenceClassIndex = 0;
											for (var ci=0;ci<me.classesIndexes[me.classes[classDataIndex].level-1][1].length;ci++) {
												if (me.classesIndexes[me.classes[classDataIndex].level-1][1][ci][1] == gridRowLabel) {
													referenceClassIndex=me.classesIndexes[me.classes[classDataIndex].level-1][1][ci][0];
												}
											}
											
											//console.log("referenceClassIndex -> " + referenceClassIndex);
											
											/**
											 * Dynamically create the layer
											 */
											var layer = new OpenLayers.Layer.WMS(
													"[ref]"+me.interactiveChgMatrixLabel+" - "+gridRowLabel,
    												me.wpsManager.url.replace("wps","wms"),
    												{
    													layers: rasterName, 
    													transparent:"true",
    													env: "dataEnv:ref="+referenceClassIndex+",cur=0"
    												}, 
    												{
    													isBaseLayer:false
    												}
    										);
    										
    										map.addLayer(layer);
    										
    										/*
											 * Check if tabs exists and if so switch to View Tab 
											 */
											var hasTabPanel = false;
											if (me.target.renderToTab && me.renderToTab) {
												var container = Ext.getCmp(me.target.renderToTab);
												if (container.isXType('tabpanel'))
													hasTabPanel = true;
											}
									
											if (hasTabPanel) {
												if (me.win)
													me.win.destroy();
												container.setActiveTab(0);
											}
										}
										else if (gridRowLabel == '[Sum]') { // Column
											/**
											 * Style ENV Parameter
											 */
											var currClassIndex = 0;
											for (var ci=0;ci<me.classesIndexes[me.classes[classDataIndex].level-1][1].length;ci++) {
												if (me.classesIndexes[me.classes[classDataIndex].level-1][1][ci][1] == gridColLabel) {
													currClassIndex=me.classesIndexes[me.classes[classDataIndex].level-1][1][ci][0];
												}
											}
											
											//console.log("currClassIndex -> " + currClassIndex);
											
											/**
											 * Dynamically create the layer
											 */
											var layer = new OpenLayers.Layer.WMS(
													"[cur]"+me.interactiveChgMatrixLabel+" - "+gridColLabel,
    												me.wpsManager.url.replace("wps","wms"), 
    												{
    													layers: rasterName, 
    													transparent:"true",
    													env: "dataEnv:ref=0,cur="+currClassIndex
    												}, 
    												{
    													isBaseLayer:false
    												}
    										);
    										
    										map.addLayer(layer);

    										/*
											 * Check if tabs exists and if so switch to View Tab 
											 */
											var hasTabPanel = false;
											if (me.target.renderToTab && me.renderToTab) {
												var container = Ext.getCmp(me.target.renderToTab);
												if (container.isXType('tabpanel'))
													hasTabPanel = true;
											}
									
											if (hasTabPanel) {
												if (me.win)
													me.win.destroy();
												container.setActiveTab(0);
											}
										}
									}
								}]
							});
							var position = e.getXY();
	                        e.stopEvent();
	                        menu_grid.showAt(position);
                        }
					}
				}
			}
		});
		
		// ///////////////////////////////////////
		// Scatter High-Chart Panel
		// ///////////////////////////////////////
		var series = [];
		for (var d = 0; d < settings.data.length - 1; d++) {
			var data = {};
			var dataMatrix = [];
			for (var dd = 0; dd < settings.data[d].length - 2; dd++) {
				var dataRow = [];
				dataRow.push(d + 1);
				dataRow.push(dd + 1);
				dataRow.push(settings.data[d][dd + 1]);

				dataMatrix.push(dataRow);
			}
			data.data = dataMatrix;
			series.push(data);
		}

		var changeMatrixScatterChart = new Ext.ux.HighChart({
			title : this.scatterChartTabTitle,
			animation : true,
			animShift : true,
			series : series,
			chartConfig : {
				chart : {
					type : 'bubble',
					zoomType : 'xy',
					spacingBottom : 65
				},
				title : {
					text : this.scatterChartTitle
				},
				subtitle : {
					text : this.scatterChartSubTitle
				},
				yAxis : [{
					title : {
						enabled : true,
						text : this.scatterChartYAxisLabel
					},
					gridLineWidth : 1,
					style : {
						backgroundColor : Ext.isIE ? '#ffffff' : "transparent"
					},
					labels : {
						style : {
							backgroundColor : Ext.isIE ? '#ffffff' : "transparent"
						},
						rotation : 320,
						y : 0,
						formatter : function() {
							if (typeof this.value === 'number' && this.value % 1 == 0)
								if (settings.data[this.value - 1] && settings.data[this.value-1][0] && settings.data[this.value-1][0] != '[Sum]')
									return settings.data[this.value-1][0];
						}
					}
				}],
				xAxis : [{
					title : {
						enabled : true,
						text : this.scatterChartXAxisLabel
					},
					gridLineWidth : 1,
					style : {
						backgroundColor : Ext.isIE ? '#ffffff' : "transparent"
					},
					labels : {
						style : {
							backgroundColor : Ext.isIE ? '#ffffff' : "transparent"
						},
						rotation : 320,
						y : +22,
						formatter : function() {
							if ( typeof this.value === 'number' && this.value % 1 == 0)
								if (settings.data[this.value - 1] && settings.data[this.value-1][0] && settings.data[this.value-1][0] != '[Sum]')
									return settings.data[this.value-1][0];
						}
					}
				}]
				/*,exporting: {
				 enabled: true,
				 width: 1200,
				 url: this.highChartExportUrl
				 },*/
			}
		});

		// ///////////////////////////////////////
		// Main Tab Panel
		// ///////////////////////////////////////
		var changeMatrixOutcomeTabPanel = new Ext.TabPanel({
			title : this.changeMatrixResultsTitle,
			height : 300,
			width : 300,
			closable : true,
			renderTo : Ext.getBody(),
			activeTab : 0,
			items : [changeMatrixGridPanel, changeMatrixScatterChart]
		});

		// ///////////////////////////////////////
		// Pie High-Chart Panel
		// ///////////////////////////////////////
		var addPieChartToTabPanel = function(pieChartTabTitle, pieChartTitle, pieChartSubTitle, data) {
			var changeMatrixPieChart = new Ext.ux.HighChart({
				title : pieChartTabTitle,
				animation : true,
				animShift : true,
				closable : true,
				series : [{
					type : 'pie',
					data : data
				}],
				chartConfig : {
					chart : {
						plotBackgroundColor : null,
						plotBorderWidth : null,
						plotShadow : true,
						spacingBottom : 65
					},
					title : {
						text : pieChartTitle
					},
					subtitle : {
						text : pieChartSubTitle
					},
					tooltip : {
						pointFormat : '{point.name}: <b>{point.percentage:.4f}%</b>'
					},
					plotOptions : {
						pie : {
							allowPointSelect : true,
							cursor : 'pointer',
							dataLabels : {
								enabled : true,
								color : '#000000',
								connectorColor : '#000000',
								format : '<b>{point.name}</b>: {point.percentage:.4f} %'
							}
						}
					}
					/*,exporting: {
					 enabled: true,
					 width: 1200,
					 url: this.highChartExportUrl
					 },*/
				}
			});
			
			changeMatrixOutcomeTabPanel.add(changeMatrixPieChart);
			changeMatrixOutcomeTabPanel.doLayout();
		};
		
		// ///////////////////////////////////////
		// Drawing the Panel
		// ///////////////////////////////////////
		//return changeMatrixGridPanel;		
		return changeMatrixOutcomeTabPanel;
	},

	/**
	 *
	 */
	handleTimeout : function() {
		if (!this.loadingMask)
			this.loadingMask = new Ext.LoadMask(Ext.get('change-matrix-form-panel'), 'Loading..');
		this.loadingMask.hide();
		Ext.getCmp('change-matrix-submit-button').enable();
		//Ext.Msg.alert(this.changeMatrixTimeoutDialogTitle, this.changeMatrixTimeoutDialogText);
		
		var wfsGrid = Ext.getCmp(this.wfsChangeMatrisGridPanel);
		if(wfsGrid) {
			var lastOptions = wfsGrid.store.lastOptions;
         	wfsGrid.store.reload(lastOptions);
         	wfsGrid.getView().refresh();
		}		
	},

	/**
	 *
	 */
	handleRequestStart : function() {
		var me = this;

		if (!this.loadingMask)
			this.loadingMask = new Ext.LoadMask(Ext.get('change-matrix-form-panel'), 'Loading..');
		me.loadingMask.show();
		var submitButton = Ext.getCmp('change-matrix-submit-button');
		if (submitButton)
			submitButton.disable();
		if (me.errorTimer)
			clearTimeout(me.errorTimer);
		me.errorTimer = setTimeout(function() {
			me.handleTimeout();
		}, me.requestTimeout);
	},

	/**
	 *
	 */
	handleRequestStop : function() {
		if (!this.loadingMask)
			this.loadingMask = new Ext.LoadMask(Ext.get('change-matrix-form-panel'), 'Loading..');
		this.loadingMask.hide();
		var submitButton = Ext.getCmp('change-matrix-submit-button');
		if (submitButton)
			submitButton.enable();
		/*if (this.errorTimer)
			clearTimeout(this.errorTimer);*/
	}

});

Ext.preg(gxp.plugins.ChangeMatrix.prototype.ptype, gxp.plugins.ChangeMatrix);
