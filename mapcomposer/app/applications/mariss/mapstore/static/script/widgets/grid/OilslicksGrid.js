/** api: (define)
 *  module = gxp.npa.grid
 *  class = FootprintsGrid
 */
Ext.namespace("gxp.npa.grid");

/** api: constructor
 *  .. class:: FootprintsGrid(config)
 *
 *      Create a new grid displaying the contents of a 
 *      ``GeoExt.data.FeatureStore`` for Scheduled Capacities .
 */
gxp.npa.grid.OilslicksGrid = Ext.extend(gxp.grid.FeatureGrid, {

    /** api: config[map]
     *  ``OpenLayers.Map`` If provided, a layer with the features from this
     *  grid will be added to the map.
     */
    map: null,

    /** api: config[ignoreFields]
     *  ``Array`` of field names from the store's records that should not be
     *  displayed in the grid.
     */
    ignoreFields: ['count','FERC'],
    
    /** api: config[layer]
     *  ``OpenLayers.Layer.Vector``
     *  The vector layer that will be synchronized with the layer store.
     *  If the ``map`` config property is provided, this value will be ignored.
     */
    
    /** api: config[schema]
     *  ``GeoExt.data.AttributeStore``
     *  Optional schema for the grid. If provided, appropriate field
     *  renderers (e.g. for date or boolean fields) will be used.
     */

    /** api: config[dateFormat]
     *  ``String`` Date format. Default is the value of
     *  ``Ext.form.DateField.prototype.format``.
     */

    /** api: config[timeFormat]
     *  ``String`` Time format. Default is the value of
     *  ``Ext.form.TimeField.prototype.format``.
     */

    /** private: property[layer]
     *  ``OpenLayers.Layer.Vector`` layer displaying features from this grid's
     *  store
     */
    layer: null,
    showSlected:false,
    
      /** api: method[initComponent]
     *  Initializes the FeatureGrid.
     */
    initComponent: function(){
        gxp.npa.grid.OilslicksGrid.superclass.initComponent.call(this);       
        this.resetBtn= new  Ext.Button({
        text: (!this.showSlected)?"Show All":'Show Selected',
        iconCls:'icon-filtervec',
        width:100,
        hidden:true,
        enableToggle:true,
        pressed:this.showSlected,
        toggleHandler:function(btn,pressed){
            this.showSlected=pressed;
            var row=this.getSelectionModel().getSelected();
           if(pressed)btn.setText('Show Selected');
           else {
               btn.setText('Show All');
               this.resetFilters();}
            if(pressed && row) this.filterLayers(row.data.feature);
        },scope:this
        });
        this.getTopToolbar().insert(0,this.resetBtn);
        this.getSelectionModel().on('rowselect',function( sm, rowIndex, r ){
                    var feature = r.data.feature;
                     this.filterLayers(feature);
                        },this);
        
    },
    setStore: function(store, schema) {
            gxp.npa.grid.OilslicksGrid.superclass.setStore.call(this,store, schema);
            this.getStore().on('load',function(s,r){
                if(this.showSlected && r.length>0 ) 
                {
                    if(this.rendered)this.getSelectionModel().selectFirstRow();
                    else {
                        this.filterLayers(r[0]);
                        this.on('render',function(){
                            this.getSelectionModel().selectFirstRow();
                        },this);
                        }
                    }
            },this); 
            },
    filterLayers:function(feature){
        if(!this.layersTofilter) {          
               this.layersTofilter={};
               for(var layerName in this.layersfilter){
                   var lName=layerName;
                    if(this.ftMan.npaGroup)lName=layerName+"_"+this.ftMan.npaGroup;
                    var index = this.target.mapPanel.layers.find("name",lName);
                    var l =this.target.mapPanel.layers.getAt(index);
                    if(l) this.layersTofilter[layerName]={layer:l,tmpl: new Ext.XTemplate(this.layersfilter[layerName],
                        {
                            
                            compiled: true,
                            addZero:function(val,n){
                                val=''+val;
                                var newVal='';
                                for(var i = 0; i < n - val.length; i++ ){
                                newVal +='0';
                                }
                            return newVal+val;
                            },
                              convUpid:function(val){
                               val=val.toString();
                               val=  val.split('.')[1];
                             var d=4-val.length;
                             var n=(d>0)? parseInt(val) * (10* d): parseInt(val);
                             return n;
                            }
                            }),
                            origFilter:l.getLayer().params.CQL_FILTER||'INCLUDE' 
                            };
                        
                };
              }    
                        if(this.showSlected)
                        {
                            for(var layerName in this.layersTofilter){
                            var cql=this.layersTofilter[layerName].tmpl.apply(feature.data);
                                this.layersTofilter[layerName].layer.getLayer().mergeNewParams({
                                 cql_filter: cql,
                                });
                                this.layersTofilter[layerName].layer.npaCqlModified=true;
                            }
        }
    },

/**
 * api: method[resetFilter]
 * Reset original filter
 */        
    resetFilters:function(){
        
            for(var layerName in this.layersTofilter){
            
                                this.layersTofilter[layerName].layer.getLayer().mergeNewParams({
                                
                                 cql_filter: this.layersTofilter[layerName].origFilter,
                                });
                                this.layersTofilter[layerName].layer.npaCqlModified=false;
                            }
        
    },
 /**
 * api: method[clearFilters]
 * Clear all filter
 */    
    clearFilters:function(){
            for(var layerName in this.layersTofilter){
            
                                this.layersTofilter[layerName].layer.getLayer().mergeNewParams({
                                
                                 cql_filter: 'INCLUDE',
                                });
                            }
        
    },


    /** api: method[getColumns]
     *  :arg store: ``GeoExt.data.FeatureStore``
     *  :return: ``Array``
     *  
     *  Gets the configuration for the column model.
     */
    getColumns: function(store) {
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
        columns.push({
                xtype: 'actioncolumn',
                header: "",
                menuDisabled: true,
                fixed:true,
                width: 30,
                position: 1,
                hidden: false,
                scope: this,
                items: [{
                    iconCls: 'zoomaction',
                    tooltip: "ZoomTo",
                    text: 'ZoomTo',

                    handler: function (grid, rowIndex, colIndex) {
                        var store = grid.getStore();
                        var row = store.getAt(rowIndex);
                        var sm=this.getSelectionModel();
                        sm.selectRow(rowIndex);
                        var feature = row.data.feature;
                        var usid = feature.data.usid;
                        var bounds = feature.geometry.getBounds();
                        if(bounds){
                            this.map.zoomToExtent(bounds);
                        }
                    }
                }]
            });
    var name, type, xtype, format, renderer;
        (this.schema || store.fields).each(function(f) {
            if (this.schema) {
                name = f.get("name");
                type = f.get("type").split(":").pop();
                
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
            } else {
                name = f.name;
            }
            if (this.ignoreFields.indexOf(name) === -1) {
                columns.push({
                    dataIndex: name,
                    header: name.replace("_"," "),
                    width: 150,
                    sortable: true,
                    xtype: xtype,
                    format: format,
                    renderer: xtype ? undefined : renderer
                });
            }
        }, this);
        
        return columns;
    },

   


});

/** api: xtype = gxp_featuregrid */
Ext.reg('npa_oilslicks_grid', gxp.npa.grid.OilslicksGrid); 
