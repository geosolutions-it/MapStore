/*
 *  Copyright (C) 2014 GeoSolutions S.A.S.
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

Ext.ns("mxp.widgets");

/**
 * Service input form for a new run
 * Currently hardcoded to Asset Allocator
 *
 */
mxp.widgets.CMREOnDemandServiceInputForm = Ext.extend(Ext.Panel, {

	/** api: xtype = mxp_cmre_ondemand_services_input_form */
	xtype : 'mxp_cmre_ondemand_services_input_form',
	category : 'WPS_RUN_CONFIGS',
	layout: 'fit',
	//global variables
	osdi2ManagerRestURL : null,
	serviceName : null,
	mapPanel : null,
	serviceAreaLimitsTolerance : 0.01,
	serviceAreaLimits : {
		bottom: -34.80,
		left: 30.55,
		right: 100.90,
		top: 33.10
	},
	defaultAoi :{
		bottom: -34.80,
		left: 30.55,
		right: 100.90,
		top: 33.10
	},
	/**
	 * config[dataId]
	 * the id of the resource from whitch load data
	 */
	dataId : null,
	/**
	 * config[data]
	 * the data to load
	 */
	data : null,
	
	//i18n
	nameLabel : 'Name',
	descriptionLabel : 'Description',
	textSave : 'Execute',
	resetTitleText : "Reset",
	
	savingMessage : "Saving...",
	loadingMessage : "Loading...",
	saveSuccessTitle : "Saved",
	saveSuccessMessage : "Resource saved succesfully",
	executeRunTitle : "Could not start the Execution",
	executeRunMessage : "The provided inputs are not valid or not complete. Please, check carefully the provided values.",
	resourceNotValid : "Resource not valid",
	deleteSuccessMessage : "Resource Deleted Successfully",
	
	updateAssetsPositionButtonText : "Update Assets Position",
	updateAssetsPositionButtonTooltip : "When copying the parameters from an existing run, it's possible to try updating the position automatically accordingly to the selected date/time.",

	northFieldLabel: 'North',
	southFieldLabel: 'South',
	eastFieldLabel: 'East',
	westFieldLabel: 'West',
	bboxButtonLabel: 'Area',
	bboxButtonTooltip: 'Select Area of Interest. Must be equal or less than the service max extent.',
	
	aoiLabel: "Area of Interest",
	durationFieldLabel: "Duration",
	numberOfEvaluationsFieldLabel: "Num. of Evaluations",
	startTimeFieldLabel: "Start Time",
	riskMapTypeFieldLabel: 'Risk Map Type',
	assetsFieldTitle: 'Assets',
	assetsAddFieldTooltip: "Add a new Asset",
	assetsDelFieldTooltip: "Remove an Asset",
    cloneThisAssetText:'Clone this asset',
	
	/*
	 * 
	 */
	initComponent : function() {
		var values = this.values || {
			category : this.category
		};

		this.addEvents(
			/**
			 * @event save
			 * Fires after save.
			 * @param {Ext.DataView} this
			 * @param {id} the id of the saved resource
			 */
			"save",
			
			/**
			 * @event delete
			 * Fires after delete.
			 * @param {Ext.DataView} this
			 */
			"delete",
			/**
			 * @event execute
			 * Fires after execute.
			 * @param {Ext.DataView} this
			 */
			"execute"
		);
		
		
		if (!this.genericFields) {
			// /////////////////////////////////////////
			// -- defining form fields
			// /////////////////////////////////////////
			var me = this;
			var updateBox = function(){
				// Update area
				var values = me.resourceform.getForm().getValues();
				//TODO check valid
				var record = me.readData(values);
				var bboxAvailable = record.get('East_BBOX') &&  record.get('North_BBOX') && record.get('West_BBOX')&& record.get('South_BBOX');
			    if(bboxAvailable){
					var map = me.mapPanel.map;
					var aoi= new OpenLayers.Bounds(
						record.get('West_BBOX'),
					    record.get('South_BBOX'),
					    record.get('East_BBOX'),
					    record.get('North_BBOX')
					);
					// note map projection object could not be initialized yet
					// so lets create it's projection object
					var mapPrj = new OpenLayers.Projection(map.projection);
					me.selectBBOX.setAOI(aoi.transform(new OpenLayers.Projection('EPSG:4326'), mapPrj),true);
			 	}
		   };
			this.northField = new Ext.form.NumberField({
				fieldLabel : this.northFieldLabel,
				id : this.northFieldLabel + "_BBOX",
				maxValue : me.serviceAreaLimits.top,
				minValue : me.serviceAreaLimits.bottom,
				width : 130,
				allowBlank : true,
				decimalPrecision : 4,
				allowDecimals : true,
				hideLabel : false,
				listeners: {
					change:updateBox
			    }
			});

			this.westField = new Ext.form.NumberField({
				fieldLabel : this.westFieldLabel,
				id : this.westFieldLabel + "_BBOX",
				minValue : me.serviceAreaLimits.left,
				maxValue : me.serviceAreaLimits.right,
				width : 100,
				allowBlank : true,
				decimalPrecision : 4,
				allowDecimals : true,
				hideLabel : false,
				listeners: {
					change:updateBox
			    }
			});

			this.eastField = new Ext.form.NumberField({
				fieldLabel : this.eastFieldLabel,
				id : this.eastFieldLabel+ "_BBOX",
				maxValue : me.serviceAreaLimits.right,
				minValue : me.serviceAreaLimits.left,
				width : 100,
				allowBlank : true,
				decimalPrecision : 4,
				allowDecimals : true,
				hideLabel : false,
				listeners: {
					change:updateBox
			    }
			});

			this.southField = new Ext.form.NumberField({
				fieldLabel : this.southFieldLabel,
				id : this.southFieldLabel + "_BBOX",
				minValue : me.serviceAreaLimits.bottom,
				maxValue : me.serviceAreaLimits.top,
				width : 130,
				allowBlank : true,
				decimalPrecision : 4,
				allowDecimals : true,
				hideLabel : false,
				listeners: {
					change:updateBox
			    }
			});

			this.bboxButton = new Ext.Button({
				text : this.bboxButtonLabel,
				tooltip : this.bboxButtonTooltip,
				enableToggle : true,
                toggleGroup: "mapControls",
				height : 50,
				width : 50,
				listeners : {
					scope : me,
					toggle : function(button, pressed) {
						if (pressed) {
							//
							// Activating the new control
							//
							this.selectBBOX.activate();
						} else {
							this.selectBBOX.deactivate();
						}
					}
				}
			});

			this.startTime = new Ext.form.DateField({
				format : 'Y-m-d',
				fieldLabel : '',
				id : me.id + '_ReferenceDate',
				name : 'referenceDate',
				ref : 'referenceDate',
				maxLength : 180,
				anchor : '95%',
				allowBlank : false,
				value : ''
			});

			this.updateAssetsPositionButton = new Ext.Button({
				text : this.updateAssetsPositionButtonText,
				tooltip : this.updateAssetsPositionButtonTooltip,
				disabled : true,
				iconCls : 'geolocation_ic',
				width : 150,
				listeners : {
					scope : me,
					toggle : function(button, pressed) {
						if (pressed) {
							//
							// Activating the new control
							//
							this.selectBBOX.activate();
						} else {
							this.selectBBOX.deactivate();
						}
					}
				}
			});

			this.durationField = new Ext.form.NumberField({
				id : me.id + "_Duration",
				decimalPrecision : 0,
				allowDecimals : false,
				hideLabel : false,
				maxLength : 180,
				anchor : '95%',
				name : "timeHorizon",
				ref : "timeHorizon",
				fieldLabel : this.durationFieldLabel,
				value : "",
				allowBlank : false
			});
			
			this.evaluationsField = new Ext.form.NumberField({
				id : me.id + "_NumEvaluations",
				decimalPrecision : 0,
				allowDecimals : false,
				hideLabel : false,
				maxLength : 180,
				anchor : '95%',
				name : "numberOfEvaluations",
				ref : "numberOfEvaluations",
				fieldLabel : this.numberOfEvaluationsFieldLabel,
				value : "60000",
				allowBlank : false
			});
			
			this.assetFramePanel = new Ext.FormPanel({
				frame : true,
				layout : 'form',
				autoScroll : true,
				ref : 'assetsform',
				border : false,
				items : [this.createAsset(1)],
				renderTo : Ext.getBody()
			});

			// /////////////////////////////////////////
			// -- attach fields
			// /////////////////////////////////////////
			this.genericFields = [{
				xtype : "textfield",
				name : "id",
				anchor : '95%',
				hidden : true,
				value : ""
			}, {
				xtype : "textfield",
				name : "category",
				anchor : '95%',
				hidden : true,
				value : ""
			}, {
				xtype : 'textfield',
				maxLength : 180,
				anchor : '95%',
				name : "name",
				fieldLabel : this.nameLabel,
				value : "",
				allowBlank : false
			}, {
				xtype : 'textfield',
				maxLength : 180,
				anchor : '95%',
				name : "description",
				fieldLabel : this.descriptionLabel,
				value : "",
				allowBlank : false
			},{
				xtype : 'container',
				fieldLabel : this.aoiLabel,
				items : [{
					xtype : 'fieldset',
					style : 'padding:5px;text-align: center;',
					border : false,
					columnWidth : 0.8,
					collapsible : false,
					defaults : {
						anchor : '100%'
					},
					autoHeight : true,
					layout : 'table',
					layoutConfig : {
						columns : 3
					},
					bodyStyle : 'padding:5px;',
					bodyCssClass : 'aoi-fields',
					items : [{
						layout : "form",
						cellCls : 'spatial-cell',
						labelAlign : "top",
						cls : 'center-align',
						border : false,
						colspan : 3,
						items : [me.northField]
					}, {
						layout : "form",
						cellCls : 'spatial-cell',
						labelAlign : "top",
						border : false,
						items : [me.westField]
					}, {
						layout : "form",
						cellCls : 'spatial-cell',
						border : false,
						items : [me.bboxButton]
					}, {
						layout : "form",
						cellCls : 'spatial-cell',
						labelAlign : "top",
						border : false,
						items : [me.eastField]
					}, {
						layout : "form",
						cellCls : 'spatial-cell',
						labelAlign : "top",
						border : false,
						colspan : 3,
						items : [me.southField]
					}],
					listeners : {
						"afterrender" : function() {
							var baseProj = me.mapPanel.map.getProjection();
							var projection = me.mapPanel.map.projection;
							me.mapProjection = new OpenLayers.Projection(projection);

							//create the click control
							var ClickControl = OpenLayers.Class(OpenLayers.Control, {
								defaultHandlerOptions : {
									'single' : true,
									'double' : false,
									'pixelTolerance' : 0,
									'stopSingle' : false,
									'stopDouble' : false
								},

								initialize : function(options) {
									this.handlerOptions = OpenLayers.Util.extend({}, this.defaultHandlerOptions);
									OpenLayers.Control.prototype.initialize.apply(this, arguments);
									this.handler = new OpenLayers.Handler.Click(this, {
										'click' : this.trigger
									}, this.handlerOptions);
								},
								trigger : function(e) {
									//get lon lat
									var map = this.map;
									var lonlat = map.getLonLatFromPixel(e.xy);
									//
									var geoJsonPoint = lonlat.clone();
									geoJsonPoint.transform(map.getProjectionObject(), new OpenLayers.Projection('EPSG:4326'));
									this.latitudeField.setValue(geoJsonPoint.lat);
									this.longitudeField.setValue(geoJsonPoint.lon);
									//update point on the map
									this.lonLatButton.toggle(false);
								},
								map : me.mapPanel.map
							});

							me.selectLonLat = new ClickControl();
							me.mapPanel.map.addControl(me.selectLonLat);

							me.selectBBOX = new OpenLayers.Control.SetBox({
								map : me.mapPanel.map,
								bboxProjection : new OpenLayers.Projection('EPSG:4326'),
								layerName : "BBOX",
								displayInLayerSwitcher : false,
								boxDivClassName : "olHandlerBoxZoomBox",
								aoiStyle : new OpenLayers.StyleMap({
									"default" : {
										"fillColor" : "#FFFFFF",
										"strokeColor" : "#FF0000",
										"fillOpacity" : 0.1,
										"strokeWidth" : 1
									},
									"select" : {
										"fillColor" : "#FFFFFF",
										"strokeColor" : "#FF0000",
										"fillOpacity" : 0.5,
										"strokeWidth" : 1
									},
									"temporary" : {
										"strokeColor" : "#ee9900",
										"fillColor" : "#ee9900",
										"fillOpacity" : 0.4,
										"strokeWidth" : 1
									}
								}),
								onChangeAOI : function() {
									var bounds = new OpenLayers.Bounds.fromString(this.currentAOI);
									var maxBounds = this.map.getMaxExtent().clone();
									
									var bboxBounds;

									if (this.map.getProjection() != this.bboxProjection.getCode()) {
										maxBounds  = maxBounds.transform(this.map.getProjectionObject(), this.bboxProjection);
										bboxBounds = bounds.transform(this.map.getProjectionObject(), this.bboxProjection);
									} else {
										bboxBounds = bounds;
									}

									if (
										(bboxBounds.top-me.serviceAreaLimits.top       >= me.serviceAreaLimitsTolerance) ||
										(bboxBounds.bottom-me.serviceAreaLimits.bottom <= -me.serviceAreaLimitsTolerance) ||
										(bboxBounds.left-me.serviceAreaLimits.left     <= -me.serviceAreaLimitsTolerance) ||
										(bboxBounds.right-me.serviceAreaLimits.right   >= me.serviceAreaLimitsTolerance)
									) {
										Ext.Msg.show({
				                            title: "ERROR",
				                            msg: "The selected Area is outside the map max extent. Please select an area between " + JSON.stringify(me.serviceAreaLimits, undefined, 2),
				                            width: 300,
				                            buttons : Ext.Msg.OK,
				                            icon: Ext.MessageBox.ERROR
				                        });
									} else {
										me.northField.setValue(bboxBounds.top);
										me.southField.setValue(bboxBounds.bottom);
										me.westField.setValue(bboxBounds.left);
										me.eastField.setValue(bboxBounds.right);
	
										me.fireEvent('select', this, bboxBounds);
	
										this.deactivate();
										me.bboxButton.toggle(false);
	
										me.fireEvent('onChangeAOI', bounds);
									}
								}
							});

							me.mapPanel.map.addControl(me.selectBBOX);
							me.mapPanel.map.enebaleMapEvent = true;
							//load data(defaults)
							if(me.data){
								var data = me.readData(me.data);
								//TODO for some reason, we have to wait
								//before loading data to have the map correctly 
								// initialized
								setTimeout(function(){me.loadData(data);},500);
									
								
								
							}
							//load data from GeoStore resource
							if(me.dataId){
								me.loadDataFromGeoStore(me.dataId);
							}
							me.doLayout();
							
						},
						beforecollapse : function(p) {
							var bboxLayer = me.mapPanel.map.getLayersByName("BBOX")[0];

							if (bboxLayer)
								me.mapPanel.map.removeLayer(bboxLayer);
						}
					}
				}]
			}, {
				xtype : 'container',
				layout : 'table',
				fieldLabel : this.startTimeFieldLabel,
				items : [this.updateAssetsPositionButton, this.startTime]
			}, 
			this.durationField,
			this.evaluationsField,
			{
				xtype : 'combo',
				fieldLabel : this.riskMapTypeFieldLabel,
				hiddenName : 'riskMapType',
				mode : 'local',
				store : new Ext.data.SimpleStore({
					fields : ['abbr', 'name'],
					data : [["PAG", "Piracy Attack Group Map"]]
				}),
				displayField : 'name',
				valueField : 'abbr',
				triggerAction : 'all',
				value : 'PAG',
				selectOnFocus : true,
				autoSelect : true,
				forceSelection : true,
				allowBlank : false,
				maxLength : 180,
				anchor : '95%'
			}, {
				xtype : 'fieldset',
				ref : 'assets',
				name : 'assets',
				style : 'padding:5px;',
				border : true,
				columnWidth : 0.8,
				title : this.assetsFieldTitle,
				collapsible : true,
				defaultType : 'textfield',
				defaults : {
					anchor : '100%'
				},
				layout : 'anchor',
				autoHeight : true,
				bodyStyle : 'padding:5px;',
				tbar : ["->",
				//ADD ASSET
				{
					tooltip : this.assetsAddFieldTooltip,
					ref : '../add-asset',
					iconCls : "add_ic",
					id : "add-asset-btn",
					scope : this,
					handler : function() {
						var numItems = me.assetFramePanel.items.length;
						if (numItems <= 16) {
							var asset = me.createAsset(numItems + 1);
							me.assetFramePanel.add(asset);
							me.assetFramePanel.doLayout();
							/*if (asset.collapsible && !asset.collapsed) {
							 asset.collapse();
							 }*/
						}
					}
				},
				//REMOVE ASSET
				{
					tooltip : this.assetsDelFieldTooltip,
					ref : '../rem-asset',
					iconCls : "delete_ic",
					id : "rem-asset-btn",
					scope : this,
					handler : function() {
						var numItems = me.assetFramePanel.items.length;
						if (numItems > 1) {
							me.assetFramePanel.remove(me.assetFramePanel.items.get(numItems - 1));
							me.assetFramePanel.doLayout();
						}
					}
				}],
				items : [this.assetFramePanel]
			}];
		}

		if (!this.attributeFields) {
			this.attributesFields = [];
		}

		var mainPanel = {
			frame : true,
			xtype : 'form',
			layout : 'form',
			region : 'north',
			autoScroll : true,
			ref : 'resourceform',
			border : false,
			items : this.genericFields
		};

		this.items = [mainPanel];
		this.bbar = ["->",
		//SAVE
		{
			text : this.textSave,
			tooltip : this.tooltipSave,
			ref : '../save',
			iconCls : "accept",
			id : "save-btn",
			scope : this,
			handler : function() {
				this.executeRun();
				
			}
		},
		//RESET
		{
			text : this.resetTitleText,
			tooltip : this.resetTitleText,
			ref : '../reset',
			iconCls : 'delete_ic',
			disabled : true,
			id : "reset-btn",
			scope : this,
			handler : function() { 
				/*var resource = this.getResource();
				 if(resource.id){
				 this.showPermissionPrompt(resource.id);
				 }*/
			}
		}];

		mxp.widgets.CMREOnDemandServiceInputForm.superclass.initComponent.call(this, arguments);
	},
	
	/*
	 * 
	 */
	createAsset : function(id) {
		var me = this;
		var asset = {
			xtype : 'fieldset',
			itemId : "asset-" + id,
			name : "asset-" + id,
			ref : "asset-" + id,
			style : 'padding:5px;',
			border : true,
			columnWidth: 0.8,
			title : 'Asset #' + id,
			collapsible : true,
			collapsed : false,
			defaultType : 'textfield',
			defaults : {
				anchor : '95%'
			},
			//layout: 'anchor',
			autoHeight : true,
			bodyStyle : 'padding:5px;',
			items : [{
				xtype : 'textfield',
				maxLength : 180,
				name : "id_" + id,
				ref : 'assetId',
				fieldLabel : "Id",
				value : id,
				allowBlank : false,
				readOnly : true
			}, {
				xtype : 'textfield',
				maxLength : 180,
				name : "name_" + id,
				ref : 'assetName',
				fieldLabel : "Name",
				value : "Ship " + id,
				allowBlank : false
			}, {
				xtype : 'combo',
				fieldLabel : 'Type',
				name : 'type_' + id,
				ref : 'assetType',
				mode : 'local',
				store : new Ext.data.SimpleStore({
					fields : ['value', 'name'],
					data : [["Frigate", "Frigate"]]
				}),
				displayField : 'name',
				valueField : 'value',
				triggerAction : 'all',
				value : 'Frigate',
				selectOnFocus : true,
				autoSelect : true,
				forceSelection : true,
				allowBlank : false,
				maxLength : 180
			}, {
				xtype : 'container',
				fieldLabel : "Asset Position",
				name : "asset_pos_" + id,
				ref : "assetPosition",
				items : [{
					xtype : 'fieldset',
					name : "asset_pos_field_" + id,
					style : 'padding:5px;text-align: center;',
					border : false,
					columnWidth : 0.8,
					collapsible : false,
					autoHeight : true,
					layout : 'table',
					layoutConfig : {
						columns : 3
					},
					bodyStyle : 'padding:5px;',
					bodyCssClass : 'aoi-fields',
					items : [{
						layout : "form",
						name : 'lon0_form_' + id,
						cellCls : 'spatial-cell',
						labelAlign : "top",
						cls : 'center-align',
						border : false,
						items : [{
							xtype : 'numberfield',
							name : 'lon0_' + id,
							ref : '../../longitudeField',
							fieldLabel : 'Lon',
							allowBlank : false,
							minValue : me.serviceAreaLimits.left,
							maxValue : me.serviceAreaLimits.right,
							maxLength : 7,
							decimalPrecision : 3
						}]
					}, {
						layout : "form",
						name : 'lon0_lat0_form_' + id,
						cellCls : 'spatial-cell',
						labelAlign : "top",
						cls : 'center-align',
						border : false,
						items : [{
							xtype : 'button',
							name : 'lon0_lat0_btn_' + id,
							ref : '../../lonLatButton',
							enableToggle : true,
                            toggleGroup: "mapControls",
							iconCls : 'geolocation_ic',
							height : 32,
							width : 32,
							listeners : {
								scope : this,
								toggle : function(button, pressed) {
									if (pressed) {
										me.selectLonLat.lonLatButton = this.resourceform.assets.assetsform.get("asset-" + id).assetPosition.lonLatButton;
										me.selectLonLat.latitudeField = this.resourceform.assets.assetsform.get("asset-" + id).assetPosition.latitudeField;
										me.selectLonLat.longitudeField = this.resourceform.assets.assetsform.get("asset-" + id).assetPosition.longitudeField;
										me.selectLonLat.activate();
									} else {
										me.selectLonLat.deactivate();
									}
								}
							}
						}]
					}, {
						layout : "form",
						name : 'lat0_form_' + id,
						cellCls : 'spatial-cell',
						labelAlign : "top",
						cls : 'center-align',
						border : false,
						items : [{
							xtype : 'numberfield',
							name : 'lat0_' + id,
							ref : '../../latitudeField',
							fieldLabel : 'Lat',
							allowBlank : false,
							minValue : me.serviceAreaLimits.bottom,
							maxValue : me.serviceAreaLimits.top,
							maxLength : 7,
							decimalPrecision : 3
						}]
					}],
					listeners : {
						"afterlayout" : function() {
						},
						beforecollapse : function(p) {
						}
					}
				}]
			}, {
				xtype : 'numberfield',
				name : 'obs_range_' + id,
				ref : 'assetObsRange',
				fieldLabel : 'Obs. Range',
				allowBlank : false,
				maxLength : 8,
				decimalPrecision : 3,
				minValue : 0,
				// set maxlength to 5 on input field
				autoCreate : {
					tag : 'input',
					type : 'text',
					size : '20',
					autocomplete : 'off',
					maxlength : '6'
				},
				validator : function(val) {
					if (!Ext.isEmpty(val) && val >= 0) {
						return true;
					} else {
						return "Value cannot be empty and must be a number equal or greater than 0";
					}
				},
				renderer : function(value, metaData, record, rowIndex, colIndex, store, view) {
					Ext.util.Format.number(value, '0.000');
					return value;
				}
			}, {
				xtype : 'numberfield',
				name : 'heading_' + id,
				ref : 'assetHeading',
				fieldLabel : 'Heading',
				allowBlank : false,
				anchor : '95%',
				maxLength : 6,
				decimalPrecision : 3,
				minValue : 0,
				// set maxlength to 5 on input field
				autoCreate : {
					tag : 'input',
					type : 'text',
					size : '20',
					autocomplete : 'off',
					maxlength : '6'
				},
				validator : function(val) {
					if (!Ext.isEmpty(val) && 0 <= val && val <= 6.283) {
						return true;
					} else {
						return "Value cannot be empty and must be a number between [0 - 6.283]";
					}
				},
				renderer : function(value, metaData, record, rowIndex, colIndex, store, view) {
					Ext.util.Format.number(value, '0.000');
					return value;
				}
			}, {
				xtype : 'numberfield',
				name : 'cost_' + id,
				ref : 'assetCost',
				fieldLabel : 'Cost',
				allowBlank : false
			}, {
				xtype : 'numberfield',
				name : 'pfa_' + id,
				ref : 'assetPfa',
				fieldLabel : 'Pfa',
				allowBlank : false,
				maxLength : 5,
				decimalPrecision : 3,
				minValue : 0.000,
				maxValue : 1.000,
				// set maxlength to 5 on input field
				autoCreate : {
					tag : 'input',
					type : 'text',
					size : '20',
					autocomplete : 'off',
					maxlength : '6'
				},
				validator : function(val) {
					if (!Ext.isEmpty(val) && 0 <= val && val <= 1) {
						return true;
					} else {
						return "Value cannot be empty and must be a number between [0 - 1]";
					}
				},
				renderer : function(value, metaData, record, rowIndex, colIndex, store, view) {
					Ext.util.Format.number(value, '0.000');
					return value;
				}
			}, {
				xtype : 'numberfield',
				name : 'pd_' + id,
				ref : 'assetPd',
				fieldLabel : 'Pd',
				allowBlank : false,
				maxLength : 5,
				decimalPrecision : 3,
				minValue : 0.000,
				maxValue : 1.000,
				// set maxlength to 5 on input field
				autoCreate : {
					tag : 'input',
					type : 'text',
					size : '20',
					autocomplete : 'off',
					maxlength : '6'
				},
				validator : function(val) {
					if (!Ext.isEmpty(val) && 0 <= val && val <= 1) {
						return true;
					} else {
						return "Value cannot be empty and must be a number between [0 - 1]";
					}
				},
				renderer : function(value, metaData, record, rowIndex, colIndex, store, view) {
					Ext.util.Format.number(value, '0.000');
					return value;
				}
			}, {
				xtype : 'numberfield',
				name : 'min_speed_' + id,
				ref : 'assetMinSpeed',
				fieldLabel : 'Min Speed',
				allowBlank : false,
				maxLength : 6,
				decimalPrecision : 3,
				minValue : 0,
				// set maxlength to 5 on input field
				autoCreate : {
					tag : 'input',
					type : 'text',
					size : '20',
					autocomplete : 'off',
					maxlength : '6'
				},
				validator : function(val) {
					if (!Ext.isEmpty(val) && 0 <= val && val <= 20) {
						return true;
					} else {
						return "Value cannot be empty and must be a number between [0 - 20]";
					}
				},
				renderer : function(value, metaData, record, rowIndex, colIndex, store, view) {
					Ext.util.Format.number(value, '0.000');
					return value;
				}
			}, {
				xtype : 'numberfield',
				name : 'max_speed_' + id,
				ref : 'assetMaxSpeed',
				fieldLabel : 'Max Speed',
				allowBlank : false,
				maxLength : 6,
				decimalPrecision : 3,
				minValue : 0,
				// set maxlength to 5 on input field
				autoCreate : {
					tag : 'input',
					type : 'text',
					size : '20',
					autocomplete : 'off',
					maxlength : '6'
				},
				validator : function(val) {
					if (!Ext.isEmpty(val) && 0 <= val && val <= 20) {
						return true;
					} else {
						return "Value cannot be empty and must be a number between [0 - 20]";
					}
				},
				renderer : function(value, metaData, record, rowIndex, colIndex, store, view) {
					Ext.util.Format.number(value, '0.000');
					return value;
				}
			}, {
				xtype : 'numberfield',
				name : 'min_heading_' + id,
				ref : 'assetMinHeading',
				fieldLabel : 'Min Heading',
				allowBlank : false,
				maxLength : 6,
				decimalPrecision : 3,
				minValue : -1.8,
				// set maxlength to 5 on input field
				autoCreate : {
					tag : 'input',
					type : 'text',
					size : '20',
					autocomplete : 'off',
					maxlength : '6'
				},
				validator : function(val) {
					if (!Ext.isEmpty(val) && -1.8 <= val && val <= 1.8) {
						return true;
					} else {
						return "Value cannot be empty and must be a number between [-1.8 - +1.8]";
					}
				},
				renderer : function(value, metaData, record, rowIndex, colIndex, store, view) {
					Ext.util.Format.number(value, '0.000');
					return value;
				}
			}, {
				xtype : 'numberfield',
				name : 'max_heading_' + id,
				ref : 'assetMaxHeading',
				fieldLabel : 'Max Heading',
				allowBlank : false,
				maxLength : 6,
				decimalPrecision : 3,
				minValue : -1.8,
				// set maxlength to 5 on input field
				autoCreate : {
					tag : 'input',
					type : 'text',
					size : '20',
					autocomplete : 'off',
					maxlength : '6'
				},
				validator : function(val) {
					if (!Ext.isEmpty(val) && -1.8 <= val && val <= 1.8) {
						return true;
					} else {
						return "Value cannot be empty and must be a number between [-1.8 - +1.8]";
					}
				},
				renderer : function(value, metaData, record, rowIndex, colIndex, store, view) {
					Ext.util.Format.number(value, '0.000');
					return value;
				}
			}],
            loadData: function(data){
                    var asset = data;
                    var assetFieldSet =this;
                    assetFieldSet.assetCost.setValue(asset.cost);
					assetFieldSet.assetId.setValue(asset.id);
					assetFieldSet.assetMaxHeading.setValue(asset.maxHeading);
					assetFieldSet.assetMaxSpeed.setValue(asset.maxSpeed);
					assetFieldSet.assetMinHeading.setValue(asset.minHeading);
					assetFieldSet.assetMinSpeed.setValue(asset.minSpeed);
					assetFieldSet.assetName.setValue(asset.name);
					assetFieldSet.assetObsRange.setValue(asset.obsRange);
					assetFieldSet.assetPd.setValue(asset.Pd);
					assetFieldSet.assetPfa.setValue(asset.Pfa);
					assetFieldSet.assetHeading.setValue(asset.heading0);
					assetFieldSet.assetType.setValue(asset.type);
					assetFieldSet.assetPosition.longitudeField.setValue(asset.lon0);
					assetFieldSet.assetPosition.latitudeField.setValue(asset.lat0);
            },
            getData: function(){
                var asset = this;
                var lonLat = new OpenLayers.Geometry.Point(asset.assetPosition.longitudeField.getValue(), asset.assetPosition.latitudeField.getValue());    
                var data = {
                    cost: parseFloat(asset.assetCost.getValue()),
                    id: parseInt(asset.assetId.getValue()),
                    maxHeading: parseFloat(asset.assetMaxHeading.getValue()),
                    maxSpeed: parseFloat(asset.assetMaxSpeed.getValue()),
                    minHeading: parseFloat(asset.assetMinHeading.getValue()),
                    minSpeed: parseFloat(asset.assetMinSpeed.getValue()),
                    name: asset.assetName.getValue(),
                    obsRange: parseFloat(asset.assetObsRange.getValue()),
                    Pd: parseFloat(asset.assetPd.getValue()),
                    Pfa: parseFloat(asset.assetPfa.getValue()),
                    /*position: {
                        lon: lonLat.x,
                        lat: lonLat.y,
                        x: geoJsonPoint.x,
                        y: geoJsonPoint.y
                    },*/
                    heading0: parseFloat(asset.assetHeading.getValue()),
                    lon0: parseFloat(lonLat.x),
                    lat0: parseFloat(lonLat.y),				
                    type: asset.assetType.getValue()
                };
                return data;
            },
            buttons: [{
                iconCls: 'clone_map',
                tooltip: me.cloneThisAssetText,
                ref:'../cloneBtn',
                handler: function(){
                    var asset = this.refOwner;
                    var data = asset.getData();
                    data.id = me.assetFramePanel.items.length + 1;  
                    var newAsset = me.createAsset(data.id);
                    var 
                    newAsset = me.resourceform.assets.assetsform.add(newAsset);
                    newAsset.loadData(data);
                    me.resourceform.doLayout();
                    
                    
                }
            }]
		};

		return asset;
	},

	/**
	 * api: method[executeRun]
	 * Save the resource in the form to GeoStore
	 */
	executeRun : function() {
		//new execution
		var me = this;

		//check forms validity
		if(!this.resourceform.getForm().isValid() && 
		   !this.assetFramePanel.getForm().isValid()) {
		   	Ext.Msg.show({
				title : me.executeRunTitle,
				msg : me.executeRunMessage,
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.ERROR
			});
			
			return;
		}

		//prepare and send inputs
		var map = this.mapPanel.map;
		var serviceRunInputs = this.resourceform.getForm().getValues();
		//serviceRunInputs.assets = this.assetFramePanel.getForm().getValues();
		serviceRunInputs.assets = [];
		
		for( var i=0; i<this.resourceform.assets.assetsform.items.length; i++) {
			var asset = this.resourceform.assets.assetsform.items.get(i);
			var lonLat = new OpenLayers.Geometry.Point(asset.assetPosition.longitudeField.getValue(), asset.assetPosition.latitudeField.getValue());
			var geoJsonPoint = lonLat.clone();
				geoJsonPoint.transform(new OpenLayers.Projection('EPSG:4326'), map.getProjectionObject());

			serviceRunInputs.assets[i] = {
				cost: parseFloat(asset.assetCost.getValue()),
				id: parseInt(asset.assetId.getValue()),
				maxHeading: parseFloat(asset.assetMaxHeading.getValue()),
				maxSpeed: parseFloat(asset.assetMaxSpeed.getValue()),
				minHeading: parseFloat(asset.assetMinHeading.getValue()),
				minSpeed: parseFloat(asset.assetMinSpeed.getValue()),
				name: asset.assetName.getValue(),
				obsRange: parseFloat(asset.assetObsRange.getValue()),
				Pd: parseFloat(asset.assetPd.getValue()),
				Pfa: parseFloat(asset.assetPfa.getValue()),
				/*position: {
					lon: lonLat.x,
					lat: lonLat.y,
					x: geoJsonPoint.x,
					y: geoJsonPoint.y
				},*/
				heading0: parseFloat(asset.assetHeading.getValue()),
				lon0: parseFloat(lonLat.x),
				lat0: parseFloat(lonLat.y),				
				type: asset.assetType.getValue()
			};
		}
		
		serviceRunInputs.category = me.category;
		
		var geoJsonInputs = JSON.stringify(serviceRunInputs, undefined, 2);

		//send to [POST] osdi2ManagerRestURL + "services/" + serviceId
		var runUrl = me.osdi2ManagerRestURL + "services/" + me.serviceId + "?category=" + me.category;
		
		var finish = function(response) {
			me.setLoading(false);
			me.saveSuccess();
			me.fireEvent("save", response);
			me.fireEvent('execute',this);
		};
		
		var finishError = function(response) {
			me.setLoading(false);
			me.fireEvent("save", null);
			Ext.Msg.show({
				title : me.failSaveTitle,
				msg : response.statusText + "(status " + response.status + "):  ",
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.ERROR
			});
		};

		me.startServiceExecution(runUrl, geoJsonInputs, finish, finishError);
	/*
		var createFinish = function(response) {
			console.log(response);
			var win = me.showPermissionPrompt(response);
			finish(response);
		};
		//CREATE resource
		if (resource && !resource.id) {
			//category must be indicated
			if (!resource.category || resource.category == "") {
				//assign the catgory
				resource.category = this.category;
			}
			this.setLoading(true, this.savingMessage);
			this.resourceManager.create(resource,
			//SUCCESS
			createFinish,
			//FAIL
			finishError);
			//UPDATE resource
		} else if (resource && resource.id) {
			this.resourceManager.update(resource.id, resource,
			//SUCCESS
			function(response) {
				if (me.startServiceExecutionStoredData) {
					me.startServiceExecution(resource.id, resource.blob, finish, finishError);
				} else {
					finish(response);
				}
			}, finishError);
		}
	*/

	},
	/**
	 * api: method[setLoading]
	 * Load the resource in the form
	 * Parameters:
	 * record - {Ext.record} the record of GeoStore resource. must have id attribute at least
	 * Return:
	 */
	loadResource : function(record) {
		//load record
		var resourceId;
		if (record) {
			resourceId = record.get('id');
			this.general.getForm().loadRecord(record);
		}

		if (resourceId) {

			this.setLoading(true, this.loadingMessage);
			var me = this;
			this.resourceManager.findByPk(resourceId,
			//Full Resource Load Success
			function(data) {
				//fill the form
				if (!data) {
					Ext.Msg.show({
						title : me.failSaveTitle,
						msg : response.statusText + "(status " + response.status + "):  ",
						buttons : Ext.Msg.OK,
						icon : Ext.MessageBox.ERROR
					});
				}
				
				var r2 = new record.store.recordType(data);
				var form = me.general.getForm();
				form.loadRecord(r2);
				//fill attributes
				var attributes = r2.get("attributes");
				for (var attname in attributes) {
					var field = form.findField("attribute." + attname);
					if (field) {
						field.setValue(attributes[attname].value);
					} else {
						//Add attribute field
						me.general.attributeColumn.add({
							xtype : 'textfield',
							id : 'attribute.' + attname,
							anchor : '95%',
							fieldLabel : attname,
							name : 'attribute.' + attname,
							value : attributes[attname].value
						});
						me.general.attributeColumn.doLayout();
					}

				}
				//load resource. If the editor has a load resource
				//method defined, call it to load the stored data
				// in the editor
				me.resource.getResourceEditor().loadResourceData(r2.get('blob'));
				//enable or disable save button
				me.save.setDisabled(!(record.get('canEdit') === true));
				me.permission.setDisabled(!(record.get('canEdit') === true));
				me.setLoading(false);
				//TODO load visibility
			}, {
				full : true
			});

		}
		//get visibility

	},
	/**
	 * private: method[setLoading]
	 * Shows loading mask
	 */
	setLoading : function(enable, message) {
		if (enable && !this.myMask) {
			this.myMask = new Ext.LoadMask(Ext.getBody(), {
				msg : message || this.loadingMessage
			});
			this.myMask.show();
		}
		if (!enable && this.myMask) {
			this.myMask.hide();
			this.myMask = null;
		}

	},

	/**
	 * private: method[startServiceExecution]
	 *  Start a new Service Execution. 
	 */
	startServiceExecution : function(url, blob, successCallback, failureCallback) {
		this.setLoading(true);
		
		var method = 'POST';
		var contentType = 'application/json';

		Ext.Ajax.request({
			url : url,
			method : method,
			headers : {
				'Content-Type' : contentType,
				'Accept' : 'application/json, text/plain, text/xml',
				'Authorization' : this.auth
			},
			params : blob,
			scope : this,
			success : function(responseText) {
				successCallback(id);
			},
			failure : failureCallback
		});
	},
	saveSuccess : function() {
		Ext.MessageBox.show({
			title : this.saveSuccessTitle,
			msg : this.saveSuccessMessage,
			buttons : Ext.Msg.OK,
			icon : Ext.MessageBox.INFO
		});
	},
	/**
	 * private: method[showPermissionPrompt]
	 *  Show the permission prompt for the resource for witch
	 *  the id is a parameter
	 * Parameters:
	 * id - long - the id of the resource
	 * Returns:
	 * the window
	 */
	showPermissionPrompt : function(id) {
		var winPermission = new mxp.widgets.ResourceGroupPermissionWindow({
			resourceId : id,
			title : this.resetTitleText,
			auth : this.auth,
			geostoreURL : this.geoStoreBase,
			target : this.target
		});
		winPermission.show();
		return winPermission;
	}, 
	
	/** private: method[loadData]
	 *  Load data from a record
	 */
	loadData: function (record){
		//load record
		this.resourceform.getForm().loadRecord(record);
		
		//
		//load assets
		//
		
		//create missing assets
		var nCurrent = this.resourceform.assets.items.length;
		var assetsData = record.get('assets');
		if(assetsData){
			var nData = assetsData.length;
			var nMissing = nData  - nCurrent;
			if(nMissing > 0){
				for(var i = nCurrent; i< nData; i++ ){
					this.resourceform.assets.assetsform.add(this.createAsset(i+1));
				}
			}
			
			//fill assets data
			for(var i = 0; i< assetsData.length; i++ ){
				var assetFieldSet = this.resourceform.assets.assetsform.items.get(i);
					var asset = assetsData[i];
				
					assetFieldset.loadData(assetData[i]);
			}
		}
		// Load Map
		var bboxAvailable = record.get('East_BBOX') &&  record.get('North_BBOX') && record.get('West_BBOX')&& record.get('South_BBOX');
		if(bboxAvailable){
			var map = this.mapPanel.map;
			var aoi= new OpenLayers.Bounds(
				record.get('West_BBOX'),
			    record.get('South_BBOX'),
			    record.get('East_BBOX'),
			    record.get('North_BBOX')
			);
			// note map projection object could not be initialized yet
			// so lets create it's projection object
			var mapPrj = new OpenLayers.Projection(map.projection);
			this.selectBBOX.setAOI(aoi.transform(new OpenLayers.Projection('EPSG:4326'), mapPrj),true);
			
		}
	},
	
	/** private: method[loadDataFromGeoStore]
	 *  Load data from GeoStore using the resource id
	 */
	loadDataFromGeoStore:function(dataId){
		var mask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait..."});
		mask.show();
		var successHandler = function(response,opts){
			 try{
			 	var data = this.readData(Ext.decode(response.responseText));
			 	this.loadData(data);
			 	
			 }catch(e){
			 	
			 	this.loadFail();
			 }
			 mask.hide();
			 this.doLayout();
			 
			 
		};
		var failureHandler = function(){
			 mask.hide();
			 this.loadFail();
		};
		Ext.Ajax.request({
		   url: this.geoStoreBase + '/data/' + dataId,
		   
		   success: successHandler,
		   failure: failureHandler,
		   scope: this,
		   headers: {
		       'Authorization':this.auth
		   }
		});
		
	},
	
	/** private: method[readData]
	 *  read json data to provide a record to load
	 */
	readData : function(data){
		 var FormRecord = Ext.data.Record.create([ // creates a subclass of Ext.data.Record
		    'East_BBOX',
		    'North_BBOX',
		    'South_BBOX',
		    'West_BBOX',
		    'category',
		    'description',
		    'id',
		    'name',
		    'numberOfEvaluations',
		    'referenceDate',
		    'riskMapType',
		    'timeHorizon',
		    'assets'
		    
		]);
		return new FormRecord(data);
	},
	
	/** private: method[failLoad]
	 *  show a message about fail loading data in the store
	 */
	loadFail : function(){
		Ext.Msg.show({
            title: "ERROR",
            msg: "Unable to Load the previous Resource",//TODO i18n
            width: 300,
            buttons : Ext.Msg.OK,
            icon: Ext.MessageBox.ERROR
         });
	},
});
Ext.reg(mxp.widgets.CMREOnDemandServiceInputForm.prototype.xtype, mxp.widgets.CMREOnDemandServiceInputForm); 