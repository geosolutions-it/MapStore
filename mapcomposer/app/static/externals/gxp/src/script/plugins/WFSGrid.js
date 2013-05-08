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
           
            otherParams+= this.sortAttribute ? "&sort="+this.sortAttribute :"";
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
    addOutput: function(config) {
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
                    case "checkDisplay":
                        var checkModel=me.getCheckDisplayAction(me.actionColumns[kk]);
                        this.sm= checkModel;
                        me.wfsColumns.push(checkModel);
                        break;   
                }
            }
        }
         
        
        var wfsGridPanel=new Ext.grid.GridPanel({ 
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
            bbar: new Ext.PagingToolbar({
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
                            protocol: /*new OpenLayers.Protocol.WFS({ 
                                    url: this.wfsParam.wfsURL, 
                                    featureType: this.wfsParam.featureType, 
                                    readFormat: new OpenLayers.Format.GeoJSON(),
                                    featureNS: this.wfsParam.featureNS, 
                                    filter: this.wfsParam.filter,
                                    viewparams: this.viewParams,
                                    sortBy: {
                                        property: "runEnd",
                                        order: "DESC"
                                    },
                                    maxFeatures: params.limit,
                                    startIndex:  params.start,
                                    outputFormat: "application/json",
                                    srsName: this.wfsParam.srsName,
                                    version: this.wfsParam.version
                                })*/
                            me.getProtocol({
                                limit: params.limit,
                                start:  params.start
                            })
                        });
                    }          
                                
                },
                displayMsg: this.displayMsgPaging,
                emptyMsg: this.emptyMsg
            })
        }); 

        config = Ext.apply(wfsGridPanel, config || {});
        
        this.wfsGrid = gxp.plugins.WFSGrid.superclass.addOutput.call(this, config);
        
        this.setTotalRecord(function(total){
            if(parseInt(total,10) > 0) {
                me.loadFeatureFields(function(){
                    if(me.columns){
                        for(kk=0; kk<me.columns.length; kk++){
                            me.wfsColumns.push(me.columns[kk]);
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
                    
                    new GeoExt.data.FeatureStore({ 
                        wfsParam: me,
                        //sortInfo: {field: "runEnd", direction: "DESC"},
                        id: this.id+"_store",
                        fields: me.featureFields,
                        listeners:{
                            beforeload: function(store){

                                if(me.loadMask)
                                    me.loadMask.show(); 
                                
                                me.wfsGrid.reconfigure(
                                    store, 
                                    new Ext.grid.ColumnModel({
                                        columns: me.wfsColumns
                                    })
                                    );
                                me.wfsGrid.getBottomToolbar().bind(store);   
                            },
                            load : function(store){
                                 if(me.loadMask)
                                 me.loadMask.hide(); 
                            },
                            
                            exception : function(store){
                                if(me.loadMask)
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
                            protocol: /*new OpenLayers.Protocol.WFS({ 
                                    url: me.wfsURL, 
                                    featureType: me.featureType, 
                                    readFormat: new OpenLayers.Format.GeoJSON(),
                                    featureNS: me.featureNS, 
                                    filter: me.filter, 
                                    viewparams: me.viewParams,
                                    maxFeatures: me.pageSize,
                                    sortBy: {
                                        property: "runEnd",
                                        order: "DESC"
                                    },
                                    startIndex: 0,
                                    outputFormat: "application/json",
                                    srsName: me.srsName,
                                    version: me.version
                                })*/
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
         });   
        
 
        return this.wfsGrid;
    }  
});

Ext.preg(gxp.plugins.WFSGrid.prototype.ptype, gxp.plugins.WFSGrid);

