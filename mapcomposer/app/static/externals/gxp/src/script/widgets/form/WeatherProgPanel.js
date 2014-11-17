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
    
    forceLayout : true, 

	/** i18n **/
    weatherProgClimateTitleText: 'Climate Variables',
    weatherProgStatTitleText: 'Statistics',
    climateVarPrecLabel: "Precipitation", 
    climateVarMinTempLabel: "Min Temperature", 
    climateVarMaxTempLabel: "Max Temperature", 
    climateVarMeanTempLabel: "Mean Temperature",     
    timeFieldsetTitle: "Hours - Day Filter",    
    timeHoursLabel: "Hours", 
    timeDayLabel: "Day",                 
    startDateLabel: "Selection Begin",
    startDateEmptyText: "Select Start Date ...",
    endDateLabel: "Selection end",
    endDateEmptyText: "Select End Date ...",                            

	// Validation
	invalidFormDialogText: "Please review the form fields:<ul>",
	invalidFormTitleText: "Error",
    dateMandatoryAlertText: "You must select at least the start date",
    twoTimeMandatoryAlertText: "You have selected Two time, you must also select And Time",
    startDateMandatoryAlertText: "You must select Start Time",
	wpsError: "Error on WPS Process",

	/** EoF i18n **/

	// show result grid when done. Default is false
	showResultOnDone: false,

    /** api: config[defaultAction]
     *  ``Object`` Time selection set disable elements
     */
	enableOrDisableConfig:{
		1:{
			filterT1ComboBox: true
		},
		2:{
			filterT1ComboBox: false
		},
		'default':{
			filterT1ComboBox: false
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

	initComponent:function(config){
		var wfsResumeTool = this.target.tools['gxp_wfsresume'];
		this.wfsResumeTool = wfsResumeTool;
		this.wfsResumeTool.addSupport(this.classesIndexes, this.classes, this.geocoderConfig);
		gxp.widgets.form.WeatherProgPanel.superclass.initComponent.call(this, config);
	},
    
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
                    disabled: false
                },{
                	boxLabel: "Std", 
                	name: 'weatherProgStatVar', 
                	inputValue: "STD",
                    disabled: false
                }],
            	listeners:{
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
		this.activeElementByTitle(this.roiTitleText);
        this.roiFieldSet.ownerCt.doLayout();
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
                	boxLabel: this.climateVarPrecLabel, 
                	name: 'weatherProgClimateVar', 
                	inputValue: "rain_cum",
                    checked: true
                },{
                	boxLabel: this.climateVarMinTempLabel, 
                	name: 'weatherProgClimateVar', 
                	inputValue: "temp_min",
                    disabled: false
                },{
                	boxLabel: this.climateVarMaxTempLabel, 
                	name: 'weatherProgClimateVar', 
                	inputValue: "temp_max",
                    disabled: false
                },{
                	boxLabel: this.climateVarMeanTempLabel, 
                	name: 'weatherProgClimateVar', 
                	inputValue: "temp_mean",
                    disabled: false
                }],
            	listeners:{
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
                deferredRender: false,
				ref   : '/yearsSelection',
	            cls: 'x-check-group-alt',
				id   : me.id + '_yearsSelection',
				name : 'years',
            	columns: 1,
            	items:[{
                	boxLabel: this.oneYearText, 
                	name: 'years', 
                	inputValue: 1,
                    disabled: false
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
                title : this.timeFieldsetTitle,
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
                            boxLabel: this.timeHoursLabel, 
                            name: 'dayhours', 
                            inputValue: "_h1",
                            disabled: false
                        },{
                            boxLabel: this.timeDayLabel, 
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
				fieldLabel : this.startDateLabel,
				emptyText : this.startDateEmptyText,
				labelSeparator : ':' + '<span style="color: #918E8F; padding-left: 2px;">*</span>',
				editable : true,
				resizable : true,
                width : 150,
				allowBlank : false,
				readOnly : false
			}, {
				xtype : "datefield",
				ref   : '../../filterT1ComboBox',
				id   : me.id + '_filterT1ComboBox',
				name : 'filterT1',
				fieldLabel : this.endDateLabel,
                format: "Y-m-d H:i",
                width : 150,
				emptyText : this.endDateEmptyText,
				labelSeparator : ':' + '<span style="color: #918E8F; padding-left: 2px;">*</span>',
				editable : true,
				resizable : true,
				allowBlank : false,
				readOnly : false
			}]
		}];
	},

    /** api: method[submitForm]
     *  Submit form. FIXME: include new functionalities
     */
	submitForm: function() {
        // Commented for demo
		if(this.validate()){
			//TODO: Get result from WPS process
			// var responseData = this.getFakeResponse();
			// var params = this.getWPSParams();
			// this.showResult(responseData);

            //activate tab
            var changematrixTool = this.target.tools["changeMatrixTool"];            
            var tab = Ext.getCmp(changematrixTool.wfsChangeMatrisGridPanelID);
            tab.setActiveTab(this.geocoderConfig.targetResultGridId + "_panel");
			
            // Commented for demo
			var wfsGrid = Ext.getCmp(this.geocoderConfig.targetResultGridId);
			if(wfsGrid) {
				var lastOptions = wfsGrid.store.lastOptions;
	         	wfsGrid.store.reload(lastOptions);
	         	wfsGrid.getView().refresh();
			}
                
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
        
        var startTime = this.filterT0ComboBox.getValue();
        var endTime = this.filterT1ComboBox.getValue();                    
        var yearsSelection = this.yearsSelection;
        
        if (startTime === "" && endTime === ""){
            valid = false;
            msg = "<li>" + this.dateMandatoryAlertText + "</li>";
        }else{
            if(startTime !== ""){
                if (yearsSelection.getValue().inputValue === 2 && endTime === ""){
                    valid = false;
                    msg = "<li>" + this.twoTimeMandatoryAlertText + "</li>";        
                }
            }else{
                valid = false;
                msg = "<li>" + this.startDateMandatoryAlertText + "</li>";            
            }
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
        var checkEdnDateDisabled = end.disabled;
        
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
        
        var yearsSelection = this.yearsSelection;
        
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
				value : checkEdnDateDisabled ? startDateUTC : endDateUTC
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
