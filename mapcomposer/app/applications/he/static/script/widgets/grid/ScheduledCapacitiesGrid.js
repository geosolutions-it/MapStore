/** api: (define)
 *  module = gxp.he.grid
 *  class = ScheduledCapacitiesGrid
 */
Ext.namespace("gxp.he.grid");

/** api: constructor
 *  .. class:: ScheduledCapacitiesGrid(config)
 *
 *      Create a new grid displaying the contents of a 
 *      ``GeoExt.data.FeatureStore`` for Scheduled Capacities .
 */
gxp.he.grid.ScheduledCapacitiesGrid = Ext.extend(gxp.grid.FeatureGrid, {

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
		
        var columns = [{
			xtype: 'actioncolumn',
			header: "", 
			width: 30,
			hidden: false,
			scope: this,
			items: [{
				iconCls: 'zoomaction',
				tooltip: this.actionTooltip,
				scope: this,
				handler: function(grid, rowIndex, colIndex){
					var store = grid.getStore();
					var row = store.getAt(rowIndex);
					var feature = row.data.feature;
					if(feature){
                        if(feature){
                        var geom=feature.geometry;
                            this.map.setCenter(new OpenLayers.LonLat(geom.x,geom.y),15,false,true);
                        }
                        /*
						var bounds = feature.geometry.getBounds();
						if(bounds){
							this.map.zoomToExtent(bounds);
							
							var showButton = Ext.getCmp("showButton");
							if(!showButton.pressed){
								showButton.toggle(true);
							}
							
							grid.getSelectionModel().selectRow(rowIndex);
						}*/
					}
				}
			}]
		}];
        columns.push({
                xtype: 'actioncolumn',
                header: "",
                width: 30,
                position: 1,
                hidden: false,
                scope: this,
                items: [{
                    iconCls: 'ic_chart-spline',
                    tooltip: "Chart",
                    text: 'Chart',

                    handler: function (grid, rowIndex, colIndex) {
                        var store = grid.getStore();
                        var row = store.getAt(rowIndex);
                        var feature = row.data.feature;
                        
                        var chart = {
                            title: feature.data.Location,
                            xtype: 'gxp_chart_panel',
                            region: 'center',
                            showLegend:false,
                            frame:false,
                            header:true,
                            border: false,
                            bodyStyle:'background-color: #FAFAFA;',
                            chartOptions: {
                                data:this.testData,
                                xField:'Effective_Date',
                                yField:'Scheduled_Capacity',
                                //y_label:'Scheduled Capacity',
                                store: new Ext.data.JsonStore({
                                    root: 'features',
                                    autoLoad: true,
                                    fields:[{name:"Effective_Date",mapping:'properties.cpcty_EffectiveDate'},
                                            {name:"Designed_Capacity",mapping:'properties.cpcty_Design'},
                                            {name:"Scheduled_Capacity",mapping:'properties.cpcty_Scheduled'},
                                            {name:"Operational_Capacity",mapping:'properties.cpcty_Operational'}
                                           ],
                                    url: 'http://he.geo-solutions.it/geoserver/gascapacity/ows?&outputFormat=application%2Fjson',
                                    vendorParams: store.vendorParams,
                                    baseParams:{
                                        service:'WFS',
                                        version:'1.1.0',
                                        request:'GetFeature',
                                        outputFormat: 'application/json',
                                        typeName:"gascapacity:gcd_v_scheduled_capacity_by_pipeline_detail",
                                        viewparams: store.viewparams + ";cpcty_RID:" + feature.data.cpcty_RID,
                                    }
                                }),
                                //xtype: 'gxp_C3Chart'
                                xtype: 'gxp_MGChart',
                                dateFormat : '%Y-%m-%dZ'

                            }
                        };
                        var canvasWindow = new Ext.Window({
                            title: "Scheduled Capacities",
                            maximizable:true,
                            collapsible:true,
                            title: 'Capacities' + '<i  style="font-size:.8em;color:#C47A02; float:right; ">MDth/d</i>',
                            layout: 'border',
                            autoScroll: false,
                            height: 350,
                            width: 950,
                            items: [chart]
                        }).show();

                    }
                }]
            });
		var name, type, xtype, format, renderer;
        (this.schema || store.fields).each(function(f) {
            if (this.schema) {
                name = f.get("name");
                type = f.get("type").split(":").pop();
                align = undefined;
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
                        align = "right";
                        format = "0,000";
                }
            } else {
                name = f.name;
            }
            if (this.ignoreFields.indexOf(name) === -1) {
                columns.push({
                    dataIndex: name,
                    header: name.replace("_"," "),
                    width: 200,
                    sortable: true,
                    xtype: xtype,
                    format: format,
                    align: align ? align : undefined,
                    renderer: xtype ? undefined : renderer
                });
            }
        }, this);
        
        return columns;
    }
   
    

});

/** api: xtype = gxp_featuregrid */
Ext.reg('he_scheduled_capacities_grid', gxp.he.grid.ScheduledCapacitiesGrid); 
