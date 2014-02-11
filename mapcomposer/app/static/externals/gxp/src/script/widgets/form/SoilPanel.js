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
 *  class = SoilToolPanel
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
gxp.widgets.form.SoilPanel = Ext.extend(Ext.FormPanel, {

	/** api: xtype = gxp_soilpanel */
	xtype : "gxp_soilpanel",

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

	// First fieldset
	basedOnCLCText: 'Based on CLC',
	coverText: 'Coefficiente Copertura',
	changingTaxText: 'Tasso di Variazione',
	marginConsumeText: 'Consumo Marginale del Suolo',
	sprawlText: 'Sprawl Urbano',

	// Second fieldset
	basedOnImperviousnessText: 'Based on Imperviousness',
	urbanDispersionText: 'Dispersione Urbana',
	edgeDensityText: 'Edge Density',
	urbanDiffusionText: 'Diffusione Urbana',
	framesText: 'Frammentazione',
	consumeOnlyText: 'Consumo Suolo',
	consumeOnlyConfText: 'Coefficiente Ambientale Cons. Suolo',
	/** EoF i18n **/

	// cclLevelMode: 'another',
	cclLevelMode: 'radiogroup',

	/**
	 * Geocoder configuration
	 **/ 
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

	/** private: method[initComponent]
	 *  Generate a panel with the configuration present on this
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

		Ext.apply(panelConfig, {
			border : false,
			layout : "accordion",
			disabled : false,
			autoScroll : false,
			title : this.title,
		    defaults: {
		        // applied to each contained panel
		        bodyStyle: 'padding:15px'
		        // ,
		        // layout: 'form'
		    },
		    layoutConfig: {
		        // layout-specific configs go here
		        titleCollapse: false,
		        animate: true,
		        activeOnTop: false
		    }
		});

		Ext.apply(this, panelConfig);

		gxp.widgets.form.SoilPanel.superclass.constructor.call(this, panelConfig);
	},

	initComponent: function(config){
		var me = this;

		var roiForm = new Ext.form.FormPanel({
    		title: this.roiTitleText,
	        items: this.getRoiItems(config)
		})

		this.items = [{
    		title: this.timeSelectionTitleText,
	        items: this.getTimeSelectionItems(config)
	    },{
    		title: this.soilSealingIndexTitleText,
	        items: this.getSealingIndexItems(config)
	    },{
    		title: this.clcLevelTitleText,
	        items: this.getCclLevelItems(config)
	    },{
    		title: this.clcLegendBuilderTitleText,
	        items: this.getCclLegendItems(config)
	    }
	    // , roiForm
	    ,{
    		title: this.roiTitleText,
	        items: this.getRoiItems(config)
	    }
	    ];

		gxp.widgets.form.SoilPanel.superclass.initComponent.call(this, config);
	},

	getTimeSelectionItems: function(config){
		var me = this;
		var onElementSelect = function(el, selected, index) {
			//TODO
		};
		return [{
	            xtype: 'radiogroup',
	            fieldLabel: 'Auto Layout',
				ref   : '/yearsSelection',
	            cls: 'x-check-group-alt',
				name : 'years',
            	columns: 1,
            	items:[{
                	boxLabel: 'one year', 
                	name: 'years', 
                	inputValue: 1
                },{
                	boxLabel: 'two year', 
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
				ref   : 'filterT0ComboBox',
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
				}
			}, {
				xtype : "combo",
				ref   : 'filterT1ComboBox',
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
				}
			}]
		}];
	},

	getSealingIndexItems: function(config){

		var me = this;
		var onElementSelect = function(el, selected, index) {
			//TODO
		};

		return [{
			title : this.basedOnCLCText,
			xtype : 'fieldset',
			autoWidth : true,
			collapsible : false,
			layout : 'fit',
			defaultType : 'radiogroup',
			items : [{
				ref   : '/sealingIndexCLC',
	            cls: 'x-check-group-alt',
				name : 'sealingIndex',
            	columns: 1,
            	items:[{
                	boxLabel: this.coverText, 
                	name: 'sealingIndex', 
                	inputValue: this.coverText
                },{
                	boxLabel: this.changingTaxText, 
                	name: 'sealingIndex', 
                	inputValue: this.changingTaxText
                },{
                	boxLabel: this.marginConsumeText, 
                	name: 'sealingIndex', 
                	inputValue: this.marginConsumeText
                },{
                	boxLabel: this.sprawlText, 
                	name: 'sealingIndex', 
                	inputValue: this.sprawlText
                }],
            	listeners:{
            		change: onElementSelect
            	}
            }]
        },{
			title : this.basedOnImperviousnessText,
			xtype : 'fieldset',
			autoWidth : true,
			collapsible : false,
			layout : 'fit',
			defaultType : 'radiogroup',
			items : [{
				ref   : '/sealingIndexImpervious',
	            cls: 'x-check-group-alt',
				name : 'sealingIndex',
            	columns: 1,
			    defaults: {
			        // applied to each contained panel
			        bodyStyle: 'padding:15px'
			    },
            	items:[{
                	boxLabel: this.urbanDispersionText, 
                	name: 'sealingIndex', 
                	inputValue: this.urbanDispersionText
                },{
                	boxLabel: this.edgeDensityText, 
                	name: 'sealingIndex', 
                	inputValue: this.edgeDensityText
                },{
                	boxLabel: this.urbanDiffusionText, 
                	name: 'sealingIndex', 
                	inputValue: this.urbanDiffusionText
                },{
                	boxLabel: this.framesText, 
                	name: 'sealingIndex', 
                	inputValue: this.framesText
                },{
                	boxLabel: this.consumeOnlyText, 
                	name: 'sealingIndex', 
                	inputValue: this.consumeOnlyText
                },{
                	boxLabel: this.consumeOnlyConfText, 
                	name: 'sealingIndex', 
                	inputValue: this.consumeOnlyConfText
                }],
            	listeners:{
            		change: onElementSelect
            	}
            }]
        }];
	},

	getCclLevelItems: function(config){
		var me = this;

		var cclLevelItem0;

		// Select a layer record as CCL
		var onElementSelect = function(el, selected, index) {

			// clean
			me.roiFieldSet.removeFeatureSummary();
			me.roiFieldSet.reset();

			// get layer record from the selected element
			var record = selected;
			if(!selected.get){
				record = selected.inputValue;
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
		};

		if(this.cclLevelMode == 'radiogroup'){
			cclLevelItem0 = {
	            xtype: 'radiogroup',
	            fieldLabel: 'Auto Layout',
				ref   : '/rasterComboBox',
	            cls: 'x-check-group-alt',
				name : 'raster',
            	columns: 1,
            	listeners:{
            		change: onElementSelect
            	}
	        };    

		    this.layerStore.on('load', function (t, records, options) {
                var i = 0;
                me.rasterComboBox.items = [];
                for (var i = 0; i < records.length; i++) {
                    me.rasterComboBox.items.push({
                    	boxLabel: records[i].get('title'), 
                    	name: 'raster', 
                    	inputValue: records[i]
                    })
                }
                me.rasterComboBox.doLayout();
            });

		    this.on('activate', function(){
				me.reloadLayers();
		    });

		}else{
			cclLevelItem0 = {
				xtype : "combo",
				ref   : '/rasterComboBox',
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
					select : onElementSelect,
					beforequery : function() {
						this.reloadLayers();
					}
				}
			};
		}
		return [cclLevelItem0];
	},

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
			ref : 'classesselector',
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

	getRoiItems: function(config){
		// Fieldset configurtions
		var roiFieldSetConfig = {
				ref: '/roiFieldSet',
				id: this.id + '_roiFieldSet',
				layout: 'table',
				xtype:'gxp_spatial_selector_field',
				loadingMaskId: this.id,
				wpsManager: this.wpsManager
				,
				boxMaxWidth: 300
				// ,
				// collapsed : true,
				// checkboxToggle : false,
				// collapsible : false
		};

		// copy runtime dependencies
		roiFieldSetConfig.mapPanel = this.target.mapPanel;
		Ext.apply(roiFieldSetConfig, this.geocoderConfig);
		return [roiFieldSetConfig]
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
			data.push(recordData);
		}

		return data;
	}

});

Ext.reg(gxp.widgets.form.SoilPanel.prototype.xtype, gxp.widgets.form.SoilPanel);
