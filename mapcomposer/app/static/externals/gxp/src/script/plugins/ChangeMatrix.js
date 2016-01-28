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
gxp.plugins.ChangeMatrix = Ext.extend(gxp.plugins.TableableTool, {

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
	changeMatrixResultsTitle : "Land Cover",

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
	
	/** api: config[wpsChgMatrixProcessName]
	 *  ``String``
	 *  ID of the WPS Land Cover Process .
	 */
	wpsChgMatrixProcessName: 'gs:ChangeMatrix',
	
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

	/** api: config[source]
	 *  ``String``
	 *  ChangeMatrix Layer Source .
	 */
	source : null,

	/** api: config[nsPrefix]
	 *  ``String``
	 *  ChangeMatrix Layer NS Prefix .
	 */
	nsPrefix : null,

	/** api: config[storeName]
	 *  ``String``
	 *  Store Name for WFS logging on Land Cover Process .
	 */
	storeName : null,
	
	/** api: config[typeName]
	 *  ``String``
	 *  Type Name for WFS logging on Land Cover Process .
	 */
	typeName : null,
	
	/** api: config[jiffleStyle]
	 *  ``String``
	 *  Jiffle Style for the Raster returned by the Land Cover Process .
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
	
	/** api: config[selectReturnType]
	 *  ``Boolean``
	 *  Allow return type on the geocoder.
	 */
	selectReturnType: false,
	
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
	chgMatrixFieldSetTitle : 'Land Cover Inputs',

	/** api: config[scatterChartTabTitle]
	 * ``String``
	 * Text for Scatter Chart Tab Panel (i18n).
	 */
	scatterChartTabTitle : "Scatter Chart",

	/** api: config[pieChartMenuLabel]
	 * ``String``
	 * Text for the Land Cover Grid Menu Label (i18n).
	 */
	pieChartMenuLabel : "Print Pie Chart",
	
	/** api: config[interactiveChgMatrixLabel]
	 * ``String``
	 * Text for the Land Cover Menu Label (i18n).
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

		// copy gecoder config
		if(this.panelsConfig){
			for(var i = 0; i< this.panelsConfig.length; i++){
				var panelConfig = this.panelsConfig[i];
				var geocoderPanelConfig = {};
				//var clcLevelsPanelConfig = {};
				// copy general
				Ext.apply(geocoderPanelConfig, this.geocoderConfig || {});
				// ovewrite specific
				Ext.apply(geocoderPanelConfig, panelConfig.geocoderConfig || {});
				// set on panel config
				panelConfig.clcLevelsConfig = this.clcLevelsConfig;
				panelConfig.geocoderConfig = geocoderPanelConfig;
				panelConfig.wpsManager = this.wpsManager;
			}	
		}

		return gxp.plugins.ChangeMatrix.superclass.init.apply(this, arguments);

	},

	/** private: method[generatePanel]
	 *  Generate a panel with the configuration present on this
	 */
	generatePanel: function(config){
		var panelConfig = {};
		Ext.apply(panelConfig, this.panelConfig);
		panelConfig.title = this.title;

		// copy all general config
		if(config){
			Ext.apply(panelConfig, config);
		}

		// override properties
		Ext.apply(panelConfig, {
			id : this.id + '_panel',
			items : [this.getPanelContent(config)]
		});

		panelConfig.target = this.target;
		panelConfig.wpsManager = this.wpsManager;
		panelConfig.classes = this.classes;
		panelConfig.classesIndexes = this.classesIndexes;

		return Ext.create(panelConfig);
	}

});

Ext.preg(gxp.plugins.ChangeMatrix.prototype.ptype, gxp.plugins.ChangeMatrix);
