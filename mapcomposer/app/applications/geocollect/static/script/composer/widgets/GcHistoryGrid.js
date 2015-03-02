/**
* Copyright (c) 2008-2011 The Open Planning Project
*
* Published under the GPL license.
* See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
* of the license.
*/

/** api: (define)
 *  module = gxp.grid
 *  class = GcHistoryGrid
 *  base_link = `Ext.grid.GridPanel <http://extjs.com/deploy/dev/docs/?class=Ext.grid.GridPanel>`_
 */
Ext.namespace("gxp.grid");

/** api: constructor
 *  .. class:: GcHistoryGrid(config)
 *
 *      Create a new grid displaying the contents of a 
 *      .
 */
gxp.grid.GcHistoryGrid = Ext.extend(Ext.grid.GridPanel, {

  /** api: xtype = gxp_googlegeocodercombo */
    xtype: "gxp_gchistroygrid",
    
    /** private: config[typeAhead]
     * the queryParameter for WFS
     */
    queryParam : "cql_filter",
    
    title:'History',
    
    
   /** api: config[ignoreFields]
     *  ``Array`` of field names from the store's records that should not be
     *  displayed in the grid.
     */    
    
     ignoreFields: null,
    
    /** api: config[colConfig]
     *  ``Object``
     *  An object with as keys the field names, which will provide the ability
     *  to override the col configuration for that fileds
     */
    colConfig:null,
    
    /** api: config[mapPanel]
     *  the mapPanel
     */
    mapPanel:  null,
    /** api: config[url]
     *  url to perform requests
     */
    wfsURL:  '',
    /** api: config[typeName]
     *  the tipe name to search
     */
    typeName: '',
    /**
     * private config[root]
     * the root node containing feature data.
     */
    root:'features',
    /**
     * private config[recordId]
     * the id of the record.
     */
    recordId: 'fid',
    
    custom  : null,
    
    geometry: null,
    
    /** api: config[recordModel]
     *  ``Ext.Record | Array`` record model to create the store
     *  for restricting search.
     * exemple: 
     * recordModel: [
     *  {name: 'id', mapping: 'id'},
     *  {name: 'geometry', mapping: 'geometry'},
     *  {name: 'codice_ato', mapping: 'properties.codice_ato'},
     *  {name: 'denominazi', mapping: 'properties.denominazi'}
     *  
     *   ],
     */
    recordModel: null,
    
    /** api: config[queriableAttributes]
     *  ``String | Array`` feature attributes to query
     *  for restricting search.
     * for the exemple is ['codice_ato','denominazi']
     */
    queriableAttribute : null ,
    
    /** api: config[sortBy]
     *  ``String | Array`` sorting attribute
     *  needed for pagination.
     */
    sortBy : '',

    /** api: config[pageSize]
     *  ``Integer`` page size of result list.
     *  needed for pagination. default is 10
     */
    pageSize:30,
    /** api: config[loadingText]
     *  ``String`` loading text for i18n 
     */
    loadingText: 'Searching...',
    /** api: config[emptyText]
     *  ``String`` empty text for i18n 
     */
    emptyText: "Search",
    /** api: config[width]
     *  ``int`` width of the text box. default is 200
     */
    width: 200,
    
    /** defines style for the search result item
     */
    itemSelector:  'div.search-item',
    
    /** api: config[tpl]
     *  ``Ext.XTemplate`` the template to show results.
     */
    tpl: null,
    
    /** api: config[predicate]
     *  ``String`` predicate to use for search (LIKE,ILIKE,=...).
     */
    predicate: '=',
    /** api: config[vendorParams]
     *  ``String`` additional parameters object. cql_filters
     *  is used in AND the search params. (see listeners->beforequery)
     */
    vendorParams: '',

    outputFormat: 'application/json',
    
    /** private: method[initComponent]
     *  Override
     */
    initComponent: function() {
        
        this.ignoreFields = ["feature", "state", "fid"].concat(this.ignoreFields); 
        this.store= new Ext.data.Store();
        this.cm= new Ext.grid.ColumnModel({columns: []});
        this.sm= new Ext.grid.RowSelectionModel({singleSelect:true});
        this.bbar=[];
        this.getSchema(this.createHistoryGrid,this);
        this.on('render',function(){
            if(!this.mask) this.mask=  new Ext.LoadMask(this.id, {msg:"Please wait...",store:this.store});
        },this);
      return gxp.grid.GcHistoryGrid.superclass.initComponent.apply(this, arguments);
    },
    
//Recupero lo achema dal server per costruire records model e columns model 
 getSchema: function(callback,scope){   
        var schema = new GeoExt.data.AttributeStore({
            url: this.wfsURL, 
            baseParams: Ext.apply({
                SERVICE: "WFS",
                VERSION: "1.1.0",
                REQUEST: "DescribeFeatureType",
                TYPENAME: this.typeName,
            },this.baseParams||{}),
            autoLoad: true,
            listeners: {
                "load": function() {
                    callback.call(scope, schema);
                },
                scope: this
            }
        });
    },
 
// Crea store, collumn model e gird dallo schema della WFS layer
createHistoryGrid:function(schema){
          this.schema=schema;
          this.store=this.createStore(); 
                 if(this.pageSize){
                     this.getBottomToolbar().add( new Ext.PagingToolbar({
                    store: this.store,
                    pageSize: this.pageSize,
                    renderTo:this.footer,
                    afterPageText:"",
                    beforePageText:"",
                    listeners:{
                        render: function(){
                            this.last.setVisible(false);
                            
                        }
                    }
                }));
                
                }  
                
                 
        this.reconfigure(this.store, this.createColumnModel()); 
        this.doLayout();
        },
 
//Crea JSON WFS STORE
createStore:function(){
                 console.log(this.sortBy);
        return store = new Ext.data.JsonStore({
            combo: this,
            root: this.root,
            messageProperty: 'crs',
            sortInfo:{
                field:this.sortBy,
                direction:'DESC'
                },
            autoLoad: false,
            fields:this.createRecordsModel(),
            mapPanel:this.mapPanel,
            url: this.wfsURL,
            vendorParams: this.vendorParams,
            paramNames:{
                start: "startindex",
                limit: "maxfeatures",
                sort: "sortBy"
            },
            baseParams:Ext.apply({
                service:'WFS',
                version:'1.1.0',
                request:'GetFeature',
                typeName:this.typeName ,
                outputFormat: this.outputFormat,
                sortBy: this.sortBy
            },this.baseParams||{}),
            listeners:{
                beforeload: function(store){
                    var mapPanel = (this.mapPanel?this.mapPanel:this.combo.target.mapPanel);
                    store.setBaseParam( 'srsName', mapPanel.map.getProjection() );
                    for (var name in this.vendorParams ) {
                        if(this.vendorParams.hasOwnProperty(name)){
                            if(name!='cql_filter' && name != "startindex" && name != "maxfeatures" && name != 'outputFormat' ){
                                store.setBaseParam(store, this.vendorParams[name]);
                            }
                        }
                    }
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
       
               // this.combo.crs = this.reader.jsonData.crs;
                //custom total workaround
                var estimateTotal = function(o,options,store){
                    var current = o.totalRecords +  options.params[store.paramNames.start] ;
                    var currentCeiling = options.params[store.paramNames.start] + options.params[store.paramNames.limit];
                    if(current < currentCeiling){
                        return current;
                    }else{
                        return 100000000000000000; 
                    }
                };
                o.totalRecords = estimateTotal(o,options,this);
                //end of custom total workaround
                
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
            }
            
        });  
           
           
 
           
       },    
//Crea record model a partire da schema    
createRecordsModel: function() {
        
                    
                    var fields = [], geometryName;
                    var geomRegex = /gml:((Multi)?(Point|Line|Polygon|Curve|Surface|Geometry)).*/;
                    var types = {
                        "xsd:boolean": "boolean",
                        "xsd:int": "int",
                        "xsd:integer": "int",
                        "xsd:short": "int",
                        "xsd:long": "int",
                        "xsd:date": "date",
                        "xsd:string": "string",
                        "xsd:float": "float",
                        "xsd:decimal": "float"
                    };
                    this.schema.each(function(r) {
                        var match = geomRegex.exec(r.get("type"));
                        if (match) {
                            geometryName = r.get("name");
                            this.geometryType = match[1];
                        } else {
                            // TODO: use (and improve if needed) GeoExt.form.recordToField    
                            var type = types[r.get("type")];
                                var field = {
                                name: r.get("name"),
                                mapping: "properties."+r.get("name"),
                                type: type
                            };
                            //TODO consider date type handling in OpenLayers.Format
                            if (type == "date") {
                                field.dateFormat = "Y-m-d\\Z";
                            }
                            fields.push(field);
                        }
                    }, this);
                   
                  return fields;  
                    
                    
                              
    },
      /** api: method[getColumns]
     *  :
     *  :return: ``Array``
     *  
     *  Create the configuration for the column model form wfs schema.
     */
    getColumns: function() {
        function getRenderer(format) {
            return function(value) {
                //TODO When http://trac.osgeo.org/openlayers/ticket/3131
                // is resolved, change the 5 lines below to
                // return value.format(format);
                var date = value;
                if (typeof value == "string") {
                     date = Date.parseDate(value.replace(/Z$/, ""), "c");
                }
                return date ? date.format(format) : value;
            };
        }
        
       
          var columns = [];     
        var name, type, xtype, format, renderer;
        this.schema.each(function(f) {
            
                
                name = f.get("name");
                type = f.get("type").split(":").pop();
                 if (type.match(/^[^:]*:?((Multi)?(Point|Line|Polygon|Curve|Surface|Geometry))/)) {
                    // exclude gml geometries
                    return;
                }
                format = null;
                switch (type) {
                    case "date":
                        format = this.dateFormat;
                    case "datetime":
                        format = format ? format : this.dateFormat + " " + this.timeFormat;
                        xtype = undefined;
                        renderer = getRenderer(format);
                        break;
                    case "boolean":
                        xtype = "booleancolumn";
                        break;
                    case "string":
                        xtype = "gridcolumn";
                        break;
                    default:
                        xtype = "numbercolumn";
                }
            
             var fieldCfg = GeoExt.form.recordToField(f);
            if (this.ignoreFields.indexOf(name) === -1) {
               var col={
                    dataIndex: name,
                    header: fieldCfg.fieldLabel,
                    sortable: true,
                    xtype: xtype,
                    format: format,
                    renderer: xtype ? undefined : renderer,
                  //  editor: fieldCfg,
                    editable:this.edit 
                    
                };
                 if (this.colConfig && this.colConfig[name]) {
                     
                    Ext.apply(col, this.colConfig[name]);
                }
                columns.push(col);
            }
        }, this);
        return columns;
    },
    
    /** private: method[createColumnModel]
     *  :return: ``Ext.grid.ColumnModel``
     */
    createColumnModel: function() {
        var cols = this.getColumns();
        return new Ext.grid.ColumnModel(
            {
               columns: cols,
                }
               );
    },
//Load wfs features 
   loadHistory: function(param){
        var params={};
        if(this.oldParam===param)return;//If already loaded skip!
     
     
      
       if(!param)  this.store.removeAll();
      
              //Preparo il filtro con il valore passato ed eseguo la query
       this.vendorParams={cql_filter:this.queriableAttribute+this.predicate+""+param+""};
       this.store.setBaseParam(this.queryParam,this.queriableAttribute+this.predicate+param);
       if(this.pageSize){
         this.store.load({  params:{
                startindex: 0,          
        maxfeatures: this.pageSize
           }});
       }else this.store.load();
       this.oldParam=param;
   },
    
 refreshHistory:function(){
     this.store.reload();
 }
 
 } );
 Ext.reg(gxp.grid.GcHistoryGrid.prototype.xtype, gxp.grid.GcHistoryGrid);
