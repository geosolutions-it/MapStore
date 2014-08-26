/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires plugins/Tool.js
 * @requires widgets/PlanEditorPanel.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = PlanEditor
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: PlanEditor(config)
 *
 *    Provides an action to edit AOI based on current available services for the logged user.
 */
gxp.plugins.PlanEditor = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_planeditor */
    ptype: "gxp_planeditor",

    /** i18n **/
    titleText: "Plan",
    columnsHeadersText:{
        service_name: "ServiceName",
        start: "Start",
        end: "End",
        sensor: "Sensor",
        sensor_mode: "SensorMode",
        ships: "Ships count"
    },
    serviceText: "Service",
    submitFailTitleText: "Fail",
    submitFailText: "An error occur while saving",
    submitSuccessTitleText: "Saved",
    submitSuccessText: "Save succesfully",
    submitFailByModeText:{
        save: "An error occur while saving current AOI",
        confirm: "An error occur while confirming current AOI",
        confirmAcqList: "An error occur while saving current acquisition list"
    },
    submitSuccessByModeText: {
        save: "Current AOI has been saved",
        confirm: "Current AOI has been confirmed",
        confirmAcqList: "Selected acquisition list has been saved"
    },
    notValidFailTitleText: "Fail",
    notValidFailText: "Please complete the form before save",
    confirmRemoteDeleteTitleText: "Remove AOI",
    confirmRemoteDeleteText: "Do you want to remove stored content? Otherwhise, it will be restored",
    editButtonText: "Edit",
    saveButtonText: "Save",
    drawButtonText: "Draw",
    resetText: "Reset",
    confirmText: "Confirm",
    importButtonText: "Import",
    importTooltipText: "Import a shape file, KML or GeoJSON as AOI",
    editTooltipText: "Edit current AOI in the map",
    saveTooltipText: "Save current AOI status",
    drawTooltipText: "Draw a new polygon to be included in current service's AOI",
    confirmTooltipText: "Confirm current AOI for the selected service",
    resetTooltipText: "Clean lastest changes and optionally remove all saved AOI for the selected service",
    defaultMessage: "Select a service to edit AOI",
    commitedMessage: "Commited AOI, You can't edit it any more",
    acqListMessage: "Acquisition list already generated, You can't edit it any more",
    selectedMessage: "Edit and commit the AOI",
    defaultPanelTitleText: "Editor",
    acquisitionPanelTitleText: "Acquisition List",
    exportAcqListText: "Export",
    exportAcqListTooltipText: "Export current acquisition list to GML2 format",
    emptyAcqListText: "Not available acquisition list yet",
    acqListTipText: "Click on each record you want to confirm as 'Acquisition List' and press on 'Export' button",
    /** api: config[failedExport]
     * ``String``
     * Text for Export error (i18n).
     */
    failedExport: "Failed to find response for output format {0}",
    /** api: config[nvalidParameterValueErrorText]
     * ``String``
     * Text for CSV Export error (i18n).
     */
    invalidParameterValueErrorText: "Invalid Parameter Value",
    /** EoF i18n **/
    
    /** api: config[addLayerID]
    *  ``String`` add layer plugin id
    */
    addLayerID: "addlayer",
    
    /** api: config[importExportID]
    *  ``String`` Import export plugin id
    */
    importExportID: "gxp_importexport",
    
    /** api: config[source]
    *  ``String`` source of the layer
    */
    source: "MARISS-Layers",
    
    /** api: config[layerName]
    *  ``String`` layer name for the edit
    */
    layerName: "aois",
    
    /** api: config[acq_list]
    *  ``String`` layer for the acquisition list
    */
    layerAcqListName: "acq_list",

    // options for the WMS layer on addLayers plugin
    layerOptions: {
        customParams:{
            displayInLayerSwitcher: false
        }
    },
    
   /** api: config[exportVersion]
    *  ``String`` Version for the layer export.
    */
    exportVersion: "1.0.0",

    // custom parameters.
    auxiliaryLayerName: "Draft Layer",
    displayAuxiliaryLayerInLayerSwitcher: false,
    addWMSLayer: false,
    layerURL: null,
    addFeatureTable: true,
    wfsVersion: "1.1.0",
    defaultGeometryName: "the_geom",
    defaultFeatureNS: "http://mariss.it",
    defaultProjection: "EPSG:4326",

    // hidden form id to download SHP on confirm
    downloadFormId: "__shp_downloader_",
    // flag to download the confirmed SHP when it's confirmed
    downloadUploadedSHP: false,

    // private parameters
    currentServiceName: null,
    draftFeatures: [],
    currentStatus: "DRAFT",

    // mode: see checkMode function
    mode: "default",
    store: null,

    // when the panel is activated, the owner panel (west) is expanded to 500
    expandToWidth: 550,

    // default style for the working layers
    defaultLayerStyle:{
        "strokeColor": "#FF0000",
        "strokeWidth": 2,
        "fillColor": "#FFFFFF",
        "fillOpacity": 0.2
    },

    // Known status of AOIs
    STATUS:{
        DRAFT: "DRAFT",
        COMMITED: "COMMITED",
        ACQ_LIST_SAVED: "ACQ_LIST_SAVED"
    },
    
    /** api: method[addOutput]
     */
    addOutput: function() {

        // bind importer for SHP/GEOJSON/KML/KMZ import
        var importer = this.target.tools[this.importExportID];
        if(importer){
            importer.on("layerloaded", this.saveDraftFeatures, this);
        }else{
            console.error("ImportExport plugin not found");
        }

        // generate backend urls based on this.target.config.adminUrl
        var adminUrl = this.target.config.adminUrl;
        // services available URL. 
        this.servicesUrl = adminUrl + "mvc/serviceManager/extJSbrowser?action=get_serviceslist&folder=";
        // submit service.
        this.submitUrl = adminUrl + "mvc/serviceManager/confirmServiceAOI?url=";
        // submit service.
        this.submitAcqUrl = adminUrl + "mvc/serviceManager/confirmServiceAcqPlan?url=";

        /**
         * UPDATES FROM ALFA
         **/
        
            // Services grid
            var me = this;
            this.store = new Ext.data.JsonStore({
                url: this.getServicesUrl(),
                pageSize: 10,
                autoLoad: true,
                fields : ["id", "text", "status", "leaf", "size", "iconCls", "loaded", "expanded", "mtime", "permission"]
            });
            var servicesListgrid = new Ext.grid.GridPanel({
                id: this.id + "_services_grid",
                layout: 'fit',
                autoHeight: true,
                sm: new GeoExt.grid.FeatureSelectionModel(),
                // viewConfig: {
                //     emptyText: this.emptyAcqListText
                // },
                store: me.store,
                columns: [
                    {header: 'ServiceID', dataIndex: "text", sortable: true},
                    {header: 'Status', dataIndex: "status", sortable: true},
                    {
                        text: 'Action',
                        header: undefined,
                        menuDisabled:true,
                        resizable:false,
                        xtype  :'actioncolumn',
                        align  :'center',
                        width  : 50,
                        //icon   : '../shared/icons/fam/delete.gif',  // Use a URL in the icon config
                        //tooltip: 'Sell stock',
                        getClass: function(val, meta, rec) {
                            var service  = rec.data.text;
                            var status   = rec.data.status;

                            if (status === "NEW" || status === "AOI") {
                                this.tooltip = 'Edit AOI';
                                return 'aoi';
                            }
                            else if (status === "ACQUISITIONLIST") {
                                this.tooltip = 'Create Plan';
                                return 'plan';
                            }
                            else {
                                this.tooltip = 'View';
                                return 'view';
                            }
                        },
                        handler: function(grid, rowIndex, colIndex) {
                            var rec      = grid.store.getAt(rowIndex);
                            var service  = rec.data.text;
                            var status   = rec.data.status;
                            //alert("Service ["+service+"] : " + status);
                                                        
                            if (status === "NEW" || status === "AOI") {
                                me.onSelectService(service, me.viewPanel, false);
                                
                                var myWin = new Ext.Window({
                                    height : 400,
                                    width  : 550,
                                    title: me.defaultPanelTitleText,
                                    id: me.id + "_editor",
                                    items:[planFormPanelConfig]
                                });
                                
                                myWin.on("close", function() {
                                    if(Ext.getCmp(me.id + "_services_grid"))
                                    {
                                        me.store.reload();
                                        Ext.getCmp(me.id + "_services_grid").getView().refresh();
                                    }
                                });
                                myWin.show();
                            }
                            if (status === "ACQUISITIONLIST") {
                                var myWin = new Ext.Window({
                                    height : 400,
                                    width  : 550,
                                    layout : 'fit',
                                    title: me.acquisitionPanelTitleText,
                                    id: me.id + "_acqlist_wnd",
                                    items:[{
                                        id: me.id + "_acqlist",
                                        autoScroll: true,
                                        items:[]
                                    }]
                                });
                                
                                myWin.on("close", function() {
                                    if(Ext.getCmp(me.id + "_services_grid"))
                                    {
                                        me.store.reload();
                                        Ext.getCmp(me.id + "_services_grid").getView().refresh();
                                    }
                                });
                                myWin.show();

                                me.onSelectService(service, me.viewPanel, true);
                            }
                        }
                    }
                ],
                listeners:{
                    rowclick: function(grid, rowIndex, columnIndex, e) {
                        var rec      = grid.store.getAt(rowIndex);
                        var service  = rec.data.text;
                        var status   = rec.data.status;
                        
                        this.onSelectService(service, this.viewPanel, false);
                        
                        /*if(selModel.getCount() == 0){
                            Ext.getCmp(this.id + "_export_acq_button").disable();
                        }else{
                            Ext.getCmp(this.id + "_export_acq_button").enable();
                        }*/
                    },
                    scope:this
                },
                tbar: [],
                // paging bar on the bottom
                bbar: new Ext.PagingToolbar({
                    store: me.store,
                    displayInfo: true,
                    displayMsg: '{0}-{1} of {2}',
                    emptyMsg: "No service available"
                })
                /*bbar:["->",
                {
                    text: this.exportAcqListText,
                    id: this.id + "_export_acq_button",
                    disabled: true,
                    iconCls: "icon-save",
                    tooltip: this.exportAcqListTooltipText,
                    handler: function() {
                        var me = this;
                        this.mode = "confirmAcqList";
                        var submitStatusToWFS = function(){
                            // change status
                            me.currentStatus = me.STATUS.ACQ_LIST_SAVED;
                            // merge draft features to wfs layer
                            me.mergeDraftFeatures();

                            // send WFS transaction
                            me.saveStrategy.save();

                            // update current form status
                            me.checkMode();
                        };

                        // filter by selected features 
                        var fids = "";
                        var selModel = this.acqListgrid.getSelectionModel(); 
                        var selectedRecords = selModel.getSelections();
                        for(var i = 0; i < selectedRecords.length; i++){
                            var record = selectedRecords[i];
                            if(record
                                && record.data
                                && record.data.fid){
                                fids += "'" + record.data.fid + "',";
                            }
                        }
                        fids = fids.substring(0, fids.length -1);

                        this.doExportAndSaveStatus("GML2", me.STATUS.ACQ_LIST_SAVED, this.layerAcqListName, this.submitAcqUrl, false, null, fids);

                        // this.doExportLayer("GML2", this.layerAcqListName, this.submitAcqUrl, false, submitStatusToWFS, fids);
                        // open the GML on a popup: this.doExportLayer("GML2", this.layerAcqListName, null, true, null, fids);
                    },
                    scope: this
                }]*/
            });
            
        /*
        var serviceSelectorConfig = {
            xtype: "compositefield",
            items:[{
                xtype: "combo",
                fieldLabel: this.serviceText,
                name: "service",
                valueField: 'text',
                displayField: 'text',
                autoLoad : true,
                triggerAction : 'all',
                width: 100,
                store: new Ext.data.JsonStore({
                    url: this.getServicesUrl(),
                    fields : ["id", "text", "status", "leaf", "size", "iconCls", "loaded", "expanded", "mtime", "permission"]
                }),
                listeners : {
                    select : function(c, record, index) {
                        var service = c.getValue();
                        this.onSelectService(service, this.viewPanel);
                    },
                    scope : this
                }

            },{
                id: this.id + "_message",
                html: this.defaultMessage,
                style: {
                    "padding-top": "4px",
                },
                flex: 1 
            }]
        };
        */
        
        var planFormPanelConfig = {
            xtype: "gxp_planeditorpanel",
            disabled: true,
            buttons:[{
                text: this.importButtonText,
                id: this.id + "_import_button",
                iconCls: "gxp-icon-importexport",
                tooltip: this.importTooltipText,
                menu: {
                    xtype: 'menu',
                    items: [{
                        text: importer.labels["kml/kmz"].loadText ? importer.labels["kml/kmz"].loadText : "Import KML/KMZ",
                        iconCls: importer.iconClsDefault["kml/kmz"].iconClsExport,
                        handler: function() {
                            this.onButtonClicked("import", "KML");
                        },
                        scope: this
                    },{
                        text: importer.labels["geojson"].loadText ? importer.labels["geojson"].loadText : "Import GeoJSON",
                        iconCls: importer.iconClsDefault["geojson"].iconClsExport,
                        handler: function() {
                            this.onButtonClicked("import", "GeoJSON");
                        },
                        scope: this
                    },{
                        text: importer.labels["shp"].loadText ? importer.labels["shp"].loadText : "Import SHP",
                        iconCls: importer.iconClsDefault["shp"].iconClsExport,
                        handler: function() {
                            this.onButtonClicked("import", "SHP");
                        },
                        scope: this
                    }]
                }
            },{
                text: this.editButtonText,
                id: this.id + "_edit_button",
                iconCls: "gx-map-edit",
                tooltip: this.editTooltipText,
                handler: function() {
                    this.onButtonClicked("edit");
                },
                scope: this
            },{
                text: this.saveButtonText,
                id: this.id + "_save_button",
                disabled: true,
                iconCls: "icon-save",
                tooltip: this.saveTooltipText,
                handler: function() {
                    this.onButtonClicked("save");
                },
                scope: this
            },{
                text: this.drawButtonText,
                id: this.id + "_draw_button",
                iconCls: "gx-map-add",
                tooltip: this.drawTooltipText,
                handler: function() {
                    this.onButtonClicked("draw");
                },
                scope: this
            },{
                text: this.confirmText,
                scope: this,
                iconCls: "save",
                tooltip: this.confirmTooltipText,
                id: this.id + "_confirm_button",
                handler: function(){
                    this.onButtonClicked("confirm");
                }
            },{
                text: this.resetText,
                iconCls: "deleteIcon",
                tooltip: this.resetTooltipText,
                scope: this,
                id: this.id + "_reset_button",
                handler: function(){
                    this.onButtonClicked("reset");
                }
            }],
            listeners:{
                render: this.onPanelRender,
                scope:this
            }
        };

        /*
        var accordionConfig = {
            xtype: 'panel',
            // title: this.titleText,
            layout: "accordion",
            id: this.id + "_accordion",
            height: 500,
            defaults:{
                xtype: 'panel',
                layout: "form"    
            },
            autoScroll: true,
            items:[{
                title: this.defaultPanelTitleText,
                autoScroll: true,
                id: this.id + "_editor",
                items:[planFormPanelConfig]
            },{
                title: this.acquisitionPanelTitleText,
                id: this.id + "_acqlist",
                autoScroll: true,
                items:[]
            }]
        };
        */

        // configure output
        var outputConfig = {
            xtype: 'panel',
            title: this.titleText,
            id: this.id + "_output",
            defaults:{
                xtype: 'panel',
                layout: "fit"    
            },
            layout: "fit",
            /*layout: {
                type  : 'vbox',
                align : 'stretch',  
                pack  : 'start'
            },*/
            /*items:[{
                items: [serviceSelectorConfig],
                height: 30
            },{
                items:[accordionConfig],
                flex: 1
            }],*/
            autoScroll: true,
            style: {
                "padding-top": "10px",
            },
            items:[{
                items: [servicesListgrid],
                flex: 1
            }],
            listeners:{
                activate: function(){
                    /*Ext.getCmp(this.id + "_message").getEl().dom.innerText = this.defaultMessage;
                    this.checkMode();
                    if(this.expandToWidth
                        && this.output
                        && this.output[0]
                        && this.output[0].ownerCt
                        && this.output[0].setWidth){
                        var ownerPanel = this.output[0].ownerCt;
                        if(ownerPanel.ownerCt){
                            // ownerPanel could be west or east
                            ownerPanel.setWidth(this.expandToWidth);
                            ownerPanel.ownerCt.doLayout();
                        }
                    }
                    this.fixPanelHeight();*/
                },
                scope:this
            }
        };

        /**
         * UPDATES FROM ALFA - END
         **/
        
        Ext.apply(outputConfig, this.outputConfig || {} );
        return gxp.plugins.PlanEditor.superclass.addOutput.call(this, outputConfig);    
    },

    fixPanelHeight: function(){
        var accordion = Ext.getCmp(this.id + "_accordion");
        var output = Ext.getCmp(this.id + "_output");
        var accordionLength = output.getHeight() - (accordion.items.length* 21);
        // accordion.setHeight(output.getHeight() - 30);
        accordion.setHeight(accordionLength);

    },

   /** private: method[onPanelRender]
    *  Callback called when the form panel is rendered.
    */ 
    onPanelRender: function(panel){
        this.viewPanel = panel;
    },

   /** private: method[getServicesUrl]
    *  Get the available services based on current user logged
    */ 
    getServicesUrl: function(){
        return this.servicesUrl + this.target.user.name;
    },

   /** private: method[onButtonClicked]
    *  Listener to handle a button click
    */ 
    onButtonClicked: function(buttonId, options){
        this.mode = buttonId;
        this.checkMode();
        switch (buttonId){
            case 'edit':{
                this.onEdit();
                break;
            }
            case 'save':{
                this.onSave();
                break;
            }
            case 'draw':{
                this.onDraw();
                break;
            }
            case 'reset':{
                this.onReset();
                break;
            }
            case 'confirm':{
                this.onConfirm();
                break;
            }
            case 'import':{
                this.onImport(options);
                break;
            }
            default:{
                console.error("Unknown button");
            }
        }
    },

   /** private: method[onEdit]
    *  Callback called when the edit button is clicked.
    */ 
    onEdit: function(){
        // remove old control
        if(this.modifyControl && !this.modifyControl.active){
            this.target.mapPanel.map.removeControl(this.modifyControl);
        }
        // Default mode is edit
        var mode = "edit";
        // create control
        if(!this.modifyControl || !this.modifyControl.active){
            // the editor can change draft or wfs layer
            if(this.wfsLayer 
                && this.wfsLayer.features 
                && this.wfsLayer.features.length == 1){
                this.modifyControl = new OpenLayers.Control.ModifyFeature(this.wfsLayer);
                // the mode is editing an AOI on WFS
                // mode = "aoiEdit";
            }else{
                this.modifyControl = new OpenLayers.Control.ModifyFeature(this.draftLayer);
            }
            this.target.mapPanel.map.addControl(this.modifyControl);
        }
        // activate or deactivate
        if(this.modifyControl.active){
            this.modifyControl.deactivate();    
            this.target.mapPanel.map.removeControl(this.modifyControl);
            // remove current control
            mode = "editComplete";
            delete this.modifyControl;
        }else{
            this.modifyControl.activate();
        }
        this.mode = mode;

        this.checkMode();
    },

   /** private: method[onSave]
    *  Callback called when the save button is clicked.
    */ 
    onSave: function(){
        // validate form
        var form = this.viewPanel.getForm();
        if(!form.isValid()){
            Ext.Msg.show({
                title: this.notValidFailTitleText,
                msg: this.notValidFailText,
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR
            });
            return null;
        }
        // merge draft features to polygon layer
        try
        {
            this.mergeDraftFeatures();
        }
        catch(err)
        {
            //console.log(err);
        }

        // send WFS transaction
        this.saveStrategy.save();
    },


   /** private: method[onDraw]
    *  Callback called when the draw button is clicked.
    */ 
    onDraw: function(){
        if(!this.drawControl){
            this.drawControl = new OpenLayers.Control.DrawFeature(this.draftLayer, OpenLayers.Handler.Polygon,{
                eventListeners:{
                    "featureadded": this.onFeatureAdded,
                    scope: this
                }
            });
            //this.drawControl.events.on("featureadded ", this.onFeatureAdded, this);
            this.target.mapPanel.map.addControl(this.drawControl);
        }
        this.drawControl.activate();

        // disable all buttons while drawing
        Ext.getCmp(this.id + "_edit_button").disable();
        Ext.getCmp(this.id + "_save_button").disable();
        Ext.getCmp(this.id + "_draw_button").disable();
        Ext.getCmp(this.id + "_reset_button").disable();

    },


   /** private: method[onReset]
    *  Callback called when the reset button is clicked.
    */ 
    onReset: function(){

        var me = this;

        // we can: remove draft status or complete remove the AOI
        var resetFunction = function(){
            me.viewPanel.getForm().reset();
            // delete persisted data
            if(me.wfsLayer 
                && me.wfsLayer.features 
                && me.wfsLayer.features.length == 1){
                me.wfsLayer.features[0].state = OpenLayers.State.DELETE;
                // send WFS transaction
                me.saveStrategy.save();
            }

            // delete draftLayer
            if(me.draftLayer){
                me.draftLayer.removeAllFeatures();
            }

            // check mode
            me.checkMode();
        }

        // delete persisted data
        if(this.wfsLayer 
            && this.wfsLayer.features 
            && this.wfsLayer.features.length == 1){
            Ext.Msg.confirm(
                this.confirmRemoteDeleteTitleText,
                this.confirmRemoteDeleteText,
                function(btn) {
                    if (btn === 'yes') {
                        resetFunction();
                        return true;
                    } else {
                        // change mode
                        me.mode = "aoiEdit";
                        // Only reset auxiliary content
                        me.resetAuxiliaryContent();
                        return false;
                    }
                }
            );
        }else{
            resetFunction();
        }
    },

   /** private: method[onReset]
    *  Callback called when the reset button is clicked.
    */ 
    onConfirm: function(form){
        // validate form
        var form = this.viewPanel.getForm();
        if(!form.isValid()){
            Ext.Msg.show({
                title: this.notValidFailTitleText,
                msg: this.notValidFailText,
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR
            });
            return null;
        }
        // Export as SHP file
        this.doExport("shape-zip");
    },

   /** private: method[onImport]
    *  Callback called when the import button is clicked.
    */ 
    onImport: function(format){
        switch (format){
            case 'KML':{
                this.importKML();
                break;
            }
            case 'GeoJSON':{
                var importer = this.target.tools[this.importExportID];
                if(importer){
                    importer["exportConf"]["geojson"]["layer"] = this.draftLayer;
                    importer.importLayerFile("geojson");
                }
                break;
            }
            case 'SHP':{
                var importer = this.target.tools[this.importExportID];
                if(importer){
                    importer["exportConf"]["shp"]["layer"] = this.draftLayer;
                    importer.importLayerFile("shp");
                }
                break;
            }
            default:{
                // TODO: Implement other formats
                Ext.Msg.show({
                    title: "Not available",
                    msg: "This functionality is not currently available. Work in progress",
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.INFO
                });
            }
        }
    },

   /** private: method[checkMode]
    *  Check mode and enble or disable buttons
    */ 
    checkMode: function(){
        var panel = this.viewPanel;

        // change message for WFS commits
        this.currentSubmitFailTitleText = this.submitFailTitleText;
        this.currentSubmitSuccessTitleText = this.submitSuccessTitleText;
        this.currentSubmitFailText = this.submitFailByModeText[this.mode] ? this.submitFailByModeText[this.mode] : this.submitFailText;
        this.currentSubmitSuccessText = this.submitSuccessByModeText[this.mode] ? this.submitSuccessByModeText[this.mode] : this.submitSuccessText;

        switch (this.mode){
            case 'save':{
                Ext.getCmp(this.id + "_edit_button").enable();
                Ext.getCmp(this.id + "_save_button").enable();
                Ext.getCmp(this.id + "_draw_button").enable();
                Ext.getCmp(this.id + "_reset_button").enable();
                Ext.getCmp(this.id + "_confirm_button").enable();
                break;
            }
            case 'edit':{
                Ext.getCmp(this.id + "_edit_button").enable();
                Ext.getCmp(this.id + "_save_button").disable();
                Ext.getCmp(this.id + "_draw_button").disable();
                Ext.getCmp(this.id + "_reset_button").disable();
                Ext.getCmp(this.id + "_confirm_button").disable();
                break;
            }
            case 'editComplete':{
            }
            case 'import':{
            }
            case 'draw':{
                Ext.getCmp(this.id + "_edit_button").enable();
                Ext.getCmp(this.id + "_save_button").enable();
                Ext.getCmp(this.id + "_draw_button").enable();
                Ext.getCmp(this.id + "_reset_button").enable();
                Ext.getCmp(this.id + "_confirm_button").enable();
                break;
            }
            case 'confirmAcqList':{
            }
            case 'confirm':{
            }
            case 'aoiEdit':{
                var msg = Ext.getCmp(this.id + "_message");
                if(this.currentStatus == this.STATUS.COMMITED){
                    // disable all buttons
                    try
                    {
                        if(this.viewPanel) this.viewPanel.disable();
                        if(msg) msg.getEl().dom.innerText = this.commitedMessage;
                        // Ext.getCmp(this.id + "_message").setText(this.commitedMessage);
                        if(Ext.getCmp(this.id + "_acqlist")) Ext.getCmp(this.id + "_acqlist").enable();
                        // Ext.getCmp(this.id + "_acqlist").expand();
                    }
                    catch(err)
                    {
                        //console.log(err);
                    }
                }else if(this.currentStatus == this.STATUS.ACQ_LIST_SAVED){
                    // disable all buttons
                    try
                    {
                        if(this.viewPanel) this.viewPanel.disable();
                        if(msg) msg.getEl().dom.innerText = this.acqListMessage;
                        if(Ext.getCmp(this.id + "_acqlist")) Ext.getCmp(this.id + "_acqlist").collapse();
                        if(Ext.getCmp(this.id + "_acqlist")) Ext.getCmp(this.id + "_acqlist").disable();
                        if(Ext.getCmp(this.id + "_editor")) Ext.getCmp(this.id + "_editor").expand();
                        // Ext.getCmp(this.id + "_message").setText(this.acqListMessage);
                    }
                    catch(err)
                    {
                        //console.log(err);
                    }
                }else{
                    try
                    {
                        if(this.viewPanel) this.viewPanel.enable();
                        if(msg) msg.getEl().dom.innerText = this.selectedMessage;
                        if(Ext.getCmp(this.id + "_acqlist")) Ext.getCmp(this.id + "_acqlist").disable();
                        // Ext.getCmp(this.id + "_message").setText(this.selectedMessage);
                        // Edit is enabled only if already exists an AOI.
                        if(this.wfsLayer 
                            && this.wfsLayer.features
                            && this.wfsLayer.features.length > 0){
                            if(Ext.getCmp(this.id + "_save_button"))    Ext.getCmp(this.id + "_save_button").enable();
                            if(Ext.getCmp(this.id + "_edit_button"))    Ext.getCmp(this.id + "_edit_button").enable();
                            if(Ext.getCmp(this.id + "_confirm_button")) Ext.getCmp(this.id + "_confirm_button").enable();
                        }else{
                            if(Ext.getCmp(this.id + "_save_button"))    Ext.getCmp(this.id + "_save_button").disable();
                            if(Ext.getCmp(this.id + "_edit_button"))    Ext.getCmp(this.id + "_edit_button").disable();
                            if(Ext.getCmp(this.id + "_confirm_button")) Ext.getCmp(this.id + "_confirm_button").disable();
                        }
                        if(Ext.getCmp(this.id + "_draw_button"))  Ext.getCmp(this.id + "_draw_button").enable();
                        if(Ext.getCmp(this.id + "_reset_button")) Ext.getCmp(this.id + "_reset_button").enable();
                    }
                    catch(err)
                    {
                        //console.log(err);
                    }
                }
                break;
            }
            case 'reset':{
                if(Ext.getCmp(this.id + "_edit_button"))    Ext.getCmp(this.id + "_edit_button").disable();
                if(Ext.getCmp(this.id + "_save_button"))    Ext.getCmp(this.id + "_save_button").disable();
                if(Ext.getCmp(this.id + "_draw_button"))    Ext.getCmp(this.id + "_draw_button").enable();
                if(Ext.getCmp(this.id + "_reset_button"))   Ext.getCmp(this.id + "_reset_button").disable();
                if(Ext.getCmp(this.id + "_confirm_button")) Ext.getCmp(this.id + "_confirm_button").disable();
                break;
            }
            default:{
                if(Ext.getCmp(this.id + "_edit_button"))    Ext.getCmp(this.id + "_edit_button").disable();
                if(Ext.getCmp(this.id + "_save_button"))    Ext.getCmp(this.id + "_save_button").disable();
                if(Ext.getCmp(this.id + "_draw_button"))    Ext.getCmp(this.id + "_draw_button").disable();
                if(Ext.getCmp(this.id + "_reset_button"))   Ext.getCmp(this.id + "_reset_button").disable();
                if(Ext.getCmp(this.id + "_confirm_button")) Ext.getCmp(this.id + "_confirm_button").disable();
            }
        }
    },

    onSelectService: function(serviceName, panel, loadData){
        // save current serviceName. It's 'user@serviceName' in the WFS layer
        this.currentServiceName = this.target.user.name +  "@" + serviceName;
        // change mode
        this.mode = "aoiEdit";

        // add the auxiliary layers
        this.resetAuxiliaryContent();

        // this.viewPanel.enable();
        if (loadData)
            this.loadAcqData();
    },

   /** private: method[loadAcqData]
    *  Load acquisition list data
    */ 
    loadAcqData: function(){
        var acqList = Ext.getCmp(this.id + "_acqlist");
        //if(!this.acqListgrid){
            var grid = this.getAcqListGrid();
            acqList.add(grid);
            try
            {
                acqList.doLayout();
            }
            catch(err)
            {
                //console.log(err);
            }
        /*}else{
            this.refreshAcqListGrid();
        }*/
    },

    onFeatureAdded: function(controlReturns){
        this.drawControl.deactivate();
        Ext.getCmp(this.id + "_draw_button").enable();
        // write attributes
        this.draftFeatures.push(controlReturns.feature);
        // merge draft features to polygon layer
        this.mergeDraftFeatures();
        // check node
        this.checkMode();
    },

   /** private: method[checkMode]
    *  Merge current draft features to polygon layer AOI
    */ 
    mergeDraftFeatures: function(){
        var form = this.viewPanel.getForm();
        var values = form.getValues();

        // merging geometries in a multipolygon
        var components = [];
        var currentAOI = null;
        var featuresToRemove = [];
        var isOnPolygonLayer = false;

        // from current AOI
        if(this.wfsLayer 
            && this.wfsLayer.features
            && this.wfsLayer.features.length > 0){
            // current AOI must be on 0 index
            currentAOI = this.wfsLayer.features[0];
            if(currentAOI.geometry instanceof OpenLayers.Geometry.MultiPolygon && currentAOI.geometry.components){
                for(var j = 0; j < currentAOI.geometry.components.length; j++){
                    components.push(this.wfsLayer.features[0].geometry.components[j]);
                }
            }else{
                components.push(this.wfsLayer.features[0].geometry);
            }
            isOnPolygonLayer = true;
        }

        // from the draft features
        for(var i = 0; i < this.draftFeatures.length; i++){
            if(this.draftFeatures[i].geometry instanceof OpenLayers.Geometry.MultiPolygon && this.draftFeatures[i].geometry.components){
                for(var j = 0; j < this.draftFeatures[i].geometry.components.length; j++){
                    components.push(this.draftFeatures[i].geometry.components[j]);
                }
            }else{
                components.push(this.draftFeatures[i].geometry);
            }
            if(!currentAOI){
                currentAOI = this.draftFeatures[i];
            }
        }

        // Date start
        var dateStart = new Date(values.dateStart);
        var dateEnd = new Date(values.dateEnd);
        
        // merged geometry, update/insert and override attributes
        var geometry = components.length > 1 ? new OpenLayers.Geometry.MultiPolygon(components): currentAOI.geometry;
        Ext.apply(currentAOI,{
            geometry: geometry,
            state: currentAOI.fid ? OpenLayers.State.UPDATE : OpenLayers.State.INSERT,
            attributes:{
                service_name: this.currentServiceName,
                start: values.dateStart ? dateStart.toISOString(): currentAOI.attributes.start,
                end: values.dateEnd ? dateEnd.toISOString(): currentAOI.attributes.end,
                sensor: values.sensor ? values.sensor : currentAOI.attributes.sensor,
                sensor_mode: values.sensorMode ? values.sensorMode : currentAOI.attributes.sensor_mode,
                status: this.currentStatus
            }
        });

        // add draft feature to wfs
        if (!isOnPolygonLayer){
            this.wfsLayer.addFeatures(currentAOI);
        }

        // clean draft features
        this.draftFeatures = [];
    },

   /** private: method[refreshAcqListGrid]
    *  Refresh acquisition list data with a new store based on selected service
    */ 
    refreshAcqListGrid: function(){
        //if(!this.acqListgrid){
            // Feature grid
            this.acqListgrid = this.getAcqListGrid();
        /*}else{
            if(Ext.getCmp(this.id + "_export_acq_button")) Ext.getCmp(this.id + "_export_acq_button").disable();
            if(this.acqListgrid.store.proxy.protocol.filter != this.getCurrentFilter()){
                this.acqListgrid.store = new GeoExt.data.FeatureStore({
                    layer: this.acqListLayer,
                    fields: [
                        {name: "service_name", type: "string"},
                        {name: "ships", type: "number"},
                        {name: "start", type: "string"},
                        {name: "end", type: "string"},
                        {name: "sensor", type: "string"},
                        {name: "sensor_mode", type: "string"}
                    ],
                    proxy: new GeoExt.data.ProtocolProxy({
                        url: this.layerURL,
                        protocol: new OpenLayers.Protocol.WFS({
                            version: this.wfsVersion,
                            url: this.layerURL,
                            featureType: this.layerAcqListName,
                            geometryName: this.defaultGeometryName,
                            featureNS: this.defaultFeatureNS,
                            srsName: this.target.mapPanel.map.projection,
                            filter: this.getCurrentFilter()
                        })
                    }),
                    autoLoad: true,
                    listeners:{
                        load:function(){
                            try{
                                if(this.acqListgrid
                                    && this.acqListgrid.getView
                                    && this.acqListgrid.getView().refresh){
                                    this.acqListgrid.getView().refresh();
                                }
                            }catch (e){
                                // TODO: why? console.log(e);
                            }
                        },
                        scope: this
                    }
                });
            }
        }*/
        return this.acqListgrid;
    },

   /** private: method[refreshAcqListGrid]
    *  Get acquisition list grid based on selected service
    */ 
    getAcqListGrid: function(){
        if(this.addFeatureTable /*&& !this.acqListgrid*/){
            // Feature grid
            this.acqListgrid = new Ext.grid.GridPanel({
                height: 364,
                width : 530,
                sm: new GeoExt.grid.FeatureSelectionModel(),
                // viewConfig: {
                //     emptyText: this.emptyAcqListText
                // },
                store: new GeoExt.data.FeatureStore({
                    layer: this.acqListLayer,
                    fields: [
                        {name: "service_name", type: "string"},
                        {name: "ships", type: "number"},
                        {name: "start", type: "string"},
                        {name: "end", type: "string"},
                        {name: "sensor", type: "string"},
                        {name: "sensor_mode", type: "string"}
                    ],
                    proxy: new GeoExt.data.ProtocolProxy({
                        url: this.layerURL,
                        protocol: new OpenLayers.Protocol.WFS({
                            version: this.wfsVersion,
                            url: this.layerURL,
                            featureType: this.layerAcqListName,
                            geometryName: this.defaultGeometryName,
                            featureNS: this.defaultFeatureNS,
                            srsName: this.target.mapPanel.map.projection,
                            filter: this.getCurrentFilter()
                        })
                    }),
                    autoLoad: true
                }),
                columns: [
                    // {header: this.columnsHeadersText["service_name"], dataIndex: "service_name"},
                    // {header: this.columnsHeadersText["ships"], dataIndex: "ships", sortable: true},
                    {header: this.columnsHeadersText["start"], dataIndex: "start", sortable: true},
                    {header: this.columnsHeadersText["end"], dataIndex: "end", sortable: true},
                    {header: this.columnsHeadersText["sensor"], dataIndex: "sensor", sortable: true},
                    {header: this.columnsHeadersText["sensor_mode"], dataIndex: "sensor_mode", sortable: true}
                ],
                listeners:{
                    rowclick: function(grid, rowIndex, columnIndex, e) {
                        var selModel = grid.getSelectionModel();
                        if(selModel.getCount() == 0){
                            Ext.getCmp(this.id + "_export_acq_button").disable();
                        }else{
                            Ext.getCmp(this.id + "_export_acq_button").enable();
                        }
                    },
                    scope:this
                },
                // tbar: [],
                bbar:["->",
                {
                    text: this.exportAcqListText,
                    id: this.id + "_export_acq_button",
                    disabled: true,
                    iconCls: "icon-save",
                    tooltip: this.exportAcqListTooltipText,
                    handler: function() {
                        var me = this;
                        this.mode = "confirmAcqList";
                        var submitStatusToWFS = function(){
                            // change status
                            me.currentStatus = me.STATUS.ACQ_LIST_SAVED;
                            // merge draft features to wfs layer
                            me.mergeDraftFeatures();

                            // send WFS transaction
                            me.saveStrategy.save();

                            // update current form status
                            me.checkMode();
                        };

                        // filter by selected features 
                        var fids = "";
                        var selModel = this.acqListgrid.getSelectionModel(); 
                        var selectedRecords = selModel.getSelections();
                        for(var i = 0; i < selectedRecords.length; i++){
                            var record = selectedRecords[i];
                            if(record
                                && record.data
                                && record.data.fid){
                                fids += "'" + record.data.fid + "',";
                            }
                        }
                        fids = fids.substring(0, fids.length -1);

                        this.doExportAndSaveStatus("GML2", me.STATUS.ACQ_LIST_SAVED, this.layerAcqListName, this.submitAcqUrl, false, null, fids);

                        // this.doExportLayer("GML2", this.layerAcqListName, this.submitAcqUrl, false, submitStatusToWFS, fids);
                        // open the GML on a popup: this.doExportLayer("GML2", this.layerAcqListName, null, true, null, fids);
                    },
                    scope: this
                }]
            });
        }
        return this.acqListgrid;
    },

   /** private: method[resetAuxiliaryContent]
    *  Initialize the auxiliary layers and get current service AOI data
    */ 
    resetAuxiliaryContent: function(){

        // clean draft features
        this.draftFeatures = [];


        // draftLayer
        if(this.draftLayer){
            this.draftLayer.removeAllFeatures();
        }else{
            this.draftLayer = new OpenLayers.Layer.Vector(this.auxiliaryLayerName, {
                displayInLayerSwitcher: this.displayAuxiliaryLayerInLayerSwitcher,
                projection: this.defaultProjection,
                style: this.defaultLayerStyle
            });
            this.target.mapPanel.map.addLayer(this.draftLayer);
        }
        
        // polygon layer
        if(this.wfsLayer){
            this.target.mapPanel.map.removeLayer(this.wfsLayer);    
        }

        // acq_list layer
        if(this.acqListLayer){
            this.target.mapPanel.map.removeLayer(this.acqListLayer);
        }

        // addMSLayer(this.layerName, this.layerName, this.target.sources[this.source].url);
        var addLayer = this.target.tools[this.addLayerID];
        var source = this.target.sources[this.source];

        if(source){
            this.layerURL = source.url;

            // add layer if present
            if(addLayer && this.addWMSLayer){
                var options = {};
                Ext.apply(options, this.layerOptions);
                Ext.apply(options ,{
                    msLayerTitle: unescape(this.layerName),
                    msLayerName: unescape(this.layerName),
                    wmsURL: source.url
                });   
                addLayer.addLayer(options);
            }
        }

        // generate current serviceName WFS layer
        this.saveStrategy = new OpenLayers.Strategy.Save();
        this.saveStrategy.events.on({
            'success': this.onSaveSuccess,
            'fail': this.onSaveFail,
            scope: this
        });
        // wfsLayer
        this.wfsLayer = new OpenLayers.Layer.Vector(this.layerName, {
            map: this.target.mapPanel.map,
            displayInLayerSwitcher: this.displayAuxiliaryLayerInLayerSwitcher,
            strategies: [
                new OpenLayers.Strategy.BBOX(),
                this.saveStrategy
            ],
            protocol: new OpenLayers.Protocol.WFS({
                version: this.wfsVersion,
                url: this.layerURL,
                featureType: this.layerName,
                geometryName: this.defaultGeometryName,
                featureNS: this.defaultFeatureNS,
                srsName: this.defaultProjection
            }),
            filter: this.getCurrentFilter(),
            projection: this.defaultProjection,
            style: this.defaultLayerStyle
        });

        // acqListLayer
        this.acqListLayer = new OpenLayers.Layer.Vector(this.layerName, {
            map: this.target.mapPanel.map,
            displayInLayerSwitcher: this.displayAuxiliaryLayerInLayerSwitcher,
            protocol: new OpenLayers.Protocol.WFS({
                version: this.wfsVersion,
                url: this.layerURL,
                featureType: this.layerAcqListName,
                geometryName: this.defaultGeometryName,
                featureNS: this.defaultFeatureNS,
                srsName: this.defaultProjection
            }),
            filter: this.getCurrentFilter(),
            projection: this.defaultProjection
            // ,
            // style: this.defaultLayerStyle
        });

        var me = this;
        this.wfsLayer.events.register("loadend", this.wfsLayer, function (e) {
            me.loadWFSData();
            me.checkMode();
        });
        this.target.mapPanel.map.addLayer(this.wfsLayer);
        this.target.mapPanel.map.addLayer(this.acqListLayer);
    },

    onSaveFail: function(){
        Ext.Msg.show({
            // title: this.submitFailTitleText,
            // msg: this.submitFailText,
            title: this.currentSubmitFailTitleText,
            msg: this.currentSubmitFailText,
            buttons: Ext.Msg.OK,
            icon: Ext.MessageBox.ERROR
        });
    },

    onSaveSuccess: function(){
        Ext.Msg.show({
            // title: this.submitSuccessTitleText,
            // msg: this.submitSuccessText,
            title: this.currentSubmitSuccessTitleText,
            msg: this.currentSubmitSuccessText,
            buttons: Ext.Msg.OK,
            icon: Ext.MessageBox.INFO
        });
        if(Ext.getCmp(this.id + "_save_button"))   Ext.getCmp(this.id + "_save_button").disable();
        if(Ext.getCmp(this.id + "_services_grid")) Ext.getCmp(this.id + "_services_grid").getView().refresh();
    },

    // Load WFS data on current form
    loadWFSData: function(){
        this.currentStatus = this.STATUS.DRAFT;
        // exists current AOI?
        if(this.wfsLayer 
            && this.wfsLayer.features
            && this.wfsLayer.features.length > 0
            && this.wfsLayer.features[0].fid){
            // current AOI must be on 0 index
            var currentAOI = this.wfsLayer.features[0];
            // set current status
            if (this.viewPanel)
            {
                this.viewPanel.getForm().setValues({
                    dateStart: new Date(currentAOI.attributes.start),
                    dateEnd: new Date(currentAOI.attributes.end),
                    sensor: currentAOI.attributes.sensor,
                    sensorMode: currentAOI.attributes.sensor_mode
                });
            }
            this.currentStatus = currentAOI.attributes.status;
        }else{
            if(this.viewPanel) this.viewPanel.reset();
        }
    },

    // generate a filter for the layer
    getCurrentFilter: function(){
        return new OpenLayers.Filter.Comparison({
            type: OpenLayers.Filter.Comparison.EQUAL_TO,
            property: "service_name",
            value: this.currentServiceName
        });
    },     

    /** api: method[doExport]
     */    
    doExport: function(outputFormat){

        // do export for a new COMMITED status
        this.doExportAndSaveStatus(outputFormat);
    },      

    /** api: method[doExportAndSaveStatus]
     */    
    doExportAndSaveStatus: function(outputFormat, newStatus, layerName, submitUrl, downloadGenerated, submitCallback, fids){

        var me = this;
        var submitStatusToWFS = function(){
            // change status
            me.currentStatus = newStatus ? newStatus : me.STATUS.COMMITED;
            // merge draft features to wfs layer
            me.mergeDraftFeatures();

            // send WFS transaction
            me.saveStrategy.save();

            // update current form status
            me.checkMode();
        };

        this.doExportLayer(outputFormat, layerName ? layerName : this.layerName, submitUrl ? submitUrl : this.submitUrl, 
            downloadGenerated ? downloadGenerated : this.downloadUploadedSHP, submitCallback ? submitCallback : submitStatusToWFS, fids);
    },  

    /** api: method[doExportLayer]
     *  Export a layer in a format. Optionally submitted to backend and/or downloaded in an iframe
     */    
    doExportLayer: function(outputFormat, layerName, submitUrl, downloadGenerated, submitCallback, fids){

        var me = this;
        
        var filter = this.getCurrentFilter();
        
        var node = new OpenLayers.Format.Filter({
            version: this.wfsVersion,
            srsName: this.defaultProjection
        }).write(filter);
        
        var xml = new OpenLayers.Format.XML().write(node);

        var failedExport = String.format(this.failedExport, outputFormat);

        var user = this.target.user.name;
        var service = this.currentServiceName.substring(user.length +1);

        var cql_filter;
        if(fids){
            cql_filter = "id in (" + fids  + ")";
            cql_filter = encodeURIComponent(cql_filter);
        }else{
            cql_filter = "service_name='" + this.currentServiceName + "'";
        }

        // Url generation
        var exportUrl = this.layerURL;
        exportUrl += "?service=WFS" +
                "&version=" + (this.exportVersion ? this.exportVersion : this.wfsVersion) +
                "&request=GetFeature" +
                "&typeName=" + layerName +
                "&exceptions=application/json" +
                "&cql_filter=" + cql_filter +
                "&outputFormat="+ outputFormat;

        if(submitUrl){
            url =  submitUrl + encodeURIComponent(exportUrl) + "&user="+user + "&service="+service;
        }else{
            url = exportUrl;
        }

        // submit the SHP        
        OpenLayers.Request.POST({
            url: url,
            data: xml,
            callback: function(request) {

                if(request.status == 200){
                    //submit status
                    if(submitUrl && submitCallback){
                        submitCallback();
                    }
                
                    try
                      {
                            var serverError = Ext.util.JSON.decode(request.responseText);
                            Ext.Msg.show({
                                title: this.invalidParameterValueErrorText,
                                msg: "outputFormat: " + outputFormat + "</br></br>" +
                                     failedExport + "</br></br>" +
                                     "Error: " + serverError.exceptions[0].text,
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.ERROR
                            });                        
                      }
                    catch(err)
                      {
                        if(downloadGenerated){
                            // submit filter in a standard form (before check)
                            this.doDownloadPost(exportUrl, xml);
                        }
                      }
                      
                }else{
                    Ext.Msg.show({
                        title: failedExport,
                        msg: request.statusText,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                }
            },
            scope: this
        });   

    },

    /** api: method[doDownloadPost]
     *  This method is used to downlad a gnerated file
     */    
    doDownloadPost: function(url, data){
        //        
        //delete other iframes appended
        //
        if(document.getElementById(this.downloadFormId)) {
            document.body.removeChild(document.getElementById(this.downloadFormId)); 
        }
        // submit form with filter
        var form = document.createElement("form");
        form.setAttribute("id", this.downloadFormId);
        form.setAttribute("method", "POST");
        form.setAttribute("action", url);
        // var hiddenField = document.createElement("input");      
        // hiddenField.setAttribute("name", "filter");
        // hiddenField.setAttribute("value", data);
        // form.appendChild(hiddenField);
        form.target = "_blank";
        document.body.appendChild(form);
        form.submit(); 
    },

    /** api: method[importKML]
     *  Import a KML or KMZ file as AOI
     */  
    importKML: function(){
        var importer = this.target.tools[this.importExportID];
        if(importer){
            importer["exportConf"]["kml/kmz"]["layer"] = this.draftLayer;
            importer.importKML();
        }
    },

    /** api: method[importKML]
     *  Save imported features. Check the features imported and merge into draft layer
     */  
    saveDraftFeatures: function(layer){
        var importedFeatures = 0;
        var failFeatures = [];
        // from the draft layer
        for(var i = 0; i < layer.features.length; i++){
            if(layer.features[i].geometry 
                && (layer.features[i].geometry instanceof OpenLayers.Geometry.MultiPolygon
                    || layer.features[i].geometry instanceof OpenLayers.Geometry.Polygon)){
                // clean fid if exists
                if(layer.features[i].fid){
                    delete layer.features[i].fid;
                }
                this.draftFeatures.push(layer.features[i]);
                importedFeatures++;
            }else{
                failFeatures.push(layer.features[i]);
            }
        }
        // only merge imported and remove the others. TODO: show message
        layer.removeFeatures(failFeatures);
        if(importedFeatures > 0 ){
            this.mergeDraftFeatures();
            this.checkMode();
        }
    }
});

Ext.preg(gxp.plugins.PlanEditor.prototype.ptype, gxp.plugins.PlanEditor);
