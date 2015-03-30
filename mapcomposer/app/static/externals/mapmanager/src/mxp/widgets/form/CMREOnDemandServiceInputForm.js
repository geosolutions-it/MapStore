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
	optToolCategory: "OPT_TOOL_CONFIGS",
	layout: 'fit',
	//global variables
	osdi2ManagerRestURL : null,
	serviceName : null,
	mapPanel : null,
	vectorLayer : null,
	maxAllowedTimeHorizon : 72,
	riskMapTypes : {},
	serviceAreaLimitsTolerance : 0.01,
	serviceAreaLimits : {
		bottom: -90,
		left: -180,
		right: 180,
		top: 90
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
	saveSuccessMessage : "Process launched successfully.",
	executeRunTitle : "Could not start the Execution",
	executeRunMessage : "The provided inputs are not valid or not complete. Please, check carefully the provided values.",
	resourceNotValid : "Resource not valid",
	deleteSuccessMessage : "Resource Deleted Successfully",
	
	updateAssetsPositionButtonText : "Update Assets Position",
	updateAssetsPositionButtonTooltip : "When copying the parameters from an existing run, it's possible to try updating the position automatically accordingly to the selected date/time.",
	updateAssetsPositionButtonConfirm : "Retrieve initial assets positions from previous run, using the following weights for the costs: ",
	updateAssetsPositionButtonWarning : "No asset position available for the selected data. Please select a valid date inside the run time horizon!",
    errorGettingAssetTypesMessage: "Error while getting asset types from server. Please contact the administrator",
    
	northFieldLabel: 'North',
	southFieldLabel: 'South',
	eastFieldLabel: 'East',
	westFieldLabel: 'West',
	bboxButtonLabel: 'Area',
	bboxButtonTooltip: 'Select Area of Interest. Must be equal or less than the service max extent.',
	
	aoiLabel: "Area of Interest",
	durationFieldLabel: "Duration (h)",
	numberOfEvaluationsFieldLabel: "Num. of Evaluations",
	startTimeFieldLabel: "Start Time",
	riskMapTypeFieldLabel: 'Risk Map Type',
	assetsFieldTitle: 'Assets',
	assetsAddFieldTooltip: "Add a new Asset",
	assetsDelFieldTooltip: "Remove an Asset",
    cloneThisAssetText:'Clone this asset',
	titleConfirmResetMsg:"Confirm form reset",
	textConfirmResetMsg:"Reset all form fields?",
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
				var bboxAvailable = record.get('maxlon') &&  record.get('maxlat') && record.get('minlon')&& record.get('minlat');
			    if(bboxAvailable){
					var map = me.mapPanel.map;
					var aoi= new OpenLayers.Bounds(
						record.get('minlon'),
					    record.get('minlat'),
					    record.get('maxlon'),
					    record.get('maxlat')
					);
					// note map projection object could not be initialized yet
					// so lets create it's projection object
					var mapPrj = new OpenLayers.Projection(map.projection);
					me.selectBBOX.setAOI(aoi.transform(new OpenLayers.Projection('EPSG:4326'), mapPrj),true);
			 	}
		   };
			this.northField = new Ext.form.NumberField({
				fieldLabel : this.northFieldLabel,
				name: 'maxlat',
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
				name: 'minlon',
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
				name: 'maxlon',
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
				name: 'minlat',
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
					click : function(button, evt) {
						if (this.startTime.value == null) {
							Ext.Msg.show({
	                            title: "ERROR",
	                            msg: "Please select a valid Start Time.",
	                            width: 300,
	                            buttons : Ext.Msg.OK,
	                            icon: Ext.MessageBox.ERROR
	                        });
						} else {
							if (this.resourceMapId) {
								this.updatePosition(this.resourceMapId);
							} else {
								this.loadResourceFromGeoStore(this.dataId);
							}
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
				value : this.maxAllowedTimeHorizon,
				minValue : 0,
				maxValue : this.maxAllowedTimeHorizon,
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
									//add point feature to the map
									var mapPrj = new OpenLayers.Projection(map.projection);
									var point = new OpenLayers.Geometry.Point(geoJsonPoint.lon, geoJsonPoint.lat);
									    point.transform(new OpenLayers.Projection('EPSG:4326'), mapPrj);
									var pointFeature = new OpenLayers.Feature.Vector(point);
									//set order for label.
									var asset_id = (this.lonLatButton.name.substring(this.lonLatButton.name.lastIndexOf("_")+1));
									pointFeature.attributes.order = parseInt(asset_id);
									
									for (var f=0; f<me.vectorLayer.features.length; f++) {
										if (me.vectorLayer.features[f].attributes.order === parseInt(asset_id)) {
											me.vectorLayer.removeFeatures([me.vectorLayer.features[f]],true);
										}
									}
									
									me.vectorLayer.addFeatures([pointFeature]);
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

							if(me.dataId){
								//load data from GeoStore resource
								me.loadDataFromGeoStore(me.dataId);
							}else if(me.defaultData){
								//load data(defaults)
								var data = me.readData(me.defaultData);
								//TODO for some reason, we have to wait
								//before loading data to have the map correctly 
								// initialized
								setTimeout(function(){me.loadData(data);},500);
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
					data : this.getRiskMapTypeDataStores()
				}),
				displayField : 'name',
				valueField : 'abbr',
				triggerAction : 'all',
				//value : 'PAG',
				selectOnFocus : true,
				autoSelect : true,
				forceSelection : true,
				allowBlank : false,
				maxLength : 180,
				anchor : '95%',
				listeners : {
					// SHOW /Hide distance units for DWITHIN
					select : function(c, record, index) {
						var map = this.mapPanel.map;
						var riskMapObj = eval("this.riskMapTypes."+record.json[0]);
						
						var bounds = new OpenLayers.Bounds(
								parseFloat(riskMapObj.defaultData.minlon),
								parseFloat(riskMapObj.defaultData.minlat),
								parseFloat(riskMapObj.defaultData.maxlon),
								parseFloat(riskMapObj.defaultData.maxlat)
						);
						var maxBounds = map.getMaxExtent().clone();
						
						var bboxBounds;

						if (this.selectBBOX.map.getProjection() != ("EPSG:"+riskMapObj.requestCRS)) {
							var bboxProjection = new OpenLayers.Projection("EPSG:"+riskMapObj.requestCRS);
							bboxBounds = bounds.transform(bboxProjection, this.selectBBOX.map.getProjectionObject());
						} else {
							bboxBounds = bounds;
						}
						
						this.selectBBOX.currentAOI = bboxBounds.left+","+bboxBounds.bottom+","+bboxBounds.right+","+bboxBounds.top;
						this.selectBBOX.onChangeAOI();
						this.selectBBOX.setAOI(bboxBounds,true);
					},
					scope : this
				}
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
							
							for (var f=0; f<me.vectorLayer.features.length; f++) {
								if (me.vectorLayer.features[f].attributes.order === parseInt(numItems)) {
									me.vectorLayer.removeFeatures([me.vectorLayer.features[f]],true);
								}
							}
							
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
			disabled : false,
			id : "reset-btn",
			scope : this,
			handler : function() {  
				Ext.Msg.confirm(this.titleConfirmResetMsg, this.textConfirmResetMsg, function(btn) {
						if (btn == 'yes') {
							this.resetForm();
						}
				},this);
			}
		}];

		mxp.widgets.CMREOnDemandServiceInputForm.superclass.initComponent.call(this, arguments);
	},
	getRiskMapTypeDataStores: function(){
		var riskMapType = [];
		
		for(ri in this.riskMapTypes) {
			var riskMapObj = eval("this.riskMapTypes."+ri);
			riskMapType.push([ri, riskMapObj.description]);
		}
		
		return riskMapType;
	},
	resetForm: function(){
		var resourceform = this.resourceform;
		var assetsform = resourceform.assets.assetsform;
		resourceform.getForm().reset();
		assetsform.removeAll();
		assetsform.add(this.createAsset(1));
		if(this.defaultData){
			var data = this.readData(this.defaultData);
			this.loadData(data);
		}
		assetsform.doLayout();
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
			labelWidth:200,
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
				store: new MapStore.data.GeoStoreStore({
                    categoryName: "ASSETPRESETS",
                    geoStoreBase: me.geoStoreBase,
                    currentFilter: '*',
                    includeAttributes:true,
                    auth: me.auth,
                    idProperty: 'id',
                    fields: [
                        'id',
                        'name',
                        'type',
                        'minSpeed',
                        "maxSpeed",
                        "maxHeading",
                        "minHeading",
                        "lat0",
                        "lon0",
                        "heading0",
                        "cost",
                        "obsRange",
                        "Pd",
                        "Pfa"
                    ],
                    sortInfo: { field: "type", direction: "ASC" },
                    listeners: {
                        exception: function(proxy, type, action, options, response) {
                            Ext.Msg.show({
                               msg: this.errorGettingAssetTypesMessage,
                               buttons: Ext.Msg.OK,
                               icon: Ext.MessageBox.ERROR
                            });
                        },
                        load: function(store) {
                        	if (!this.assetFramePanel.get(parseInt(id)-1).assetType.getValue()) {
                        		this.assetFramePanel.get(parseInt(id)-1).assetType.setValue(store.getAt(0).get('type'));
                        	}
                        },

                        scope: this
                    }
                }),
                listeners: {
                    select: function(combo,record,index){
                        var id = combo.refOwner.assetId.getValue();
                        var name = record.get('name');
                        name = name ? name + (name.indexOf('(') == 0 ? "" : " " + id) : "";
                        var data = Ext.apply({},record.data);
                        data.id = id;
                        data.name = name;
                        combo.refOwner.loadData(data);
                    }
                },
				displayField : 'type',
				valueField : 'type',
				triggerAction : 'all',
				value : '',
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
					//bodyStyle : 'padding:5px;',
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
							width:110,
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
							width:110,
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
				fieldLabel : 'Observation Range (m)',
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
			},{
				xtype : 'numberfield',
				name : 'heading_' + id,
				ref : 'assetHeading',
				fieldLabel : 'Heading (rad)',
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
			},{
				xtype : 'numberfield',
				name : 'cost_' + id,
				ref : 'assetCost',
				fieldLabel : 'Avg. Mission cost by Km (USD)',
				allowBlank : false
			},{
				xtype : 'numberfield',
				name : 'pfa_' + id,
				ref : 'assetPfa',
				fieldLabel : 'Probability of false alarm',
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
			},{
				xtype : 'numberfield',
				name : 'pd_' + id,
				ref : 'assetPd',
				fieldLabel : 'Probability of Detection',
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
			},  {
				xtype : 'numberfield',
				name : 'min_speed_' + id,
				ref : 'assetMinSpeed',
				fieldLabel : 'Min Speed (m/s)',
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
					if (!Ext.isEmpty(val) && 0 <= val && val <= 30) {
						return true;
					} else {
						return "Value cannot be empty and must be a number between [0 - 30]";
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
				fieldLabel : 'Max Speed (m/s)',
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
					if (!Ext.isEmpty(val) && 0 <= val && val <= 30) {
						return true;
					} else {
						return "Value cannot be empty and must be a number between [0 - 30]";
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
				fieldLabel : 'Min Heading (rad)',
				allowBlank : false,
				maxLength : 6,
				decimalPrecision : 3,
				minValue : -3,
				// set maxlength to 5 on input field
				autoCreate : {
					tag : 'input',
					type : 'text',
					size : '20',
					autocomplete : 'off',
					maxlength : '6'
				},
				validator : function(val) {
					if (!Ext.isEmpty(val) && -3 <= val && val <= 3 ){
						return true;
					} else {
						return "Value cannot be empty and must be a number between [-3 - +3]";
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
				fieldLabel : 'Max Heading (rad)',
				allowBlank : false,
				maxLength : 6,
				decimalPrecision : 3,
				minValue : -3,
				// set maxlength to 5 on input field
				autoCreate : {
					tag : 'input',
					type : 'text',
					size : '20',
					autocomplete : 'off',
					maxlength : '6'
				},
				validator : function(val) {
					if (!Ext.isEmpty(val) && -3 <= val && val <= 3) {
						return true;
					} else {
						return "Value cannot be empty and must be a number between [-3 - +3]";
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
					//add point feature to the map
					var mapPrj = new OpenLayers.Projection(me.mapPanel.map.projection);
					var point = new OpenLayers.Geometry.Point(asset.lon0, asset.lat0);
						point.transform(new OpenLayers.Projection('EPSG:4326'), mapPrj);
					var pointFeature = new OpenLayers.Feature.Vector(point);
					//set order for label.
            		pointFeature.attributes.order = parseInt(asset.id);
            		
            		for (var f=0; f<me.vectorLayer.features.length; f++) {
						if (me.vectorLayer.features[f].attributes.order === parseInt(asset.id)) {
							me.vectorLayer.removeFeatures([me.vectorLayer.features[f]],true);
						}
					}
					            		
					me.vectorLayer.addFeatures([pointFeature]);
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
		if(!this.resourceform.getForm().isValid() || 
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
		
		var riskMapObj = eval("this.riskMapTypes."+serviceRunInputs.riskMapType);
		
		serviceRunInputs.owsBaseURL = riskMapObj.owsBaseURL;
		serviceRunInputs.owsService = riskMapObj.owsService;
		serviceRunInputs.owsVersion = riskMapObj.owsVersion;
		serviceRunInputs.owsResourceIdentifier = riskMapObj.owsResourceIdentifier;
		serviceRunInputs.requestCRS = riskMapObj.requestCRS;
		serviceRunInputs.timeResolution = riskMapObj.timeResolution;
		
		//Remove serviceRunInputs.riskMapType reference
		delete serviceRunInputs.riskMapType;
		
		//Adding metocs
		serviceRunInputs.metocs = [];
		
		if (riskMapObj.metocs) {
			for( var m=0; m<riskMapObj.metocs.length; m++) {
				serviceRunInputs.metocs[m] = {
					sourceId: riskMapObj.metocs[m].sourceId,
					title: riskMapObj.metocs[m].title,
					owsBaseURL: riskMapObj.metocs[m].owsBaseURL,
					owsService: riskMapObj.metocs[m].owsService,
					owsVersion: riskMapObj.metocs[m].owsVersion,
					owsResourceIdentifier: riskMapObj.metocs[m].owsResourceIdentifier,
					referenceTimeDim: riskMapObj.metocs[m].referenceTimeDim
				};
			}			
		}
		
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
					assetFieldSet.loadData(asset);
			}
		}
		// Load Map
		var bboxAvailable = record.get('maxlon') &&  record.get('maxlat') && record.get('minlon')&& record.get('minlat');
		if(bboxAvailable){
			var map = this.mapPanel.map;
			var aoi= new OpenLayers.Bounds(
				record.get('minlon'),
			    record.get('minlat'),
			    record.get('maxlon'),
			    record.get('maxlat')
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
			 	this.updateAssetsPositionButton.enable();
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
		   url: this.geoStoreBase + 'data/' + dataId,
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
		    'maxlon',
		    'maxlat',
		    'minlat',
		    'minlon',
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
            msg: "Unable to Load the Remote Resource",//TODO i18n
            width: 300,
            buttons : Ext.Msg.OK,
            icon: Ext.MessageBox.ERROR
         });
	},

	/** private: method[loadResourceFromGeoStore]
	 *  Load data from GeoStore using the resource name (WPS execution ID)
	 */
	loadResourceFromGeoStore:function(dataId){
		var mask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait..."});
		mask.show();
		
		var successHandler = function(response,opts){
			 try{
			 	var dq = Ext.DomQuery;
      			var xml = response.responseXML;
      			this.resourceId = dq.selectValue('Resource/name', xml);
      			this.resourceStatus = xml.evaluate('//Resource/Attributes/attribute[name="status"]/value', xml, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue.textContent;
      			if (this.resourceStatus == "SUCCESS") {
	      			this.resourceMapID = xml.evaluate('//Resource/Attributes/attribute[name="mapId"]/value', xml, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue.textContent;
	      			mask.hide();
	      			this.updatePosition(this.resourceMapID);
      			} else {
      				this.loadFail();
      			}
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
		   url: this.geoStoreBase + 'resources/resource/' + dataId,
		   success: successHandler,
		   failure: failureHandler,
		   scope: this,
		   headers: {
		       'Authorization':this.auth
		   }
		});
		
	},
	
	/** private: method[updatePosition]
	 *  Load map data and costs from GeoStore
	 */
	updatePosition:function(resourceMapId){
		var mask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait..."});
		mask.show();

		var successHandler = function(response,opts){
			 try{
			 	var dq = Ext.DomQuery; 
      			var xml = response.responseXML;
      			//this.mapConfigData = response.responseText;
      			var mapResourceId = dq.selectValue('Resource/id', xml);
      			var mapConfigJson = Ext.decode(dq.selectValue('Resource/data/data', xml));
      			
      			if(mapConfigJson) {
      				this.searchOptimizationToolValuesOnGeoStore(mapResourceId, mapConfigJson);
      			} else {
      				this.loadFail();
      			}
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
		   url: this.geoStoreBase + 'resources/resource/' + resourceMapId + '?full=true',
		   success: successHandler,
		   failure: failureHandler,
		   scope: this,
		   headers: {
		       'Authorization':this.auth
		   }
		});
		
	},
	
	/** private: method[retrieveAssetsLocations]
	 *  Retrieve the SolutionID and ask to the WFS the Assets position
	 */
	searchOptimizationToolValuesOnGeoStore:function(mapId, mapConfigJson) {
		var user = Ext.decode(sessionStorage['userDetails']).user.name;

        var categoryName = this.optToolCategory;
        var resourceName = user+"_"+mapId;

		var successHandler = function(response,opts){
			 try{
			 	if(response.responseXML) {
			 		var dq = Ext.DomQuery;
	      			var xml = response.responseXML;
	      			var optToolValues = Ext.decode(dq.selectValue('Resource/data/data', xml));
			 		
					Ext.Msg.confirm(
						this.updateAssetsPositionButtonText, 
						this.updateAssetsPositionButtonConfirm + "{" + mapConfigJson.customData.optimizationTool.costs_descr + "} -> {" + optToolValues.optimizationToolValues + "}", 
						function(btn) {
							if (btn == 'yes') {
								this.retrieveAssetsLocations(mapConfigJson);
							}
						}, this);
			 	}
			 }catch(e){
			 	this.loadFail();
			 }
		};
		
		var failureHandler = function(){
			Ext.Msg.confirm(
				this.updateAssetsPositionButtonText, 
				this.updateAssetsPositionButtonConfirm + "{" + mapConfigJson.customData.optimizationTool.costs_descr + "} -> {" + mapConfigJson.customData.optimizationToolValues + "}", 
				function(btn) {
					if (btn == 'yes') {
						this.retrieveAssetsLocations(mapConfigJson);
					}
				},this);
		};
		
		Ext.Ajax.request({
		   url: this.geoStoreBase + 'misc/category/name/'+categoryName+'/resource/name/'+resourceName,
		   success: successHandler,
		   failure: failureHandler,
		   scope: this,
		   headers: {
		       'Authorization':this.auth
		   }
		});
	},
	
	/** private: method[retrieveAssetsLocations]
	 *  Retrieve the SolutionID and ask to the WFS the Assets position
	 */
	retrieveAssetsLocations:function(mapJson){
		var geoserverBase = mapJson.sources.geoserver.url;
		    //geoserverBase = "http://172.21.173.30:8080/geoserver/ows";
		    
		var tracksLayer;
		for (var t=0; t<mapJson.customData.optimizationToolLayers.length; t++) {
			if(mapJson.customData.optimizationToolLayers[t].indexOf("tracks")>0) {
				tracksLayer = mapJson.customData.optimizationToolLayers[t];
				break;
			}
		}
		
		if(tracksLayer) {
			var findOptimalSolutions = function(costs, coeff){
		    	if(!costs){
		    		return [];
		    	}
		    	var solutionId;
		    	var minValue = Number.MAX_VALUE;
		    	for(var i = 0; i < costs.length ; i++){
		    		var totCost = calculateCost(costs[i],coeff);
		    		if(minValue > totCost){
		    			minValue = totCost;
		    			solutionId = [costs[i].solutionId];
		    		}
		    	}
		    	return solutionId;
		    };
		    
		    var calculateCost = function (costObj, coeff){
		    	var cost = 0;
		    	for(var i = 0; i< coeff.length;i++){
		    		cost += costObj.cost[i]*coeff[i];
		    	}
		    	return cost;
		    };
		    
			var successHandler = function(response,opts){
				 try{
				 	//var data = Ext.decode('{"type":"FeatureCollection","totalFeatures":3,"features":[{"type":"Feature","id":"oaa_tracks_97f81105e81594d.1","geometry":{"type":"Point","coordinates":[53.492,16.673]},"geometry_name":"location","properties":{"SolutionID":1,"AssetID":1,"Time":"2014-12-15T00:00:00Z","Range":110000}},{"type":"Feature","id":"oaa_tracks_97f81105e81594d.145","geometry":{"type":"Point","coordinates":[58.414,12.934]},"geometry_name":"location","properties":{"SolutionID":1,"AssetID":2,"Time":"2014-12-15T00:00:00Z","Range":25000}},{"type":"Feature","id":"oaa_tracks_97f81105e81594d.289","geometry":{"type":"Point","coordinates":[51.383,10.698]},"geometry_name":"location","properties":{"SolutionID":1,"AssetID":3,"Time":"2014-12-15T00:00:00Z","Range":25000}}],"crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:EPSG::4326"}}}');
	      			var data = Ext.decode(response.responseText);
	      			//console.log(data);
	      			if (data.features.length > 0) {
					 	for (var f=0; f<data.features.length; f++) {
					 		var assetCoords = data.features[f].geometry.coordinates; 
					 		this.assetFramePanel.get("asset-"+(f+1)).assetPosition.longitudeField.setValue(assetCoords[0]);
					 		this.assetFramePanel.get("asset-"+(f+1)).assetPosition.latitudeField.setValue(assetCoords[1]);
					 		//add point feature to the map
					 		var mapPrj = new OpenLayers.Projection(this.mapPanel.map.projection);
							var point = new OpenLayers.Geometry.Point(assetCoords[0], assetCoords[1]);
								point.transform(new OpenLayers.Projection('EPSG:4326'), mapPrj);
							var pointFeature = new OpenLayers.Feature.Vector(point);
							//set order for label.
	            			pointFeature.attributes.order = parseInt((f+1));
	            			
	            			for (var ff=0; ff<this.vectorLayer.features.length; ff++) {
								if (this.vectorLayer.features[ff].attributes.order === parseInt((f+1))) {
									this.vectorLayer.removeFeatures([this.vectorLayer.features[ff]],true);
								}
							}
	            			
							this.vectorLayer.addFeatures([pointFeature]);
					 	}
	      			} else {
	      				Ext.Msg.show({
                            title: this.updateAssetsPositionButtonText,
                            msg: this.updateAssetsPositionButtonWarning,
                            width: 300,
                            icon: Ext.MessageBox.WARNING
                        });
	      			}
				 }catch(e){
				 	this.loadFail();
				 	throw e;
				 }
			};
			
			var failureHandler = function(){
				this.loadFail();
				throw new Error("Failed to load Tracks!");
			};
			
			var solutionId = findOptimalSolutions(mapJson.customData.optimizationTool.costs, mapJson.customData.optimizationToolValues);
			//console.log(solutionId);
			
			var geoServerURL = geoserverBase + "/?service=WFS&version=1.0.0&request=GetFeature&typeName="+tracksLayer+"&outputFormat=application%2Fjson&cql_filter=(Time=%27"+this.startTime.value+"T00:00:00Z%27 and SolutionID="+solutionId+")";
			//console.log(geoServerURL);

			Ext.Ajax.request({
			   url: geoServerURL,
			   success: successHandler,
			   failure: failureHandler,
			   scope: this,
			   headers: {
			       'Authorization':this.auth
			   }
			});

		} else {
			this.loadFail();
			throw new Error('Could not find the Tracks layer on server!');
		}
	}
	
});
Ext.reg(mxp.widgets.CMREOnDemandServiceInputForm.prototype.xtype, mxp.widgets.CMREOnDemandServiceInputForm); 