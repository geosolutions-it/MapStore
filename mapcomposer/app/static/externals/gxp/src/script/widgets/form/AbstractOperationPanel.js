/*  Copyright (C) 2007 - 2014 GeoSolutions S.A.S.
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
 *  class = AbstractOperationPanel
 */

/** api: (extends)
 *  Ext.Panel.js
 */
Ext.namespace("gxp.widgets.form");

/** api: constructor
 *  .. class:: ChangeMatrix(config)
 *
 *    Common configurations for tools panel on UNINA project
 */
gxp.widgets.form.AbstractOperationPanel = Ext.extend(Ext.FormPanel, {

	/** i18n **/
	timeSelectionTitleText: "Time Selection",
	soilSealingIndexTitleText: "Soil Sealing Index",
	clcLevelTitleText: "CLC level",
	clcLegendBuilderTitleText: "CLC Level Builder",
	roiTitleText: "ROI",
	timeFilterTitle : 'Time Filter',
	changeMatrixRasterFieldLabel : "Raster Layer",
	currentTimeFieldLabel: 'Reference time',
	referenceTimeFieldLabel: 'Current time', 

	// Years text
	oneYearText: 'one year',
	twoYearsText: 'two years',

	// bbar text
	submitButtonText: 'Submit',
	resetButtonText: 'Reset',

	/** api: config[changeMatrixEmptyFilter]
	 *  ``String``
	 *  Form validation messages: Empty filter (i18n).
	 */
	changeMatrixEmptyFilter : "Please specify both time filters",

	/** api: config[geocoderSelectorsLabels]
	 * ``Array`` of ``String``
	 * Label text for the return types selection (i18n).
	 */
	geocoderSelectorsLabels: ['Administrative Area List', 'Administrative Area Subs'],

	/** EoF i18n **/

	// clcLevelMode: 'another',
	
	/** api: config[requestTimeout]
	 *  ``Integer``
	 *  Timeout for the WPS request
	 */
	requestTimeout : 5000,
    
    /** api: config[clcLevelMode]
     *  ``String`` Geocoder configuration for the ROI and WPS procces
     */
	clcLevelMode: 'radiogroup',
	useAccordion: true,

	// layout config
	layout: 'form',
	labelAlign: 'top',
    
    /** api: config[defaultAction]
     *  ``Object`` Geocoder configuration for the ROI and WPS procces
     */
	geocoderConfig:{
		wpsUnionProcessID: null,
		wpsBufferProcessID: null,
		wfsBaseURL: null,
		spatialOutputCRS: null,
		showSelectionSummary: null,
		zoomToCurrentExtent: null,
		defaultStyle: null,
		selectStyle: null,
		temporaryStyle: null,
		labelStyle: null,
		bufferOptions: null,
		geocoderTypeName: null,
		geocoderTypeTpl: null,
		geocoderTypeRecordModel: null,
		geocoderTypeSortBy: null,
		geocoderTypeQueriableAttributes: null,
		geocoderTypeDisplayField: null,
		geocoderTypePageSize: null,
		selectReturnType: null
	},

    /** api: config[clcLevelsConfig]
     *  ``Object`` CLC levels configuration
     */
	clcLevelsConfig: null,
    
    /** api: config[defaultAction]
     *  ``Object`` Time selection set disable elements
     */
	enableOrDisableConfig:{
	},
    
    /** api: config[roiFieldSetConfig]
     *  ``Object`` Configuration to overwrite roifieldset config
     */
	roiFieldSetConfig: {},

	/** private: method[constructor]
	 *  Prepare the layout for the panel
	 */
	constructor: function(config){

		// default panel config
		var panelConfig = {};
		Ext.apply(panelConfig, config || {});

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

		// ///////////////
		// ItemSelector Ex
		// ///////////////
		var data = [];

		Ext.apply(this, panelConfig);

		gxp.widgets.form.AbstractOperationPanel.superclass.constructor.call(this, panelConfig);
	},


	/** api: method[initComponent]
	 *  Generate a panel with the configuration present on this
	 */
	initComponent: function(config){
		var me = this;

		Ext.apply(this, config || {});

		if (this.useAccordion){
			Ext.apply(this, {
				border : false,
				layout : "accordion",
				disabled : false,
				autoScroll : false,
				title : this.title,
			    defaults: {
			        // applied to each contained panel
			        bodyStyle: 'padding:15px',
					autoScroll : true
			        // ,
			        // layout: 'form'
			    },
			    layoutConfig: {
			        // layout-specific configs go here
			        titleCollapse: false,
			        animate: true,
			        activeOnTop: false
			    },
			    bbar: this.generateBbar(config)
			});
		}else{
			Ext.apply(this, {
				border : false,
				// layout : "fit",
				disabled : false,
				autoScroll : false,
				title : this.title,
				defaults : {
					border : false,
					xtype : 'fieldset',
					autoWidth : true,
					collapsible : true,
					boxMaxHeight: 200,
					// boxMaxWidth: 300,
					// collapsed : true,
					// layout : 'table',
					// columns: 1,
					defaultType : 'numberfield',
					defaults : {
						border : false,
						// layout : "fit",
						boxMaxHeight: 200,
						// boxMaxWidth: 200,
						// bodyStyle : 'padding:15px',
						// width : 200,
						collapsed : false
					}
				},
			    bbar: this.generateBbar(config)
			});
		}

		this.items = this.generateItems(config);

		gxp.widgets.form.AbstractOperationPanel.superclass.initComponent.call(this, config);
	},

    /** api: method[generateItems]
     *  :arg config: ``String`` Configuration to be applied on this
     *  :returns: ``Array`` items for the form.
     *  Override it on custom panels
     */
	generateItems: function(config){
		return [];
	},

    /** api: method[submitForm]
     *  Submit form. To be overrided on custom elements
     */
	submitForm: function() {
		console.log("TODO");
	},

    /** api: method[resetForm]
     *  Reset form.
     */
	resetForm: function(){
		if(this.roiFieldSet.rendered){
			this.roiFieldSet.removeFeatureSummary();
			this.roiFieldSet.reset();
			//this.roiFieldSet.collapse();	
		}
		this.getForm().reset();
		this.enableOrDisableElements('default');
	},
    
    /** api: method[activeElementByTitle]
     *  :arg title: ``String`` Title for the item to be expanded
     *  Expand the item with the `title` on this panel.
     */
	activeElementByTitle: function(title){
		if(this.items && this.items.each){
			this.items.each(function (item){
				if(item.title == title){
					item.expand();
				}
			});
		}
	},

    /** api: method[enableOrDisableElements]
     *  :arg config: ``String`` Configuration to be applied on this
     *  Enable or disable elements on this based on `this.enableOrDisableConfig`
     */
	enableOrDisableElements: function(config){
		if(this.enableOrDisableConfig
				&& this.enableOrDisableConfig[config]){
				// iterate on the enableOrDisableConfig
				for(var key in this.enableOrDisableConfig[config]){
					var component = Ext.getCmp(this.id + '_' + key);
					if(component 
						&& this.enableOrDisableConfig[config][key] instanceof Object){
						if(!component.disabled){
							// iterate on configured items
							for(var item in this.enableOrDisableConfig[config][key]){
								// enable or disable
								if(component.rendered 
									&& component.items
									&& component.items.items
									&& component.items.items[item]){
									component.items.items[item].setDisabled(this.enableOrDisableConfig[config][key][item]);
								}else if(component.items
										&& component.items[item]){
									component.items[item].disabled = this.enableOrDisableConfig[config][key][item];
								}
							}
						}
					}else if(component){
						// enable or disable
						if(component.rendered){
							component.setDisabled(this.enableOrDisableConfig[config][key]);
						}else{
							component.disabled = this.enableOrDisableConfig[config][key];
						}
					}
				}
			}
	},

    /** api: method[getTimeSelectionItems]
     *  :arg config: ``String`` for this element. Unused
     *  :returns: ``Array`` items for the timeSelection element.
     *  Obtain time selection elements.
     */
	getTimeSelectionItems: function(config){
		var me = this;
		var onElementSelect = function(el, selected, index) {
			// Disable or enable elements by me.enableOrDisableConfig
			if(selected && selected.inputValue){
				me.enableOrDisableElements(selected.inputValue);
			}
		};
		return [{
	            xtype: 'radiogroup',
				ref   : '/yearsSelection',
	            cls: 'x-check-group-alt',
				id   : me.id + '_yearsSelection',
				name : 'years',
            	columns: 1,
            	items:[{
                	boxLabel: this.oneYearText, 
                	name: 'years', 
                	inputValue: 1
                },{
                	boxLabel: this.twoYearsText, 
                	name: 'years', 
                	inputValue: 2
                }],
            	listeners:{
            		change: onElementSelect
            	}
	        },{
			title : this.timeFilterTitle,
			xtype : 'fieldset',
			autoWidth : true,
			collapsible : false,
			layout : 'form',
			defaultType : 'numberfield',
			items : [{
				xtype : "combo",
				ref   : '../../filterT0ComboBox',
				id   : me.id + '_filterT0ComboBox',
				name : 'filterT0',
				fieldLabel : this.referenceTimeFieldLabel,
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
				},
				listeners : {
					scope : this,
					select : me.selectTimeIndex
				}
			}, {
				xtype : "combo",
				ref   : '../../filterT1ComboBox',
				id   : me.id + '_filterT1ComboBox',
				name : 'filterT1',
				fieldLabel : this.currentTimeFieldLabel,
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
				},
				listeners : {
					scope : me,
					select : me.selectTimeIndex
				}
			}]
		}];
	},

    /** api: method[selectTimeIndex]
     *  Callback when a time selection item is selected. To be overrided on custom panels
     */
	selectTimeIndex: function(){
	},

    /** api: method[getCclLevelItems]
     *  :arg config: ``Object`` Configuration for this. Unused
     *  :returns: ``Array`` items for the CLC level element.
     *  Obtain CLC level elements.
     */
	getCclLevelItems: function(config){
		var me = this;

		var cclLevelItem0;

		if(this.clcLevelMode == 'radiogroup'){
			cclLevelItem0 = {
	            xtype: 'radiogroup',
	            fieldLabel: this.clcLevelTitleText,
				ref   : '/rasterComboBox',
				id   : me.id + '_rasterComboBox',
	            cls: 'x-check-group-alt',
				name : 'raster',
            	columns: 1,
            	listeners:{
            		change: me.onLayerSelect,
            		scope: this
            	}
	        };    

		    this.layerStore.on('load', function (t, records, options) {
                var i = 0;
                me.rasterComboBox.items = [];
                for (var i = 0; i < records.length; i++) {
                	// delegate to getRasterItem
                	var item = me.getRasterItem(records[i]);
                	if(item != null){
	                    me.rasterComboBox.items.push(item);	
                	}
                }
                me.rasterComboBox.doLayout();
            });

		    this.target.on('ready', function(){
				me.reloadLayers();
		    });

		}else{
			cclLevelItem0 = {
				xtype : "combo",
				ref   : '/rasterComboBox',
				id   : me.id + '_rasterComboBox',
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

						if (value) {
							me.layerTimeout = setTimeout(function() {
								me.layerStore.filterBy(function(rec, recId) {
				                	var item = me.getRasterItem(rec);
				                	if(item == null){
				                		return false
				                	}
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
						me.roiFieldSet.removeFeatureSummary();
						me.roiFieldSet.reset();
						//me.roiFieldSet.collapse();
						me.getForm().reset();
					},
					select : me.onLayerSelect,
					beforequery : function() {
						this.reloadLayers();
					}
				}
			};
		}
		return [cclLevelItem0];
	},

    /** api: method[getRasterItem]
     *  :arg record: ``Object`` Record element
     *  :returns: ``Object`` item to be added or null if couldn't be added
     */
	getRasterItem: function(record){
    	var boxLabel = record.get('title'); 
    	var inputValue = record.get('name');
    	var filterFound = null;
    	var append = true;

    	// Filter and decorate the record
    	if (this.clcLevelsConfig
    		&& this.clcLevelsConfig.length){
    		append = false;
    		for (var i = 0; i < this.clcLevelsConfig.length; i++){
    			var filterConfig = this.clcLevelsConfig[i];
    			if (inputValue.indexOf(filterConfig.filter) > -1){
    				append = true;
					filterFound = filterConfig;
    				if(filterConfig.decorator){
						boxLabel = String.format(filterConfig.decorator, inputValue.split(filterConfig.filter)[1]);
					}
					break;
    			}

    		}
    	}

    	// return the item or null otherwise
    	if(append){
            return {
            	boxLabel: boxLabel, 
            	name: 'raster', 
            	inputValue: inputValue,
            	recordValue: record,
            	filterFound: filterFound
            };	
    	}else{
    		return null;
    	}

	},

    /** api: method[onLayerSelect]
     *  :arg el: ``Object`` Component
     *  :arg selected: ``Object`` Selected element
     *  Select a layer record as CLC level and initialize needed items on the form
     */
	onLayerSelect: function(el, selected, index) {
		var me = this;

		// clean
		this.roiFieldSet.removeFeatureSummary();
		this.roiFieldSet.reset();	

		// get layer record from the selected element
		var record = selected;
		if(selected){
			if(!selected.get){
				record = selected.recordValue;
			}

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

			me.timeValuesStore.removeAll();
			me.timeValuesStore.loadData(data, false);

			// //////////////////////////////////////////////////
			// Populate the itemselector classes
			// //////////////////////////////////////////////////
			var itemClassSelector = Ext.getCmp(me.id + '_classesselector');
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
			me.activeElementByTitle(me.timeSelectionTitleText);	
		}
	},

    /** api: method[getCclLegendItems]
     *  :arg config: ``Object`` Configuration for this. Unused
     *  :returns: ``Array`` items for the CLC legend element.
     *  Obtain CLC legend elements.
     */
	getCclLegendItems: function(config){
		var me = this;
		return [{
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
			ref : '../classesselector',
			id: me.id + '_classesselector',
			name : 'classesselector',
			boxMaxWidth: 330,
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
		}];
	},

    /** api: method[getRoiItems]
     *  :arg config: ``Object`` Configuration for this. Unused
     *  :returns: ``Array`` items for the ROI element.
     *  Obtain ROI elements.
     */
	getRoiItems: function(config){

		// Fieldset configuration
		var roiFieldSetConfig = {
				ref: '/roiFieldSet',
				id: this.id + '_roiFieldSet',
				layout: 'table',
				xtype:'gxp_spatial_selector_field',
				loadingMaskId: this.id,
				wpsManager: this.wpsManager
		};

		// configuration for low screens
		var lowScreensConfig = {
			// scrollable configuration with 200 px: 
			height: 200,
			autoScroll: true,
			autoHeight: false,
			autoWidth: false,
			collapsed : false,
			checkboxToggle : false,
			collapsible : false
		};

		// configuration for long screens
		var longScreensConfig = {
			// not scrollable and visible: 
			autoHeight: false,
			autoWidth: false,
			width: 320,
			collapsed : false,
			checkboxToggle : false,
			collapsible : false
		};

		// Apply screen config
		// if(window.innerHeight < 1000){ // FIXME: Fix roi border
		if(false){
			Ext.apply(roiFieldSetConfig, lowScreensConfig);
		}else{
			Ext.apply(roiFieldSetConfig, longScreensConfig);
		}

		Ext.apply(roiFieldSetConfig, this.roiFieldSetConfig);

		// copy runtime dependencies
		roiFieldSetConfig.mapPanel = this.target.mapPanel;
		Ext.apply(roiFieldSetConfig, this.geocoderConfig);
		return [roiFieldSetConfig]
	},

    /** api: method[generateBbar]
     *  :arg config: ``Object`` Configuration for this. Unused
     *  :returns: ``Ext.Toolbar`` for the buttom bar.
     *  Obtain buttom bar.
     */
	generateBbar: function(config){
		var me = this;

		return new Ext.Toolbar({
			items : ["->", {
					text : this.resetButtonText,
					iconCls : 'gxp-icon-removelayers',
					handler : me.resetForm,
					scope:this
				}, {
					text : this.submitButtonText,
					iconCls : 'gxp-icon-zoom-next',
					ref : 'submit-button',
					id : me.id + '_submit-button',
					handler : me.submitForm,
					scope:this
				}]
		});
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
				
				if (group && name && group !== "background") {
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

			var recordData = [sourceId, record.data.name, record.data.name, record.id, srs, record.data.uuid, record.data.times, record.data.gnURL];

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
			var item = this.getRasterItem(record);
        	if(item != null){
        		recordData[1] = item.boxLabel;
				data.push(recordData);
        	}
		}

		return data;
	},
	
	/**
	 *
	 */
	handleTimeout : function() {
		if (!this.loadingMask)
			this.loadingMask = new Ext.LoadMask(Ext.get(this.id), 'Loading..');
		this.loadingMask.hide();
		Ext.getCmp(this.id + '_submit-button').enable();
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
			this.loadingMask = new Ext.LoadMask(Ext.get(this.id), 'Loading..');
		me.loadingMask.show();
		var submitButton = Ext.getCmp(this.id + '_submit-button');
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
			this.loadingMask = new Ext.LoadMask(Ext.get(this.id), 'Loading..');
		this.loadingMask.hide();
		var submitButton = Ext.getCmp(this.id + '_submit-button');
		if (submitButton)
			submitButton.enable();
		/*if (this.errorTimer)
			clearTimeout(this.errorTimer);*/
	}

});