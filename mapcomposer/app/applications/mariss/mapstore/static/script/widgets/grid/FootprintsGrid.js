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
gxp.npa.grid.FootprintsGrid = Ext.extend(gxp.grid.FeatureGrid, {

    /** api: config[map]
     *  ``OpenLayers.Map`` If provided, a layer with the features from this
     *  grid will be added to the map.
     */
    map: null,

    expanderTemplateText: null,

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
        
        this.pCart=(this.pCartId)?this.target.tools[this.pCartId]:null; 
        this.pScenario=(this.addScenarioId)?this.target.tools[this.addScenarioId]:null; 
        if(this.expanderTemplateText){
            this.expander=this.createExpander();
            this.plugins = [this.expander];
        }
        gxp.npa.grid.FootprintsGrid.superclass.initComponent.call(this);       
        this.resetBtn= new  Ext.Button({
        text: "Show All",
        iconCls:'icon-filtervec',
        width:'100px',
        hidden:true,
        enableToggle:true,
        toggleHandler:function(btn,pressed){
            this.showSlected=pressed;
             var row=this.getSelectionModel().getSelected();
           if(pressed)btn.setText('Show Selected');
           else {
               btn.setText('Show All');
                this.clearFilter();
                }
            if(pressed && row) this.filterLayers(row.data.feature);
          
        },scope:this
    });
    
        this.getTopToolbar().insert(0,this.resetBtn);
        this.regionCt=Ext.getCmp('south');
        
       this.addEvents("filterreseted");       
       
       this.getSelectionModel().on('rowselect',function( sm, rowIndex, r ){
                     var feature = r.data.feature;
                     this.filterLayers(feature);
                        },this);
    },
    setStore: function(store, schema) {
            gxp.npa.grid.FootprintsGrid.superclass.setStore.call(this,store, schema);
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
             
                    var index = this.target.mapPanel.layers.find("name",layerName);
                    var l =this.target.mapPanel.layers.getAt(index);
                    if(l) this.layersTofilter[layerName]={layer:l.getLayer(),tmpl: new Ext.XTemplate(this.layersfilter[layerName],
                        {
                            compiled: true,
                            addZero:function(val,n){
                                val=''+val;
                                var newVal='';
                                for(var i = 0; i < n - val.length; i++ ){
                                newVal +='0';
                                }
                            return newVal+val;
                            }
                            })};
                };
              }    
                        
                       if(this.showSlected){
                            for(var layerName in this.layersTofilter){
                           
                            var cql=    this.layersTofilter[layerName].tmpl.apply(feature.data);
                           
                                this.layersTofilter[layerName].layer.mergeNewParams({
                                
                                 cql_filter: cql,
                                });
                            }}
    },
    clearFilter:function(){
          // this.getSelectionModel().clearSelections();
            this.fireEvent("filterreseted",this);
           for(var layerName in this.layersTofilter){
            
                                this.layersTofilter[layerName].layer.mergeNewParams({
                                
                                 cql_filter: 'INCLUDE',
                                });
                            }
        },
    addScenarioToMap:function(row){
    if(this.pScenario){
        this.pScenario.loadElement(row,this.pCartType);
         this.regionCt.collapse();
        }
    },
     addToCart:function(row){
    if(this.pCart){
        this.pCart.loadElement(row,this.pCartType);
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

        var actions=[];
        actions.push({
            iconCls: 'zoomaction',
            tooltip: "ZoomTo",
            handler: function (grid, rowIndex, colIndex) {
                var store = grid.getStore();
                var row = store.getAt(rowIndex);
                var sm=this.getSelectionModel();
                sm.selectRow(rowIndex);
                var feature = row.data.feature;
               // this.filterLayers(feature);
                var usid = feature.data.usid;
                var bounds = feature.geometry.getBounds();
                if(bounds){
                    this.map.zoomToExtent(bounds);
                }
            }
        });

        if(this.pScenario)
            actions.push({
                iconCls: 'addScenario',
                tooltip : "Add To Map",
                handler : function(grid, rowIndex, colIndex) {
                    var store = grid.getStore();
                    var row = store.getAt(rowIndex);
                    var feature = row.data.feature;
                    var usid = feature.data.usid;
                    this.addScenarioToMap(row);
                }});
        if(this.pCart)
            actions.push({
                iconCls: 'addtocartaction',
                tooltip : "Add To Cart",
                handler : function(grid, rowIndex, colIndex) {
                    var store = grid.getStore();
                    var row = store.getAt(rowIndex);
                    var feature = row.data.feature;
                    var usid = feature.data.usid;
                    this.addToCart(row);
                }});
        var columns = [];
        if(this.expander)columns.push(this.expander);
        columns.push({
                xtype: 'actioncolumn',
                header: "",
                fixed:true,
                width: 80, 
                menuDisabled: true,
                position: 1,
                hidden: false,
                scope: this,
                items:actions 
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
                    case "dateTime":
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
                    header: (this.propertyNames && this.propertyNames[name])? this.propertyNames[name]: name.replace("_"," "),
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

 /** api: config[createExpander]
     *  ``Function`` Returns an ``Ext.grid.RowExpander``. Can be overridden
     *  by applications/subclasses to provide a custom expander.
     */
    createExpander: function() {
        return new Ext.grid.RowExpander({
            tpl: new Ext.XTemplate(this.expanderTemplateText)
        });
    }    

});

/** api: xtype = gxp_featuregrid */
Ext.reg('npa_footprints_grid', gxp.npa.grid.FootprintsGrid); 
