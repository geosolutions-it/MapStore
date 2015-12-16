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
    loadAcqData:function(acqPlan){
    	if (!acqPlan) return;
    	var myWin = new Ext.Window({
			height : 400,
			width  : 550,
			layout : 'fit',
			title: "Acquisition Plan",
			id: this.id + "_acqlist_wnd",
			items:[{
				id: this.id + "_acqlist",
				autoScroll: true,
				items:[]
			}]
		});
		
		myWin.show();
		
		var acqList = Ext.getCmp(this.id + "_acqlist");
		var grid = this.getAcqListGrid(acqPlan);
		acqList.add(grid);
		try
		{
			acqList.doLayout();
		}
		catch(err)
		{
			//console.log(err);
		}
    },
   /** private: method[refreshAcqListGrid]
    *  Get acquisition list grid based on selected service
    */ 
    getAcqListGrid: function(acqPlanUrl){
        	var me = this;

            // Feature grid
            
            var proxy;
            
            if (acqPlanUrl) {
            	proxy = new GeoExt.data.ProtocolProxy({
		            protocol: new OpenLayers.Protocol.HTTP({
		                url: acqPlanUrl,
		                format: new OpenLayers.Format.GML()
		            })
		        });
            }
            
            var acqListStore = new GeoExt.data.FeatureStore({
                layer: this.acqListLayer,
                fields: [
                    {name: "service_name", type: "string"},
                    {name: "ships", type: "number"},
                    {name: "start", type: "string"},
                    {name: "end", type: "string"},
                    {name: "sensor", type: "string"},
                    {name: "sensor_mode", type: "string"}
                ],
                proxy: proxy,
                pageSize: 100,
                autoLoad: true
            });
            
            this.columnsHeadersText = {
		        service_name: "ServiceName",
		        start: "Start",
		        end: "End",
		        sensor: "Sensor",
		        sensor_mode: "SensorMode",
		        ships: "Ships count"
		    };
		    
            this.acqListgrid = new Ext.grid.GridPanel({
                height: 361,
                width : 533,
                sm: new GeoExt.grid.FeatureSelectionModel(),
                // viewConfig: {
                //     emptyText: this.emptyAcqListText
                // },
                store: acqListStore,
                columns: [
                    // {header: this.columnsHeadersText["service_name"], dataIndex: "service_name"},
                    // {header: this.columnsHeadersText["ships"], dataIndex: "ships", sortable: true},
                    {header: this.columnsHeadersText["start"], dataIndex: "start", sortable: true},
                    {header: this.columnsHeadersText["end"], dataIndex: "end", sortable: true},
                    {header: this.columnsHeadersText["sensor"], dataIndex: "sensor", sortable: true},
                    {header: this.columnsHeadersText["sensor_mode"], dataIndex: "sensor_mode", sortable: true},
                    {
                        text: 'Show',
                        header: 'Show',
                        menuDisabled:true,
                        resizable:false,
                        xtype  :'actioncolumn',
                        align  :'center',
                        width  : 50,
                        getClass: function(val, meta, rec) {
                            this.tooltip = 'Show/Hide on Map';
                            return 'view';
                        },
                        handler: function(grid, rowIndex, colIndex) {
                            var rec      = grid.store.getAt(rowIndex);
                            var geometry = rec.data.feature.geometry;
                            
                            if (!me.wfsLayer) {
                            	for(var i=0; i<me.target.mapPanel.layers.getCount(); i++) {
                            		if (me.target.mapPanel.layers.getAt(i).data.name === "aois") {
                            			me.wfsLayer = me.target.mapPanel.layers.getAt(i);
                            		}
                            	}
                            }
                            
                            if (me.wfsLayer) {
	                            var feature = me.wfsLayer.features[0];
	                            Ext.apply(feature,{
	                                fid: '',
	                                geometry: geometry
	                            });
	                            // delete draftLayer
	                            if(me.wfsLayer){
	                                me.wfsLayer.removeAllFeatures();
	                                me.wfsLayer.addFeatures(feature);
	                            }
	                      	}
                        }
                    }
                ],
                listeners:{
                    rowclick: function(grid, rowIndex, columnIndex, e) {
                        var rec      = grid.store.getAt(rowIndex);
                        var selModel = grid.getSelectionModel();
                        try{
                            if(selModel.getCount() == 0){
                                Ext.getCmp(this.id + "_export_acq_button").disable();
                            }else{
                                Ext.getCmp(this.id + "_export_acq_button").enable();
                            }
                        } catch (e){
                            
                        }
                    },
                    scope:this
                },
                // tbar: [],
                bbar:[
                    new Ext.PagingToolbar({
                        store: acqListStore,
                        displayInfo: true,
                        displayMsg: '{0}-{1} of {2}',
                        emptyMsg: "No service available"
                    }),
                    "->",
                    {}]
            });
            
        return this.acqListgrid;
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
        
        actions.push({
            iconCls: 'acqplanaction',
            tooltip: "Show Acquisition Plan",
            handler: function (grid, rowIndex, colIndex) {
                var store = grid.getStore();
                var row = store.getAt(rowIndex);
                var sm=this.getSelectionModel();
                sm.selectRow(rowIndex);
                var feature = row.data.feature;
                // this.filterLayers(feature);
                var usid = feature.data.usid;
                var acqPlan = row.data.acq_plan_url;
                this.loadAcqData(acqPlan);
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
