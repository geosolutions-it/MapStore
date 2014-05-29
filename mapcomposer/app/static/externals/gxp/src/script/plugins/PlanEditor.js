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
        sensor_mode: "SensorMode"
    },
    serviceText: "Service",
    submitFailTitleText: "Fail",
    submitFailText: "An error occur while saving current AOI",
    submitSuccessTitleText: "Saved",
    submitSuccessText: "Current AOI has been saved",
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
    importTooltipText: "Import a shap file, KML or GeoJSON as AOI",
    editTooltipText: "Edit current AOI in the map",
    saveTooltipText: "Save current AOI status",
    drawTooltipText: "Draw a new polygon to be included in current service's AOI",
    confirmTooltipText: "Confirm current AOI for the selected service",
    resetTooltipText: "Clean lastest changes and optionally remove all saved AOI for the selected service",
    defaultMessage: "Select a service to edit AOI",
    commitedMessage: "Commited AOI, You can't edit it any more",
    selectedMessage: "Edit and commit the AOI",
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
    
    /** api: config[source]
    *  ``String`` source of the layer
    */
    source: "MARISS-Layers",
    
    /** api: config[layerName]
    *  ``String`` layer name for the edit
    */
    layerName: "aois",

    // options for the WMS layer on addLayers plugin
    layerOptions: {
        customParams:{
            displayInLayerSwitcher: false
        }
    },

    // custom parameters.
    auxiliaryLayerName: "Polygon Layer",
    displayAuxiliaryLayerInLayerSwitcher: false,
    addWMSLayer: false,
    layerURL: null,
    addFeatureTable: false,
    wfsVersion: "1.1.0",
    defaultGeometryName: "the_geom",
    defaultFeatureNS: "http://mariss.it",
    defaultProjection: "EPSG:4326",

    // hidden form id to download SHP on confirm
    downloadFormId: "shp_downloader",
    // flag to download the confirmed SHP when it's confirmed
    downloadUploadedSHP: false,

    // private parameters
    currentServiceName: null,
    draftFeatures: [],
    currentStatus: "DRAFT",

    // mode: see checkMode function
    mode: "default",

    // when the panel is activated, the owner panel (west) is expanded to 500
    expandToWidth: 500,

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
    },
    
    /** api: method[addOutput]
     */
    addOutput: function() {

        // generate backend urls based on this.target.config.adminUrl
        var adminUrl = this.target.config.adminUrl;
        // services available URL. 
        this.servicesUrl = adminUrl + "mvc/serviceManager/extJSbrowser?action=get_folderlist&folder=";
        // submit service.
        this.submitUrl = adminUrl + "mvc/serviceManager/confirmServiceAOI?url=";

        // configure output
        var outputConfig = {
            xtype: 'panel',
            title: this.titleText,
            layout: "form",
            style: {
                "padding-top": "10px",
            },
            items:[{
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
                        fields : ["id", "text", "leaf", "size", "iconCls", "loaded", "expanded", "mtime", "permission"]
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
            },{
                xtype: "gxp_planeditorpanel",
                layout: "form",
                disabled: true,
                buttons:[{
                    text: this.importButtonText,
                    id: this.id + "_import_button",
                    iconCls: "gx-map-add",
                    tooltip: this.importTooltipText,
                    handler: function() {
                        this.onButtonClicked("import");
                    },
                    scope: this
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
            }],
            listeners:{
                activate: function(){
                    Ext.getCmp(this.id + "_message").getEl().dom.innerText = this.defaultMessage;
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
                },
                scope:this
            }
        }
        Ext.apply(outputConfig, this.outputConfig || {} );
        return gxp.plugins.PlanEditor.superclass.addOutput.call(this, outputConfig);    
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
    onButtonClicked: function(buttonId){
        this.mode = buttonId;
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
                this.onImport();
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
        this.mergeDraftFeatures();

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
    onImport: function(){
        // TODO: Implement it
        Ext.Msg.show({
            title: "Not available",
            msg: "This functionality is not currently available. Work in progress",
            buttons: Ext.Msg.OK,
            icon: Ext.MessageBox.INFO
        });
    },

   /** private: method[checkMode]
    *  Check mode and enble or disable buttons
    */ 
    checkMode: function(){
        var panel = this.viewPanel;
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
            case 'draw':{
                Ext.getCmp(this.id + "_edit_button").enable();
                Ext.getCmp(this.id + "_save_button").enable();
                Ext.getCmp(this.id + "_draw_button").enable();
                Ext.getCmp(this.id + "_reset_button").enable();
                Ext.getCmp(this.id + "_confirm_button").enable();
                break;
            }
            case 'confirm':{
                this.viewPanel.disable();
                Ext.getCmp(this.id + "_edit_button").disable();
                Ext.getCmp(this.id + "_save_button").disable();
                Ext.getCmp(this.id + "_draw_button").disable();
                Ext.getCmp(this.id + "_reset_button").disable();
                Ext.getCmp(this.id + "_confirm_button").disable();
                Ext.getCmp(this.id + "_message").getEl().dom.innerText = this.commitedMessage;
                break;
            }
            case 'aoiEdit':{
                var msg = Ext.getCmp(this.id + "_message");
                if(this.currentStatus == this.STATUS.COMMITED){
                    // disable all buttons
                    this.viewPanel.disable();
                    msg.getEl().dom.innerText = this.commitedMessage;
                    // Ext.getCmp(this.id + "_message").setText(this.commitedMessage);
                }else{
                    this.viewPanel.enable();
                    msg.getEl().dom.innerText = this.selectedMessage;
                    // Ext.getCmp(this.id + "_message").setText(this.selectedMessage);
                    // Edit is enabled only if already exists an AOI.
                    if(this.wfsLayer 
                        && this.wfsLayer.features
                        && this.wfsLayer.features.length > 0){
                        Ext.getCmp(this.id + "_save_button").enable();
                        Ext.getCmp(this.id + "_edit_button").enable();
                        Ext.getCmp(this.id + "_confirm_button").enable();
                    }else{
                        Ext.getCmp(this.id + "_save_button").disable();
                        Ext.getCmp(this.id + "_edit_button").disable();
                        Ext.getCmp(this.id + "_confirm_button").disable();
                    }
                    Ext.getCmp(this.id + "_draw_button").enable();
                    Ext.getCmp(this.id + "_reset_button").enable();
                }
                break;
            }
            case 'reset':{
                Ext.getCmp(this.id + "_edit_button").disable();
                Ext.getCmp(this.id + "_save_button").disable();
                Ext.getCmp(this.id + "_draw_button").enable();
                Ext.getCmp(this.id + "_reset_button").disable();
                Ext.getCmp(this.id + "_confirm_button").disable();
                break;
            }
            default:{
                Ext.getCmp(this.id + "_edit_button").disable();
                Ext.getCmp(this.id + "_save_button").disable();
                Ext.getCmp(this.id + "_draw_button").disable();
                Ext.getCmp(this.id + "_reset_button").disable();
                Ext.getCmp(this.id + "_confirm_button").disable();
            }
        }
    },

    onSelectService: function(serviceName, panel){
        // save current serviceName. It's 'user@serviceName' in the WFS layer
        this.currentServiceName = this.target.user.name +  "@" + serviceName;
        // change mode
        this.mode = "aoiEdit";

        // add the auxiliary layers
        this.resetAuxiliaryContent();

        this.viewPanel.enable();

        // refresh filter on WFS grid
        if(this.addFeatureTable){
            if(this.grid){
                this.viewPanel.remove(this.getFeatureGrid());
                this.grid = null;
            }
            this.viewPanel.add(this.getFeatureGrid());
            this.viewPanel.doLayout();
        }
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
            components.push(this.draftFeatures[i].geometry);
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
                // TODO: get date time from form
                start: values.dateStart ? dateStart.toISOString(): "",
                end: values.dateEnd ? dateEnd.toISOString(): "",
                sensor: values.sensor,
                sensor_mode: values.sensorMode,
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

    getFeatureGrid: function(){
        if(this.addFeatureTable && !this.grid){
            // Feature grid
            this.grid = new Ext.grid.GridPanel({
                // xtype: "grid",
                title: "Feature Table",
                height: 150,
                sm: new GeoExt.grid.FeatureSelectionModel(),
                store: new GeoExt.data.FeatureStore({
                    layer: this.wfsLayer,
                    fields: [
                        {name: "service_name", type: "string"},
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
                            featureType: this.layerName,
                            geometryName: this.defaultGeometryName,
                            featureNS: this.defaultFeatureNS,
                            srsName: this.defaultProjection,
                            filter: this.getCurrentFilter()
                        })
                    }),
                    autoLoad: true
                }),
                columns: [
                    {header: this.columnsHeadersText["service_name"], dataIndex: "service_name"},
                    {header: this.columnsHeadersText["start"], dataIndex: "start"},
                    {header: this.columnsHeadersText["end"], dataIndex: "end"},
                    {header: this.columnsHeadersText["sensor"], dataIndex: "sensor"},
                    {header: this.columnsHeadersText["sensor_mode"], dataIndex: "sensor_mode"}
                ],
                bbar: []
            });
        }
        return this.grid;
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

        var me = this;
        this.wfsLayer.events.register("loadend", this.wfsLayer, function (e) {
            me.loadWFSData();
            me.checkMode();
        });
        this.target.mapPanel.map.addLayer(this.wfsLayer);
    },

    onSaveFail: function(){
        Ext.Msg.show({
            title: this.submitFailTitleText,
            msg: this.submitFailText,
            buttons: Ext.Msg.OK,
            icon: Ext.MessageBox.ERROR
        });
    },

    onSaveSuccess: function(){
        Ext.Msg.show({
            title: this.submitSuccessTitleText,
            msg: this.submitSuccessText,
            buttons: Ext.Msg.OK,
            icon: Ext.MessageBox.INFO
        });
        Ext.getCmp(this.id + "_save_button").disable();
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
            this.viewPanel.getForm().setValues({
                dateStart: new Date(currentAOI.attributes.start),
                dateEnd: new Date(currentAOI.attributes.end),
                sensor: currentAOI.attributes.sensor,
                sensorMode: currentAOI.attributes.sensor_mode
            });
            this.currentStatus = currentAOI.attributes.status;
        }else{
            this.viewPanel.reset();
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

        var me = this;
        var submitStatusToWFS = function(){
            // change status
            me.currentStatus = me.STATUS.COMMITED;
            // merge draft features to wfs layer
            me.mergeDraftFeatures();

            // send WFS transaction
            me.saveStrategy.save();

            // update current form status
            me.checkMode();
        }
        
        var filter = this.getCurrentFilter();
        
        var node = new OpenLayers.Format.Filter({
            version: this.wfsVersion,
            srsName: this.defaultProjection
        }).write(filter);
        
        var xml = new OpenLayers.Format.XML().write(node);

        var failedExport = String.format(this.failedExport, outputFormat);

        var user = this.target.user.name;
        var service = this.currentServiceName.substring(user.length +1);

        // Url generation
        var exportUrl = this.layerURL;
        exportUrl += "?service=WFS" +
                "&version=" + this.wfsVersion +
                "&request=GetFeature" +
                "&typeName=" + this.layerName +
                "&exceptions=application/json" +
                "&outputFormat="+ outputFormat;
        url = this.submitUrl + encodeURIComponent(exportUrl) + "&user="+user + "&service="+service;

        // submit the SHP        
        OpenLayers.Request.POST({
            url: url,
            data: xml,
            callback: function(request) {

                if(request.status == 200){
                    //submit status
                    submitStatusToWFS();
                
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
                        if(this.downloadUploadedSHP){
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
     *  This method is used only if this.downloadUploadedSHP is true
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
        var hiddenField = document.createElement("input");      
        hiddenField.setAttribute("name", "filter");
        hiddenField.setAttribute("value", data);
        form.appendChild(hiddenField);
        document.body.appendChild(form);
        form.submit(); 
    }
});

Ext.preg(gxp.plugins.PlanEditor.prototype.ptype, gxp.plugins.PlanEditor);
