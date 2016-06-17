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
 *  module = gxp.widgets.form
 *  class = ChangeMatrixPanel
 */

/** api: (extends)
 *  Ext.Panel.js
 */
Ext.namespace("gxp.widgets.form");

/** api: constructor
 *  .. class:: ChangeMatrix(config)
 *
 *    Show a change matrix of changes between two rasters
 */
gxp.widgets.form.ChangeMatrixPanel = Ext.extend(gxp.widgets.form.AbstractOperationPanel, {

	/** api: xtype = gxp_changematrixpanel */
	xtype : "gxp_changematrixpanel",

	/** i18n **/

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

	/** EoF i18n **/

    /** api: config[clcLevelsConfig]
     *  ``Object`` CLC levels cconfiguration
     */
	clcLevelsConfig:[{
		filter: 'corine_L',
		decorator: 'Corine Land Cover Level {0}'
	},{
		filter: 'touring',
		decorator: 'Touring Land Cover Level {0}'
	}],

	// clcLevelMode: 'combobox',

	initComponent:function(config){
		var wfsResumeTool = this.target.tools['gxp_wfsresume'];
		this.wfsResumeTool = wfsResumeTool;
		this.wfsResumeTool.addSupport(this.classesIndexes, this.classes, this.geocoderConfig);
		gxp.widgets.form.ChangeMatrixPanel.superclass.initComponent.call(this, config);
	},

	generateItems: function(config){
		return [{
    		title: this.clcLevelTitleText,
    		layout : 'fit',
	        items: this.getCclLevelItems(config)
	    },{
    		title: this.timeSelectionTitleText,
    		layout : 'form',
	        items: this.getTimeSelectionItems(config)
	    },{
    		title: this.clcLegendBuilderTitleText,
			layout : 'table',
			columns: 1,
	        items: this.getCclLegendItems(config)
	    },{
    		title: this.roiTitleText,
			layout : 'form',
			autoScroll: true,
	        items: this.getRoiItems(config),
			listeners: {
				expand: function(panel){
					panel.doLayout();
				}
			}
	    }];
	},

	resetForm: function(){
		gxp.widgets.form.ChangeMatrixPanel.superclass.resetForm.call(this);
		this.activeElementByTitle(this.clcLevelTitleText);
	},

	selectTimeIndex: function(){
		var filter0 = Ext.getCmp(this.id + '_filterT0ComboBox');
		var filter1 = Ext.getCmp(this.id + '_filterT1ComboBox');
		if(filter0 
			&& filter0.getValue() 
			&& filter1 && filter1.getValue()){
			this.activeElementByTitle(this.clcLegendBuilderTitleText);
		}
	},

	getTimeSelectionItems: function(config){
		var me = this;
		return [{
			title : this.timeFilterTitle,
			xtype : 'fieldset',
			autoWidth : true,
			collapsible : false,
			layout : 'form',
			defaultType : 'numberfield',
			items : [{
				xtype : "combo",
				ref   : 'filterT0ComboBox',
				id   : me.id + '_filterT0ComboBox',
				name : 'filterT0',
				fieldLabel : this.referenceTimeFieldLabel,
				lazyInit : true,
				mode : 'local',
				triggerAction : 'all',
				store : this.timeValuesStore,
				emptyText : this.selectAnItemEmptyText,
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
				},
				listeners : {
					scope : me,
					select : me.selectTimeIndex
				}
			}, {
				xtype : "combo",
				ref   : 'filterT1ComboBox',
				id   : me.id + '_filterT1ComboBox',
				name : 'filterT1',
				fieldLabel : this.currentTimeFieldLabel,
				lazyInit : true,
				mode : 'local',
				triggerAction : 'all',
				store : this.timeValuesStore,
				emptyText : this.selectAnItemEmptyText,
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
				},
				listeners : {
					scope : me,
					select : me.selectTimeIndex
				}
			}]
		}];
	},

	submitForm: function() {
		var me = this;
		var form = me.getForm();
		var formIsValid = true;

        //activate tab
        var changematrixTool = this.target.tools["changeMatrixTool"];            
        var tab = Ext.getCmp(changematrixTool.wfsChangeMatrisGridPanelID);
        tab.setActiveTab(this.geocoderConfig.targetResultGridId + "_panel");
		
		for (var itm = 0; itm < form.items.items.length; itm++) {
			switch (form.items.items[itm].ref) {
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
		
		if(!this.useCuda) {
			Ext.Msg.confirm(
				"CUDA", 
				"CUDA has not been checked, the computation may take too long. Would you like to proceed anyway?",
				function(btn,text){
                	if (btn == 'yes'){
						if(me.jobUid) {

								if(me.roiFieldSet && me.roiFieldSet.rendered){
									me.roiFieldSet.removeFeatureSummary();
								}
						
								// get form params
								var params = form.getFieldValues();
						
								// ///////////////
								// ItemSelector Ex
								// ///////////////
								var classesSelectorExStore = Ext.getCmp(me.id + '_classesselector').storeTo;
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
								if (me.roiFieldSet && me.roiFieldSet.collapsed !== true && me.roiFieldSet.outputType.value) {
									params.roi = me.roiFieldSet.currentExtent;
								} else {
									//currentExtent = map.getMaxExtent();
									//change the extent projection if it differs from 4326
									if (map.getProjection() != 'EPSG:4326') {
										currentExtent.transform(map.getProjectionObject(), new OpenLayers.Projection('EPSG:4326'));
									}
									// set ROI parameter
									params.roi = currentExtent.toGeometry();
								}
						
								if (this.useCuda) {
									params.jcuda = true;
								} else {
									params.jcuda = false;
								}
								
								// if is selected as radio group override raster name from the inputValue
								if(this.clcLevelMode == 'radiogroup'){
									params.raster = params.raster.inputValue;
								}
						        
								if(me.jobUid) {
									params.jobUid = me.jobUid;
									me.startWPSRequest(params);
								} else {
									return Ext.Msg.show({
											   title: me.changeMatrixInvalidFormDialogTitle,
											   msg: "Missing 'username' value!",
											   buttons: Ext.Msg.OK,
											   icon: Ext.MessageBox.WARNING,
											   scope: me
											});			
								}


						} else {
							return Ext.Msg.show({
									   title: this.invalidFormDialogText,
									   msg: "Missing 'username' value!",
									   buttons: Ext.Msg.OK,
									   icon: Ext.MessageBox.WARNING,
									   scope: this
									});				
						}
                    } else {
                        return false;
                    }
                }
            );
		} else {
			if(this.jobUid) {

						if(me.roiFieldSet && me.roiFieldSet.rendered){
							me.roiFieldSet.removeFeatureSummary();
						}
				
						// get form params
						var params = form.getFieldValues();
				
						// ///////////////
						// ItemSelector Ex
						// ///////////////
						var classesSelectorExStore = Ext.getCmp(me.id + '_classesselector').storeTo;
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
						if (me.roiFieldSet && me.roiFieldSet.collapsed !== true && me.roiFieldSet.outputType.value) {
							params.roi = me.roiFieldSet.currentExtent;
						} else {
							//currentExtent = map.getMaxExtent();
							//change the extent projection if it differs from 4326
							if (map.getProjection() != 'EPSG:4326') {
								currentExtent.transform(map.getProjectionObject(), new OpenLayers.Projection('EPSG:4326'));
							}
							// set ROI parameter
							params.roi = currentExtent.toGeometry();
						}
				
						if (this.useCuda) {
							params.jcuda = true;
						} else {
							params.jcuda = false;
						}
						
						// if is selected as radio group override raster name from the inputValue
						if(this.clcLevelMode == 'radiogroup'){
							params.raster = params.raster.inputValue;
						}
				        
						if(this.jobUid) {
							params.jobUid = this.jobUid;
							me.startWPSRequest(params);
						} else {
							return Ext.Msg.show({
									   title: me.changeMatrixInvalidFormDialogTitle,
									   msg: "Missing 'username' value!",
									   buttons: Ext.Msg.OK,
									   icon: Ext.MessageBox.WARNING,
									   scope: me
									});			
						}

			} else {
				return Ext.Msg.show({
						   title: this.invalidFormDialogText,
						   msg: "Missing 'username' value!",
						   buttons: Ext.Msg.OK,
						   icon: Ext.MessageBox.WARNING,
						   scope: this
						});				
			}				
		}
		
		/*} else {
			if(me.roiFieldSet && me.roiFieldSet.rendered){
				me.roiFieldSet.removeFeatureSummary();
			}
	
			// get form params
			var params = form.getFieldValues();
	
			// ///////////////
			// ItemSelector Ex
			// ///////////////
			var classesSelectorExStore = Ext.getCmp(me.id + '_classesselector').storeTo;
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
			if (me.roiFieldSet && me.roiFieldSet.collapsed !== true && me.roiFieldSet.outputType.value) {
				params.roi = me.roiFieldSet.currentExtent;
			} else {
				//currentExtent = map.getMaxExtent();
				//change the extent projection if it differs from 4326
				if (map.getProjection() != 'EPSG:4326') {
					currentExtent.transform(map.getProjectionObject(), new OpenLayers.Projection('EPSG:4326'));
				}
				// set ROI parameter
				params.roi = currentExtent.toGeometry();
			}
	
			if (this.useCuda) {
				params.jcuda = true;
			} else {
				params.jcuda = false;
			}
			
			// if is selected as radio group override raster name from the inputValue
			if(this.clcLevelMode == 'radiogroup'){
				params.raster = params.raster.inputValue;
			}
	        
			if(this.jobUid) {
				params.jobUid = this.jobUid;
				me.startWPSRequest(params);
			} else {
				return Ext.Msg.show({
						   title: me.changeMatrixInvalidFormDialogTitle,
						   msg: "Missing 'username' value!",
						   buttons: Ext.Msg.OK,
						   icon: Ext.MessageBox.WARNING,
						   scope: me
						});			
			}
		}*/
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
		var jiffleStyle = me.geocoderConfig.jiffleStyle + layerLevel;
		
		var inputs = {
			name : new OpenLayers.WPSProcess.LiteralData({
				value : params.raster
			}),
			defaultStyle : new OpenLayers.WPSProcess.LiteralData({
				value : jiffleStyle
			}),
			storeName : new OpenLayers.WPSProcess.LiteralData({
				value : me.geocoderConfig.storeName
			}),
			typeName : new OpenLayers.WPSProcess.LiteralData({
				value : me.geocoderConfig.typeName
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
			JCUDA : new OpenLayers.WPSProcess.LiteralData({
				value : params.jcuda.toString()
			}),
			jobUid : new OpenLayers.WPSProcess.LiteralData({
				value : params.jobUid
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

		me.wpsManager.execute(me.geocoderConfig.wpsChgMatrixProcessName, requestObject, me.showResultsGrid, this);
		
		//me.handleRequestStop();
		
		var wfsGrid = Ext.getCmp(me.geocoderConfig.targetResultGridId);
		if(wfsGrid) {
			var lastOptions = wfsGrid.store.lastOptions;
         	wfsGrid.store.reload(lastOptions);
         	wfsGrid.getView().refresh();
		}
	},

	/**
	 *
	 */
	showResultsGrid : function(responseText) {
		//this.handleRequestStop();

		var wfsGrid = Ext.getCmp(this.geocoderConfig.targetResultGridId);
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
		
		// var grid = this.createResultsGrid(responseData.changeMatrix, responseData.rasterName, responseData.referenceName);

		var wfsResumeTool = me.target.tools['gxp_wfsresume'];

		var grid = new gxp.widgets.WFSResume(Ext.apply({
			data: responseData.changeMatrix, 
			name: responseData.rasterName, 
			referenceName: responseData.referenceName,
			listeners : {
				scope : this
			}
		})); 

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
	}

});

Ext.reg(gxp.widgets.form.ChangeMatrixPanel.prototype.xtype, gxp.widgets.form.ChangeMatrixPanel);
