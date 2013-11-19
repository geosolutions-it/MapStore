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
    featureNS: null,
    
    
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
    
    /** api: config[sourcePrefix]
     *  ``String``
     *  Default prefix for sources layer title
     */
    sourcePrefix: "Sources of ",
    
    
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
    // end i18n
    

    /** private: countFeature
     *  ``Integer``
     */
    countFeature: null,
    
    addLayerIconPath: "theme/app/img/silk/add.png",
    detailsIconPath: "theme/app/img/silk/information.png",
    deleteIconPath: "theme/app/img/silk/delete.png",
    addLayerTool: null,
    
    featureFields: null,
    geometryType: null,
    

    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.WFSGrid.superclass.constructor.apply(this, arguments);  
        
        this.setTotalRecord();
        
        if(config.autoRefresh){
            this.setAutoRefresh(config.autoRefresh);
        }
    },
    
    setTotalRecord: function(callback){
        var hitCountProtocol = new OpenLayers.Protocol.WFS({ 
               url: this.wfsURL, 
               featureType: this.featureType, 
               readOptions: {output: "object"},
               featureNS: this.featureNS, 
               resultType: "hits",
               filter: this.filter,
               outputFormat: "application/json",
               srsName: this.srsName,
               version: this.version
       });
                 
               
       hitCountProtocol.read({
         callback: function(response) {
                this.countFeature=response.numberOfFeatures;
                if(callback)
                    callback.call();
         },
         scope: this
       });
         
       return this.countFeature;
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
        var me = this;
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
                                // prevent ExtJs to generate title
                                var title = record.get(layerTitleAtt);
                                if(title === undefined)
                                    title = record.get(layerNameAtt);
                                
                                addLayer.addLayer({
                                    msLayerTitle: title,
                                    msLayerName: record.get(wsAtt) + ":" + record.get(layerNameAtt),
                                    wmsURL: record.get(wmsURLAtt)
							}, function(r){								
                                // only spm has source points to be displayed
                                if(me.displaySource == true){
                                    addLayer.addLayer({
                                        msLayerTitle: me.sourcePrefix + record.get(layerNameAtt),
                                        msLayerName: me.featureType,
                                        wmsURL: me.wmsURL,
                                        // the CQL_FILTER must be lowercase (see WMSSource)
                                        customParams: {
                                            cql_filter: 'layerName = \'' + record.get(layerNameAtt) + '\''
                                        },
                                        zoomAfterAdd: false
                                    });
                                    
                                    // TODO: temporary fix
                                    addLayer.zoomAfterAdd = true;
                                }
							});                               
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
                                   
                                   // shared reader
                                   var reader = new Ext.data.ArrayReader({}, [
                                       {name: 'name'},
                                       {name: 'value'},
                                       {name: 'coverage'}
                                   ]);
                                   
                                   /*
                                   var detailsStore=new Ext.data.ArrayStore({
                                       fields: ['name', 'value', 'coverage'],
                                       idIndex: 0 
                                   });
                                   */

                                   var recordDetailsData = new Array();

                                   for(var k=0; k<me.featureFields.length; k++){
                                       var fname = me.featureFields[k].name;
                                       switch(fname){
                                           case 'ftUUID':
                                                // ignore
                                                break;
                                           case 'count':
                                           case 'min':
                                           case 'max':
                                           case 'sum':
                                           case 'avg':
                                           case 'stddev':
                                           case 'riskarea':
                                                // do nothing, they will be se on 'coverage' catch
                                                break;
                                           case 'coverages':
                                                {
                                                    var coverages_string = record.get(fname);
                                                    var coverages = coverages_string.split(' | ');
                                                    
                                                    var aoiString = record.get("areaOfInterest");
                                                    var aoiCorners = aoiString.split("; ");
                                                    
                                                    var aoiCoords = [];
                                                        aoiCoords.push(aoiCorners[0].split(" ")[0].trim().replace('[',''));
                                                        aoiCoords.push(aoiCorners[0].split(" ")[1].trim());

                                                        aoiCoords.push(aoiCorners[1].split(" ")[0].trim());
                                                        aoiCoords.push(aoiCorners[1].split(" ")[1].trim().replace(']',''));
                                                        
                                                    var points = [
													    new OpenLayers.Geometry.Point(aoiCoords[0], aoiCoords[1]),
													    new OpenLayers.Geometry.Point(aoiCoords[0], aoiCoords[3]),
													    new OpenLayers.Geometry.Point(aoiCoords[2], aoiCoords[3]),
													    new OpenLayers.Geometry.Point(aoiCoords[2], aoiCoords[1])
													];
													
													var ring = new OpenLayers.Geometry.LinearRing(points);
													var polygon = new OpenLayers.Geometry.Polygon([ring]);
													var projection = this.target.mapPanel.map.getProjectionObject();
													var poly = new OpenLayers.Geometry.MultiPolygon(polygon);
													var area = poly.getGeodesicArea( projection );
													var inPerDisplayUnit = OpenLayers.INCHES_PER_UNIT["km"];
											        if(inPerDisplayUnit) {
											            var inPerMapUnit = OpenLayers.INCHES_PER_UNIT["m"];
											            area *= Math.pow((inPerMapUnit / inPerDisplayUnit), 2);
											        }
											        
											        	// nmi -> area = (area.toFixed(2) * 1000 * 0.000539956803);
											        	area = Math.round(area*100)/100; 
													
                                                    // data must match!
                                                    // I'm using this long coding style for easy debugging
                                                    // and to avoid browser compatibility issues
                                                    var counts = record.get('count').split(' | ');
                                                    var mins = record.get('min').split(' | ');
                                                    var maxs = record.get('max').split(' | ');
                                                    var sums = record.get('sum').split(' | ');
                                                    var avgs = record.get('avg').split(' | ');
                                                    var stddevs = record.get('stddev').split(' | ');
                                                    var riskareas = record.get('riskarea').split(' | ');
                                                    for(var i = 0; i<coverages.length; i++)
                                                    {
                                                    	recordDetailsData.push([ 'area' , area + " km<sup>2</sup>", coverages[i]]);
                                                        recordDetailsData.push([ 'count' , counts[i], coverages[i]]);
                                                        recordDetailsData.push([ 'min' , mins[i], coverages[i]]);
                                                        recordDetailsData.push([ 'max' , maxs[i], coverages[i]]);
                                                        recordDetailsData.push([ 'sum' , sums[i], coverages[i]]);
                                                        recordDetailsData.push([ 'avg' , avgs[i], coverages[i]]);
                                                        recordDetailsData.push([ 'stddev' , stddevs[i], coverages[i]]);
                                                        if (!(riskareas[i] === " - "))
                                                        	recordDetailsData.push([ 'riskarea' , riskareas[i] + " km<sup>2</sup>", coverages[i]]);
                                                    }
                                                }
                                                break;
                                           default:
                                                // '0' because coverages names cannot begin with a digit and it's usefull when sorting
                                                recordDetailsData.push([ fname , record.get(fname), '0']);
                                                break;
                                       }
                                   }

                                   //detailsStore.loadData(recordDetailsData);

                                   var groupstore = new Ext.data.GroupingStore({
                                       reader: reader,
                                       data: recordDetailsData,
                                       sortInfo:{field: 'coverage', direction: "ASC"},
                                       groupField:'coverage'
                                   });
						           var controls = [
						            	new OpenLayers.Control.Navigation(),
							            new OpenLayers.Control.Attribution(),
							            new OpenLayers.Control.PanPanel()
							            //new OpenLayers.Control.ZoomPanel()
						            ];
                                   
                                   var layers = [];

								   // add current map visible layers
                                   for (var lyCount = 0; lyCount < this.target.mapPanel.map.layers.length; lyCount++) {
                                   		var layer = this.target.mapPanel.map.layers[lyCount];
                                   		layers.push(layer.clone());
                                   }
                                   
                                   // add current Layer
                                   var layerReady = false;
                                   if (record.get('itemStatus') && record.get('itemStatus') == "COMPLETED") layerReady = true;
                                   
                                   if (layerReady) {
	                                   var currentLayer = new OpenLayers.Layer.WMS( "My WMS", record.get('outputUrl'),
										                    {layers: record.get('layerName'), styles: record.get('styleName'),transparent: true, 'VERSION': "1.1.1"}//,
								                            /*{'maxExtent': new OpenLayers.Bounds(minx,miny,maxx,maxy),'maxResolution': "auto"}*/);
	                                   layers.push(currentLayer);
                                   }
                                   
                                   // setting initial Map extent
                                   var extent = null;
                                   
                                   if (record.get('areaOfInterest')) {
                                   	  var roi = record.get('areaOfInterest');
                                   	      roi = roi.replace('[','').replace(']','').replace(';','');
                                   	  var coords = roi.split(' ');
                                   	  extent = [parseFloat(coords[0]), parseFloat(coords[1]), parseFloat(coords[2]), parseFloat(coords[3])];
                                   } else {
                                   	  extent = this.target.mapPanel.extent; 
                                   }
                                   
                                   new Ext.Window({ 
                                          title: record.get(layerTitleAtt)+ " - " + me.detailsWinTitle,
                                          height: 400,
                                          width: 700,
                                          layout: 'border',
                                          resizable: true,
                                          items:[
                                          		new Ext.Panel({
										            title: 'ROI',
										            region: 'west',
										            split: true,
										            width: 200,
										            collapsible: true,
										            collapsed: !layerReady,
										            margins:'3 0 3 3',
										            cmargins:'3 3 3 3',
										            items:[
										            	{
												            xtype: "gx_mappanel",
												            //ref: "mapPanel",
												            region: "center",
												            height: 400,
                                          					width: 200,
												            map: {
												            	//bounds: this.target.mapPanel.map.bounds,
												            	//projection: this.target.mapPanel.map.projection,
												                //numZoomLevels: this.target.mapPanel.map.numZoomLevels,
												                controls: controls
												            },
												            extent: extent,
												            layers: layers
												        }
										            ]
										        }, this),
                                                new Ext.grid.GridPanel({
                                                	region: 'center',
										            margins:'3 3 3 0', 
										            defaults:{autoScroll:true},
										            //width: 400,
                                                    //store: detailsStore,
                                                    store: groupstore,
                                                    view: new Ext.grid.GroupingView({
                                                        forceFit:true,
                                                        groupTextTpl: '{[(values.group == "0") ? "General Properties" : "Coverage "+values.group]}'
                                                    }),
                                                    anchor: '100%',
                                                    //viewConfig : {
                                                    //	forceFit: true
                                                    //},
                                                    columns: [
                                                        {
                                                            header: me.detailsHeaderName, 
                                                            dataIndex: "name",
                                                            renderer: function (val){
                                                                return '<b>' + val + '</b>';
                                                            }
                                                        }, {
                                                            header: me.detailsHeaderValue, 
                                                            dataIndex: "value"
                                                        }, {
                                                            header: me.detailsHeaderValue, 
                                                            dataIndex: "coverage",
                                                            hidden: true
                                                        }
                                                    ]
                                                })
                                             ]
                                  }).show();
                      }
                  }]
             };
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
                        handler: function(gpanel, rowIndex, colIndex)
                            {
                               var store = gpanel.getStore();	
                               var record = store.getAt(rowIndex);
                              // var map = me.target.mapPanel.map;
                               var mapPanel=me.target.mapPanel;
                               var layerName= record.get(wsAtt) + ":" + record.get(layerNameAtt);
                               var layerSrcTitle= me.sourcePrefix + record.get(layerNameAtt);
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
                                                    readOptions: {output: "object"},
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
                                                    
                                                    if(record.get('name') == layerName || record.get('title') == layerSrcTitle){
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
       var kk;   
      
       var wfsGridPanel=new Ext.grid.GridPanel({ 
            title: this.title, 
            store: [], 
            id: this.id,
            layout: "fit",
            viewConfig : {
                    forceFit: true
            },
            colModel: new Ext.grid.ColumnModel({
                columns: []
            }),
            listeners: {
		    render: function(){
                        
                        //this.doLayout();
		    }
            },
            bbar: new Ext.PagingToolbar({
                pageSize: this.pageSize,
                wfsParam: this,
                id: this.id+"_paging",
                store: /*wfsStore*/[],
                displayInfo: true,
                listeners: {
		    render: function(){
                        this.last.setVisible(false);
                        //this.doLayout();
		    },
                    "beforechange": function(paging,params){
                        paging.store.removeAll(true);
                        paging.store.proxy=new GeoExt.data.ProtocolProxy({ 
                                protocol: new OpenLayers.Protocol.WFS({ 
                                    url: this.wfsParam.wfsURL, 
                                    featureType: this.wfsParam.featureType, 
                                    readFormat: new OpenLayers.Format.GeoJSON(),
                                    featureNS: this.wfsParam.featureNS, 
                                    filter: this.wfsParam.filter,
                                    sortBy: {
                                        property: "runEnd",
                                        order: "DESC"
                                    },
                                    maxFeatures: params.limit,
                                    startIndex:  params.start,
                                    outputFormat: "application/json",
                                    srsName: this.wfsParam.srsName,
                                    version: this.wfsParam.version
                                })
                       });
                    }          
                                
                },
                displayMsg: this.displayMsgPaging,
                emptyMsg: this.emptyMsg
            })
        }); 

        config = Ext.apply(wfsGridPanel, config || {});
        var wfsGrid = gxp.plugins.WFSGrid.superclass.addOutput.call(this, config);

        this.getSchema(function(schema){
                    this.featureFields= new Array();
                    var geomRegex = /gml:((Multi)?(Point|Line|Polygon|Curve|Surface|Geometry)).*/;
                    var types = {
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
                    };
                    schema.each(function(r) {
                        var match = geomRegex.exec(r.get("type"));
                        if (match) {
                            geometryName = r.get("name");
                            me.geometryType = match[1];
                        } else {
                            var type = types[r.get("type")];
                            var field = {
                                name: r.get("name"),
                                type: type
                            };
                           /* if (type == "date") {
                                field.dateFormat = "Y-m-d H:i:s";
                            }"format": "Y-m-d H:i:s"*/
                            me.featureFields.push(field);
                        }
                    }, this);

                    var wfsStore= new GeoExt.data.FeatureStore({ 
                        wfsParam: me,
                        sortInfo: { field: "runEnd", direction: "DESC" },
                        id: this.id+"_store",
                        fields: me.featureFields,
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
                                    this.applySort();
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
                            protocol: new OpenLayers.Protocol.WFS({ 
                                url: me.wfsURL, 
                                featureType: me.featureType, 
                                readFormat: new OpenLayers.Format.GeoJSON(),
                                featureNS: me.featureNS, 
                                filter: me.filter, 
                                maxFeatures: me.pageSize,
                                sortBy: {
                                    property: "runEnd",
                                    order: "DESC"
                                },
                                startIndex: 0,
                                outputFormat: "application/json",
                                srsName: me.srsName,
                                version: me.version
                            }) 
                        }), 
                        autoLoad: true 
                    });
                    
                    
                    var columns= [];
                    
                    if(me.actionColumns){
                        for( kk=0; kk<me.actionColumns.length; kk++){
                            switch (me.actionColumns[kk].type){
                                case "addLayer":
                                       columns.push(me.getAddLayerAction(me.actionColumns[kk]));
                                   break;
                                case "details":
                                       columns.push(me.getDetailsAction(me.actionColumns[kk]));
                                   break;  
                                case "delete":
                                       columns.push(me.getDeleteAction(me.actionColumns[kk]));
                                   break;   
                            }
                        }
                    }

                    if(me.columns){
                        for( kk=0; kk<me.columns.length; kk++){
                            columns.push(me.columns[kk]);
                        }
                    }else{
                        for(kk=0; kk<me.featureFields.length; kk++){
                            columns.push({
                                header: me.featureFields[kk].name, 
                                dataIndex: me.featureFields[kk].name,
                                sortable: true
                            });
                        }
                    }   

                    wfsGrid.reconfigure(
                       wfsStore, 
                       new Ext.grid.ColumnModel({
                                columns: columns
                       })
                   );
                       
                   wfsGrid.getBottomToolbar().bind(wfsStore);
                    
                },this
        );	
        Ext.getCmp(this.outputTarget).setActiveTab(wfsGrid);

        ///opt/tomcat_gui/webapps/xmlJsonTranslate/tem

        return wfsGrid;
    }
       
});

Ext.preg(gxp.plugins.WFSGrid.prototype.ptype, gxp.plugins.WFSGrid);
