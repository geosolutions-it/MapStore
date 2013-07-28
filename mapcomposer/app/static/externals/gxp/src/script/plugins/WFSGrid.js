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
    // end i18n
    

    /** private: countFeature
     *  ``Integer``
     */
    countFeature: null,
    
    featureFields: null,
    
    addLayerIconPath: "theme/app/img/silk/add.png",
    detailsIconPath: "theme/app/img/silk/information.png",
    deleteIconPath: "theme/app/img/silk/delete.png",
    zoomToIconPath: "theme/app/img/silk/map_magnify.png",
    startEditToIconPath: "theme/app/img/silk/table_edit.png",
  
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
                    var geometry = me.getGeometry(record,sourceSRS);
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
                    me.removeGeometry(actionConf.layerName, record.get("fid"));
                },
                rowselect: function(check, rowIndex, record) {
                    var geom = me.getGeometry(record,actionConf.sourceSRS);
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
    setEditGrid: function(record,colType,rowIndex){
        var me = this;
        var rowIndex = rowIndex;
        var fm = Ext.form;    
        
        var editor = new fm.TextField({
            allowBlank: false
        });            

        var listValues = record.substring(1,record.length-1);
        var arrayValues = listValues.split(",");
        
        var values = [];
        
        for (var i = 0;i<arrayValues.length;i++){
            values[values.length] = [i,arrayValues[i]];
        }        
        
        var store = new Ext.data.ArrayStore({
            storeId: 'store_'+colType,
            fields: ['layer','values'],
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
                    width: 20,
                    header: 'layer',
                    dataIndex: 'layer',
                    hidden: false
                },{
                    id: 'values',
                    header: 'values',
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
            items: [{
                icon   : this.startEditToIconPath,  
                tooltip: this.startEditToTooltip,
                scope: this,
                handler: function(grid, rowIndex, colIndex) {
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
                                var colRecord = grid.getStore().getAt(rowIndex).get('padr');
                                var padrGrid = me.setEditGrid(colRecord,colType,rowIndex);
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
                                var colRecord = grid.getStore().getAt(rowIndex).get('cff');
                                var cffGrid = me.setEditGrid(colRecord,colType,rowIndex);
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
                        width: 300,
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
                                    
                                    myTabs.items.each(function(i){
                                    
                                        if(i.items.items[0].getXType() != 'fieldset'){
                                            var store = i.items.items[0].getStore();
                                            var ccc = [];
                                            
                                            store.each(function(r) {
                                                ccc.push(r.get('values'));
                                            });
                                            var newString = "{" + ccc.join() + "}";
                                            
                                            var originSelectionModel = me.wfsGrid.getSelectionModel();
                                            var record = originSelectionModel.getSelected();
                                            record.set(i.title.toLowerCase(),newString);
                                        }else{
                                            var fieldValue = i.items.items[0].items.items[0].getValue();
                                            var originSelectionModel = me.wfsGrid.getSelectionModel();
                                            var record = originSelectionModel.getSelected();
                                            record.set(i.title.toLowerCase(),fieldValue);
                                        }
                                        
                                    });
                                    
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
                
		
    getGeometry: function(rec, sourceSRS){
        var map = this.target.mapPanel.map;
        var geometry = rec.data.feature.geometry;
        
        if(sourceSRS)
            if(sourceSRS != map.getProjection()){
                var coll=new OpenLayers.Geometry.Collection(new Array(geometry.clone()));
                var targetColl=coll.transform(
                    new OpenLayers.Projection(sourceSRS),
                    map.getProjectionObject()													
                    );	
                geometry = targetColl.components[0];   
                delete targetColl;
            }
        return geometry;
    },
    
    displayGeometry: function(layerName, id, geometry, style ){ //"Bersaglio Selezionato"
        var map = this.target.mapPanel.map;
        var targetLayer = map.getLayersByName(layerName)[0];
       
        if(!targetLayer){
            var layerStyle= style || {
                strokeColor: "#FF00FF",
                strokeWidth: 2,
                fillColor: "#FF00FF",
                fillOpacity: 0.8
            };
                                    
            targetLayer = new OpenLayers.Layer.Vector(layerName,{
                displayInLayerSwitcher: false,
                style: layerStyle
            });
			
            map.addLayer(targetLayer);
        }
        if(geometry) {
            var feature = new OpenLayers.Feature.Vector(geometry,{
                "id": id
            });
            targetLayer.addFeatures([feature]);	   
        } 
    },
    
    removeGeometry: function(layerName, id){
        var map = this.target.mapPanel.map;
        var targetLayer = map.getLayersByName(layerName)[0];
        var unSelectFeatures= targetLayer.getFeaturesByAttribute("id", id);
        targetLayer.removeFeatures(unSelectFeatures); 
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
        
        var wfsGridPanel=new Ext.grid.EditorGridPanel({ 
            title: this.title, 
            store: [], 
            id: this.id,
            layout: "fit",
           
            viewConfig : {
                forceFit: true
            },
            listeners: {
                render: function(grid){
                    if(me.loadMsg){
                       me.loadMask = new Ext.LoadMask(grid.getEl(), {msg:me.loadMsg});
                       //me.loadMask.show();
                    }
                    
                }
            },     
            sm: this.sm,
            colModel: new Ext.grid.ColumnModel({
                columns: []
            }),
            bbar: bbar,
            scope: this,
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

        config = Ext.apply(wfsGridPanel, config || {});
        
        this.wfsGrid = gxp.plugins.WFSGrid.superclass.addOutput.call(this, config);
        
        var totalHandler = function(total){
            if(parseInt(total,10) > 0) {
                me.loadFeatureFields(function(){
                    if(me.columns){
                        for(kk=0; kk<me.columns.length; kk++){
                            var column = {};
                            Ext.apply(column, me.columns[kk]);
                            if(column.header instanceof Array) {
                                column.header = column.header[GeoExt.Lang.getLocaleIndex()];
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
                                if(me.wfsGrid.getBottomToolbar()) {
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
                                        
                                for(var i = 0, len = r.length; i < len; i++){
                                    r[i].join(this);
                                }
                                        
                                if(this.snapshot){
                                    this.data = this.snapshot;
                                    delete this.snapshot;
                                }
                                        
                                this.clearData();
                                this.data.addAll(r);   
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
                        },
                        proxy: new GeoExt.data.ProtocolProxy({ 
                            protocol: 
                            me.getProtocol({
                                limit: me.pageSize,
                                start:  0
                            })
                        }), 
                        autoLoad: true 
                    });
          
                }
                );	
            } else if(me.onEmpty){
                me.onEmpty.call(null, me);
            }
         };
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

    }
    
});

Ext.preg(gxp.plugins.WFSGrid.prototype.ptype, gxp.plugins.WFSGrid);

