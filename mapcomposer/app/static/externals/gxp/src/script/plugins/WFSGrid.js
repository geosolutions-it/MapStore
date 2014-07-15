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
     *  featureType to load from the WFS service
     */
    featureType: null,    
    
    /** api: config[wfsURL]
     *  ``String``
     *  
     *  base URL of the WFS service
     */
    wfsURL: null,
        
    /** api: config[srsName]
     *  ``String``
     *  SRS used to query the WFS (for the output geometry)
     */
    srsName: "EPSG:4326",    
    
    /** api: config[filter]
     *  ``OpenLayers.Filter``
     *  Optional Filter used to extracts features.  
     *
     */
    filter: null,
    
    /** api: config[viewParams]
     *  ``String``
     *  Optional viewParams to contextualize Geoserver parametric sql views
     */
    viewParams: null, 

    /** api: config[version]
     *  ``String``
     *  WFS version to be used for requests.
     */
    version: "1.1.0",
    
    /** api: config[title]
     *  ``String``
     *  Optional title for the grid.
     */
    title: null,
     
    /** api: config[paging]
     *  ``Boolean``
     *  Create a paging grid.
     */
    paging: true,
     
    /** api: config[pageSize]
     *  ``Integer``
     *  Number of records per page shown in the grid.
     */
    pageSize: 10,
    
    /** api: config[autoRefreshInterval]
     *  ``Integer``
     *  Interval in milliseconds for the autorefresh functionality.
     */
    autoRefreshInterval: 10000,
        
    /** api: config[columns]
     *  ``Array Object``
     *  Explicitly configure grid columns to use (columns array of the Ext.Grid)
     */
    columns: null,
    
    /** api: config[fields]
     *  ``Array Object``
     *  Explicitly configure grid store fields to use (columns array of the Ext.Grid)
     */
    fields: null,
    
    /** api: config[data]
     *  ``Array Object``
     *  Static data to be loaded on the grid
     */
    data: null,
    
    /** api: config[extraData]
     *  ``Array Object``
     *  Static data to be loaded on the grid in addition to those got from WFS
     */
    extraData: null,
    
    /** api: config[autoLoad]
     *  ``Boolean``
     *  
     */
    autoLoad: true,
    
    // start i18n
    displayMsgPaging: "Displaying topics {0} - {1} of {2}",
    emptyMsg: "No topics to display",
    loadMsg: "Please Wait...",
    zoomToTooltip: 'Zoom all\'elemento',
    // end i18n
    
    zoomToIconPath: "theme/app/img/silk/map_magnify.png",
    
    /** private: countFeature
     *  ``Integer``
     */
    countFeature: null,
    
    featureFields: null,
    
    geometryType: null,
    
    supportTypes: {
        "xsd:boolean": "boolean",
        "xsd:int": "int",
        "xsd:integer": "int",
        "xsd:short": "int",
        "xsd:long": "int",
        /*"xsd:date": "date",
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
        
        if(config.fields){
           this.featureFields = config.fields;
        }
        
        if(config.autoRefresh){
            this.setAutoRefresh(config.autoRefresh);
        }
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
                    var ppp = geometry.getBounds();
                    map.zoomToExtent(geometry.getBounds(),true);
                }
            }]  
        };
    },
    /** api: method[addOutput]
     */    
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
    /** api: method[addOutput]
     */    
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
    /** api: method[addOutput]
     */    
    removeGeometry: function(layerName, id){
        var map = this.target.mapPanel.map;
        var targetLayer = map.getLayersByName(layerName)[0];
        if(targetLayer) {
            var unSelectFeatures= targetLayer.getFeaturesByAttribute("id", id);
            targetLayer.removeFeatures(unSelectFeatures); 
        }
    },    
    /** api: method[addOutput]
     */    
    getGeometry: function(rec, sourceSRS){
        var map = this.target.mapPanel.map;
        var geometry = rec.data.feature.geometry;
        var ppp = geometry.getBounds();
        if(geometry && sourceSRS) {
            var mapProj = map.getProjection();
            if(sourceSRS != map.getProjection()){
                var coll=new OpenLayers.Geometry.Collection(new Array(geometry.clone()));
                    var ccc = new OpenLayers.Projection(sourceSRS);
                    var bbb = map.getProjectionObject();
                var targetColl=coll.transform(
                    new OpenLayers.Projection(sourceSRS),
                    map.getProjectionObject()
                    );
                geometry = targetColl.components[0];   
                delete targetColl;
            }
        }
        return geometry;
    },    
    /** api: method[addOutput]
     */
    addOutput: function(config) {
        var me = this;
        this.wfsColumns = [];

        if(me.actionColumns){
            for( var kk=0; kk<me.actionColumns.length; kk++){
                switch (me.actionColumns[kk].type){
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

        var bbar;
        
        if(this.paging) {
            bbar = this.createPagingToolbar();
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
                    }
                    
                }
            },     
            sm: this.sm,
            colModel: new Ext.grid.ColumnModel({
                columns: []
            }),
            bbar: bbar,
            scope: this    
        }); 

        config = Ext.apply(wfsGridPanel, config || {});
        
        this.wfsGrid = gxp.plugins.WFSGrid.superclass.addOutput.call(this, config);
        
        if(this.data) {
            this.loadData();
        } if(this.autoLoad) {
            this.countRecords(this.onTotal, this);
        } else {
            this.wfsGrid.on('activate', function() {            
                if(this.data) {
                    this.loadData();
                } else {
                    this.countRecords(this.onTotal, this);
                }
            }, this, {single: true});
        }
        
        return this.wfsGrid;
    },
    
    onTotal: function(total, callback){
        if(parseInt(total,10) > 0 || (this.extraData && this.extraData.length > 0)) {
            this.loadSchema(this.onSchema.createDelegate(this, [callback]));	
        } else if(this.onEmpty){
            this.isEmpty = true;
            this.onEmpty.call(null, this);
        }       
    },
    
    onSchema: function(callback) {
        if(this.columns){
            for(kk=0; kk<this.columns.length; kk++){
                var column = {};
                Ext.apply(column, this.columns[kk]);
                if(column.header instanceof Array) {
                    column.header = column.header[GeoExt.Lang.getLocaleIndex()];
                }
                
                this.wfsColumns.push(column);
            }
        }else{
            for(kk=0; kk<this.featureFields.length; kk++){
                this.wfsColumns.push({
                    header: this.featureFields[kk].name, 
                    dataIndex: this.featureFields[kk].name,
                    sortable: true
                });
            }
        } 
        
        for(kk=0; kk<this.featureFields.length; kk++){
            if(this.featureFields[kk].mapping) {
                this.featureFields[kk].mapping = this.featureFields[kk].mapping.replace('${locale}', GeoExt.Lang.locale);                             
            }
        }
        
        var me = this;
        
        new GeoExt.data.FeatureStore({ 
            wfsParam: this,
            id: this.id+"_store",
            fields: this.featureFields,
            listeners:{
                beforeload: function(store){
                    if(this.loadMask && this.loadMask.el && this.loadMask.el.dom)
                        this.loadMask.show(); 
                    
                    this.wfsGrid.reconfigure(
                        store, 
                        new Ext.grid.ColumnModel({
                            columns: this.wfsColumns
                        })
                    );
                    if(this.wfsGrid.getBottomToolbar() && this.wfsGrid.getBottomToolbar().bind) {
                        this.wfsGrid.getBottomToolbar().bind(store);
                    }
                },
                load : function(store){
                     if(this.loadMask)
                        this.loadMask.hide(); 
                },
                
                exception : function(store){
                    if(this.loadMask && this.loadMask.el && this.loadMask.el.dom)
                        this.loadMask.hide(); 
                },
                scope: this
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
                        if(me.extraData && me.extraData.length > 0) {
                            for(var j = 0, lenextra = me.extraData.length; j < lenextra; j++){
                                var extraRecord = me.extraData[j];
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
                        if(me.extraData && me.extraData.length > 0) {
                            for(var j = 0, lenextra = me.extraData.length; j < lenextra; j++){
                                var extraRecord = me.extraData[j];
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
                this.getProtocol({
                    limit: !me.paging ? 1000 : this.pageSize,
                    start:  0
                })
            }), 
            autoLoad: true 
        });

    },
    
    
    createPagingToolbar: function() {
        return new Ext.PagingToolbar({
            pageSize: this.pageSize,
            wfsParam: this,
            id: this.id+"_paging",
            store: [],
            displayInfo: true,
            listeners: {
                "beforechange": function(paging,params){
                    paging.store.removeAll(true);
                    paging.store.proxy=new GeoExt.data.ProtocolProxy({ 
                        protocol:
                        this.getProtocol({
                            limit: params.limit,
                            start:  params.start
                        })
                    });
                },
                scope: this
                            
            },
            displayMsg: this.displayMsgPaging,
            emptyMsg: this.emptyMsg
        });
    },
    
    countRecords: function(callback, scope){
        
        var hitCountProtocol = this.getProtocol({
            resultType: "hits",
            outputFormat: "text/xml"
        });
                 
               
        hitCountProtocol.read({
            callback: function(response) {
                var respObj=new OpenLayers.Format.WFST({version: "1.1.0"}).read(
                            response.priv.responseXML, {output: "object"});
                this.countFeature=respObj.numberOfFeatures;
                if(callback)
                    callback.call(scope, this.countFeature);
            },
            scope: this
        });
         
        return this.countFeature;
    },
    
    
    loadSchema: function(callback, scope){
        if(this.featureFields == null){
            this.getSchema(function(schema){
                this.featureFields= new Array();
                var geomRegex = /gml:((Multi)?(Point|Line|Polygon|Curve|Surface|Geometry)).*/;
                    
                schema.each(function(r) {
                    var match = geomRegex.exec(r.get("type"));
                    if (match) {
                        this.geometryType = match[1];
                    } else {
                        var type = this.supportTypes[r.get("type") || "string"];
                        var field = {
                            name: r.get("name"),
                            type: type
                        };
                        this.featureFields.push(field);
                    }
                }, this);
                               
                if(callback)
                    callback.call(scope); 
            }, this); 
       } else if(callback) {
            callback.call(scope);  
       }
        
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
        this.countRecords(function(){
            var paging=Ext.getCmp(pagID);
            paging.doRefresh();
        });
    },
    
    getProtocol: function(params){
        var protocol;
        
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
        
        return protocol;
    },
    
    setPage: function(pageNumber){
        var pagID= this.id+"_paging"; 
        this.countRecords(function(){
            var paging=Ext.getCmp(pagID);
            paging.changePage(pageNumber);
        }); 
    },

    
    loadData: function() {
        var store = new GeoExt.data.FeatureStore({ 
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

