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
    changeMatrixActionTip: "Get a change matrix for two raster layers",
    
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
    changeMatrixRasterFieldLabel: "Raster T0",
    
    /** api: config[changeMatrixCQLFilterT0FieldLabel]
     *  ``String``
     *  Text for the CQL Filter T0 field label (i18n).
     */
    changeMatrixCQLFilterT0FieldLabel: "CQL Filter T0",
    
    /** api: config[changeMatrixCQLFilterT1FieldLabel]
     *  ``String``
     *  Text for the CQL Filter T1 field label (i18n).
     */
    changeMatrixCQLFilterT1FieldLabel: "CQL Filter T1",
    
    /** api: config[changeMatrixButtonText]
     *  ``String``
     *  Text for the changeMatrix form button (i18n).
     */
    changeMatrixButtonText: "Submit",
    
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
    win: null,
    formPanel: null,
    wpsManager: null,
    resultWin: null,
    
    init: function(target) {
        console.log('init');
        console.log(this.target);
        console.log(arguments);
        
        // cannot find the wpsManager tool
        // it is not included in the default tools
        // if I add in the customTools property of mapStoreConfig.js, it says that the plugin cannot be created
        
        this.wpsManager = this.target.tools[this.wpsManager];
        
        //this.wpsMananger = "wpsSPM";
        //var wps = this.target.tools[this.wpsManager];
        
        return gxp.plugins.ChangeMatrix.superclass.init.apply(this, arguments);
    },

    /** 
     * api: method[addActions]
     */
    addActions: function() {
        var actions = gxp.plugins.ChangeMatrix.superclass.addActions.apply(this, [{
            iconCls: "gxp-icon-addgroup",
            disabled: false,
            tooltip: this.changeMatrixActionTip,
            handler: function() {
                var me = this;
                
                if(me.win)
                    me.win.destroy();
                    
                var rasterLayersStoreData = [];
                for(var i = 0; i < this.rasterLayers.length; i++) {
                    rasterLayersStoreData.push([this.rasterLayers[i]]);
                }
                
                var checkBoxGroupItems = [];
                for(var i = 0; i < this.classes.length; i++) {
                    checkBoxGroupItems.push({
                        boxLabel: this.classes[i],
                        name: 'class-'+this.classes[i],
                        value: this.classes[i]
                    });
                }
                
                me.formPanel = new Ext.form.FormPanel({
                    width: 300,
                    height: 150,
                    items: [
                        {
                            xtype: 'checkboxgroup',
                            id: 'classescheckboxgroup',
                            fieldLabel: this.changeMatrixClassesFieldLabel,
                            items: checkBoxGroupItems
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
                    ],
                    buttons: [
                        {
                            text: this.changeMatrixButtonText,
                            handler: function() {
                                var form = me.formPanel.getForm();
                                
                                if(!form.isValid()) {
                                    return Ext.Msg.alert(me.changeMatrixInvalidFormDialogTitle, me.changeMatrixInvalidFormDialogText);
                                }
                                
                                // get form params
                                var params = form.getFieldValues();
                                
                                //get an array of the selected classes from the CheckBoxGroup
                                var selectedCheckBoxes = form.findField('classescheckboxgroup').getValue();
                                var selectedClasses = [];
                                for(var i = 0; i < selectedCheckBoxes.length; i++) {
                                    selectedClasses.push(selectedCheckBoxes[i].value);
                                }
                                params.classes = selectedClasses;
                                if(params.classes.length == 0) {
                                    //if no classes were selected, alert a message and return
                                    return Ext.Msg.alert(me.changeMatrixEmptyClassesDialogTitle, me.changeMatrixEmptyClassesDialogText);
                                }
                                
                                //get the current extent
                                var map = me.target.mapPanel.map;
                                var currentExtent = map.getExtent();
                                //change the extent projection if it differs from 4326
                                if(map.getProjection() != 'EPSG:4326') {
                                    currentExtent.transform(map.getProjectionObject(),
                                        new OpenLayers.Projection('EPSG:4326'));
                                }
                                //transform to a Geometry (instead of Bounds)
                                params.roi = currentExtent.toGeometry();
                                
                                me.startWPSRequest(params);
                            }
                        }
                    ]
                });

                me.win = new Ext.Window({
                    width: 315,
                    height: 200,
                    title: this.changeMatrixDialogTitle,
                    constrainHeader: true,
                    renderTo: this.target.mapPanel.body,
                    items: [ me.formPanel ]
                });
                
                me.win.show();
            },
            scope: this
        }]);
        
        return actions;
    },
    
    startWPSRequest: function(params) {
        this.showResultsGrid();
        console.log(params);
        return;
        var inputs = {
            raster: new OpenLayers.WPSProcess.LiteralData({value: params.raster}),
            filterT0: new OpenLayers.WPSProcess.LiteralData({value: params.filterT0}),
            filterT1: new OpenLayers.WPSProcess.LiteralData({value: params.filterT1})
        };
        // come inseriamo più proprietà con lo stesso nome in inputs ? 
        // Andrea: Plugin WPS Modificato per accettare anche array di Inputs
        for(var i = 0; i < classes.length; i++) {
            inputs.classes.push(new OpenLayers.WPSProcess.LiteralData({value: classes[i]})); 
        }
        
        var callback = function(response, process) {
            console.log('process executed');
            console.log(arguments);
            // fill the ChangeMatrixStore with response data
            // show grid
            //this.showResultsGrid(response);
        }
        
        var requestObject = {
            type: "raw",
            inputs: inputs,
            outputs: [{
                identifier: "result",
                mimeType: "application/json"
            }],
            callback: callback,
            scope: this
        };
        this.wpsManager.execute(requestObject, this.showResultsGrid); //Andrea: Introdotto metodo di callback, il metodo viene invocato con la risposta in formato testo
    },
    
    showResultsGrid: function(responseText) {
        
        var responseData= Ext.util.JSON.decode(responseText);
        
        // static data
        var data = { "changeMatrix":
          [
            {"ref":"0", "now":"0", "pixels":"16002481"},
            {"ref":"0", "now":"35", "pixels":"15002481"},
            {"ref":"0", "now":"1", "pixels":"10002481"},
            {"ref":"0", "now":"36", "pixels":"7002481"},
            {"ref":"0", "now":"37", "pixels":"2002481"},
            {"ref":"1", "now":"0", "pixels":"0"},
            {"ref":"1", "now":"35", "pixels":"0"},
            {"ref":"1", "now":"1", "pixels":"3192"},
            {"ref":"1", "now":"36", "pixels":"15"},
            {"ref":"1", "now":"37", "pixels":"0"},
            {"ref":"35", "now":"0", "pixels":"0"},
            {"ref":"35", "now":"35", "pixels":"7546"},
            {"ref":"35", "now":"1", "pixels":"0"},
            {"ref":"35", "now":"36", "pixels":"0"},
            {"ref":"35", "now":"37", "pixels":"16"},
            {"ref":"36", "now":"0", "pixels":"166"},
            {"ref":"36", "now":"35", "pixels":"36"},
            {"ref":"36", "now":"1", "pixels":"117"},
            {"ref":"36", "now":"36", "pixels":"1273887"},
            {"ref":"36", "now":"37", "pixels":"11976"},
            {"ref":"37", "now":"0", "pixels":"274"},
            {"ref":"37", "now":"35", "pixels":"16"},
            {"ref":"37", "now":"1", "pixels":"16"},
            {"ref":"37", "now":"36", "pixels":"28710"},
            {"ref":"37", "now":"37", "pixels":"346154"}
          ]
        };
        var grid = this.createResultsGrid(data.changeMatrix);
        
        var hasTabPanel = false;
        if(this.target.renderToTab) {
            var container = Ext.getCmp(this.target.renderToTab);
            if(container.isXType('tabpanel')) hasTabPanel = true;
        }
        
        if(hasTabPanel) {
            container.add(grid);
            container.setActiveTab(container.items.length-1);
        } else {
            if(this.resultWin)
                this.resultWin.destroy();
            
            //remove title to avoid double header
            grid.title = undefined;
            
            this.resultWin = new Ext.Window({
                width: 350,
                height: 350,
                layout: 'fit',
                title: this.changeMatrixResultsTitle,
                constrainHeader: true,
                renderTo: this.target.mapPanel.body,
                items: [ grid ]
            });
            this.resultWin.show();
        }
        if(this.win) this.win.destroy();
    },
    
    createResultsGrid: function(data) {

        //store
        var changeMatrixStore = new Ext.data.JsonStore({
            storeId: 'changeMatrixStore',
            autoLoad: false,
            fields: [
                {
                    name: 'ref',
                    type: 'int'
                },{
                    name: 'now',
                    type: 'int'
                },{
                    name: 'pixels',
                    type: 'int'
                }
            ],
            data: data
        });

        //calculate min/max values, to scale values down to a 0-100 range
        var min, max;
        changeMatrixStore.each(function(record) {
            if(min == null || record.get('pixels') < min) min = record.get('pixels');
            if(max == null || record.get('pixels') > max) max = record.get('pixels');
        });

        //grid panel
        return new Ext.grid.GridPanel({
            title: this.changeMatrixResultsTitle,
            store: changeMatrixStore,
            height: 300,
            width: 300,
            closable: true,
            columns: [
                { header: 'ref', dataIndex: 'ref' },
                { header: 'now', dataIndex: 'now' },
                { header: 'Changes', dataIndex: 'pixels' }
            ],
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
    }
        
});

Ext.preg(gxp.plugins.ChangeMatrix.prototype.ptype, gxp.plugins.ChangeMatrix);
