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
gxp.widgets.form.SoilPanel = Ext.extend(gxp.widgets.form.AbstractOperationPanel, {

	/** api: xtype = gxp_soilpanel */
	xtype : "gxp_soilpanel",

	/** i18n **/
	clcLevelTitleText: 'CLC Levels / Urban Grids',
	imperviousnessText: 'Imperviousness',

	// LUC (land use/cover)
	basedOnCLCText: 'Based on CLC',
	coverText: 'Coefficiente Copertura',
	changingTaxText: 'Tasso di Variazione',
	marginConsumeText: 'Consumo Marginale del Suolo',
	sprawlText: 'Sprawl Urbano',

	// Second fieldset (impervious)
	basedOnImperviousnessText: 'Based on Imperviousness',
	urbanDispersionText: 'Dispersione Urbana',
	edgeDensityText: 'Edge Density',
	urbanDiffusionText: 'Diffusione Urbana',
	framesText: 'Frammentazione',
	consumeOnlyText: 'Consumo Suolo',
	consumeOnlyConfText: 'Coefficiente Ambientale Cons. Suolo',

	// Validation
	invalidFormDialogText: "Please review the form fields:<ul>",
	invalidFormTitleText: "Error",
	invalidYearsFormDialogText: "Years range not selected",
	invalidROIFormDialogText: "ROI not selected",
	invalidCLCLevelFormDialogText: "CLC level not selected",
	invalidClassesFormDialogText: "CLC Level builder not selected",
	invalidSealingIndexFormDialogText: "Soil Sealing index not selected",
	invalidRange0IndexFormDialogText: "Reference time not selected",
	invalidRange1IndexFormDialogText: "Current time not selected",
	wpsError: "Error on WPS Process",

	/** EoF i18n **/
    
    /** api: config[defaultAction]
     *  ``Object`` Time selection set disable elements
     */
	enableOrDisableConfig:{
		1:{
			sealingIndexCLC:{
				0: false,
				1: true,
				2: true,
				3: true
			},
			sealingIndexImpervious:{
				0: false,
				1: false,
				2: false,
				3: false,
				4: false,
				5: false,
				6: true,
				7: true
			},
			filterT1ComboBox: true,
			classesselector: false
		},
		2:{
			sealingIndexCLC:{
				0: false,
				1: false,
				2: false,
				3: false
			},
			sealingIndexImpervious:{
				0: false,
				1: false,
				2: false,
				3: false,
				4: false,
				5: false,
				6: false,
				7: false
			},
			filterT1ComboBox: false
		},
		'sealingIndexImpervious':{
			classesselector: true
		},
		'sealingIndexCLC':{
			rasterComboBox: false,
			classesselector: false
		},
		'default':{
			sealingIndexCLC:{
				0: false,
				1: false,
				2: false,
				3: false
			},
			sealingIndexImpervious:{
				0: false,
				1: false,
				2: false,
				3: false,
				4: false,
				5: false,
				6: false,
				7: false
			},
			rasterComboBox: false,
			filterT1ComboBox: false,
			classesselector: false
		},
		'clcLevels':{
			sealingIndexCLC: false,
			sealingIndexImpervious: true
		},
		'impervious':{
			sealingIndexCLC: true,
			sealingIndexImpervious: false
		}
	},
    
    /** api: config[roiFieldSetConfig]
     *  ``Object`` Configuration to overwrite roifieldset config
     */
	roiFieldSetConfig: {
		/** api: config[defaultSelectionMethod]
		 *  ``String``
		 *  Default selection method enabled. @see this.spatialSelectors
		 */
		defaultSelectionMethod: 'geocoder',
		/** api: config[spatialSelectors]
		 *  ``Object``
		 * Enable/disable spatial selectors options.
		 */
		spatialSelectors : [{
			name  : 'GeoCoder',
			label : 'Administrative Areas',
			value : 'geocoder'
		}],
		/** api: config[defaultReturnType]
		 *  ``String``
		 *  Default return type enabled. @see this.geocoderSelectors
		 */
		defaultReturnType: 'list',
		/** api: config[geocoderSelectorsLabels]
		 * ``Array`` of ``String``
		 * Label text for the return types selection (i18n).
		 */
		geocoderSelectorsLabels: this.geocoderSelectorsLabels,
		/** api: config[geocoderSelectors]
		 *  ``Object``
		 *  Options for the geocoder return types selections.
		 */
	 	geocoderSelectors : [{
			name  : 'List',
			label : 'Administrative Area List',
			value : 'list'
		}, {
			name  : 'Subs',
			label : 'Administrative Area Subs',
			value : 'subs'
		}]
	},

    /** api: config[clcLevelsConfig]
     *  ``Object`` CLC levels cconfiguration
     */
	clcLevelsConfig:[{
		filter: 'corine_L',
		decorator: 'Corine Land Cover Level {0}'
	},{
		filter: 'urban_grids',
		decorator: 'Urban Grids'
	}],

    /** private: config[clcLevelsConfig]
     *  ``Object`` Translated index names by id
     */
	translatedIndexNames:{},


	/** api: method[initComponent]
	 *  Generate a panel with the configuration present on this
	 */
	initComponent: function(config){

		// Use translations
		Ext.apply(this.translatedIndexNames,{
			1: this.coverText,
			2: this.changingTaxText,
			3: this.marginConsumeText,
			4: this.sprawlText,
			5: this.urbanDispersionText,
			6: this.edgeDensityText,
			7: this.urbanDiffusionText,
			8: this.framesText,
			9: this.consumeOnlyText,
			10: this.consumeOnlyConfText,

		})

		gxp.widgets.form.SoilPanel.superclass.initComponent.call(this, config);
	},

    /** api: method[generateItems]
     *  :arg config: ``String`` Configuration to be applied on this
     *  :returns: ``Array`` items for the form.
     *  Custom elements for the soil sealing panel
     */
	generateItems: function(config){
		return [{
    		title: this.clcLevelTitleText,
    		layout : 'fit',
	        items: this.getCclLevelItems(config)
	    },{
    		title: this.timeSelectionTitleText,
    		// layout : 'fit',
	        items: this.getTimeSelectionItems(config)
	    },{
    		title: this.soilSealingIndexTitleText,
	        items: this.getSealingIndexItems(config)
	    },{
    		title: this.clcLegendBuilderTitleText,
			layout : 'table',
			columns: 1,
	        items: this.getCclLegendItems(config)
	    },{
    		title: this.roiTitleText,
			layout : 'vBox',
	        items: this.getRoiItems(config)
	    }];
	},

    /** api: method[getCclLevelItems]
     *  :arg config: ``Object`` Configuration for this. Unused
     *  :returns: ``Array`` items for the CLC level element.
     *  Obtain CLC level elements.
     */
	getCclLevelItems: function(config){
		var me = this;

		// Divide in two fieldset
	    this.layerStore.on('load', function (t, records, options) {
            me.clcLevels.items = [];
            me.imperviousness.items = [];
            for (var i = 0; i < records.length; i++) {
            	// delegate to getRasterItem
            	var item = me.getRasterItem(records[i]);
            	if(item != null){
            		if(item.filterFound == me.clcLevelsConfig[0]){
            			me.clcLevels.items.push(item);
            		}else{
            			me.imperviousness.items.push(item);
            		}
            	}
            }
            me.clcLevels.doLayout();
            me.imperviousness.doLayout();
        });

	    this.target.on('ready', function(){
			me.reloadLayers();
	    });

		return [{
			title : this.clcLevelTitleText,
			xtype : 'fieldset',
			ref   : '/rasterComboBox',
			id   : me.id + '_rasterComboBox',
			autoWidth : true,
			autoHeight : true,
			collapsible : false,
			layout : 'fit',
			defaultType : 'radiogroup',
			items : [{
				ref   : '../../clcLevels',
				id: me.id + "clcLevels",
	            cls: 'x-check-group-alt',
				name : 'raster',
            	columns: 1,
            	listeners:{
            		change: me.onLayerSelect,
            		scope: this
            	}
            }]
        },{
			title : this.imperviousnessText,
			xtype : 'fieldset',
			autoWidth : true,
			autoHeight : true,
			collapsible : false,
			layout : 'fit',
			defaultType : 'radiogroup',
			items : [{
				ref   : '../../imperviousness',
				id: me.id + "imperviousness",
	            cls: 'x-check-group-alt',
				name : 'raster',
            	columns: 1,
			    defaults: {
			        // applied to each contained panel
			        bodyStyle: 'padding:15px'
			    },
            	listeners:{
            		change: me.onLayerSelect,
            		scope: this
            	}
            }]
        }];
	},

    /** api: method[resetForm]
     *  Reset form.
     */
	resetForm: function(){
		gxp.widgets.form.SoilPanel.superclass.resetForm.call(this);
		this.filterT0ComboBox.reset();
		this.filterT1ComboBox.reset();
		this.activeElementByTitle(this.clcLevelTitleText);
	},

    /** api: method[onLayerSelect]
     *  :arg el: ``Object`` Component
     *  :arg selected: ``Object`` Selected element
     *  Select a layer record as CLC level and initialize needed items on the form
     */
	onLayerSelect: function(el, selected, index) {

		// Reset another elements
		this.yearsSelection.reset();
		this.filterT0ComboBox.reset();
		this.filterT1ComboBox.reset();
		this.sealingIndexCLC.reset();
		this.sealingIndexImpervious.reset();
		this.classesselector.reset();
		if(this.roiFieldSet.rendered){
			this.roiFieldSet.removeFeatureSummary();
			this.roiFieldSet.reset();
		}

		if(selected && selected.inputValue 
			// the filter for clc levels is 0
			&& selected.inputValue.indexOf(this.clcLevelsConfig[0].filter) > -1){
			this.enableOrDisableElements('clcLevels');
		}else if(selected){
			// should be impervious index
			this.enableOrDisableElements('impervious');
		}

		gxp.widgets.form.SoilPanel.superclass.onLayerSelect.call(this, el, selected, index);
	},

    /** api: method[getSealingIndexItems]
     *  :arg config: ``String`` for this element. Unused
     *  :returns: ``Array`` items for the sealing index element.
     *  Obtain sealing index elements.
     */
	getSealingIndexItems: function(config){

		var me = this;

		return [{
			title : this.basedOnCLCText,
			xtype : 'fieldset',
			autoWidth : true,
			collapsible : false,
			layout : 'fit',
			defaultType : 'radiogroup',
			items : [{
				ref   : '../../sealingIndexCLC',
				id: me.id + "_sealingIndexCLC",
	            cls: 'x-check-group-alt',
				name : 'sealingIndex',
            	columns: 1,
            	items:[{
                	boxLabel: this.coverText, 
                	name: 'sealingIndex', 
                	inputValue: 1
                },{
                	boxLabel: this.changingTaxText, 
                	name: 'sealingIndex', 
                	inputValue: 2
                },{
                	boxLabel: this.marginConsumeText, 
                	name: 'sealingIndex', 
                	inputValue: 3
                },{
                	boxLabel: this.sprawlText, 
                	name: 'sealingIndex', 
                	inputValue: 4
                }],
            	listeners:{
            		change: this.sealingIndexSelect,
            		scope: this
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
				ref   : '../../sealingIndexImpervious',
				id: me.id + "_sealingIndexImpervious",
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
                	inputValue: 5
                },{
                	boxLabel: this.edgeDensityText, 
                	name: 'sealingIndex', 
                	inputValue: 6
                },{
                	boxLabel: this.urbanDiffusionText + ' (a)', 
                	name: 'sealingIndex', 
                	inputValue: 71
                },{
                	boxLabel: this.urbanDiffusionText + ' (b)', 
                	name: 'sealingIndex', 
                	inputValue: 72
                },{
                	boxLabel: this.urbanDiffusionText + ' (c)', 
                	name: 'sealingIndex', 
                	inputValue: 73
                },{
                	boxLabel: this.framesText, 
                	name: 'sealingIndex', 
                	inputValue: 8
                },{
                	boxLabel: this.consumeOnlyText, 
                	name: 'sealingIndex', 
                	inputValue: 9
                },{
                	boxLabel: this.consumeOnlyConfText, 
                	name: 'sealingIndex', 
                	inputValue: 10
                }],
            	listeners:{
            		change: this.sealingIndexSelect,
            		scope: this
            	}
            }]
        }];
	},

    /** api: method[selectTimeIndex]
     *  Callback when a time selection item is selected
     */
	selectTimeIndex: function(){
		var filter0 = Ext.getCmp(this.id + '_filterT0ComboBox');
		var filter1 = Ext.getCmp(this.id + '_filterT1ComboBox');
		var yearsSelection = Ext.getCmp(this.id + '_yearsSelection');
		if(filter0  && filter0.getValue() 
			&& yearsSelection && yearsSelection.getValue()
			&& yearsSelection.getValue().inputValue
			&& (yearsSelection.getValue().inputValue == 1 
				||  filter1 && filter1.getValue())){
			this.activeElementByTitle(this.soilSealingIndexTitleText);
		}
	},

    /** api: method[selectTimeIndex]
     *  Callback when a time selection item is selected
     */
	sealingIndexSelect: function(parent, selected){
		if(parent 
			&& parent.ref){
			// Enable or disable elements based on parent.ref
			var selectedType = parent.ref.replace("../../", "");
			this.enableOrDisableElements(selectedType);
			// If is a sealingIndexImpervious, expand ROI
			if(selectedType == 'sealingIndexImpervious'){
				// disable check on the other radiogroup
				this.sealingIndexCLC.items.each(function(item){
					item.checked = false;
				});
				this.activeElementByTitle(this.roiTitleText);
			}else{
				// disable check on the other radiogroup
				this.sealingIndexImpervious.items.each(function(item){
					item.checked = false;
				});
				if(selected.inputValue == 3 || selected.inputValue == 4){
					this.classesselector.setDisabled(true);
					// Active next accordion: roiTitleText
					this.activeElementByTitle(this.roiTitleText);
				}else{
					this.classesselector.setDisabled(false);
					// Active next accordion: clcLevelBuilder
					this.activeElementByTitle(this.clcLegendBuilderTitleText);
				}
			}
		}
	},

    /** api: method[submitForm]
     *  Submit form. FIXME: include new functionalities
     */
	submitForm: function() {
		if(this.validate()){
			//TODO: Get result from WPS process
			// var responseData = this.getFakeResponse();
			// var params = this.getWPSParams();
			// this.showResult(responseData);
			this.startWPSRequest(this.getForm().getValues());
		}
	},

    /** api: method[validate]
     *  Validate form content after commit
     */
	validate: function(){
		var form = this.getForm();
		var values = form.getValues();
		var valid = true;
		var msg = this.invalidFormDialogText;

		// Time selection validation
		if(values.years){
			switch(parseInt(values.years)){
				case 2:
					if(values.filterT1){
						valid = valid && true;
					}else{
						valid = false;
						msg += "<li>" + this.invalidRange1IndexFormDialogText + "</li>";
					}
				default: 
					if(values.filterT0){
						valid = valid && true;
					}else{
						valid = false;
						msg += "<li>" + this.invalidRange0IndexFormDialogText + "</li>";
					}
			}
		}else{
			msg += "<li>" + this.invalidYearsFormDialogText + "</li>";
			valid = false;
		}

		// Soil Sealing index validation
		if(values.sealingIndex){
			valid = valid && true;
		}else{
			valid = false;
			msg += "<li>" + this.invalidSealingIndexFormDialogText + "</li>";
		}

		// CLC Level  validation
		if(this.rasterComboBox.disabled || values.raster){
			valid = valid && true;
		}else{
			valid = false;
			msg += "<li>" + this.invalidCLCLevelFormDialogText + "</li>";
		}

		// CLC Level builder validation
		if(this.classesselector.disabled || values.classesselector){
			valid = valid && true;
		}else{
			valid = false;
			msg += "<li>" + this.invalidClassesFormDialogText + "</li>";
		}

		// ROI validation
		if(this.roiFieldSet.getSelectedAreas()){
			valid = valid && true;
		}else{
			valid = false;
			msg += "<li>" + this.invalidROIFormDialogText + "</li>";
		}

		// Show message if is invalid
		if(!valid){
			msg += "</ul>";
			Ext.Msg.show({
			   title: this.invalidFormTitleText,
			   msg: msg,
			   width: 250,
			   buttons: Ext.Msg.OK,
			   icon: Ext.MessageBox.WARNING,
			   scope: this
			});
		}
		return valid;
	},

    /** api: method[showResult]
     *  :arg data: ``Object`` with the response of the process
     *  Show result as tabpanel. It uses the ´gxp_wfsresume´ plugin.
     */
	showResult: function(data){
		// request stop
		this.handleRequestStop();

		// decode data if is encoded
		var responseData = data;
		if(responseData && !responseData.index){
			try{
				responseData = JSON.parse(responseData);
			}catch (e){
				Ext.Msg.show({
				   title: this.wpsError,
				   msg: data,
				   width: 250,
				   buttons: Ext.Msg.OK,
				   icon: Ext.MessageBox.WARNING,
				   scope: this
				});
			}
		}

		// get translated name of the index
		if(responseData.index 
			&& responseData.index.id 
			&& this.translatedIndexNames[responseData.index.id]){
			responseData.index.name = this.translatedIndexNames[responseData.index.id];
		}

		// Show resume of the response data
		var me = this;
		var wfsResumeTool = this.target.tools['gxp_wfsresume'];
        if(wfsResumeTool 
        	&& responseData
        	&& responseData.index 
			&& responseData.index.id){
        	var grid = wfsResumeTool.createResultsGrid(responseData, 'soilsealing', 'soilsealing', 'soilsealing');
        	// var grid = wfsResumeTool.createResultsGrid(this.defaultInput2, 'soilsealing', 'soilsealing', 'soilsealing');
			var hasTabPanel = false;
			if (me.target.renderToTab) {
				var container = Ext.getCmp(me.target.renderToTab);
				if (container.isXType('tabpanel'))
					hasTabPanel = true;
			}
	
			if (hasTabPanel) {
				if (grid.win)
					grid.win.destroy();
				var now = new Date();
				grid.title += ' - ' + Ext.util.Format.date(now, 'H:i:s');
				container.add(grid);
				container.setActiveTab(container.items.length - 1);
			} else {
				if (me.resultWin)
					me.resultWin.destroy();
	
				//remove title to avoid double header
				grid.title = undefined;
	
				me.resultWin = new Ext.Window({
					width : 450,
					height : 450,
					layout : 'fit',
					title : grid.changeMatrixResultsTitle,
					constrainHeader : true,
					renderTo : me.target.mapPanel.body,
					items : [grid]
				});
				me.resultWin.show();
			}
			//if(this.win) this.win.destroy();
			grid.doLayout();
        }
	},

	/**
	 *
	 */
	startWPSRequest : function(params) {

		// index and subindex for 7
		var index = params.sealingIndex;
		var subIndex = null;
		if(index > 70){
			subIndex = index == 71 ? 'a' : index == 72 ? 'b' : 'c';
			index = 7;
		}
		
		// get inputs
		var inputs = {
			name : new OpenLayers.WPSProcess.LiteralData({
				value : params.raster
			}),
			defaultStyle : new OpenLayers.WPSProcess.LiteralData({
				value : this.geocoderConfig.defaultProcessStyle
			}),
			storeName : new OpenLayers.WPSProcess.LiteralData({
				value : this.geocoderConfig.storeName
			}),
			typeName : new OpenLayers.WPSProcess.LiteralData({
				value : this.geocoderConfig.typeName
			}),
			referenceFilter : new OpenLayers.WPSProcess.ComplexData({
				value : params.filterT0,
				mimeType : 'text/plain; subtype=cql'
			}),
			index: new OpenLayers.WPSProcess.LiteralData({
				value : index
			}),
			geocoderLayer: new OpenLayers.WPSProcess.LiteralData({
				value : this.geocoderConfig.geocoderLayer
			}),
			geocoderPopulationLayer: new OpenLayers.WPSProcess.LiteralData({
				value : this.geocoderConfig.geocoderPopulationLayer
			}),
			admUnits: new OpenLayers.WPSProcess.LiteralData({
				value : this.roiFieldSet.getSelectedAreas()
			}),
			admUnitSelectionType: new OpenLayers.WPSProcess.LiteralData({
				value : this.roiFieldSet.returnType != null && this.roiFieldSet.returnType == 'subs' ? "AU_SUBS" : "AU_LIST"
			}),
			classes : []
		};

		// Subindex for 7
		if(subIndex){
			inputs.subindex = new OpenLayers.WPSProcess.LiteralData({
				value : subIndex
			});
		}

		// add curTime
		if(params.filterT1){
			inputs.nowFilter = new OpenLayers.WPSProcess.ComplexData({
				value : params.filterT1,
				mimeType : 'text/plain; subtype=cql'
			});
		}

		// Generate classes elements
		var processName;
		if(params.classesselector){
			// soil sealing
			var classes = params.classesselector.split(",");
			for (var i = 0; i < classes.length; i++) {
				inputs.classes.push(new OpenLayers.WPSProcess.LiteralData({
					value : classes[i]
				}));
			}
			processName = this.geocoderConfig.wpsProcessName;
		}else{
			// impervious
			inputs.classes = null;
			inputs.imperviousnessLayer = new OpenLayers.WPSProcess.LiteralData({
				value : this.geocoderConfig.imperviousnessLayer
			});
			processName = this.geocoderConfig.imperviousnessProccessName;
		}
		

		var requestObject = {
			type : "raw",
			inputs : inputs,
			outputs : [{
				identifier : "result",
				mimeType : "application/json"
			}]
		};

		this.handleRequestStart();

		this.wpsManager.execute(processName, requestObject, this.showResult, this);
	}

});

Ext.reg(gxp.widgets.form.SoilPanel.prototype.xtype, gxp.widgets.form.SoilPanel);
