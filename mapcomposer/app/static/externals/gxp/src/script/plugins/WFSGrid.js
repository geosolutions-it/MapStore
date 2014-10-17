/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * requires 
 * include 
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = WFSGrid
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: WFSGrid(config)
 *
 *    Plugin for displaying WFS features in a grid. 
 */   
gxp.plugins.WFSGrid = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_wfsgrid */
    ptype: "gxp_wfsgrid",
    
    
    /** api: config[id]
    *  ``String``
    *  
    */
    id: "wfsGridPanel",
    
    /** api: config[featureType]
     *  ``String``
     *  
     */
    featureType: null,
    
    
    /** api: config[wfsURL]
     *  ``String``
     *  
     */
    wfsURL: null,
    
    
    /** api: config[featureNS]
     *  ``String``
     *  
     */
    featureNS: "",
    
    
    /** api: config[srsName]
     *  ``String``
     *  
     */
    srsName: null,
    
    
    
    /** api: config[filter]
     *  ``OpenLayers.Filter``
     *  
     */
    filter: null,
    
    /** api: config[viewParams]
     *  ``String``
     *  
     */
    viewParams: null, 
    

    /** api: config[version]
     *  ``String``
     *  
     */
    version: null,
    
    
    /** api: config[pageSize]
     *  ``Integer``
     *  
     */
    pageSize: 10,
    
    
    /** api: config[autoRefreshInterval]
     *  ``Integer``
     *  
     */
    autoRefreshInterval: null,
    
    
    /** api: config[columns]
     *  ``Array Object``
     *  
     */
    columns: null,
    
    
    /** api: config[columns]
     *  ``Array Object``
     *  
     */
    actionColumns: null,
    
         
    
    // start i18n
    displayMsgPaging: "Displaying topics {0} - {1} of {2}",
    emptyMsg: "No topics to display",
    addTooltip: "Add new element",
    addLayerTooltip: "Add Layer to Map",
    detailsTooltip: "View Details",
    deleteTooltip: "Delete Feature",
    deleteConfirmMsg: "Are you sure you want delete this feature?",
    detailsHeaderName: "Property Name",
    detailsHeaderValue: "Property Value",
    detailsWinTitle: "Details",
    zoomToTooltip: "Zoom al bersaglio",
    loadMsg: "Please Wait...",
    startEditToTooltip: "Start Edit Row",
    startEditGeomToTooltip: "Start Edit Feature",
    stopEditGeomToTooltip: "Stop Edit Feature",
    resetEditGeomToTooltip: "Reset Edit Feature",
    removeMessage: "Remove",
    removeTitle:"Are you sure you want to remove the element?",
    noEditElementSelectionTitle: "Seleziona un elemento",
    noEditElementSelectionMsg: "Devi selezionare un elemento!!!",    
    activeEditSessionMsgTitle: "Modifica Attiva",
    activeEditSessionMsgText: "Sei in modalità aggiunta/modifica geometria. Non puoi eliminare la geometria!",    
    // end i18n
    

    /** private: countFeature
     *  ``Integer``
     */
    countFeature: null,
    
    featureFields: null,
    
    addIconPath: "theme/app/img/silk/add.png",
    addLayerIconPath: "theme/app/img/silk/add.png",
    detailsIconPath: "theme/app/img/silk/information.png",
    deleteIconPath: "theme/app/img/silk/delete.png",
    zoomToIconPath: "theme/app/img/silk/map_magnify.png",
    startEditToIconPath: "theme/app/img/silk/table_edit.png",
    startEditGeomToIconPath: "theme/app/img/geosilk/shape_square_green.png",
    stopEditGeomToIconPath: "theme/app/img/geosilk/shape_square_red.png",
    resetEditGeomToIconPath: "theme/app/img/geosilk/shape_square_yellow.png",

  
    addLayerTool: null,
  
    geometryType: null,
    
    supportTypes: {
        "xsd:boolean": "boolean",
        "xsd:int": "int",
        "xsd:integer": "int",
        "xsd:short": "int",
        "xsd:long": "int",
        /*  "xsd:date": "date",
                        "xsd:dateTime": "date",*/
        "xsd:date": "string",
        "xsd:dateTime": "string",
        "xsd:string": "string",
        "xsd:float": "float",
        "xsd:double": "float"
    },
    

    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.WFSGrid.superclass.constructor.apply(this, arguments);  
        
        //this.setTotalRecord();
        
        if(config.fields){
           this.featureFields = config.fields;
        }
        
        if(config.autoRefresh){
            this.setAutoRefresh(config.autoRefresh);
        }
    },
    
    setTotalRecord: function(callback){
        var me= this;
        var hitCountProtocol = /*new OpenLayers.Protocol.WFS({ 
               url: this.wfsURL, 
               featureType: this.featureType, 
               readOptions: {output: "object"},
               featureNS: this.featureNS, 
               resultType: "hits",
               filter: this.filter,
               viewparams: this.viewParams,
               outputFormat: "application/json",
               srsName: this.srsName,
               version: this.version
       });*/
        this.getProtocol({
            resultType: "hits",
            outputFormat: "text/xml"
        });
                 
               
        hitCountProtocol.read({
            callback: function(response) {
                var respObj=new OpenLayers.Format.WFST({version: "1.1.0"}).read(
                            response.priv.responseXML, {output: "object"});
                this.countFeature=respObj.numberOfFeatures;
                if(callback)
                    callback.call(null, this.countFeature);
            },
            scope: this
        });
         
        return this.countFeature;
    },
    
    
    loadFeatureFields: function(callback){
        var me= this;
 
        if(this.featureFields == null){
            this.getSchema(function(schema){
                me.featureFields= new Array();
                var geomRegex = /gml:((Multi)?(Point|Line|Polygon|Curve|Surface|Geometry)).*/;
                    
                schema.each(function(r) {
                    var match = geomRegex.exec(r.get("type"));
                    if (match) {
                        //geometryName = r.get("name");
                        me.geometryType = match[1];
                    } else {
                        var type = me.supportTypes[r.get("type") || "string"];
                        var field = {
                            name: r.get("name"),
                            type: type
                        };
                        me.featureFields.push(field);
                    }
                }, this);
                               
                if(callback)
                    callback.call(this); 
            }); 
        }else
        if(callback)
            callback.call(this);  
        
    },
    
    getSchema: function(callback,scope){
        var schema = new GeoExt.data.AttributeStore({
            url: this.wfsURL, 
            baseParams: {
                SERVICE: "WFS",
                VERSION: "1.1.0",
                REQUEST: "DescribeFeatureType",
                TYPENAME: this.featureType
            },
            autoLoad: true,
            listeners: {
                "load": function() {
                    callback.call(scope, schema);
                },
                scope: this
            }
        });
    },
    
    /** private: method[getAddLayerAction]
     */
    getAddLayerAction: function(actionConf){
        var addLayer = this.target.tools[this.addLayerTool];
        var addLayerTT=this.addLayerTooltip; 
        var layerNameAtt= actionConf.layerNameAttribute || "layerName";
        var layerTitleAtt= actionConf.layerTitleAttribute || "name";
        var wsAtt= actionConf.wsNameAttribute || "wsName";
        var wmsURLAtt= actionConf.wmsURLAttribute || "outputUrl";
        var showEqualFilter= actionConf.showEqualFilter;
        return {
            xtype: 'actioncolumn',
            sortable : false, 
            width: 10,
            items: [{
                tooltip:addLayerTT,
                getClass: function(v, meta, rec) {
                    this.items[0].tooltip = addLayerTT;
                    if(showEqualFilter){
                        if (rec.get(showEqualFilter.attribute) == showEqualFilter.value)  {
                            return 'action-add-layer';
                        }else{
                            this.items[0].tooltip = null;
                            return  'no-action-add-layer';
                        } 
                    }else
                        return 'action-add-layer'; 
                            
                },
                handler: function(gpanel, rowIndex, colIndex) {
                    var store = gpanel.getStore();	
                    var record = store.getAt(rowIndex);
                    addLayer.addLayer(record.get(layerTitleAtt),
                        record.get(wsAtt) + ":" + record.get(layerNameAtt),
                        record.get(wmsURLAtt)
                        );
                }
            }]  
        };
    },
    
    
    /** private: method[getDetailsAction]
     */
    getDetailsAction: function(actionConf){
        var layerTitleAtt= actionConf.layerTitleAttribute || "name";
        var me=this;
        return {
            xtype: 'actioncolumn',
            sortable : false, 
            width: 10,
            items: [{
                icon   : me.detailsIconPath,  
                tooltip: me.detailsTooltip,
                scope: me,
                handler: function(gpanel, rowIndex, colIndex) {
                    var store = gpanel.getStore();	
                    var record = store.getAt(rowIndex);
                    var detailsStore=new Ext.data.ArrayStore({
                        fields: ['name', 'value'],
                        idIndex: 0 
                    });
                    var recordDetailsData = new Array();

                    for(var k=0; k<me.featureFields.length; k++)
                        recordDetailsData.push([ me.featureFields[k].name , record.get(me.featureFields[k].name)]);

                    detailsStore.loadData(recordDetailsData);
                                   
                    new Ext.Window({ 
                        title: record.get(layerTitleAtt)+ " - " + me.detailsWinTitle,
                        height: 400,
                        width: 400,
                        layout: 'fit',
                        resizable: true,
                        items:
                        new Ext.grid.GridPanel({
                            store: detailsStore,
                            anchor: '100%',
                            viewConfig : {
                                forceFit: true
                            },
                            columns: [{
                                header: me.detailsHeaderName, 
                                dataIndex: "name",
                                renderer: function (val){
                                    return '<b>' + val + '</b>';
                                }
                            },{
                                header: me.detailsHeaderValue, 
                                dataIndex: "value"
                            }]
                        })
                    }).show();
                }
            }]
        };
    },
    
    
    /** private: method[getZoomAction]
     */
    getZoomAction: function(actionConf){
        var sourceSRS=actionConf.sourceSRS;
        var me= this;
        return {
            xtype: 'actioncolumn',
            sortable : false, 
            width: 30,
            items: [{
                icon   : this.zoomToIconPath,  
                tooltip: this.zoomToTooltip,
                scope: this,
                handler: function(grid, rowIndex, colIndex) {
                    var record = grid.store.getAt(rowIndex);
                    var map = this.target.mapPanel.map;
                    var geometry = me.getGeometry(record.data.feature.geometry,sourceSRS);
                    map.zoomToExtent(geometry.getBounds());															
                }
            }]  
        };
    },
    
    
    getCheckDisplayAction: function(actionConf){
        var me= this;
        var checkConf = {
            listeners: {
                scope: this,				
                rowdeselect: function (selMod, rowIndex, record){
                    if(this.tbar){
                        if(selMod.getCount() === 0 || selMod.getCount() > 1){
                            this.tbar.items.items[1].disable();
                        }else{
                            this.tbar.items.items[1].enable();
                        }
                    }
                    me.removeGeometry(actionConf.layerName, record.get("fid"));
                },
                rowselect: function(selMod, rowIndex, record) {
                    if(this.tbar){                    
                        if(selMod.getCount() === 1){
                            this.tbar.items.items[1].enable();
                        }else{
                            this.tbar.items.items[1].disable();
                        }
                    }
                    
                    var geom = me.getGeometry(record.data.feature.geometry,actionConf.sourceSRS);
                    me.displayGeometry(actionConf.layerName, 
                        record.get("fid"),
                        geom, actionConf.style);
                }
            }
        };
        return new Ext.grid.CheckboxSelectionModel(checkConf);  
    },
    
    /** private: method[setEditGrid]
     */
    setEditGrid: function(record,valueCol,idCol,descCol,colType,rowIndex,idHeader,descHeader){
        var me = this;
        var rowIndex = rowIndex;
        var fm = Ext.form;    
        
        var editor = new fm.TextField({
            allowBlank: false
        });            
        var values = record.get(valueCol);
        var listValues = values.substring(1,values.length-1);
        var arrayValues = listValues.split(",");
        
        var ids = record.get(idCol);
        var listIds = ids.substring(1,ids.length-1);
        var arrayIds = listIds.split(",");
        
        var descs = record.get(descCol);
        var listDescs = descs.substring(1,descs.length-1);
        var arrayDescs = listDescs.split(",");
        
        var values = [];
        
        for (var i = 0;i<arrayValues.length;i++){
            values[values.length] = [arrayIds[i],arrayDescs[i],arrayValues[i]];
        }        
        
        var store = new Ext.data.ArrayStore({
            storeId: 'store_'+colType,
            fields: ['id','layer','values'],
            data: values
        });

        var grid = new Ext.grid.EditorGridPanel({
            store: store,
            border: false,
            id: 'grid_'+colType,
            layout: 'fit',
            colModel: new Ext.grid.ColumnModel({
                columns: [{
                    id: 'layer',
                    width: 200,
                    header: idHeader || 'layer',
                    dataIndex: 'layer',
                    hidden: false
                },{
                    id: 'values',
                    header: descHeader || 'values',
                    dataIndex: 'values',
                    hidden: false,
                    editor: editor
                }]
            }),
            viewConfig: {
                forceFit: true
            },
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            frame: false,            
            listeners: {
                afteredit : function(object) {
                    row = object.row;
                    unitGrid = Ext.getCmp(this.id);
                    rowview = unitGrid.getView().getRow(row);
                    changecss = Ext.get(rowview);
                    changecss.addClass('change-row');
                }
            }
        });   
        
        return grid;    
    },

    /** private: method[getStartEditAction]
     */    
    getStartEditAction: function(actionConf){
        var sourceSRS=actionConf.sourceSRS;
        var me= this;
        return {
            xtype: 'actioncolumn',
            sortable : false, 
            width: 30,
            toggleGroup: "toolGroup",
            items: [{
                icon   : this.startEditToIconPath,  
                tooltip: this.startEditToTooltip,
                scope: this,
                handler: function(grid, rowIndex, colIndex) {
                    var record = grid.getStore().getAt(rowIndex);
                   
                    me.currentRecord = me.save[record.get("id")];
                    if(!me.currentRecord) {
                        me.currentRecord = {
                            id: record.get("id"),
                            cff: [],
                            padr: [],
                            pis: undefined
                        };
                    }
                        
                    //var arrayGrid = [];
                    var columnCount = grid.getColumnModel().getColumnCount();
                    
                    var selectionModel = grid.getSelectionModel();
                    selectionModel.unlock();
                    selectionModel.clearSelections(false);
                    selectionModel.selectRow( rowIndex, false );
                    
                    for( var kk=0; kk<columnCount; kk++){
                        var colType = grid.getColumnModel().getColumnHeader(kk);
                        
                        switch (colType){
                            case "PADR":                                
                                var padrGrid = me.setEditGrid(record,'padr','sostanze','sostanze_desc', colType,rowIndex,'Sostanza','PADR');
                                break;
                            case "PIS":
                                var colRecord = grid.getStore().getAt(rowIndex).get('pis');
                                var textField = {
                                    anchor: '100%',
                                    xtype: 'fieldset',
                                    title:'PIS',
                                    defaults: {
                                        labelWidth: 70
                                    },
                                    defaultType: 'textfield',
                                    items: [{
                                        fieldLabel: 'PIS value',
                                        anchor: '100%',
                                        name: 'pis',
                                        value: colRecord
                                    }]
                                };
                                break;  
                            case "CFF":
                                
                                var cffGrid = me.setEditGrid(record,'cff','bersagli','bersagli_desc',colType,rowIndex,'Bersaglio','CFF');
                                break;   
                        }
                    }

                    var tabs = new Ext.TabPanel({
                        activeTab: 0,
                        enableTabScroll: true,
                        items: [{
                            title: 'PIS',
                            anchor: '100%',
                            items: textField
                        },{
                            title: 'CFF',
                            items: cffGrid,
                            layout: 'fit'
                        },{
                            title: 'PADR',
                            items: padrGrid,
                            layout: 'fit'
                        }]
                    });
                    
                    var win = new Ext.Window({
                        width: 400,
                        height: 250,
                        modal: true,
                        resizable: false,
                        title: 'Road Edit Form',
                        autoShow: true,
                        autoScroll: true,
                        layout: 'fit',
                        constrain: true,
                        items: tabs,
                        buttons: [
                            {
                                text: "Salva",
                                //iconCls:this.okIconCls,
                                handler: function() {
                                
                                    var myTabs = tabs;
                                    var changed = false;
                                    myTabs.items.each(function(i){
                                    
                                        if(i.items.items[0].getXType() != 'fieldset'){
                                            var store = i.items.items[0].getStore();
                                            var fieldName = i.title.toLowerCase();
                                            var ccc = [];
                                            var foundDirty = false;
                                            store.each(function(r) {
                                                if(r.dirty) {
                                                    changed  = true;
                                                    foundDirty = true;
                                                    me.currentRecord[fieldName].push({id: r.get("id"), value: parseFloat(r.get('values'))});                                                    
                                                }
                                                ccc.push(r.get('values'));
                                            });
                                            if(foundDirty) {
                                                var newString = "{" + ccc.join() + "}";
                                                
                                                var originSelectionModel = me.wfsGrid.getSelectionModel();
                                                var record = originSelectionModel.getSelected();
                                                record.set(fieldName,newString);
                                            }
                                        }else{
                                            var fieldValue = parseFloat(i.items.items[0].items.items[0].getValue());
                                            var originSelectionModel = me.wfsGrid.getSelectionModel();
                                            var record = originSelectionModel.getSelected();
                                            var fieldName = i.title.toLowerCase();
                                            var oldValue = record.get(fieldName);
                                            if(oldValue !== fieldValue) {
                                                me.currentRecord[fieldName] = fieldValue;
                                                record.set(fieldName,fieldValue);
                                                changed = true;
                                            }
                                        }
                                        
                                    });
                                    if(changed) {
                                        me.save[me.currentRecord.id] = me.currentRecord;
                                    }
                                    this.ownerCt.ownerCt.hide();
                                }
                            },{
                                 text: "Chiudi",
                                 //iconCls:this.cancelIconCls,
                                 //scope:this,
                                 handler:function() {
                                    this.ownerCt.ownerCt.hide();
                                }
                            }
                        ]                        
                    }); 

                     win.show();
                     
                }
            }]  
        };
    },

    /* private: method[getStartEditTargetsAction]
     
    getStartEditTargetsAction: function(actionConf){
        var sourceSRS=actionConf.sourceSRS;
        var me= this;
        return {
            xtype: 'actioncolumn',
            sortable : false, 
            width: 30,            
            items: [{
                icon   : this.startEditToIconPath,  
                tooltip: this.startEditToTooltip,
                scope: this,
                handler: function(grid, rowIndex, colIndex) {
                    var record = grid.getStore().getAt(rowIndex);
                   
                    me.currentRecord = me.save[record.get("id")];
                    if(!me.currentRecord) {
                        me.currentRecord = {
                            id: record.get("id"),
                            value: record.get("value"),
                            oldvalue: record.get("value"),
                            geometry: me.getGeometry(record,sourceSRS),
                            oldgeometry: me.getGeometry(record,sourceSRS)
                        };
                    }
                        
                    //var arrayGrid = [];
                    var columnCount = grid.getColumnModel().getColumnCount();
                    
                    var selectionModel = grid.getSelectionModel();
                    selectionModel.unlock();
                    selectionModel.clearSelections(false);
                    selectionModel.selectRow( rowIndex, false );
                    
                    var colRecord = grid.getStore().getAt(rowIndex).get('value');
                    var textField = {
                        anchor: '100%',
                        xtype: 'fieldset',
                        title:'Value',
                        defaults: {
                            labelWidth: 70
                        },
                        defaultType: 'textfield',
                        items: [{
                            fieldLabel: 'Value',
                            anchor: '100%',
                            name: 'value',
                            value: colRecord
                        }]
                    };
                    
                    var win = new Ext.Window({
                        width: 300,
                        height: 250,
                        modal: true,
                        resizable: false,
                        title: 'Road Edit Form',
                        autoShow: true,
                        autoScroll: true,
                        layout: 'fit',
                        constrain: true,
                        items: [{
                            title: 'VALUE',
                            anchor: '100%',
                            items: textField
                        }],
                        buttons: [
                            {
                                text: "Salva",
                                //iconCls:this.okIconCls,
                                handler: function() {
                                
                                    var myTabs = tabs;
                                    var changed = false;
                                    myTabs.items.each(function(i){
                                    
                                        if(i.items.items[0].getXType() != 'fieldset'){
                                            var store = i.items.items[0].getStore();
                                            var fieldName = i.title.toLowerCase();
                                            var ccc = [];
                                            var foundDirty = false;
                                            store.each(function(r) {
                                                if(r.dirty) {
                                                    changed  = true;
                                                    foundDirty = true;
                                                    me.currentRecord[fieldName].push({id: r.get("id"), value: parseFloat(r.get('values'))});                                                    
                                                }
                                                ccc.push(r.get('values'));
                                            });
                                            if(foundDirty) {
                                                var newString = "{" + ccc.join() + "}";
                                                
                                                var originSelectionModel = me.wfsGrid.getSelectionModel();
                                                var record = originSelectionModel.getSelected();
                                                record.set(fieldName,newString);
                                            }
                                        }else{
                                            var fieldValue = parseFloat(i.items.items[0].items.items[0].getValue());
                                            var originSelectionModel = me.wfsGrid.getSelectionModel();
                                            var record = originSelectionModel.getSelected();
                                            var fieldName = i.title.toLowerCase();
                                            var oldValue = record.get(fieldName);
                                            if(oldValue !== fieldValue) {
                                                me.currentRecord["value"] = fieldValue;
                                                record.set(fieldName,fieldValue);
                                                record.set("value",fieldValue);
                                                changed = true;
                                            }
                                        }
                                        
                                    });
                                    if(changed) {
                                        me.save[me.currentRecord.id] = me.currentRecord;
                                    }
                                    this.ownerCt.ownerCt.hide();
                                }
                            },{
                                 text: "Chiudi",
                                 //iconCls:this.cancelIconCls,
                                 //scope:this,
                                 handler:function() {
                                    this.ownerCt.ownerCt.hide();
                                }
                            }
                        ]                        
                    }); 

                     win.show();
                     
                }
            }]  
        };
    },*/    

    /** private: method[getRemoveTargetAction]
     */    
    getRemoveTargetAction: function(actionConf){
        var sourceSRS=actionConf.sourceSRS;
        var me= this;
        
        var record;
        
        var removedStyle= {
            strokeColor: "#FF0000",
            strokeWidth: 3,
            fillColor: "#FF0000",
            fillOpacity: 0.5
        };
        
        return {
            xtype: 'actioncolumn',
            sortable : false, 
            width: 30, 
            items:[{
                icon   : this.deleteIconPath,  
                tooltip: this.deleteTooltip,
                scope: this,
                handler: function(grid, rowIndex, colIndex) {
                    record = grid.getStore().getAt(rowIndex);
                    var grid = me.wfsGrid;
                    var editToolbar = grid.getTopToolbar();   
                    var addGeom = editToolbar.items.items[0].pressed;                    
                    var editGeom = editToolbar.items.items[1].pressed;

                    if (addGeom || editGeom){
                        Ext.Msg.show({
                            title: this.activeEditSessionMsgTitle,
                            buttons: Ext.Msg.OK,                
                            msg: this.activeEditSessionMsgText,
                            icon: Ext.MessageBox.INFO,
                            scope: this
                        });              
                        return;
                    }
                    
                    Ext.MessageBox.confirm(this.removeMessage, this.removeTitle, function(btn) {
                        if(btn === 'yes') {
                            var id = record.get("id");
                            var currentRecord = me.save[id];
                            if(!currentRecord) {
                                currentRecord = {
                                    id: id,
                                    value: record.get("value"),
                                    oldvalue: record.get("value"),
                                    geometry: record.data.feature.geometry,
                                    oldgeometry: record.data.feature.geometry
                                };
                                me.save[id] = currentRecord;
                            }
                            currentRecord.removed = true;
                            
                            //me.persistEditGeometry("simulation_removed", record.get("fid"), me.getGeometry(record, sourceSRS), removedStyle);
                            
                            /*var removedStyle = (record.data.feature.newfeature) ? {
                                stroke: false,
                                fill: false
                            } : {
                                strokeColor: "#FF0000",
                                strokeWidth: 3,
                                fillColor: "#FF0000",
                                fillOpacity: 0.5
                            };*/
                            
                            var fid = record.get('fid');
                            var map = app.mapPanel.map;
                            var syntView = app.tools["syntheticview"];

                            var selectedTargetLayer = map.getLayersByName(syntView.selectedTargetLayer)[0];
                            var simulationAddedLayer = map.getLayersByName(syntView.simulationAddedLayer)[0];                             
                            var selectedTargetLayerEditing = map.getLayersByName(syntView.selectedTargetLayerEditing)[0];
                            var simulationChangedLayer = map.getLayersByName(syntView.simulationChangedLayer)[0];
                            var simulationRemovedLayer = map.getLayersByName(syntView.simulationRemovedLayer)[0];        
                            var simulationModLayer = map.getLayersByName(syntView.simulationModLayer)[0];   
                                
                            if (record.data.feature.newfeature){
                                
                                // remove added geometry from save object
                                if (me.save){
                                    for (save in me.save){
                                        if(me.save.hasOwnProperty(save)){        
                                            if (save === id)
                                                delete me.save[save];
                                        }
                                    }
                                }
                                
                                if (selectedTargetLayerEditing && selectedTargetLayerEditing.features.length !== 0){
                                    //var feature = selectedTargetLayerEditing.getFeaturesByAttribute("id",fid);
                                    //var feature = selectedTargetLayerEditing.getFeatureBy("state","Insert");
                                    var feature = selectedTargetLayerEditing.features[0];
                                    selectedTargetLayerEditing.destroyFeatures(feature);
                                    selectedTargetLayerEditing.redraw();
                                }  
                                
                                if (selectedTargetLayer && selectedTargetLayer.features.length !== 0){
                                    var feature = selectedTargetLayer.getFeaturesByAttribute("id",fid);
                                    selectedTargetLayer.destroyFeatures(feature);
                                    selectedTargetLayer.redraw();
                                }
                                
                                if (simulationAddedLayer && simulationAddedLayer.features.length !== 0){
                                    var feature = simulationAddedLayer.getFeaturesByAttribute("id",fid);
                                    simulationAddedLayer.destroyFeatures(feature);
                                    simulationAddedLayer.redraw();
                                }             

                                if (simulationChangedLayer && simulationChangedLayer.features.length !== 0){
                                    var feature = simulationChangedLayer.getFeaturesByAttribute("id",fid);
                                    simulationChangedLayer.destroyFeatures(feature);
                                    simulationChangedLayer.redraw();
                                }    
                                
                                if (simulationRemovedLayer && simulationRemovedLayer.features.length !== 0){
                                    var feature = simulationRemovedLayer.getFeaturesByAttribute("id",fid);
                                    simulationRemovedLayer.destroyFeatures(feature);
                                    simulationRemovedLayer.redraw();
                                }          

                                if (simulationModLayer && simulationModLayer.features.length !== 0){
                                    var feature = simulationModLayer.getFeaturesByAttribute("id",fid);
                                    simulationModLayer.destroyFeatures(feature);
                                    simulationModLayer.redraw();
                                }                                
                                
                            }
                            
                            if(!record.data.feature.newfeature){
                                //me.persistEditGeometry("Bersagli rimossi", record.get("fid"), me.getGeometry(record.data.feature.geometry, sourceSRS), removedStyle);
                                me.persistEditGeometry("Bersagli rimossi", record.get("fid"), me.getGeometry(currentRecord.oldgeometry, sourceSRS), removedStyle);
                                if (selectedTargetLayerEditing && selectedTargetLayerEditing.features.length !== 0){
                                    //var feature = selectedTargetLayerEditing.getFeaturesByAttribute("id",fid);
                                    //var feature = selectedTargetLayerEditing.getFeatureBy("state","Insert");
                                    var feature = selectedTargetLayerEditing.features[0];
                                    selectedTargetLayerEditing.destroyFeatures(feature);
                                    selectedTargetLayerEditing.redraw();
                                }  
                                
                                if (selectedTargetLayer && selectedTargetLayer.features.length !== 0){
                                    var feature = selectedTargetLayer.getFeaturesByAttribute("id",fid);
                                    selectedTargetLayer.destroyFeatures(feature);
                                    selectedTargetLayer.redraw();
                                }
                                
                                if (simulationAddedLayer && simulationAddedLayer.features.length !== 0){
                                    var feature = simulationAddedLayer.getFeaturesByAttribute("id",fid);
                                    simulationAddedLayer.destroyFeatures(feature);
                                    simulationAddedLayer.redraw();
                                }             

                                if (simulationChangedLayer && simulationChangedLayer.features.length !== 0){
                                    var feature = simulationChangedLayer.getFeaturesByAttribute("id",fid);
                                    simulationChangedLayer.destroyFeatures(feature);
                                    simulationChangedLayer.redraw();
                                }    
                                
                                if (simulationModLayer && simulationModLayer.features.length !== 0){
                                    var feature = simulationModLayer.getFeaturesByAttribute("id",fid);
                                    simulationModLayer.destroyFeatures(feature);
                                    simulationModLayer.redraw();
                                }                   
                            }
                            grid.getStore().remove(record);
                        }
                    });
                }
            }]
            
        };
    },


    enableTools: function(){
        var me = this;
        var disabledItems = [];
        app.toolbar.items.each(function(item) {
            if (item.disabled) {
                disabledItems.push(item);
            }
        });
        
        // For every enabled tool in the toolbar, toggle the button off (deactivating the tool)
        // Then add a listener on 'click' and 'menushow' to reset the BBoxQueryForm to disable all active tools
        for (var i = 0;i<disabledItems.length;i++){
            if(disabledItems[i].toggleGroup){
                if(disabledItems[i].scope && disabledItems[i].scope.actions){
                    for(var a = 0;a<disabledItems[i].scope.actions.length;a++){
                        //disabledItems[i].scope.actions[a].toggle(false);
                        disabledItems[i].scope.actions[a].enable();
                        
                        if (disabledItems[i].scope.actions[a].menu){
                            for(var b = 0;b<disabledItems[i].scope.actions[a].menu.items.items.length;b++){
                                disabledItems[i].scope.actions[a].menu.items.items[b].enable();
                            }
                        }

                        disabledItems[i].scope.actions[a].on({
                            "click": function(evt) {
                                 if (me.modifyControl) {me.modifyControl.deactivate();};
                                 // TODO 'Circle' and 'Poligon' tool have no other visual way to display
                                 // their statuses (active, not active), apart from the combobox
                                 // The clearValue() is intended to tell user that the tool is not enabled
                                 //me.output[0].outputType.clearValue();

                            },
                            "menushow": function(evt) {
                                var menuItems = evt.menu.items.items;
                                for (var i = 0;i<menuItems.length;i++){
                                    menuItems[i].enable();
                                }
                                 if (me.modifyControl) {me.modifyControl.deactivate();};
                                 //me.output[0].outputType.clearValue();
                            },
                            scope: this
                        });
                    }
                }                    
            }
        } 
    }, 
        
    editTargetGeometry: function(actionConf, button, rowIndex, colIndex, newFeature) {
        /*var me = this;
        var record = grid.getStore().getAt(rowIndex);*/

        var me = this;
        var record;
        var grid = this.wfsGrid;
        var selectionModel = grid.getSelectionModel();
        
        if(selectionModel.hasSelection() && selectionModel.getCount() === 1){
            if(!newFeature){
                this.tbar.items.items[0].disable();
                this.tbar.items.items[2].enable();  
                this.tbar.items.items[3].enable();  
            }else{
                this.tbar.items.items[1].disable();              
            }
            
            var selection = selectionModel.getSelected();
            record = selection; //grid.getStore().getAt(rowIndex);
                            
            me.currentRecord = me.save[record.get("id")];
            if(!me.currentRecord) {
                me.currentRecord = {
                    id: record.get("id"),
                    value: record.get("value"),
                    oldvalue: record.get("value"),
                    newfeature: record.data["new"] || false,
                    geometry: record.data.feature.geometry,
                    oldgeometry: record.data.feature.geometry
                };
                me.save[record.get("id")] = me.currentRecord;
            }
            
            var selectionModel = grid.getSelectionModel();
            //selectionModel.unlock();
            selectionModel.lock();
            
            var oldRow = selectionModel.getSelected();
            if(oldRow){
                if(oldRow.get("fid") != record.get("fid")){
                    //alert("vuoi salvare?");
                    me.removeGeometry(actionConf.layerName, oldRow.get("fid"));
                    if(me.modifyControl) {
                        me.modifyControl.deactivate();
                    }
                }
            }
            
            //selectionModel.clearSelections(false);
            //selectionModel.selectRow( rowIndex, false );
            
            var map = this.target.mapPanel.map;
            
            //perform displayGeometry
            var geom = me.getGeometry(record.data.feature.geometry,actionConf.sourceSRS);
           
            var layerStyle= {
                strokeColor: "#FF0000",
                strokeWidth: 3,
                fillColor: "#00FFFF",
                fillOpacity: 0.8
            };
            
            var targetLayer = me.displayEditGeometry(actionConf.layerName, 
                record.get("fid"),
                geom, layerStyle);
                
            targetLayer.events.unregister("featureunselected", targetLayer, selected);    
            
            var selected = function(){
                //alert("attenzione");
                targetLayer.events.unregister("featureunselected", targetLayer, selected);
                
            };
            
            targetLayer.events.register("featureunselected", targetLayer, selected);

            me.modifyControl = geom ? 
                                new OpenLayers.Control.ModifyFeature(targetLayer, {clickout: false,toggle: false ,createVertices: true}) : 
                                new OpenLayers.Control.DrawFeature(targetLayer, OpenLayers.Handler.Polygon);

            targetLayer.events.on({
                "featureadded": function(event) {
                    me.modifyControl.deactivate();
                    me.tbar.items.items[3].enable();
                    me.tbar.items.items[2].enable();  
                    me.tbar.items.items[1].enable();  
                    me.tbar.items.items[0].toggle(false);
                    me.tbar.items.items[2].toggle(true);
                    selectionModel.unlock();                   
                    me.enableTools();   
                },                                
                "beforefeatureadded": function(event) {
                    //alert("beforefeatureadded");  
                }
            });
                                    
            map.addControl(me.modifyControl);
            if(geom) {
                me.modifyControl.mode = OpenLayers.Control.ModifyFeature.RESHAPE;
            }
            
            me.modifyControl.activate();
            
            var selectFeature = targetLayer.getFeaturesByAttribute("id",record.get("fid"));
            
            if(geom) {
                me.modifyControl.selectFeature(selectFeature[0]);                    
            
                //perform ZoomAction
                var geometry = me.getGeometry(record.data.feature.geometry,actionConf.sourceSRS);
                me.oldExtent = map.getExtent();
                map.zoomToExtent(geometry.getBounds());
            } else {
                me.oldExtent = null;
            }
        
        }else{
            button.toggle(false);
            Ext.Msg.show({
                title: "Editing Bersaglio",
                buttons: Ext.Msg.OK,
                msg: "Devi selezionare solamente un Bersaglio!!!",
                icon: Ext.MessageBox.INFO,
                scope: this
            });             
        }
        
    },

    
    /* private: method[getStartEditTargetsGeomAction]
        
    getStartEditTargetsGeomAction: function(actionConf){
        var sourceSRS=actionConf.sourceSRS;
        var me= this;
        
        var record;
        //var targetLayer;
        return {
            xtype: 'actioncolumn',
            sortable : false, 
            width: 30,           
            items: [{
                icon   : this.startEditGeomToIconPath,  
                tooltip: this.startEditGeomToTooltip,
                scope: this,
                handler: this.editTargetGeometry.createDelegate(this, [actionConf], 0)
            },"-",{
                icon   : this.stopEditGeomToIconPath,  
                tooltip: this.stopEditGeomToTooltip,
                scope: this,
                handler: function(grid, rowIndex, colIndex) {
                
                    record = grid.getStore().getAt(rowIndex);

                    var selectionModel = grid.getSelectionModel();
                    selectionModel.unlock();
                    var simulationStyleChanged= {
                        strokeColor: "#FFFF00",
                        strokeWidth: 3,
                        fillColor: "#FFFF00",
                        fillOpacity: 0.5
                    };
                    var simulationStyleAdded= {
                        strokeColor: "#00FF00",
                        strokeWidth: 3,
                        fillColor: "#00FF00",
                        fillOpacity: 0.5
                    };
                    var oldRow = selectionModel.getSelected();
                    if(oldRow && oldRow.get("fid") != record.get("fid")){                        
                        //alert("vuoi salvare?");
                        me.removeGeometry(actionConf.layerName, oldRow.get("fid"));
                        me.removeGeometry(actionConf.layerName, record.get("fid"));                                       
                        me.modifyControl.deactivate();
                        //return;
                    }else{
                        if(me.modifyControl){
                        me.modifyControl.deactivate();
                        
                        var map = this.target.mapPanel.map;
                                                                               
                        var layerStyle= {
                            strokeColor: "#FF0000",
                            strokeWidth: 3,
                            fillColor: "#00FFFF",
                            fillOpacity: 0.8
                        };
                        
                        targetLayer = map.getLayersByName(actionConf.layerName)[0];
                        //targetLayer = me.displayEditGeometry(actionConf.layerName, 
                        //    record.get("fid"),
                        //    geom, layerStyle);
                            
                        var originSelectionModel = me.wfsGrid.getSelectionModel();
                            //var record1 = originSelectionModel.getSelected();
                        var destSRS = map.getProjectionObject();
                            
                            if(targetLayer.features[0]){
                        var geometry = me.getGeometryEdit(targetLayer.features[0].geometry,sourceSRS,destSRS.projCode);
                                //record1.data.feature.geometry = geometry;   

                        selectionModel.clearSelections(false);
                                
                        //selectionModel.selectRow( rowIndex, false );
                        var checkEqualGeom = geometry.equals(me.currentRecord.geometry);
                        if(!checkEqualGeom){
                            me.currentRecord.geometry = geometry;
                            me.save[me.currentRecord.id] = me.currentRecord;
                            me.persistEditGeometry(me.currentRecord.newfeature ? "Bersagli aggiunti" : "Bersagli modificati", //"simulation_added" : "simulation_changed", 
                            record.get("fid"), 
                            targetLayer.features[0].geometry, me.currentRecord.newfeature ? simulationStyleAdded : simulationStyleChanged);
                        }
                                                        
                        
                        me.removeGeometry(actionConf.layerName, record.get("fid"));
                        if(me.oldExtent) {
                            map.zoomToExtent(me.oldExtent);
                        }
                            }
                        }
                        
                    }
                    
                }
            },"-",{
                icon   : this.resetEditGeomToIconPath,  
                tooltip: this.resetEditGeomToTooltip,
                scope: this,
                handler: function(){
                
                    var map = this.target.mapPanel.map;
                    var targetLayer = map.getLayersByName(actionConf.layerName)[0];
                    targetLayer.removeAllFeatures();

                }
            }]  
        };
    }, */    
                
	
	transformCollection: function(coll, sourceProjection, destProjection) {
		// workaround to make transform consider towgs84 params
		var epsg4326 = new OpenLayers.Projection('EPSG:4326');
		coll = coll.transform(
			sourceProjection,
			epsg4326
		);
		return coll.transform(
			epsg4326,
			destProjection													
		);	
	},
	
    getGeometry: function(rec, sourceSRS){
        var map = this.target.mapPanel.map;
        //var geometry = rec.data.feature.geometry;
        var geometry = rec;
        if(geometry && sourceSRS) {
            if(sourceSRS != map.getProjection()){
                var coll=new OpenLayers.Geometry.Collection(new Array(geometry.clone()));
				
                var targetColl = this.transformCollection(
					coll, 
					new OpenLayers.Projection(sourceSRS),
					map.getProjectionObject()
				);
				
                geometry = targetColl.components[0];   
            }
        }
        return geometry;
    },
    
    getGeometryEdit: function(rec, sourceSRS, destSRS){
        var map = this.target.mapPanel.map;
        var geometry = rec;
        
        if(sourceSRS)
            if(sourceSRS != map.getProjection()){
                var coll=new OpenLayers.Geometry.Collection(new Array(geometry.clone()));
                var targetColl = this.transformCollection(
					coll, 
					new OpenLayers.Projection(destSRS),
                    new OpenLayers.Projection(sourceSRS)
				);
				
                geometry = targetColl.components[0];   
                delete targetColl;
            }
        return geometry;
    },    

    displayEditGeometry: function(layerName, id, geometry, style ){ //"Bersaglio Selezionato"
        var map = this.target.mapPanel.map;
        var targetLayer = map.getLayersByName(layerName)[0];
        if(targetLayer) {
             map.removeLayer(targetLayer);
        }
        var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
        renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;       
                
        var layerStyle= style || {
            strokeColor: "#FF00FF",
            strokeWidth: 2,
            fillColor: "#FF00FF",
            fillOpacity: 0.8
        };
                                
        targetLayer = new OpenLayers.Layer.Vector(layerName,{
            displayInLayerSwitcher: false,
            style: layerStyle,
            renderers: renderer
        });
			
        map.addLayer(targetLayer);
        
        if(geometry) {
            var feature = new OpenLayers.Feature.Vector(geometry,{
                "id": id
            });
            if(targetLayer.features.length == 0){
                targetLayer.addFeatures([feature]);
            }else{
                var oldFeature = targetLayer.getFeaturesByAttribute("id",id);
                if(!oldFeature.length){
                    targetLayer.addFeatures([feature]);
                }
            }
        }
        return targetLayer;
    },
    
    persistEditGeometry: function(layerName, id, geometry, style ){ //"Bersaglio Selezionato"
        var map = this.target.mapPanel.map;
        var targetLayer = map.getLayersByName(layerName)[0];
        
        var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
        renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;       
                
        var layerStyle= style || {
            strokeColor: "#FF00FF",
            strokeWidth: 2,
            fillColor: "#FF00FF",
            fillOpacity: 0.8
        };
        if(!targetLayer) {
             targetLayer = new OpenLayers.Layer.Vector(layerName,{
                //displayInLayerSwitcher: layerName === "simulation_removed" ? false : true, //per visualizzare le features editate dall'utente
                //displayInLayerSwitcher: true, //per visualizzare le features editate dall'utente
                displayInLayerSwitcher: false,
                style: layerStyle,
                renderers: renderer
            });
                
            map.addLayer(targetLayer);
        }                
        
        
        if(geometry) {
            var feature = new OpenLayers.Feature.Vector(geometry,{
                "id": id
            });
            if(targetLayer.features.length == 0){
                targetLayer.addFeatures([feature]);
            }else{
                var oldFeature = targetLayer.getFeaturesByAttribute("id",id);
                if(oldFeature.length > 0){
                    targetLayer.removeFeatures(oldFeature);
                }
                targetLayer.addFeatures([feature]);
            }
        }
        return targetLayer;
    },
    
    removeEditGeometry: function(layerName, id){
        var map = this.target.mapPanel.map;
        var targetLayer = map.getLayersByName(layerName)[0];
        var unSelectFeatures= targetLayer.getFeaturesByAttribute("id", id);
        targetLayer.removeFeatures(unSelectFeatures); 
    },
    
    displayGeometry: function(layerName, id, geometry, style ){ //"Bersaglio Selezionato"
        var map = this.target.mapPanel.map;
        var targetLayer = map.getLayersByName(layerName)[0];
        
        var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
        renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;       
        
        if(!targetLayer){
            var layerStyle= style || {
                strokeColor: "#FF00FF",
                strokeWidth: 2,
                fillColor: "#FF00FF",
                fillOpacity: 0.8
            };
                                    
            targetLayer = new OpenLayers.Layer.Vector(layerName,{
                displayInLayerSwitcher: false,
                style: layerStyle,
                renderers: renderer
            });
			
            map.addLayer(targetLayer);
        }
        if(geometry) {
            var feature = new OpenLayers.Feature.Vector(geometry,{
                "id": id
            });
            targetLayer.addFeatures([feature]);	   
        }
        return targetLayer;
    },
    
    removeGeometry: function(layerName, id){
        var map = this.target.mapPanel.map;
        var targetLayer = map.getLayersByName(layerName)[0];
        if(targetLayer) {
            var unSelectFeatures= targetLayer.getFeaturesByAttribute("id", id);
            targetLayer.removeFeatures(unSelectFeatures); 
        }
    },
    
    

    /** private: method[getDeleteAction]
     */
    getDeleteAction: function(actionConf){
        var idAtt= actionConf.idAttribute || "fid";
        var layerNameAtt= actionConf.layerNameAttribute || "layerName";
        var wsAtt= actionConf.wsNameAttribute || "wsName";
  
        var me=this;
        return {
            xtype: 'actioncolumn',
            sortable : false, 
            width: 10,
            items: [{
                icon   : me.deleteIconPath,  
                tooltip: me.deleteTooltip,
                scope: me,
                handler: function(gpanel, rowIndex, colIndex) {
                    var store = gpanel.getStore();	
                    var record = store.getAt(rowIndex);
                    // var map = me.target.mapPanel.map;
                    var mapPanel=me.target.mapPanel;
                    var layerName= record.get(wsAtt) + ":" + record.get(layerNameAtt);
                    Ext.MessageBox.confirm(me.deleteTooltip, 
                        me.deleteConfirmMsg, 
                        function showResult(btn){

                            if(btn=="yes"){
                                var fidFilter=new OpenLayers.Filter.FeatureId({
                                    fids:[record.get(idAtt)]
                                });
                                    
                                var deleteProtocol = new OpenLayers.Protocol.WFS({ 
                                    url: me.wfsURL, 
                                    featureType: me.featureType, 
                                    readOptions: {
                                        output: "object"
                                    },
                                    featureNS: me.featureNS, 
                                    filter: me.filter,
                                    outputFormat: "application/json",
                                    srsName: me.srsName,
                                    version: me.version
                                });
                                   
                                   
                                deleteProtocol.filterDelete(fidFilter, {
                                    callback: function(resp){
                                        var layers = mapPanel.layers;
                                        layers.data.each(function(record, index, totalItems ) {
                                                    
                                            if(record.get('name') == layerName){
                                                layers.remove(record);
                                            }
                                        }); 
                                        me.refresh();
                                    }
                                });  
                            }
                        });
                }
            }]
        };
    },
    
    setFilter: function(filter){
        this.filter=filter;
        this.setPage(1);
    },
    
    update: function (filter, viewParams){
        this.filter=filter;
        this.viewParams=viewParams;
        this.setPage(1);
    },
    

    setAutoRefresh: function(ms){
        var me=this;  
        this.autoRefreshInterval=setInterval(
            function() { 
                me.refresh()
            }, ms);  
    },
    
    
    clearAutoRefresh: function(){
        if(this.autoRefreshInterval)
            clearInterval(this.autoRefreshInterval);
    },
    
    resetFilter: function(){
        this.filter=null;
        this.setPage(1);
    },


    refresh: function(){
        var pagID= this.id+"_paging"; 
        this.setTotalRecord(function(){
            var paging=Ext.getCmp(pagID);
            paging.doRefresh();
        });
    },
    
    getProtocol: function(params, format){
        var protocol;
        if(this.viewParams || this.protocolType== "GET"){
            var otherParams=""; 
            if(params){
                otherParams+= params.limit ? "&maxFeatures="+params.limit :"";
                otherParams+= params.start ? "&startIndex="+params.start :"";
                otherParams+= params.resultType ? "&resultType="+params.resultType :"";     
            } 
            if(this.filter){
                var filterFormat = new OpenLayers.Format.Filter();
                otherParams+="&filter="+  filterFormat.write(this.filter);
            }
           
            otherParams+= this.sortAttribute ? "&sortBy="+this.sortAttribute :"";
            otherParams+= this.viewParams ? "&viewParams="+encodeURIComponent(this.viewParams) : "";
            otherParams+= this.outputFormat ? "&outputFormat="+this.outputFormat : "&outputFormat=json";
           
            
           
            protocol= new OpenLayers.Protocol.HTTP({
                url: this.wfsURL+"?service=WFS"
                +"&version="+this.version
                +"&request=GetFeature"
                +"&typeName="+this.featureType                
                +"&srs="+this.srsName
                +otherParams,
                format: new OpenLayers.Format.GeoJSON()
            }); 
        }else{
            protocol= new GeoExt.data.ProtocolProxy({ 
                protocol: new OpenLayers.Protocol.WFS({ 
                    url: this.wfsURL, 
                    featureType: this.featureType, 
                    readFormat: new OpenLayers.Format.GeoJSON(),
                    featureNS: this.featureNS, 
                    filter: this.filter,
                    viewparams: this.viewParams,
                    outputFormat: "application/json",
                    srsName: this.srsName,
                    version: this.version
                })
            }); 
            if(params){
                protocol.sortBy= params.sortBy ? params.sortBy : null;
                protocol.maxFeatures= params.limit ? params.limit : null;
                protocol.startIndex= params.start ? params.start : null;
                protocol.resultType= params.resultType ? params.resultType : null;
            }         
        }
        
        return protocol;
    },
    
    setPage: function(pageNumber){
        var pagID= this.id+"_paging"; 
        this.setTotalRecord(function(){
            var paging=Ext.getCmp(pagID);
            paging.changePage(pageNumber);
        }); 
    },

    /** api: method[addOutput]
     */
    addOutput: function(config, activate) {
        var me= this;
        this.wfsColumns= new Array();
        
        if(me.actionColumns){
            for( var kk=0; kk<me.actionColumns.length; kk++){
                switch (me.actionColumns[kk].type){
                    case "addLayer":
                        me.wfsColumns.push(me.getAddLayerAction(me.actionColumns[kk]));
                        break;
                    case "details":
                        me.wfsColumns.push(me.getDetailsAction(me.actionColumns[kk]));
                        break;  
                    case "delete":
                        me.wfsColumns.push(me.getDeleteAction(me.actionColumns[kk]));
                        break;  
                    case "zoom":
                        me.wfsColumns.push(me.getZoomAction(me.actionColumns[kk]));
                        break;
                    case "startedit":
                        me.wfsColumns.push(me.getStartEditAction(me.actionColumns[kk]));
                        break;
                    /*case "startedit_targets":
                        me.wfsColumns.push(me.getStartEditTargetsAction(me.actionColumns[kk]));
                        break;
                    case "starteditgeom_targets":
                        me.wfsColumns.push(me.getStartEditTargetsGeomAction(me.actionColumns[kk]));
                        break;  */                      
                    case "remove_target":
                        me.wfsColumns.push(me.getRemoveTargetAction(me.actionColumns[kk]));
                        break;                        
                    case "stopedit":
                        me.wfsColumns.push(me.getStopEditAction(me.actionColumns[kk]));
                        break;                        
                    case "checkDisplay":
                        var checkModel=me.getCheckDisplayAction(me.actionColumns[kk]);
                        this.sm= checkModel;
                        me.wfsColumns.push(checkModel);
                        break;   
                }
            }
        }
         
        var bbar;
        
        if(!this.noPaging) {
            bbar = new Ext.PagingToolbar({
                pageSize: this.pageSize,
                wfsParam: this,
                id: this.id+"_paging",
                store: [],
                displayInfo: true,
                listeners: {
                    render: function(){
                        //this.last.setVisible(false);
                       
                    },
                    "beforechange": function(paging,params){
                        paging.store.removeAll(true);
                        paging.store.proxy=new GeoExt.data.ProtocolProxy({ 
                            protocol:
                            me.getProtocol({
                                limit: params.limit,
                                start:  params.start
                            })
                        });
                    }          
                                
                },
                displayMsg: this.displayMsgPaging,
                emptyMsg: this.emptyMsg
            });
        }
        
        var totalHandler = function(total, callback){
            if(parseInt(total,10) > 0 || (me.extraRecords && me.extraRecords.length > 0)) {
                me.loadFeatureFields(function(){
                    if(me.columns){
                        for(kk=0; kk<me.columns.length; kk++){
                            var column = {};
                            Ext.apply(column, me.columns[kk]);
                            if(column.header instanceof Array) {
                                column.header = column.header[GeoExt.Lang.getLocaleIndex()];
                            }
                            if(column.editable) {
                                column.editor = new Ext.form.NumberField();
                            }
                            me.wfsColumns.push(column);
                        }
                    }else{
                        for(kk=0; kk<me.featureFields.length; kk++){
                            me.wfsColumns.push({
                                header: me.featureFields[kk].name, 
                                dataIndex: me.featureFields[kk].name,
                                sortable: true
                            });
                        }
                    } 
                    
                    for(kk=0; kk<me.featureFields.length; kk++){
                        me.featureFields[kk].mapping = me.featureFields[kk].mapping.replace('${locale}', GeoExt.Lang.locale);                             
                    }
                    
                    new GeoExt.data.FeatureStore({ 
                        wfsParam: me,
                        //sortInfo: {field: "runEnd", direction: "DESC"},
                        id: this.id+"_store",
                        fields: me.featureFields,
                        listeners:{
                            beforeload: function(store){

                                if(me.loadMask && me.loadMask.el && me.loadMask.el.dom)
                                    me.loadMask.show(); 
                                
                                me.wfsGrid.reconfigure(
                                    store, 
                                    new Ext.grid.ColumnModel({
                                        columns: me.wfsColumns
                                    })
                                    );
                                if(me.wfsGrid.getBottomToolbar() && me.wfsGrid.getBottomToolbar().bind) {
                                    me.wfsGrid.getBottomToolbar().bind(store);
                                }
                            },
                            load : function(store){
                                 if(me.loadMask)
                                 me.loadMask.hide(); 
                            },
                            
                            exception : function(store){
                                if(me.loadMask && me.loadMask.el && me.loadMask.el.dom)
                                me.loadMask.hide(); 
                            }
                        },
                        loadRecords : function(o, options, success){     
                            if (this.isDestroyed === true) {
                                return;
                            }
                                    
                            if(!o || success === false){
                                if(success !== false){
                                    this.fireEvent('load', this, [], options);
                                }
                                if(options.callback){
                                    options.callback.call(options.scope || this, [], options, false, o);
                                }
                                return;
                            }
                            o.totalRecords = me.countFeature;
                            
                            var r = o.records, t = o.totalRecords || r.length;
                            if(!options || options.add !== true){
                                if(this.pruneModifiedRecords){
                                    this.modified = [];
                                }
                                
                                var finalRecords = [];
                                for(var i = 0, len = r.length; i < len; i++){
                                    var add = true;
                                    if(me.extraRecords && me.extraRecords.length > 0) {
                                        for(var j = 0, lenextra = me.extraRecords.length; j < lenextra; j++){
                                            var extraRecord = me.extraRecords[j];
                                            if(extraRecord.id === r[i].get("id")) {
                                                if(extraRecord.removed) {
                                                    add = false;
                                                } else {
                                                    // changed
                                                    r[i].data.feature.geometry = extraRecord.geometry;
                                                    r[i].set("value", extraRecord.value);                                                    
                                                }
                                            }
                                        }
                                    }
                                    if(add) {
                                        r[i].join(this);
                                        finalRecords.push(r[i]);
                                    }
                                }
                                if(!options || !options.params || !options.params.start || options.params.start === 0) {
                                    // add new records only to the first page
                                    if(me.extraRecords && me.extraRecords.length > 0) {
                                        for(var j = 0, lenextra = me.extraRecords.length; j < lenextra; j++){
                                            var extraRecord = me.extraRecords[j];
                                            if(extraRecord.newfeature) {
                                                var recordType = me.wfsGrid.getStore().recordType;
                                                var newRecord = new recordType({                                                    
                                                    "geometry": "",
                                                    "id": extraRecord.id,
                                                    "fid": extraRecord.id,
                                                    "feature": {
                                                        "geometry": extraRecord.geometry
                                                    },
                                                    "value": extraRecord.value
                                                });
                                                finalRecords.push(newRecord);
                                            }
                                        }
                                    }
                                }
                                        
                                if(this.snapshot){
                                    this.data = this.snapshot;
                                    delete this.snapshot;
                                }
                                        
                                this.clearData();
                                this.data.addAll(finalRecords);   
                                this.totalLength = t;       
                                //this.applySort();
                                this.fireEvent('datachanged', this);
                                
                            }else{
                                        
                                this.totalLength = Math.max(t, this.data.length+r.length);
                                this.add(r);
                            }
                                    
                            this.fireEvent('load', this, r, options);
                            if(options.callback){
                                options.callback.call(options.scope || this, r, options, true);
                            }
                            if(callback) {
                                callback.call();
                            }
                        },
                        proxy: new GeoExt.data.ProtocolProxy({ 
                            protocol: 
                            me.getProtocol({
                                limit: me.noPaging ? 1000 : me.pageSize,
                                start:  0
                            })
                        }), 
                        autoLoad: true 
                    });
          
                }
                );
            } else if(me.onEmpty){
                me.isEmpty = true;
                me.onEmpty.call(null, me);
            }
            
         };
 
        
        var disableTools = function(){
            var disabledItems = [];
            this.app.toolbar.items.each(function(item) {
                if (!item.disabled) {
                    disabledItems.push(item);
                }
            });
            
            // For every enabled tool in the toolbar, toggle the button off (deactivating the tool)
            // Then add a listener on 'click' and 'menushow' to reset the BBoxQueryForm to disable all active tools
            for (var i = 0;i<disabledItems.length;i++){
                if(disabledItems[i].toggleGroup){
                    if(disabledItems[i].scope && disabledItems[i].scope.actions){
                        for(var a = 0;a<disabledItems[i].scope.actions.length;a++){
                            //disabledItems[i].scope.actions[a].toggle(false);
                            disabledItems[i].scope.actions[a].disable();
                            
                            if (disabledItems[i].scope.actions[a].menu){
                                for(var b = 0;b<disabledItems[i].scope.actions[a].menu.items.items.length;b++){
                                    disabledItems[i].scope.actions[a].menu.items.items[b].disable();
                                }
                            }

                            disabledItems[i].scope.actions[a].on({
                                "click": function(evt) {
                                     if (me.modifyControl) {me.modifyControl.deactivate();};
                                     // TODO 'Circle' and 'Poligon' tool have no other visual way to display
                                     // their statuses (active, not active), apart from the combobox
                                     // The clearValue() is intended to tell user that the tool is not enabled
                                     //me.output[0].outputType.clearValue();

                                },
                                "menushow": function(evt) {
                                    var menuItems = evt.menu.items.items;
                                    for (var i = 0;i<menuItems.length;i++){
                                        menuItems[i].enable();
                                    }
                                     if (me.modifyControl) {me.modifyControl.deactivate();};
                                     //me.output[0].outputType.clearValue();
                                },
                                scope: this
                            });
                        }
                    }                    
                }
            } 
        }         
        
        var addNewTarget = function() {
            
            disableTools();
            
            var store = wfsGridPanel.getStore();
            var record = new store.recordType({
                "geometry": "",
                "new": true,
                "id": Ext.id(null, "new"),
                "fid": Ext.id(null, "fid"),
                "feature": {
                    "geometry": null
                },
                "value": 0
            });
            store.insert(0, record);
            
            var selectionModel = wfsGridPanel.getSelectionModel();
            selectionModel.unlock();
            selectionModel.clearSelections(false);
            selectionModel.selectRow( 0, false );
            
            selectionModel.lock();
             
            me.editTargetGeometry({layerName:"Bersaglio Selezionato Editing",sourceSRS:'EPSG:32632'}, wfsGridPanel, 0, 0, true);
        }
        
        /*if(this.allowAdd) {
            bbar = new Ext.Toolbar({
                items:[{
                    icon   : this.addIconPath,  
                    tooltip: this.addTooltip,
                    toggleGroup: "pippo",
                    scope: this,
                    handler: function() {
                        if(me.isEmpty) {                            
                            me.isEmpty = false;
                            if(me.onFill) {
                                me.onFill.call(null, me);
                            }
                            totalHandler(1, addNewTarget);
                        } else {
                            addNewTarget();
                        }
                    }

                }]
            });
        }*/
        
        if(this.allowEdit) {
            this.tbar = new Ext.Toolbar({
                id: this.id+"_toolbar",
                name: "editToolbar",
                items:[{
                    icon   : this.addIconPath,  
                    xtype: 'button',
                    tooltip: this.addTooltip,
                    text: this.addTooltip,
                    toggleGroup: "toolGroup",
                    enableToggle: true,
                    allowDepress: false,
                    scope: this,
                    toggleHandler: function(button, pressed) {
                        if (pressed) {
                            if(me.isEmpty) {                            
                                me.isEmpty = false;
                                if(me.onFill) {
                                    me.onFill.call(null, me);
                                }
                                totalHandler(1, addNewTarget);
                            } else {
                                addNewTarget();
                            }
                        }
                    }
                },{
                    icon   : this.startEditGeomToIconPath,  
                    xtype: 'button',
                    tooltip: this.startEditGeomToTooltip,
                    text: this.startEditGeomToTooltip,
                    toggleGroup: "toolGroup",
                    enableToggle: true,
                    allowDepress: false,
                    disabled: true,
                    scope: this,
                    toggleHandler: function(button, pressed) {
                        var stopButton = Ext.getCmp("stopEditButtonId");                    
                        if (pressed) {
                            disableTools();
                            
                            var grid = me.wfsGrid;
                            //grid.disable();
                            var addGeom = grid.getTopToolbar().items.items[0];
                            var editGeom = grid.getTopToolbar().items.items[1];
                            
                            //editToolbar.enable();
               
                            var removeGeometryColumn = me.wfsGrid.colModel.columns[2];
                            
                            this.editTargetGeometry.createDelegate(this, [{layerName:this.layerEditName,sourceSRS:this.sourceEditSRS},button], 0).call();
                        }else{
                            this.enableTools();
                        }
                    }                    
                },{
                    icon   : this.stopEditGeomToIconPath,  
                    xtype: 'button',
                    tooltip: this.stopEditGeomToTooltip,
                    text: this.stopEditGeomToTooltip,
                    toggleGroup: "toolGroup",
                    enableToggle: false,
                    allowDepress: true,
                    disabled: true,
                    pressed : false,
                    scope: this,
                    toggleHandler: function(button, pressed) {
                        var me = this;                    
                        if (pressed && me.modifyControl) {

                            var record;
                            var grid = wfsGridPanel;
                            var actionConf = {};
                            actionConf.layerName = me.layerEditName;
                            actionConf.sourceSRS = me.sourceEditSRS;

                            var selectionModel = grid.getSelectionModel();
                            var selection = selectionModel.getSelected();
                            record = selection;

                            selectionModel.unlock();
                            var simulationStyleChanged= {
                                strokeColor: "#FFFF00",
                                strokeWidth: 3,
                                fillColor: "#FFFF00",
                                fillOpacity: 0.5
                            };
                            var simulationStyleAdded= {
                                strokeColor: "#00FF00",
                                strokeWidth: 3,
                                fillColor: "#00FF00",
                                fillOpacity: 0.5
                            };
                            var oldRow = selectionModel.getSelected();
                            if(oldRow && oldRow.get("fid") != record.get("fid")){                        
                                //alert("vuoi salvare?");
                                me.removeGeometry(actionConf.layerName, oldRow.get("fid"));
                                me.removeGeometry(actionConf.layerName, record.get("fid"));                                       
                                me.modifyControl.deactivate();
                                //return;
                            }else{
                                if(me.modifyControl){
                                me.modifyControl.deactivate();
                                
                                var map = this.target.mapPanel.map;
                                                                                       
                                var layerStyle= {
                                    strokeColor: "#FF0000",
                                    strokeWidth: 3,
                                    fillColor: "#00FFFF",
                                    fillOpacity: 0.8
                                };
                                
                                targetLayer = map.getLayersByName(actionConf.layerName)[0];
                                /*targetLayer = me.displayEditGeometry(actionConf.layerName, 
                                    record.get("fid"),
                                    geom, layerStyle);*/
                                    
                                var originSelectionModel = me.wfsGrid.getSelectionModel();
                                    //var record1 = originSelectionModel.getSelected();
                                var destSRS = map.getProjectionObject();
                                    
                                    if(targetLayer.features[0]){
                                        var geometry = me.getGeometryEdit(targetLayer.features[0].geometry,actionConf.sourceSRS,destSRS.projCode);
                                                //record1.data.feature.geometry = geometry;   

                                        selectionModel.clearSelections(false);
                                                
                                        //selectionModel.selectRow( rowIndex, false );
                                        var checkEqualGeom = geometry.equals(me.currentRecord.geometry);
                                        if(!checkEqualGeom){
                                            me.currentRecord.geometry = geometry;
                                            me.save[me.currentRecord.id] = me.currentRecord;
                                            me.persistEditGeometry(me.currentRecord.newfeature ? "Bersagli aggiunti" : "Bersagli modificati", //"simulation_added" : "simulation_changed", 
                                            record.get("fid"), 
                                            targetLayer.features[0].geometry, me.currentRecord.newfeature ? simulationStyleAdded : simulationStyleChanged);
                                            
                                            //perform geometry substitution
                                            record.setFeature(me.currentRecord);
                                            
                                            //check targets type ambientale
                                            var targetType = me.type;
                                            
                                            // update superficie
                                            if (targetType === "ambientale"){
                                                var areaGeom = me.getArea(record.data.feature.geometry);
                                                record.set("value",Math.round10(areaGeom,-2));
                                            }
                                            
                                            var redrawLayer = map.getLayersByName(me.currentRecord.newfeature ? "Bersagli aggiunti" : "Bersagli modificati")[0];
                                            redrawLayer.redraw();

                                        }                        
                                        
                                        me.removeGeometry(actionConf.layerName, record.get("fid"));
                                        
                                        if(me.oldExtent) {
                                            map.zoomToExtent(me.oldExtent);
                                        }
                                    }
                                }                                
                            }
                            
                            this.tbar.items.items[2].toggle();  
                            this.tbar.items.items[2].disable();  
                            this.tbar.items.items[3].disable();                            
                            this.tbar.items.items[0].enable();
                            this.tbar.items.items[1].disable();
                            
                        }
                    }
                },{
                icon   : this.resetEditGeomToIconPath,  
                tooltip: this.resetEditGeomToTooltip,
                text: this.resetEditGeomToTooltip,
                disabled: true,
                pressed : false,
                scope: this,
                handler: function(){
                    var me = this;
                    var actionConf = {};
                    actionConf.layerName = me.layerEditName;
                    actionConf.sourceSRS = me.sourceEditSRS;                
                    var map = this.target.mapPanel.map;
                    var targetLayer = map.getLayersByName(actionConf.layerName)[0];
                    targetLayer.removeAllFeatures();
                    
                    this.tbar.items.items[2].toggle(false);  
                    this.tbar.items.items[2].disable();                     
                    this.tbar.items.items[1].toggle(false);  
                    this.tbar.items.items[3].disable();                      
                    this.tbar.items.items[0].enable();
                    
                    var grid = wfsGridPanel;

                    var selectionModel = grid.getSelectionModel();

                    selectionModel.unlock();                    

                }
            }]
            });
        }
        
        var wfsGridPanel=new Ext.grid.EditorGridPanel({ 
            title: this.title, 
            store: [], 
            id: this.id,
            layout: "fit",
            hideMode: "offsets",
            viewConfig : {
                forceFit: true
            },
            listeners: {
                render: function(grid){
                    if(me.loadMsg){
                       me.loadMask = new Ext.LoadMask(grid.getEl(), {msg:me.loadMsg});
                    }
                    
                }
            },     
            sm: this.sm,
            colModel: new Ext.grid.ColumnModel({
                columns: []
            }),
            tbar: this.tbar,
            bbar: bbar,
            scope: this,
            listeners: {
                afteredit : function(object) {
                    row = object.row;
                    unitGrid = Ext.getCmp(this.id);
                    rowview = unitGrid.getView().getRow(row);
                    changecss = Ext.get(rowview);
                    changecss.addClass('change-row');
                    
                    var id = object.record.get("id");
                    var currentRecord = me.save[id];
                    if(!currentRecord) {
                        currentRecord = {
                            id: id,
                            value: object.value,
                            newfeature: object.record.data["new"] || false,
                            oldvalue: object.originalValue,
                            geometry: object.record.data.feature.geometry,
                            oldgeometry: object.record.data.feature.geometry
                        };
                        me.save[id] = currentRecord;
                    }
                    
                    currentRecord.value = object.value;
                }
            }    
        }); 

        config = Ext.apply(wfsGridPanel, config || {});
        
        this.wfsGrid = gxp.plugins.WFSGrid.superclass.addOutput.call(this, config);
        
        
        this.wfsGrid.on('activate', function() {            
            if(this.data) {
                this.loadData();
            } else {
                this.setTotalRecord(totalHandler);
            }
        }, this, {single: true});
        
        return this.wfsGrid;
    },
    loadData: function() {
        var store = new GeoExt.data.FeatureStore({ 
            //wfsParam: me,
            //sortInfo: {field: "runEnd", direction: "DESC"},
            id: this.id+"_store",
            fields: this.featureFields
                
            
        });
        
        if(this.columns){
            for(kk=0; kk<this.columns.length; kk++){
                var column = {};
                Ext.apply(column, this.columns[kk]);
                if(column.header instanceof Array) {
                    column.header = new Ext.XTemplate(column.header[GeoExt.Lang.getLocaleIndex()]).apply(this.tplData || {});
                }
                if(column.hidden && typeof column.hidden === 'string') {                    
                    column.hidden = (new Ext.XTemplate(column.hidden).apply(this.tplData || {})) === "true";
                }
                this.wfsColumns.push(column);
            }
        }
        
        this.wfsGrid.reconfigure(
            store, 
            new Ext.grid.ColumnModel({
                columns: this.wfsColumns
            })
        );
        if(this.wfsGrid.getBottomToolbar()) {
            this.wfsGrid.getBottomToolbar().bind(store);   
        }
        
        store.loadData(new OpenLayers.Format.GeoJSON().read(this.data));

    },

	/**
	 * Method: getArea
	 *
	 * Parameters:
	 * geometry - {<OpenLayers.Geometry>}
	 * units - {String} Unit abbreviation
	 *
	 * Returns:
	 * {Float} The geometry area in the given units.
	 */
	getArea : function(geometry, units) {
		var area, geomUnits;
		area = geometry.getArea();
		/*if(area > 0){
			area = geometry.getGeodesicArea(this.target.mapPanel.map.getProjectionObject());
			geomUnits = "m";

			var inPerDisplayUnit = OpenLayers.INCHES_PER_UNIT[units];
			if (inPerDisplayUnit) {
				var inPerMapUnit = OpenLayers.INCHES_PER_UNIT[geomUnits];
				area *= Math.pow((inPerMapUnit / inPerDisplayUnit), 2);
			}
		}*/
		return area;
	}
    
});

// Closure
(function () {

    /**
     * Decimal adjustment of a number.
     *
     * @param    {String}    type    The type of adjustment.
     * @param    {Number}    value    The number.
     * @param    {Integer}    exp        The exponent (the 10 logarithm of the adjustment base).
     * @returns    {Number}            The adjusted value.
     */
    function decimalAdjust(type, value, exp) {
        // If the exp is undefined or zero...
        if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // If the value is not a number or the exp is not an integer...
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
        }
        // Shift
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        // Shift back
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }

    // Decimal round
    if (!Math.round10) {
        Math.round10 = function (value, exp) {
            return decimalAdjust('round', value, exp);
        };
    }
    // Decimal floor
    if (!Math.floor10) {
        Math.floor10 = function (value, exp) {
            return decimalAdjust('floor', value, exp);
        };
    }
    // Decimal ceil
    if (!Math.ceil10) {
        Math.ceil10 = function (value, exp) {
            return decimalAdjust('ceil', value, exp);
        };
    }

})();

Ext.preg(gxp.plugins.WFSGrid.prototype.ptype, gxp.plugins.WFSGrid);

