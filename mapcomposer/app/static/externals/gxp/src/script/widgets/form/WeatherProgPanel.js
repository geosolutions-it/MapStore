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
 *  class = WeatherProg Tool
 */

/** api: (extends)
 *  Ext.Panel.js
 */
Ext.namespace("gxp.widgets.form");

/** api: constructor
 *  .. class:: WeatherProgPanel(config)
 *
 *    Show a change matrix of changes between two rasters
 */
gxp.widgets.form.WeatherProgPanel = Ext.extend(gxp.widgets.form.AbstractOperationPanel, {

	/** api: xtype = gxp_weatherprogpanel */
	xtype : "gxp_weatherprogpanel",

	/** i18n **/
    weatherProgClimateTitleText: 'Climate Variables',
    basedOnCLCText: 'Based on CLC',
    
    weatherProgStatTitleText: 'Stat',
    
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
	urbanDiffusionAText: 'Urban Area',
	urbanDiffusionBText: 'Highest Polygon Ratio',
	urbanDiffusionCText: 'Other Polygons Ratio',
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

	// show result grid when done. Default is false
	showResultOnDone: false,
    
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

    /** api: method[generateItems]
     *  :arg config: ``String`` Configuration to be applied on this
     *  :returns: ``Array`` items for the form.
     *  Custom elements for the soil sealing panel
     */
	generateItems: function(config){
		return [{
    		title: this.roiTitleText,
			layout : 'form',
			autoScroll: true,
	        items: this.getRoiItems(config)
	    },{
    		title: this.weatherProgClimateTitleText,
	        items: this.getWeatherProgClimateItems(config)
	    },{
    		title: this.timeSelectionTitleText,
    		// layout : 'fit',
	        items: this.getTimeSelectionItems(config)
	    },{
    		title: this.weatherProgStatTitleText,
    		//layout : 'fit',
	        items: this.getWeatherProgStatItems(config)
	    }];
	},

    /** api: method[getWeatherProgStatItems]
     *  :arg config: ``String`` for this element. Unused
     *  :returns: ``Array`` items for Weather Prog Climate.
     *  Obtain Weather Prog Climate.
     */
	getWeatherProgStatItems: function(config){

        /*0	sum
        1	min
        2	max
        3	mean
        4	std*/
    
		var me = this;

		return [{
			title : this.weatherProgStatTitleText,
			xtype : 'fieldset',
			autoWidth : true,
			collapsible : false,
			layout : 'fit',
			defaultType : 'radiogroup',
			items : [{
				ref   : '../../weatherProgStat',
				id: me.id + "_weatherProgStat",
	            cls: 'x-check-group-alt',
				name : 'weatherProgStatVar',
            	columns: 1,
            	items:[{
                	boxLabel: "Sum", 
                	name: 'weatherProgStatVar', 
                	inputValue: "SUM",
                    checked: true
                },{
                	boxLabel: "Min", 
                	name: 'weatherProgStatVar', 
                	inputValue: "MIN"
                },{
                	boxLabel: "Max", 
                	name: 'weatherProgStatVar', 
                	inputValue: "MAX"
                },{
                	boxLabel: "Mean", 
                	name: 'weatherProgStatVar', 
                	inputValue: "MEAN",
                    disabled: true
                },{
                	boxLabel: "Std", 
                	name: 'weatherProgStatVar', 
                	inputValue: "STD",
                    disabled: true
                }],
            	listeners:{
            		//change: this.sealingIndexSelect,
            		scope: this
            	}
            }]
        }];
	},

    /** api: method[resetForm]
     *  Reset form.
     */
	resetForm: function(){
		gxp.widgets.form.WeatherProgPanel.superclass.resetForm.call(this);
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
		if(this.roiFieldSet && this.roiFieldSet.rendered){
			this.roiFieldSet.removeFeatureSummary();
			this.roiFieldSet.reset();
		}

		if(selected && selected.inputValue 
			// the filter for clc levels is 0
			&& selected.inputValue.indexOf(this.clcLevelsConfig[0].filter) > -1) {
			// should be impervious index
			this.enableOrDisableElements('impervious');
			// disable clc levels
			this.clcLevels.items.each(function(item){
				item.checked = false;
			});
		} else if(selected) {
			this.enableOrDisableElements('clcLevels');
			// disable imperviousness items
			this.imperviousness.items.each(function(item){
				item.checked = false;
			});
			// for(var key in this.imperviousness.ite)
		}

		gxp.widgets.form.WeatherProgPanel.superclass.onLayerSelect.call(this, el, selected, index);
	},

    /** api: method[getWeatherProgClimateItems]
     *  :arg config: ``String`` for this element. Unused
     *  :returns: ``Array`` items for Weather Prog Climate.
     *  Obtain Weather Prog Climate.
     */
	getWeatherProgClimateItems: function(config){

		var me = this;

		return [{
			title : this.weatherProgClimateTitleText,
			xtype : 'fieldset',
			autoWidth : true,
			collapsible : false,
			layout : 'fit',
			defaultType : 'radiogroup',
			items : [{
				ref   : '../../weatherProgClimate',
				id: me.id + "_weatherProgClimate",
	            cls: 'x-check-group-alt',
				name : 'weatherProgClimateVar',
            	columns: 1,
            	items:[{
                	boxLabel: "Precipitation", 
                	name: 'weatherProgClimateVar', 
                	inputValue: "rain_cum",
                    checked: true
                },{
                	boxLabel: "Min Temperature", 
                	name: 'weatherProgClimateVar', 
                	inputValue: "temp_min",
                    disabled: true
                },{
                	boxLabel: "Max Temperature", 
                	name: 'weatherProgClimateVar', 
                	inputValue: "temp_max",
                    disabled: true
                },{
                	boxLabel: "Mean Temperature", 
                	name: 'weatherProgClimateVar', 
                	inputValue: "temp_mean",
                    disabled: true
                }/*,{
                	boxLabel: "Plasmopara viticola", 
                	name: 'weatherProgClimateVar', 
                	inputValue: 5
                }*/],
            	listeners:{
            		//change: this.sealingIndexSelect,
            		scope: this
            	}
            }]
        }];
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
                	inputValue: 1,
                    disabled: true
                },{
                	boxLabel: this.twoYearsText, 
                	name: 'years', 
                	inputValue: 2,
                    checked: true
                }],
            	listeners:{
            		change: onElementSelect
            	}
	        },{
                title : "Hours - Day Filter",
                xtype : 'fieldset',
                collapsible : false,
                layout : 'fit',           
                items:[{
                    xtype: 'radiogroup',
                    ref   : '/dayhours',
                    cls: 'x-check-group-alt',
                    id   : me.id + '_dayhours',
                    name : 'dayhours',
                    columns: 2,
                    listeners:{
                        //change: onElementSelect
                    },
                    items:[{
                            boxLabel: "Hours", 
                            name: 'dayhours', 
                            inputValue: "_h1",
                            disabled: true
                        },{
                            boxLabel: "Day", 
                            name: 'dayhours', 
                            inputValue: "_h24",
                            checked: true
                        }]
                    }
                ]
	        },{
			title : this.timeFilterTitle,
			xtype : 'fieldset',
			autoWidth : true,
			collapsible : false,
			layout : 'form',
			defaultType : 'datefield',
			items : [{
				xtype : "datefield",
				ref   : '../../filterT0ComboBox',
				id   : me.id + '_filterT0ComboBox',
				name : 'filterT0',
                format: "Y-m-d H:i",
				fieldLabel : "Start Date",
				emptyText : "Select Start Date ...",
				labelSeparator : ':' + '<span style="color: #918E8F; padding-left: 2px;">*</span>',
				editable : true,
				resizable : true,
                width : 150,
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
				xtype : "datefield",
				ref   : '../../filterT1ComboBox',
				id   : me.id + '_filterT1ComboBox',
				name : 'filterT1',
				fieldLabel : "End Date",
                format: "Y-m-d H:i",
                width : 150,
				//lazyInit : true,
				//mode : 'local',
				//triggerAction : 'all',
				//store : this.timeValuesStore,
				emptyText : "Select End Date ...",
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
				if(selected && selected.inputValue){
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
		}
	},

    /** api: method[submitForm]
     *  Submit form. FIXME: include new functionalities
     */
	submitForm: function() {
        // Commented for demo
		//if(this.validate()){
			//TODO: Get result from WPS process
			// var responseData = this.getFakeResponse();
			// var params = this.getWPSParams();
			// this.showResult(responseData);
			
            // Commented for demo
			var wfsGrid = Ext.getCmp(this.geocoderConfig.targetResultGridId);
			if(wfsGrid) {
				var lastOptions = wfsGrid.store.lastOptions;
	         	wfsGrid.store.reload(lastOptions);
	         	wfsGrid.getView().refresh();
			}
			
			this.startWPSRequest(this.getForm().getValues());
		//}
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
		if(this.roiFieldSet && this.roiFieldSet.getSelectedAreas()){
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

		// Refresh wfs grid
		if(this.geocoderConfig.targetResultGridId){
			var wfsGrid = Ext.getCmp(this.geocoderConfig.targetResultGridId);
			if(wfsGrid && wfsGrid.rendered) {
				var lastOptions = wfsGrid.store.lastOptions;
	         	wfsGrid.store.reload(lastOptions);
	         	wfsGrid.getView().refresh();
			}
		}

		if(this.showResultOnDone){
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
		}
	},

	/**
	 *
	 */
	startWPSRequest : function(params) {
        var me = this;
    
        var start = this.filterT0ComboBox;
        var end = this.filterT1ComboBox;
        
        var checkStartDate = start.getValue();
        
        if(checkStartDate !== ""){
            var startDateISO = new Date(start.getValue());        
            var startDateUTC = startDateISO.getFullYear() + '-'
                        + this.pad(startDateISO.getMonth() + 1) + '-'
                        + this.pad(startDateISO.getDate()) + 'T'
                        + this.pad(startDateISO.getHours()) + ':'
                        + this.pad(startDateISO.getMinutes()) + ':'
                        + this.pad(startDateISO.getSeconds()) + 'Z';
        }
        
        var checkEndDate = end.getValue();
        
        if (checkEndDate !== ""){
            var endDateISO = new Date(end.getValue());
            var endDateUTC = endDateISO.getFullYear() + '-'
                        + this.pad(endDateISO.getMonth() + 1) + '-'
                        + this.pad(endDateISO.getDate()) + 'T'
                        + this.pad(endDateISO.getHours()) + ':'
                        + this.pad(endDateISO.getMinutes()) + ':'
                        + this.pad(endDateISO.getSeconds()) + 'Z';                    
        }           
            
        var statistic = params.weatherProgStatVar;
        var raster = params.weatherProgClimateVar + params.dayhours;
        var style = this.geocoderConfig.defaultProcessStyle;
        
		//get the current extent
		var map = me.target.mapPanel.map;
		var currentExtent = map.getExtent();
		
		//transform to a Geometry (instead of Bounds)
		if (me.roiFieldSet && me.roiFieldSet.collapsed !== false && me.roiFieldSet.outputType.value) {
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
        
        var cccc = params.roi.toString();

		// get inputs
		var inputs = {
			name : new OpenLayers.WPSProcess.LiteralData({
				value : raster
			}),
			defaultStyle : new OpenLayers.WPSProcess.LiteralData({
				value : style
			}),
			storeName : new OpenLayers.WPSProcess.LiteralData({
				value : this.geocoderConfig.storeName
			}),
			typeName : new OpenLayers.WPSProcess.LiteralData({
				value : this.geocoderConfig.typeName
			}),
			statistic : new OpenLayers.WPSProcess.LiteralData({
				value : statistic
			}),                                   
			startTime : new OpenLayers.WPSProcess.LiteralData({
				value : startDateUTC || " "
			}),
			endTime : new OpenLayers.WPSProcess.LiteralData({
				value : endDateUTC || startDateUTC
			}),
			ROI : new OpenLayers.WPSProcess.ComplexData({
				value : params.roi.toString(),
				mimeType : 'application/wkt'
			})
		};

		var processName = this.geocoderConfig.wpsProcessName;

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
	},
    pad: function (n) {
        return n < 10 ? '0' + n : n
    }

});

Ext.reg(gxp.widgets.form.WeatherProgPanel.prototype.xtype, gxp.widgets.form.WeatherProgPanel);
