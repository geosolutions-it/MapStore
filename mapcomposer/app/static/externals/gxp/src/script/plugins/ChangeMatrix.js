/**
 *  Copyright (C) 2007 - 2012 GeoSolutions S.A.S.
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
gxp.plugins.ChangeMatrix = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_changematrix */
    ptype: "gxp_changematrix",
    
    /** api: config[changeMatrixMenuText]
     *  ``String``
     *  Text for add menu item (i18n).
     */
    //changeMatrixMenuText: "Add Group", // serve?

    /** api: config[changeMatrixActionTip]
     *  ``String``
     *  Text for add action tooltip (i18n).
     */
    changeMatrixActionTip: "Get a change matrix for a raster layer",
    
    /** api: config[changeMatrixDialogTitle]
     *  ``String``
     *  Title of the changeMatrix form window (i18n).
     */
    changeMatrixDialogTitle: "Change matrix",
    
    /** api: config[changeMatrixClassesFieldLabel]
     *  ``String``
     *  Text for the Classes field label (i18n).
     */
    changeMatrixClassesFieldLabel: "Classes",
    
    /** api: config[changeMatrixRasterFieldLabel]
     *  ``String``
     *  Text for the Raster field label (i18n).
     */
    changeMatrixRasterFieldLabel: "Raster Layer",
    
    /** api: config[changeMatrixCQLFilterT0FieldLabel]
     *  ``String``
     *  Text for the CQL Filter T0 field label (i18n).
     */
    changeMatrixCQLFilterT0FieldLabel: "CQL Filter 1",
    
    /** api: config[changeMatrixCQLFilterT1FieldLabel]
     *  ``String``
     *  Text for the CQL Filter T1 field label (i18n).
     */
    changeMatrixCQLFilterT1FieldLabel: "CQL Filter 2",
    
    /** api: config[changeMatrixResetButtonText]
     *  ``String``
     *  Text for the changeMatrix form submit button (i18n).
     */
    changeMatrixSubmitButtonText: "Submit",
    
    /** api: config[changeMatrixResetButtonText]
     *  ``String``
     *  Text for the changeMatrix form reset button (i18n).
     */
    changeMatrixResetButtonText: "Reset",
    
    /** api: config[changeMatrixResultsTitle]
     *  ``String``
     *  Text for the changeMatrix results container (i18n).
     */
    changeMatrixResultsTitle: "Change Matrix",
    
    // form errors
    /** api: config[changeMatrixEmptyLayer]
     *  ``String``
     *  Form validation messages: No layers selected (i18n).
     */
    changeMatrixEmptyLayer: "Please select a raster layer",
    
    /** api: config[changeMatrixEmptyFilter]
     *  ``String``
     *  Form validation messages: Empty filter (i18n).
     */
    changeMatrixEmptyFilter: "Please specify both time filters",
    
    /** api: config[changeMatrixEmptyClassesDialogTitle]
     *  ``String``
     *  Form validation messages: No classes selected (dialog title) (i18n).
     */
    changeMatrixEmptyClassesDialogTitle: "Error",
    
    /** api: config[changeMatrixEmptyClassesDialogText]
     *  ``String``
     *  Form validation messages: No classes selected (dialog content) (i18n).
     */
    changeMatrixEmptyClassesDialogText: "Please select at least one class",
    
    /** api: config[changeMatrixEmptyClassesDialogTitle]
     *  ``String``
     *  Form validation messages: No classes selected (dialog title) (i18n).
     */
    changeMatrixInvalidFormDialogTitle: "Error",
    
    /** api: config[changeMatrixEmptyClassesDialogText]
     *  ``String``
     *  Form validation messages: No classes selected (dialog content) (i18n).
     */
    changeMatrixInvalidFormDialogText: "Please correct the form errors",
        
    /** api: config[changeMatrixTimeoutDialogTitle]
     *  ``String``
     *  Form validation messages: No classes selected (dialog content) (i18n).
     */
    changeMatrixTimeoutDialogTitle: "Timeout",
        
    /** api: config[changeMatrixTimeoutDialogText]
     *  ``String``
     *  Form validation messages: No classes selected (dialog content) (i18n).
     */
    changeMatrixTimeoutDialogText: "Request Timeout",
            
    /** api: config[changeMatrixResponseErrorDialogTitle]
     *  ``String``
     *  Error parsing the JSON response from the wps service (dialog title) (i18n).
     */
    changeMatrixResponseErrorDialogTitle: "Error",
        
    /** api: config[changeMatrixResponseErrorDialogText]
     *  ``String``
     *  Error parsing the JSON response from the wps service (dialog content) (i18n).
     */
    changeMatrixResponseErrorDialogText: "There was an error processing the request.",
    
    /** api: config[renderToTab]
     *  ``Boolean``
     *  Whether or not render to a Tab. Applies only on Tab enabled View (see MapStore config)
     */
    renderToTab: true,
    
    /** api: config[requestTimeout]
     *  ``Integer``
     *  Timeout for the WPS request
     */
    requestTimeout: 30000,
    
    /** api: config[rasterLayers]
     *  ``String[]``
     *  Array of available raster layers.
     */
    rasterLayers: null,
    
    /** api: config[classes]
     *  ``Integer[]``
     *  Array of classes.
     */
    classes: null,
    
    
    /** api: config[wpsManagerID]
     *  ``String``
     *  WPS Manager Plugin ID .
     */
    wpsManagerID: null,

    //private

    // Begin i18n.
    northLabel:"North",
    westLabel:"West",
    eastLabel:"East",
    southLabel:"South",
    aoiFieldSetTitle: "Region Of Interest",
    setAoiText: "SetROI",
    setAoiTooltip: 'Enable the SetBox control to draw a ROI (BBOX) on the map',
    chgMatrixFieldSetTitle: 'Change Matrix Inputs',
    // End i18n.

    win: null,
    formPanel: null,
    wpsManager: null,
    resultWin: null,
    loadingMask: null,
    errorTimer: null,
    
    init: function(target) {

        //get a reference to the wpsManager
        this.wpsManager = target.tools[this.wpsManagerID];

        return gxp.plugins.ChangeMatrix.superclass.init.apply(this, arguments);

    },

	/** private: method[addOutput]
     *  :arg config: ``Object``
     */
    addOutput: function(config) {
        // ///////////////////
        // Initialize data
        // ///////////////////
    	var me = this;
    	
    	var rasterLayersStoreData = [];
        for(var i = 0; i < this.rasterLayers.length; i++) {
            rasterLayersStoreData.push([this.rasterLayers[i]]);
        }
        
        var classesData = [];
        for(var i = 0; i < this.classes.length; i++) {
            classesData.push([this.classes[i]]);
        }
        var classesStore = new Ext.data.ArrayStore({
            fields: ['name'],
            data: classesData
        });
        var selectedClassesStore = new Ext.data.ArrayStore({
            fields: ['name'],
            data: []
        });

		// the map 
		var map = this.target.mapPanel.map;
		map.enebaleMapEvent = true;

		// the spatialFilterOptions
	    me.spatialFilterOptions = {
			lonMax: 20037508.34,   //90,
			lonMin: -20037508.34,  //-90,
			latMax: 20037508.34,   //180,
			latMin: -20037508.34  //-180
	    };
		
        // ///////////////////
        // The ROI Select Fieldset
        // ///////////////////

        this.northField = new Ext.form.NumberField({
              fieldLabel: this.northLabel,
              id: "NorthBBOX",
              width: 100,
              minValue: this.spatialFilterOptions.lonMin,
              maxValue: this.spatialFilterOptions.lonMax,
              decimalPrecision: 5,
              allowDecimals: true,
              hideLabel : false                    
        });
        
        this.westField = new Ext.form.NumberField({
              fieldLabel: this.westLabel,
              id: "WestBBOX",
              width: 100,
              minValue: this.spatialFilterOptions.latMin,
              maxValue: this.spatialFilterOptions.latMax,
              decimalPrecision: 5,
              allowDecimals: true,
              hideLabel : false                    
        });
        
        this.eastField = new Ext.form.NumberField({
              fieldLabel: this.eastLabel,
              id: "EastBBOX",
              width: 100,
              minValue: this.spatialFilterOptions.latMin,
              maxValue: this.spatialFilterOptions.latMax,
              decimalPrecision: 5,
              allowDecimals: true,
              hideLabel : false                    
        });
              
        this.southField = new Ext.form.NumberField({
              fieldLabel: this.southLabel,
              id: "SouthBBOX",
              width: 100,
              minValue: this.spatialFilterOptions.lonMin,
              maxValue: this.spatialFilterOptions.lonMax,
              decimalPrecision: 5,
              allowDecimals: true,
              hideLabel : false                    
        });
                  
        //
        // Geographical Filter Field Set
        //        
        var selectAOI = new OpenLayers.Control.SetBox({      
            map: map,    
            onChangeAOI: function(){
                var aoiArray = this.currentAOI.split(',');
                
                document.getElementById('WestBBOX').value = aoiArray[0];
                document.getElementById('SouthBBOX').value = aoiArray[1];
                document.getElementById('EastBBOX').value = aoiArray[2];
                document.getElementById('NorthBBOX').value = aoiArray[3];
            } 
        }); 
        
        map.addControl(selectAOI);
        
        this.aoiButton = new Ext.Button({
              text: this.setAoiText,
              tooltip: this.setAoiTooltip,
              enableToggle: true,
              toggleGroup: this.toggleGroup,
              iconCls: 'aoi-button',
              height: 50,
              width: 50,
              listeners: {
                  scope: this, 
                  toggle: function(button, pressed) {
                     if(pressed){
                     
                          //
                          // Reset the previous control
                          //
                          var aoiLayer = map.getLayersByName("AOI")[0];
                          
                          if(aoiLayer)
                              map.removeLayer(aoiLayer);
                          
                          if(this.northField.isDirty() && this.southField.isDirty() && 
                              this.eastField.isDirty() && this.westField.isDirty()){
                              this.northField.reset();
                              this.southField.reset();
                              this.eastField.reset();
                              this.westField.reset();
                          }

                          //
                          // Activating the new control
                          //                          
                          selectAOI.activate();
                      }else{
                          selectAOI.deactivate();
                      }
                  }
              }
        });
              
        this.spatialFieldSet = new Ext.form.FieldSet({
            title: this.aoiFieldSetTitle,
            autoHeight: true,
			hidden: false,
			autoWidth:true,
			collapsed: false,
			checkboxToggle: true,
            autoHeight: true,
            layout: 'table',
            layoutConfig: {
                columns: 3
            },
            listeners: {
				scope: this,
				afterrender: function(cmp){
					cmp.collapse(true);
				}
			},
            defaults: {
                // applied to each contained panel
                bodyStyle:'padding:5px;'
            },
            bodyCssClass: 'aoi-fields',
            items: [
                {
                    layout: "form",
                    cellCls: 'spatial-cell',
                    labelAlign: "top",
                    border: false,
                    colspan: 3,
                    items: [
                        this.northField
                    ]
                },{
                    layout: "form",
                    cellCls: 'spatial-cell',
                    labelAlign: "top",
                    border: false,
                    items: [
                        this.westField
                    ]
                },{
                    layout: "form",
                    cellCls: 'spatial-cell',
                    border: false,
                    items: [
                        this.aoiButton
                    ]                
                },{
                    layout: "form",
                    cellCls: 'spatial-cell',
                    labelAlign: "top",
                    border: false,
                    items: [
                       this.eastField
                    ]
                },{
                    layout: "form",
                    cellCls: 'spatial-cell',
                    labelAlign: "top",
                    border: false,
                    colspan: 3,
                    items: [
                        this.southField
                    ]
                }
            ]
        });
        
        // ///////////////////
        // The main form
        // ///////////////////
    	this.chgMatrixForm = new Ext.form.FormPanel({
            id: 'change-matrix-form-panel',
            width: 355,
            height: 380,
            autoScroll:true,
            items: [
				this.spatialFieldSet,
				{
					title: this.chgMatrixFieldSetTitle,
					xtype:'fieldset',
					autoWidth:true,
					layout:'form',
					defaultType: 'numberfield',
					bodyStyle:'padding:5px',
					defaults:{				
						width: 150							
					},
					items:[
		                {
		                    xtype: 'itemselector',
		                    fieldLabel: this.changeMatrixClassesFieldLabel,
		                    imagePath: 'theme/app/img/ux/',
		                    name: 'classesselector',
		                    anchor: '100%',
		                    drawUpIcon: false,
		                    iconDown: 'selectall2.gif',
		                    drawTopIcon: false,
		                    //drawBotIcon: false,
		                    iconBottom: 'deselectall2.gif',
		                    height: 250,
		                    multiselects: [{
		                        flex: 1,
		                        store: classesStore,
		                        height: 250,
		                        valueField: 'name',
		                        displayField: 'name'
		                    },{
		                        flex: 1,
		                        store: selectedClassesStore,
		                        height: 250,
		                        valueField: 'name',
		                        displayField: 'name'
		                    }],
		                    down: function() {
		                        var leftMultiSelect = this.fromMultiselect,
		                            rightMultiSelect = this.toMultiselect;
		
		                        leftMultiSelect.view.selectRange(0, classesStore.getCount());
		                        this.fromTo();
		
		                        leftMultiSelect.view.clearSelections();
		                        rightMultiSelect.view.clearSelections();
		                    },
		                    toBottom: function() {
		                        var leftMultiSelect = this.fromMultiselect,
		                            rightMultiSelect = this.toMultiselect;
		
		                        rightMultiSelect.view.selectRange(0, selectedClassesStore.getCount());
		                        this.toFrom();
		
		                        leftMultiSelect.view.clearSelections();
		                        rightMultiSelect.view.clearSelections();
		                    }
		                },{
		                    xtype: 'combo',
		                    name: 'raster',
		                    forceSelection: true,
		                    editable: false,
		                    fieldLabel: this.changeMatrixRasterFieldLabel,
		                    mode: 'local',
		                    store: new Ext.data.ArrayStore({
		                        fields: ['name'],
		                        data: rasterLayersStoreData
		                    }),
		                    valueField: 'name',
		                    displayField: 'name',
		                    validator: function(value) {
		                        if(Ext.isEmpty(value)) return me.changeMatrixEmptyLayer
		                        return true;
		                    }
		                },{
		                    xtype: 'textfield',
		                    name: 'filterT0',
		                    fieldLabel: this.changeMatrixCQLFilterT0FieldLabel,
		                    validator: function(value) {
		                        if(Ext.isEmpty(value)) return me.changeMatrixEmptyFilter
		                        return true;
		                    }
		                },{
		                    xtype: 'textfield',
		                    name: 'filterT1',
		                    fieldLabel: this.changeMatrixCQLFilterT1FieldLabel,
		                    validator: function(value) {
		                        if(Ext.isEmpty(value)) return me.changeMatrixEmptyFilter
		                        return true;
		                    }
		                }
					]
				}
            ],
            bbar: new Ext.Toolbar({
				items:[
                {
                    text: this.changeMatrixResetButtonText,
                    iconCls: 'gxp-icon-removelayers',
                    handler: function() {
                        me.chgMatrixForm.getForm().reset();
                    }
                },{
                    text: this.changeMatrixSubmitButtonText,
                    iconCls: 'gxp-icon-zoom-next',
                    id: 'change-matrix-submit-button',
                    handler: function() {
                        var form = me.chgMatrixForm.getForm();
                        
                        if(!form.isValid()) {
                            return Ext.Msg.alert(me.changeMatrixInvalidFormDialogTitle, me.changeMatrixInvalidFormDialogText);
                        }
                        
                        // get form params
                        var params = form.getFieldValues();

                        //get an array of the selected classes from the CheckBoxGroup
                        if(selectedClassesStore.getCount() == 0) {
                            return Ext.Msg.alert(me.changeMatrixEmptyClassesDialogTitle, me.changeMatrixEmptyClassesDialogText);
                        }
                        var selectedClasses = [];
                        selectedClassesStore.each(function(record) {
                            selectedClasses.push(record.get('name'));
                        });
                        params.classes = selectedClasses;
                        
                        //get the current extent
                        var map = me.target.mapPanel.map;
                        var currentExtent = map.getExtent();
                        //transform to a Geometry (instead of Bounds)
                        if (me.spatialFieldSet.collapsed !== true) {
                        	var roi = new OpenLayers.Bounds(
                                me.westField.getValue()  ? me.westField.getValue()  : me.spatialFilterOptions.lonMin, 
                                me.southField.getValue() ? me.southField.getValue() : me.spatialFilterOptions.latMin, 
                                me.eastField.getValue()  ? me.eastField.getValue()  : me.spatialFilterOptions.lonMax, 
                                me.northField.getValue() ? me.northField.getValue() : me.spatialFilterOptions.latMax
                             );
                             
                             var bbox = roi;
                             if(!bbox)
                                bbox = map.getExtent();
                                
                             currentExtent = bbox;
                        }

                        //change the extent projection if it differs from 4326
                        if(map.getProjection() != 'EPSG:4326') {
                            currentExtent.transform(map.getProjectionObject(),
                                new OpenLayers.Projection('EPSG:4326'));
                        }
                        // set ROI parameter
                        params.roi = currentExtent.toGeometry();
                        
                        me.startWPSRequest(params);
                    }
                }
            ]})
        });
		
        // ///////////////////
        // Create the control panel
        // ///////////////////
		var cpanel = new Ext.Panel({
            border: false,
            layout: "fit",
            disabled: false,
			autoScroll:true,
            title: this.title,
			items: [
			  this.chgMatrixForm
			]
        });
        config = Ext.apply(cpanel, config || {});
        
        // ///////////////////
        // Call super class addOutput method and return the panel instance
        // ///////////////////
        return gxp.plugins.ChangeMatrix.superclass.addOutput.call(this, config);
    },
    
    
    startWPSRequest: function(params) {
        var me = this;
        
        var inputs = {
            name: new OpenLayers.WPSProcess.LiteralData({value: params.raster}),
            referenceFilter: new OpenLayers.WPSProcess.ComplexData({
                value: params.filterT0,
                mimeType: 'text/plain; subtype=cql'
            }),
            nowFilter: new OpenLayers.WPSProcess.ComplexData({
                value: params.filterT1,
                mimeType: 'text/plain; subtype=cql'
            }),
            ROI: new OpenLayers.WPSProcess.ComplexData({
                value: params.roi.toString(),
                mimeType: 'application/wkt'
            }),
            classes: []
        };
        
        for(var i = 0; i < params.classes.length; i++) {
            inputs.classes.push(new OpenLayers.WPSProcess.LiteralData({value: params.classes[i]})); 
        }

        var requestObject = {
            type: "raw",
            inputs: inputs,
            outputs: [{
                identifier: "result",
                mimeType: "application/json"
            }]
        };
        
        me.handleRequestStart();

        me.wpsManager.execute('gs:ChangeMatrix', requestObject, me.showResultsGrid, this);
    },
    
    showResultsGrid: function(responseText) {
        this.handleRequestStop();
        
        try {
            var responseData = Ext.util.JSON.decode(responseText);
        } catch(e) {
            return Ext.Msg.alert(this.changeMatrixResponseErrorDialogTitle, this.changeMatrixResponseErrorDialogText);
        }

        var grid = this.createResultsGrid(responseData);
        
        /*
         * Check if tabs exists and if we are allowed to render to a tab or a floating window
         */
        var hasTabPanel = false;
        if(this.target.renderToTab && this.renderToTab) {
            var container = Ext.getCmp(this.target.renderToTab);
            if(container.isXType('tabpanel')) hasTabPanel = true;
        }
        
        if(hasTabPanel) {
		    if(this.win) this.win.destroy();
            var now = new Date();
            grid.title += ' - ' + Ext.util.Format.date(now, 'H:i:s');
            container.add(grid);
            container.setActiveTab(container.items.length-1);
        } else {
            if(this.resultWin)
                this.resultWin.destroy();
            
            //remove title to avoid double header
            grid.title = undefined;
            
            this.resultWin = new Ext.Window({
                width: 450,
                height: 450,
                layout: 'fit',
                title: this.changeMatrixResultsTitle,
                constrainHeader: true,
                renderTo: this.target.mapPanel.body,
                items: [ grid ]
            });
            this.resultWin.show();
        }
        //if(this.win) this.win.destroy();
    },
    guessIndexes : function(data){
		var changeMatrix = data;
		var xs = [],ys=[];axisy=[],axisx=[];
		var dim = Math.sqrt(data.length);
		
		//create output matrix
		var matrix = new Array(dim);
		for (var i = 0; i < dim; i++){
			matrix[i] = new Array(dim +1);
		}
		var xAttribute = "now";
		var yAttribute = "ref";
		var dataAttribute ="pixels";
		
		for(var i = 0;i<changeMatrix.length;i++){
			var el = changeMatrix[i];
			if(axisx.indexOf(el[xAttribute]) < 0 ){axisx.push(el[xAttribute]);}
			
		}
		axisx.sort(function(a,b){return parseInt(a)-parseInt(b)});
		for(var i = 0;i<changeMatrix.length;i++){
			var el = changeMatrix[i];
			var x = axisx.indexOf(el[xAttribute]);
			var y = axisx.indexOf(el[yAttribute]);
			matrix[x][y +1] = el[dataAttribute];
		}
		console.log(axisx);
		console.log(matrix);
		for (var i = 0;i< matrix.length; i++){
		    matrix[i][0]= axisx[i];
		    axisx[i] = axisx[i]+"";
		}
		//Descending x 
		//
		//ascending y
		//axisy.sort(function(a,b){return parseInt(b)-parseInt(a)});
		var fields =[];
		fields.push(" ");
		for (var i = 0; i < axisx.length;i++){
		    fields.push(axisx[i]);
		    
		}
		
		return { fields: fields	, data: matrix };
					
	},
	
    createResultsGrid: function(data) {
		var settings = this.guessIndexes(data)	;
		
					
        //store
        var changeMatrixStore = new Ext.data.ArrayStore({
            storeId: 'changeMatrixStore',
            autoLoad: false,
            fields: settings.fields,
            data: settings.data
        });

        //calculate min/max values, to scale values down to a 0-100 range
        var min, max;
        changeMatrixStore.each(function(record) {
            if(min == null || record.get('pixels') < min) min = record.get('pixels');
            if(max == null || record.get('pixels') > max) max = record.get('pixels');
        });

		var colmodel =[];
		for (var i=0; i < settings.fields.length;i++){
			colmodel.push({header: settings.fields[i],dataIndex: settings.fields[i]});
		}
		colmodel[0].id='leftaxis'; // to assign css
		colmodel[0].header='-';	 
        //grid panel
        return new Ext.grid.GridPanel({
            title: this.changeMatrixResultsTitle,
            store: changeMatrixStore,
            height: 300,
            width: 300,
            closable: true,
            columns: colmodel,
            viewConfig: {
                getRowClass: function(record, index, rowParams) {
                    // calculate the percentage
                    var percentValue = Math.round(((record.get('pixels') - min) / max) * 100);
                    
                    // calculate color (0 = green, 100 = red)
                    var r = Math.round((255 * percentValue) / 100);
                    var g = Math.round((255 * (100 - percentValue)) / 100);
                    var b = 0;

                    // add inline styles to the row
                    rowParams.tstyle = 'width:' + this.getTotalWidth() + ';';
                    rowParams.tstyle += "background-color: rgb("+r+","+g+","+b+");";
                }
            }
        });
    },
    
    handleTimeout: function() {
    	if (!this.loadingMask) 
    		this.loadingMask = new Ext.LoadMask(Ext.get('change-matrix-form-panel'), 'Loading..');
        this.loadingMask.hide();
        Ext.getCmp('change-matrix-submit-button').enable();
        Ext.Msg.alert(this.changeMatrixTimeoutDialogTitle, this.changeMatrixTimeoutDialogText);
    },
    
    handleRequestStart: function() {
        var me = this;
        
    	if (!this.loadingMask) 
    		this.loadingMask = new Ext.LoadMask(Ext.get('change-matrix-form-panel'), 'Loading..');
        me.loadingMask.show();
        var submitButton = Ext.getCmp('change-matrix-submit-button');
        if(submitButton) submitButton.disable();
        if(me.errorTimer) clearTimeout(me.errorTimer);
        me.errorTimer = setTimeout(function() { me.handleTimeout(); }, me.requestTimeout);
    },
    
    handleRequestStop: function() {
    	if (!this.loadingMask) 
    		this.loadingMask = new Ext.LoadMask(Ext.get('change-matrix-form-panel'), 'Loading..');
        this.loadingMask.hide();
        var submitButton = Ext.getCmp('change-matrix-submit-button');
        if(submitButton) submitButton.enable();
        if(this.errorTimer) clearTimeout(this.errorTimer);
    }
});

Ext.preg(gxp.plugins.ChangeMatrix.prototype.ptype, gxp.plugins.ChangeMatrix);
