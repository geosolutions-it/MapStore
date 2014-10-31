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
 * Generic Resource Editor for GeoStore
 * Allow to edit and commit changes for a GeoStore Resource
 * 
 */
mxp.widgets.CMREOnDemandServiceInputForm = Ext.extend(Ext.Panel, {

    /** api: xtype = mxp_geostore_category_manger */
	xtype:'mxp_cmre_ondemand_services_input_form',
    category:'MAP',
     //ResourceEditor can be plugged to customize 
    //the resource stored data. It must implement 2 methods: 
    // getResourceData() and 
    // loadResourceData(resource) --> return data string
    // canCommit --> return true if the resource is valid
    /** api: config[resourceEditor]
     *  ``Object``
     * The Pluggable Resource Editor. If null the default one (a form with a text area) is used.
     * This object needs 3 methods: 
     * getResourceData() : returns the string of the resource
     * loadResourceData(resource) : load the resource in the component (typically a form)
     * canCommit() : return true if the resource edited is valid (typically check the internal form validity)
     */
    resourceEditor: null,
    /** api: config[forceUpdateStoredData]
     * ``boolean`` if true, force a second call to the /data service of GeoStore to commit the Stored Data.
     * this is needed because GeoStore service at the current time, doesn't update stored data in the resource 
     * udate service
     */
    forceUpdateStoredData:true,
    
    mapPanel:null,
    
    //Can Be everyone to load resource with visibility everyone
    defaultGroupVisibility:null,
    //i18n
	dataFieldLabel: 'Resource',
	nameLabel: 'Name',
    textAttribute: 'Attributes',
    textGeneral: 'General',
	descriptionLabel: 'Description',
    visibilityLabel:'Visibility',
    textSave: 'Execute',
    savingMessage:"Saving...",
    loadingMessage: "Loading...",
    saveSuccessTitle:"Saved",
    saveSuccessMessage:"Resource saved succesfully",
    failSaveTitle: "Failed Saving resource",
    resourceNotValid: "Resource not valid",
    deleteSuccessMessage: "Resource Deleted Successfully",
    resetTitleText: "Reset",
   
    
	initComponent: function() {
		var values = this.values ||{
            category:this.category
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
            "delete"
        );
        // initialize resource manager
        this.resourceManager = new GeoStore.Resource({
            authorization: this.auth,
            url: this.geoStoreBase + 'resources'
        });
        
        //set generic GeoStore Resource fields form
		if(!this.genericFields){
	    // /////////////////////////////////////////
		// -- defining form fields
		// /////////////////////////////////////////
			var me = this;
			this.northField = new Ext.form.NumberField({
	            fieldLabel: "North",
	            id: me.id+"_NorthBBOX",
	            width: 130,
	            allowBlank: false,
	            decimalPrecision: 4,
	            allowDecimals: true,
	            hideLabel : false                    
	        });
	        
	        this.westField = new Ext.form.NumberField({
	            fieldLabel: "West",
	            id: me.id+"_WestBBOX",
	            width: 100,
	            allowBlank: false,
	          /*  minValue: this.spatialFilterOptions.latMin,
	            maxValue: this.spatialFilterOptions.latMax,*/
	            decimalPrecision: 4,
	            allowDecimals: true,
	            hideLabel : false                    
	        });
	        
	        this.eastField = new Ext.form.NumberField({
	            fieldLabel: "East",
	            id: me.id+"_EastBBOX",
	            width: 100,
	            allowBlank: false,
	          /*  minValue: this.spatialFilterOptions.latMin,
	            maxValue: this.spatialFilterOptions.latMax,*/
	            decimalPrecision: 4,
	            allowDecimals: true,
	            hideLabel : false                    
	        });
	              
	        this.southField = new Ext.form.NumberField({
	            fieldLabel: "South",
	            id: me.id+"_SouthBBOX",
	            width: 130,
	            allowBlank: false,
	          /*  minValue: this.spatialFilterOptions.lonMin,
	            maxValue: this.spatialFilterOptions.lonMax,*/
	            decimalPrecision: 4,
	            allowDecimals: true,
	            hideLabel : false                    
	        });
	        
	        this.bboxButton = new Ext.Button({
	            text: "Area",
	            tooltip: "this.setAoiTooltip",
	            enableToggle: true,
	            //toggleGroup: this.toggleGroup,
	            //iconCls: 'aoi-button',
	            height: 50,
	            width: 50,
	            listeners: {
	                scope: me, 
	                toggle: function(button, pressed) {
	                    if(pressed){      
	                        //
	                        // Activating the new control
	                        //   
	                        this.selectBBOX.activate();
	                    }else{
	                        this.selectBBOX.deactivate();
	                    }
	                }
	            }
	        });
	        
	        this.startTime = new Ext.form.DateField({
	        	format: 'd/m/Y', 
		        fieldLabel: '',
		        id: me.id + '_txtExpireDate',
		        name: 'txtExpireDate',
		        maxLength: 180,
                anchor:'95%',
		        allowBlank: false,
		        value: ''
	        });
	        
	        this.updateAssetsPositionButton = new Ext.Button({
	            text: "Update Assets Position",
	            tooltip: "this.setAoiTooltip",
	            disabled: true,
	            //enableToggle: true,
	            //toggleGroup: this.toggleGroup,
	            iconCls: 'geolocation_ic',
	            width: 150,
	            listeners: {
	                scope: me, 
	                toggle: function(button, pressed) {
	                    if(pressed){     
	                        //
	                        // Activating the new control
	                        //   
	                        this.selectBBOX.activate();
	                    }else{
	                        this.selectBBOX.deactivate();
	                    }
	                }
	            }
	        });
	        
	        this.durationField = new Ext.form.NumberField({
	            id: me.id+"_Duration",
	          /*  minValue: this.spatialFilterOptions.lonMin,
	            maxValue: this.spatialFilterOptions.lonMax,*/
	            decimalPrecision: 2,
	            allowDecimals: false,
	            hideLabel : false,
	            maxLength: 180,
                anchor:'95%',
				name: "duration",
				fieldLabel: "Duration",
				value: "",
                allowBlank:false
	        });


		this.assetFramePanel = new Ext.FormPanel({
			  frame:true,
              //xtype:'container',
			  layout:'form',
              autoScroll:true, 
              ref:'assetsform',
			  border: false,
			  items: [
			  	this.createAsset(1)],
			  renderTo: Ext.getBody()
			});
		
	    // /////////////////////////////////////////
		// -- attach fields
		// /////////////////////////////////////////
			this.genericFields = [
              {
					xtype: "textfield",
					name: "id",
                    anchor:'95%',
					hidden: true,
					value: "values.id"
			  },{
					xtype: "textfield",
					name: "category",
                    anchor:'95%',
					hidden: true,
					value: ""
			  },{
					xtype: 'textfield',
					maxLength: 180,
                    anchor:'95%',
					name: "name",
					fieldLabel: this.nameLabel,
					value: "",
                    allowBlank:false
			  },{
					xtype: 'textfield',
					maxLength: 180,
                    anchor:'95%',
					name: "description",
					fieldLabel: this.descriptionLabel,
					value: "",
                    allowBlank:false
			  }/*{
					xtype: 'textfield',
					maxLength: 180,
                    anchor:'95%',
					name: "title",
					fieldLabel: "Title",
					value: "",
                    allowBlank:false
			  },{
					xtype: 'textarea',
					maxLength: 180,
                    anchor: '95%',
					name: "description",
					fieldLabel: this.descriptionLabel,
					readOnly: false,
					hideLabel : false,
					value: ""
			  }*/,{
			  	xtype: 'container',
			  	fieldLabel: "Area of Interest",
			  	items:[{
			  		xtype: 'fieldset',
			  		style: 'padding:5px;text-align: center;',
					border: false,
					columnWidth: 0.8,
		            //title: 'Fieldset 1',
		            collapsible: false,
		            //defaultType: 'textfield',
		            defaults: {anchor: '100%'},
		            //layout: 'anchor',
		            autoHeight: true,
			        layout: 'table',
			        layoutConfig: {columns: 3},
		            bodyStyle:'padding:5px;',
		            bodyCssClass: 'aoi-fields',
		            items :[{
			            layout: "form",
			            cellCls: 'spatial-cell',
			            labelAlign: "top",
			            cls: 'center-align',
			            border: false,
			            colspan: 3,
			            items: [me.northField]
			        },{
			            layout: "form",
			            cellCls: 'spatial-cell',
			            labelAlign: "top",
			            border: false,
			            items: [me.westField]
			        },{
			            layout: "form",
			            cellCls: 'spatial-cell',
			            border: false,
			            items: [me.bboxButton]                
			        },{
			            layout: "form",
			            cellCls: 'spatial-cell',
			            labelAlign: "top",
			            border: false,
			            items: [me.eastField]
			        },{
			            layout: "form",
			            cellCls: 'spatial-cell',
			            labelAlign: "top",
			            border: false,
			            colspan: 3,
			            items: [me.southField]
			        }],
			        listeners : {
			           "afterlayout": function(){
							var baseProj = me.mapPanel.map.getProjection();
							var projection = me.mapPanel.map.projection; 				
			                me.mapProjection = new OpenLayers.Projection(projection);
					        
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
					                    this, {
					                        'click': this.trigger
					                    }, this.handlerOptions
					                );
					            }, 
					            trigger: function(e){
							        //get lon lat
							        var map = this.map;
							        var lonlat = map.getLonLatFromPixel(e.xy);
							        //
							        var geoJsonPoint = lonlat.clone();
							        geoJsonPoint.transform(map.getProjectionObject(),new OpenLayers.Projection('EPSG:4326'));
							        this.latitudeField.setValue(geoJsonPoint.lat);
							        this.longitudeField.setValue(geoJsonPoint.lon);
							        //update point on the map
									this.lonLatButton.toggle();      
							    },
					            map:me.mapPanel.map
					        });       
					        
					        me.selectLonLat = new ClickControl();
					        me.mapPanel.map.addControl(me.selectLonLat);
					        
			                me.selectBBOX = new OpenLayers.Control.SetBox({      
			                    map: me.mapPanel.map,
			                    bboxProjection: new OpenLayers.Projection('EPSG:4326'),
			                    layerName: "BBOX",
			                    displayInLayerSwitcher: false,
			                    boxDivClassName: "olHandlerBoxZoomBox_"+me.id,
			                    aoiStyle: new OpenLayers.StyleMap({
									"default" : {
										"fillColor"   : "#FFFFFF",
								        "strokeColor" : "#FF0000",
								        "fillOpacity" : 0.5,
								        "strokeWidth" : 1
									},
									"select": {
										"fillColor"   : "#FFFFFF",
								        "strokeColor" : "#FF0000",
								        "fillOpacity" : 0.5,
								        "strokeWidth" : 1
									},
									"temporary": {
										"strokeColor": "#ee9900",
										"fillColor": "#ee9900",
										"fillOpacity": 0.4,
										"strokeWidth": 1
									}
								}),
			                    onChangeAOI: function(){
			                    	var bounds = new OpenLayers.Bounds.fromString(this.currentAOI);  
			                        var bboxBounds;

							        if(this.map.getProjection() != this.bboxProjection.getCode()){
							            bboxBounds = bounds.transform(this.map.getProjectionObject(),this.bboxProjection);
							        }else
							            bboxBounds = bounds;  
							      
							        me.northField.setValue(bboxBounds.top);
							        me.southField.setValue(bboxBounds.bottom);
							        me.westField.setValue(bboxBounds.left);
							        me.eastField.setValue(bboxBounds.right); 
							        
							        me.fireEvent('select', this, bboxBounds);
							        
			                        this.deactivate();
			                        me.bboxButton.toggle();
			                        
			                        me.fireEvent('onChangeAOI', bounds);
			                    } 
			                }); 
			        
			                me.mapPanel.map.addControl(me.selectBBOX);
			                me.mapPanel.map.enebaleMapEvent = true;
			            },
			            beforecollapse : function(p) {
			                var bboxLayer = me.mapPanel.map.getLayersByName("BBOX")[0];
      
        					if(bboxLayer)
            					me.mapPanel.map.removeLayer(bboxLayer); 
			            }
			          
			        }
			  	}]
			  },{
			  	xtype: 'container',
			  	layout: 'table',
			  	fieldLabel: "Start Time",
			  	items:[this.updateAssetsPositionButton, this.startTime]
			  },
			  this.durationField,
			  {
			  	xtype:'combo',
		       	fieldLabel:'Risk Map Type',
		       	name:'riskMapType',
		       	mode:'local',
		       	store: new Ext.data.SimpleStore({
			        fields: ['abbr', 'name'],
			        data : [
			            ["PAG", "Piracy Attack Group Map"]
			        ]
			    }),
		       	displayField: 'name',
        		valueField: 'abbr',
        		triggerAction: 'all',
  				value: 'PAG',
  				selectOnFocus:true,
		       	autoSelect:true,
		       	forceSelection:true,
		       	allowBlank:false,
		       	maxLength: 180,
                anchor:'95%'
			  },{
			  	xtype: 'fieldset',
			  	ref: 'assets',
		  		style: 'padding:5px;',
				border: true,
				columnWidth: 0.8,
	            title: 'Assets',
	            collapsible: true,
	            defaultType: 'textfield',
	            defaults: {anchor: '100%'},
	            layout: 'anchor',
	            autoHeight: true,
	            bodyStyle:'padding:5px;',
	            tbar: [ "->",
			     //ADD ASSET
			     	{
				        tooltip: "Add a new Asset",
				        ref:'../add-asset',
				        iconCls: "add_ic",
				        id: "add-asset-btn",
				        scope: this,
				        handler: function(){
				        	var numItems = me.assetFramePanel.items.length;
				        	if (numItems <= 16) {
				        		var asset = me.createAsset(numItems+1);
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
				        tooltip: "Remove an Asset",
				        ref:'../rem-asset',
				        iconCls: "delete_ic",
				        id: "rem-asset-btn",
				        scope: this,
				        handler: function(){
				        	var numItems = me.assetFramePanel.items.length;
				        	if (numItems > 1) {
				            	me.assetFramePanel.remove(me.assetFramePanel.items.get(numItems-1));
				            	me.assetFramePanel.doLayout();
				            }				        	
				        }
				     }
				  ],
	            items: [this.assetFramePanel]
			  }
			];
		}
		
        if(!this.attributeFields){
        	this.attributesFields = [];
        }
        
		var mainPanel = {
			  frame:true,
              xtype:'form',
			  layout:'form',
              region:'north',
              autoScroll:true, 
              ref:'resourceform',
			  //id: 'name-field-set',
			  border: false,
              //title:"Text",
              //iconCls:'table_edit',
              //columnWidth:.5,
			  items: this.genericFields
			};
		
		this.items = [mainPanel];
        this.bbar = [ "->",
            //SAVE
            {
                text: this.textSave,
                tooltip: this.tooltipSave,
                ref:'../save',
                iconCls: "accept",
                id: "save-btn",
                scope: this,
                handler: function(){
                	debugger
                    //this.saveResource();
                }
            },
            //RESET 
            {
                text: this.resetTitleText,
                tooltip: this.resetTitleText,
                ref:'../reset',
                iconCls: 'delete_ic',
                disabled:true,
                id: "reset-btn",
                scope: this,
                handler: function(){
                	debugger
                    /*var resource = this.getResource();
                    if(resource.id){
                        this.showPermissionPrompt(resource.id);
                    }*/
                }
            }
        ];

		mxp.widgets.CMREOnDemandServiceInputForm.superclass.initComponent.call(this, arguments);
	},
	createAsset : function(id) {
		var me = this;
			var asset = {
			  	xtype: 'fieldset',
			  	itemId: "asset-"+id,
			  	ref: "asset-"+id,
		  		style: 'padding:5px;',
				border: true,
				//columnWidth: 0.8,
	            title: 'Asset #'+id,
	            collapsible: true,
	            collapsed: false,
	            defaultType: 'textfield',
	            defaults: {anchor: '100%'},
	            //layout: 'anchor',
	            autoHeight: true,
	            bodyStyle:'padding:5px;',
	            items: [
	               {
						xtype: 'textfield',
						maxLength: 180,
	                    anchor:'95%',
						name: "id_"+id,
						ref: 'assetId',
						fieldLabel: "Id",
						value: id,
	                    allowBlank:false,
	                    readOnly: true
				   },{
						xtype: 'textfield',
						maxLength: 180,
	                    anchor:'95%',
						name: "name_"+id,
						ref: 'assetName',
						fieldLabel: "Name",
						value: "Ship "+id,
	                    allowBlank:false
				   },{
					  	xtype:'combo',
				       	fieldLabel:'Type',
				       	name:'type_'+id,
				       	ref: 'assetType',
				       	mode:'local',
				       	store: new Ext.data.SimpleStore({
					        fields: ['value', 'name'],
					        data : [
					            ["Frigate", "Frigate"]
					        ]
					    }),
				       	displayField: 'name',
		        		valueField: 'value',
		        		triggerAction: 'all',
		  				value: 'Frigate',
		  				selectOnFocus:true,
				       	autoSelect:true,
				       	forceSelection:true,
				       	allowBlank:false,
				       	maxLength: 180,
		                anchor:'95%'
				   },{
				  	xtype: 'container',
				  	fieldLabel: "Asset Position",
				  	name: "asset_pos_"+id,
				  	ref: "assetPosition",
				  	items:[{
				  		xtype: 'fieldset',
				  		name: "asset_pos_field_"+id,
				  		style: 'padding:5px;text-align: center;',
						border: false,
						columnWidth: 0.8,
			            collapsible: false,
			            defaults: {anchor: '100%'},
			            autoHeight: true,
				        layout: 'table',
				        layoutConfig: {columns: 3},
			            bodyStyle:'padding:5px;',
			            bodyCssClass: 'aoi-fields',
			            items :[{
				            layout: "form",
				            name: 'lon0_form_'+id,
				            cellCls: 'spatial-cell',
				            labelAlign: "top",
				            cls: 'center-align',
				            border: false,
				            items: [{
							    xtype: 'numberfield',
							    name: 'lon0_'+id,
							    ref: '../../longitudeField',
							    fieldLabel: 'Lon',
							    allowBlank: false,
							    //anchor: '95%',
							    maxLength: 6,
							    decimalPrecision : 3
						    }]
					       },{
				            layout: "form",
				            name: 'lon0_lat0_form_'+id,
				            cellCls: 'spatial-cell',
				            labelAlign: "top",
				            cls: 'center-align',
				            border: false,
				            items: [{
							    xtype: 'button',
							    name: 'lon0_lat0_btn_'+id,
							    ref: '../../lonLatButton',
							    enableToggle: true,
					            iconCls: 'geolocation_ic',
					            height: 32,
					            width: 32,
					            listeners: {
					                scope: this, 
					                toggle: function(button, pressed) {
					                    if(pressed){
					                    	debugger
					                    	me.selectLonLat.lonLatButton = this.resourceform.assets.assetsform.get("asset-"+id).assetPosition.lonLatButton;
					                    	me.selectLonLat.latitudeField = this.resourceform.assets.assetsform.get("asset-"+id).assetPosition.latitudeField;
							        		me.selectLonLat.longitudeField = this.resourceform.assets.assetsform.get("asset-"+id).assetPosition.longitudeField;
					                        me.selectLonLat.activate();
					                    }else{
					                        me.selectLonLat.deactivate();
					                    }
					                }
					            }
						    }]
					       },{
				            layout: "form",
				            name: 'lat0_form_'+id,
				            cellCls: 'spatial-cell',
				            labelAlign: "top",
				            cls: 'center-align',
				            border: false,
				            items: [{
							    xtype: 'numberfield',
							    name: 'lat0_'+id,
							    ref: '../../latitudeField',
							    fieldLabel: 'Lat',
							    allowBlank: false,
							    //anchor: '95%',
							    maxLength: 6,
							    decimalPrecision : 3
						   }]
					      }
					    ],
				        listeners : {
				           "afterlayout": function(){
				            	/*debugger
				           		if (me.assetFramePanel) {
				            		me.assetFramePanel.doLayout();
				           		}*/
				            },
				            beforecollapse: function(p) {
				            }
				        }
				  	}]
				  },{
					    xtype: 'numberfield',
					    name: 'obs_range_'+id,
					    ref: 'assetObsRange',
					    fieldLabel: 'Obs. Range',
					    allowBlank: false,
					    anchor: '95%',
					    maxLength: 8,
					    decimalPrecision : 3,
				        minValue         : 0,
					    // set maxlength to 5 on input field
					    autoCreate: {tag: 'input', type: 'text', size: '20', autocomplete: 'off', maxlength: '6'},
					    validator: function(val) {
						     if (!Ext.isEmpty(val) && val>=0) {
						        return true;
						     } else {
						         return "Value cannot be empty and must be a number equal or greater than 0";
						     }
					    },
					    renderer: function(value, metaData, record, rowIndex,colIndex, store, view){
						   Ext.util.Format.number(value,'0.000');
						   return value;            
						}
				 },{
					    xtype: 'numberfield',
					    name: 'heading_'+id,
					    ref: 'assetHeading',
					    fieldLabel: 'Heading',
					    allowBlank: false,
					    anchor: '95%',
					    maxLength: 6,
					    decimalPrecision : 3,
				        minValue         : 0,
					    // set maxlength to 5 on input field
					    autoCreate: {tag: 'input', type: 'text', size: '20', autocomplete: 'off', maxlength: '6'},
					    validator: function(val) {
						     if (!Ext.isEmpty(val) && 0<=val && val<=6.283) {
						        return true;
						     } else {
						        return "Value cannot be empty and must be a number between [0 - 6.283]";
						     }
					    },
					    renderer: function(value, metaData, record, rowIndex,colIndex, store, view){
						   Ext.util.Format.number(value,'0.000');
						   return value;            
						}
				 },{
					    xtype: 'textfield',
					    name: 'cost_'+id,
					    ref: 'assetCost',
					    fieldLabel: 'Cost',
					    allowBlank: false,
					    anchor: '95%'
				 },{
					    xtype: 'numberfield',
					    name: 'pfa_'+id,
					    ref: 'assetPfa',
					    fieldLabel: 'Pfa',
					    allowBlank: false,
					    anchor: '95%',
					    maxLength: 5,
					    decimalPrecision : 3,
				        minValue         : 0.000,
				        maxValue         : 1.000,
					    // set maxlength to 5 on input field
					    autoCreate: {tag: 'input', type: 'text', size: '20', autocomplete: 'off', maxlength: '6'},
					    validator: function(val) {
						     if (!Ext.isEmpty(val) && 0<=val && val<=1) {
						        return true;
						     } else {
						         return "Value cannot be empty and must be a number between [0 - 1]";
						     }
					    },
					    renderer: function(value, metaData, record, rowIndex,colIndex, store, view){
						   Ext.util.Format.number(value,'0.000');
						   return value;            
						}
				 },{
					    xtype: 'numberfield',
					    name: 'pd_'+id,
					    ref: 'assetPd',
					    fieldLabel: 'Pd',
					    allowBlank: false,
					    anchor: '95%',
					    maxLength: 5,
					    decimalPrecision : 3,
				        minValue         : 0.000,
				        maxValue         : 1.000,
					    // set maxlength to 5 on input field
					    autoCreate: {tag: 'input', type: 'text', size: '20', autocomplete: 'off', maxlength: '6'},
					    validator: function(val) {
						     if (!Ext.isEmpty(val) && 0<=val && val<=1) {
						        return true;
						     } else {
						         return "Value cannot be empty and must be a number between [0 - 1]";
						     }
					    },
					    renderer: function(value, metaData, record, rowIndex,colIndex, store, view){
						   Ext.util.Format.number(value,'0.000');
						   return value;            
						}
				},{
					    xtype: 'numberfield',
					    name: 'min_speed_'+id,
					    ref: 'assetMinSpeed',
					    fieldLabel: 'Min Speed',
					    allowBlank: false,
					    anchor: '95%',
					    maxLength: 6,
					    decimalPrecision : 3,
				        minValue         : 0,
					    // set maxlength to 5 on input field
					    autoCreate: {tag: 'input', type: 'text', size: '20', autocomplete: 'off', maxlength: '6'},
					    validator: function(val) {
						     if (!Ext.isEmpty(val) && 0<=val && val<=20) {
						        return true;
						     } else {
						        return "Value cannot be empty and must be a number between [0 - 20]";
						     }
					    },
					    renderer: function(value, metaData, record, rowIndex,colIndex, store, view){
						   Ext.util.Format.number(value,'0.000');
						   return value;            
						}
				},{
					    xtype: 'numberfield',
					    name: 'max_speed_'+id,
					    ref: 'assetMaxSpeed',
					    fieldLabel: 'Max Speed',
					    allowBlank: false,
					    anchor: '95%',
					    maxLength: 6,
					    decimalPrecision : 3,
				        minValue         : 0,
					    // set maxlength to 5 on input field
					    autoCreate: {tag: 'input', type: 'text', size: '20', autocomplete: 'off', maxlength: '6'},
					    validator: function(val) {
						     if (!Ext.isEmpty(val) && 0<=val && val<=20) {
						        return true;
						     } else {
						        return "Value cannot be empty and must be a number between [0 - 20]";
						     }
					    },
					    renderer: function(value, metaData, record, rowIndex,colIndex, store, view){
						   Ext.util.Format.number(value,'0.000');
						   return value;            
						}
				},{
					    xtype: 'numberfield',
					    name: 'min_heading_'+id,
					    ref: 'assetMinHeading',
					    fieldLabel: 'Min Heading',
					    allowBlank: false,
					    anchor: '95%',
					    maxLength: 6,
					    decimalPrecision : 3,
				        minValue         : 0,
					    // set maxlength to 5 on input field
					    autoCreate: {tag: 'input', type: 'text', size: '20', autocomplete: 'off', maxlength: '6'},
					    validator: function(val) {
						     if (!Ext.isEmpty(val) && -1.8<=val && val<=1.8) {
						        return true;
						     } else {
						        return "Value cannot be empty and must be a number between [-1.8 - +1.8]";
						     }
					    },
					    renderer: function(value, metaData, record, rowIndex,colIndex, store, view){
						   Ext.util.Format.number(value,'0.000');
						   return value;            
						}
				},{
					    xtype: 'numberfield',
					    name: 'max_heading_'+id,
					    ref: 'assetMaxHeading',
					    fieldLabel: 'Max Heading',
					    allowBlank: false,
					    anchor: '95%',
					    maxLength: 6,
					    decimalPrecision : 3,
				        minValue         : 0,
					    // set maxlength to 5 on input field
					    autoCreate: {tag: 'input', type: 'text', size: '20', autocomplete: 'off', maxlength: '6'},
					    validator: function(val) {
						     if (!Ext.isEmpty(val) && -1.8<=val && val<=1.8) {
						        return true;
						     } else {
						        return "Value cannot be empty and must be a number between [-1.8 - +1.8]";
						     }
					    },
					    renderer: function(value, metaData, record, rowIndex,colIndex, store, view){
						   Ext.util.Format.number(value,'0.000');
						   return value;            
						}
				}
	          ]
			};
			  
			return asset;
		},
    /**
     * Return the GeoStore Resource in the form
     */
    getResource : function(){
        var form = this.general.getForm();
        var values = form.getFieldValues();
        if (form.isValid() && this.resource.getResourceEditor().canCommit()){
            
            //get attributes with name attribute.<att_name>
            var attribute = {};
            for(var name in values ){
                var arr = name.split('.');
                if(arr.length >1 && arr[0]=='attribute'){
                    //special behiviour for dates
                    var value =values[name];
                    attribute[arr[1]] = {
                        name: name
                    };
                    if(value instanceof Date){
                      //TODO insert correct format
                      var field = form.findField(name);
                      if(field && field.format){
                        attribute[arr[1]].value = value.format(field.format);
                      }else{
                        attribute[arr[1]].value = value;
                      }
                    }else{
                      attribute[arr[1]].value = value;
                    }
                }
            }
           var resource = {
				id: values.id,
                name: values.name,
                description: values.description,
                category: values.category,
				attributes: attribute
                
            };
            //if the resource editor has the metod, call it
            
            resource.blob = this.resource.getResourceEditor().getResourceData(resource);
            
            return resource;
        }else{
            Ext.Msg.show({
               title: this.failSaveTitle,
               msg: this.resourceNotValid,
               buttons: Ext.Msg.OK,
               icon: Ext.MessageBox.ERROR
            }); 
        }
        
    },
    /**
     * Delete the resource loaded (TODO test)
     * uses the id or the resource loaded, if id is null
     */
     /**
     * api: method[deleteResource]
     * Delete a resource.
     * Uses the id passed as parameter,or if the parameter is missing, the resource loaded
     * Parameters:
     * id - long -  The id of the resource to delete.
     */
    deleteResource: function(id){
        var resourceId = id;
        var me = this;
        if(!id){
            var resource = this.getResource();
            resourceId = resource.id;
        }
        if(resourceId){
            this.resourceManager.deleteByPk(resourceId, function(response){
                me.fireEvent("delete");
                Ext.Msg.show({
                   title: me.resourceDeletedTitle,
                   msg: me.deleteSuccessMessage,
                   buttons: Ext.Msg.OK,
                   icon: Ext.MessageBox.INFO
                }); 
            });
        }
    },
    /**
     * api: method[saveResource]
     * Save the resource in the form to GeoStore
     */
    saveResource: function(){
        var resource = this.getResource();
        //new resource
        var me = this;
        var finish = function(response){
            me.setLoading(false);
            me.saveSuccess();
            me.fireEvent("save",response);
            
        };
        var finishError = function(response){
            me.setLoading(false);
            me.fireEvent("save",null);
            Ext.Msg.show({
               title: me.failSaveTitle,
               msg: response.statusText + "(status " + response.status + "):  ",
               buttons: Ext.Msg.OK,
               icon: Ext.MessageBox.ERROR
            }); 
        };
        var createFinish = function(response){
            console.log(response);  
            var win = me.showPermissionPrompt(response);
            finish(response);
        };
        //CREATE resource
        if(resource && !resource.id){
            //category must be indicated
            if(!resource.category || resource.category==""){
                //assign the catgory
                resource.category = this.category;
            }
            this.setLoading(true, this.savingMessage);
            this.resourceManager.create(resource,
                //SUCCESS
                createFinish,
                //FAIL
                finishError
                );
        //UPDATE resource
        }else if(resource && resource.id){
            this.resourceManager.update(resource.id,resource,
                //SUCCESS
                function(response){
                    if(me.forceUpdateStoredData){
                        me.forceUpdate(resource.id,resource.blob,finish,finishError);
                    }else{
                        finish(response);
                    }
            },finishError);
        }
        
    
    },
    /**
     * api: method[setLoading]
     * Load the resource in the form
     * Parameters:
     * record - {Ext.record} the record of GeoStore resource. must have id attribute at least
     * Return:
     */
    loadResource: function(record){
        //load record
        var resourceId;
        if(record){
            resourceId = record.get('id');
            this.general.getForm().loadRecord(record);
        }
        
        if(resourceId){
            
            this.setLoading(true, this.loadingMessage);
            var me =this;
            this.resourceManager.findByPk(resourceId, 
                //Full Resource Load Success
                function(data){
                    //fill the form
                    if(!data){
                         Ext.Msg.show({
                           title: me.failSaveTitle,
                           msg: response.statusText + "(status " + response.status + "):  ",
                           buttons: Ext.Msg.OK,
                           icon: Ext.MessageBox.ERROR
                        }); 
                    }
                    var r2 = new record.store.recordType(data);
                    var form = me.general.getForm();
                    form.loadRecord(r2);
                    //fill attributes
                    var attributes = r2.get("attributes");
                    for(var attname in attributes){
                        var field = form.findField("attribute."+attname);
                        if(field){
                            field.setValue(attributes[attname].value);
                        }else{
                            //Add attribute field
                            me.general.attributeColumn.add({
                                xtype:'textfield',
                                id:'attribute.'+attname,
                                anchor:'95%',
                                fieldLabel: attname,
                                name:'attribute.'+attname,
                                value:attributes[attname].value
                            });
                            me.general.attributeColumn.doLayout();
                        }
                       
                    }
                    //load resource. If the editor has a load resource 
                    //method defined, call it to load the stored data 
                    // in the editor
                    me.resource.getResourceEditor().loadResourceData(r2.get('blob'));
                    //enable or disable save button
                    me.save.setDisabled(! (record.get('canEdit')===true) );
                    me.permission.setDisabled(! (record.get('canEdit')===true) );
                    me.setLoading(false);
                    //TODO load visibility
                },{full:true});
            
            
        }
        //get visibility
        
    },
    /**
     * private: method[setLoading]
     * Shows loading mask
     */
    setLoading: function(enable,message){
        if(enable && !this.myMask){
            this.myMask = new Ext.LoadMask(Ext.getBody(), {msg:message || this.loadingMessage});
            this.myMask.show();
        }
        if(!enable&& this.myMask){
            this.myMask.hide();
            this.myMask = null;
        }
        
    },

   /**
    * private: method[forceUpdate]
    *  Force Resource Data Update. (if GeoStore doesn't update data)
    */
     forceUpdate: function(id, blob,successCallback,failureCallback){    

        var method = 'PUT';
	  	var contentType = 'application/json';

        Ext.Ajax.request({
			url: this.geoStoreBase + "data/" + id,
           method: method,
           headers:{
              'Content-Type' : contentType,
              'Accept' : 'application/json, text/plain, text/xml',
              'Authorization' : this.auth
           },
           params: blob,
           scope: this,
           success: function(responseText){
                successCallback(id);
           },
           failure: failureCallback
        }); 
    },
    saveSuccess: function(){
        Ext.MessageBox.show({
           title: this.saveSuccessTitle,
           msg: this.saveSuccessMessage,
           buttons: Ext.Msg.OK,
           icon: Ext.MessageBox.INFO
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
    showPermissionPrompt: function(id){
      var  winPermission = new mxp.widgets.ResourceGroupPermissionWindow({
            resourceId: id,
            title: this.resetTitleText,
            auth: this.auth,
            geostoreURL: this.geoStoreBase,
            target: this.target
        });
        winPermission.show();  
        return winPermission;
    }
});
Ext.reg(mxp.widgets.CMREOnDemandServiceInputForm.prototype.xtype, mxp.widgets.CMREOnDemandServiceInputForm);