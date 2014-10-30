/*
 *  Copyright (C) 2007 - 2014 GeoSolutions S.A.S.
 *  http://www.geo-solutions.it
 *
 *  GPLv3 + Classpath exception
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/** api: (define)
 *  module = mxp.widgets
 *  class = CMREOnDemandServicesGrid
 *  
 */
Ext.ns('mxp.widgets');

/**
 * Class: CMREOnDemandServicesGrid
 * Grid panel that shows the list of flows.
 * Selection Model can be attached to get the data of a flow.
 * 
 * GeoBatch REST API used
 * * (GET) "/flows" : list of flows 
 * * (GET) "/flows/{flowid}" : details about the flow
 * * (GET) "/flows/{flowId}/consumers" : the consumers for the flow
 * * (GET) "/consumers/{consumerid}/status" : the status of a consumer
 * * (GET) "/consumers/{consumerid}/log" the log of a consumer
 * * (PUT) "/consumers/{consumerid}/pause" pause the consumer 
 * * (PUT) "/consumers/{consumerid}/resume" resume a paused consumer
 * * (PUT) "/consumers/{consumerid}/clean" clean the consumer 
 *
 * Inherits from:
 *  - <Ext.grid.GridPanel>
 *
 */
mxp.widgets.CMREOnDemandServicesGrid = Ext.extend(Ext.grid.GridPanel, {

    /** api: xtype = mxp_viewport */
    xtype: "mxw_cmre_ondemand_services_grid",
    
     /**
	 * Property: geoBatchRestURL
	 * {string} the GeoBatch ReST Url
	 */
    geoBatchRestURL: 'http://localhost:8180/opensdi2-manager/mvc/process/geobatch/',
    autoload:true,
    /* i18n */
    nameText: 'Title',
    descriptionText:'Description',
    autoExpandColumn: 'description',
    loadingMessage: 'Loading...',
    /* end of i18n */
    //extjs grid specific config
    autoload:true,
    loadMask:true,
    
   
    initComponent : function() {
        //FIX FOR IE10 and responseXML TODO: port this as a global fix
         var ie10XmlStore  = Ext.extend(Ext.data.JsonReader, {
            read : function(response){
                        var data = response.responseText;
                        if(!data || !data.documentElement) {
                            if(window.ActiveXObject) {
                                var doc = new ActiveXObject("Microsoft.XMLDOM");
                                if(doc.loadXML(response.responseText)){
                                    data = doc;
                                }
                            }
                        }
                        return this.readRecords(data);
                    }
        });
        // create the Data Store
        this.store = new Ext.data.Store({
            autoLoad: this.autoload,
            // load using HTTP
            url: this.geoBatchRestURL + 'services/',
            record: 'service',
            idPath: 'serviceId',
            fields: [
                   'serviceId',
                   'name',
                   'description'
           ],
            /*reader:  new ie10XmlStore({
                record: 'flow',
                idPath: 'uuid',
                fields: [
                   'id',
                   'name',
                   'description']
            }),*/
            reader: new Ext.data.JsonReader({
            	root: 'data',
            	idPath: 'serviceId',
            	fields: [
                   'serviceId',
                   'name',
                   'description']
            }),
            listeners:{
                beforeload: function(a,b,c){
                   
                    if( a.proxy.conn.headers ){
                        if(this.auth){
                            a.proxy.conn.headers['Authorization'] = this.auth;
                        }
                        a.proxy.conn.headers['Accept'] = 'application/json';
                    }else{
                        a.proxy.conn.headers = {'Accept': 'application/json'};
                        if(this.auth){
                            a.proxy.conn.headers['Authorization'] = this.auth;
                        }
                    }
                   
                }
            },
            sortInfo: {
                field: 'serviceId',
                direction: 'ASC' // or 'DESC' (case sensitive for local sorting)
            }
        });
    
    
        this.tbar = this.tbar || [];
        this.tbar.push({
            iconCls:'refresh_ic',
            xtype:'button',
            text:this.refreshText,
            scope:this,
            handler:function(){
                this.store.load();
            }
        });
        
        
        this.columns= [
            {id: 'id', header: "ID", width: 100, dataIndex: 'serviceId', sortable: true,hidden:true},
            {id: 'name', header: this.nameText, width: 200, dataIndex: 'name', sortable: true},
            {id: 'description', header: this.descriptionText, dataIndex: 'description', sortable: true},
            {
                    xtype:'actioncolumn',
                    width: 35,
                    tooltip: "Issue a new run",
                    handler: this.createNewProcessRun,
                    scope: this,
                    items:[ {
                        iconCls:'add_ic',
                        width:25,
                        tooltip: this.tooltipLog,
                        scope:this,
                        getClass: function(v, meta, rec) {
                            return 'x-grid-center-icon action_column_btn';
                        }
                    }]
            }
        ],
        mxp.widgets.CMREOnDemandServicesGrid.superclass.initComponent.call(this, arguments);
    },
   
    /**
     *    private: method[checkLog] show the log of a consumer
     *      * grid : the grid
     *      * rowIndex: the index of the row 
     *      * colIndex: the actioncolumn index
     */
    createNewProcessRun: function(grid, rowIndex, colIndex){
        var record =  grid.getStore().getAt(rowIndex);
        var serviceId = record.get('serviceId');
        var serviceName = record.get('name');
        var me = this;
        //var url = this.geoBatchRestURL + "consumers/" + serviceId + "/log";

        Ext.Msg.show({
				title: "TODO",
				msg: "Running a new service will drop all previous inputs. Continue with the definition of a new run?",
				buttons: Ext.Msg.OKCANCEL,
				fn: function(buttonId, text, opt){
					if(buttonId === 'ok'){
				        var mainPanel = Ext.getCmp("mainTabPanel");
				        try{
				            //mainPanel.removeAll();
				            var serviceConfigurationPanel; 
				            
				            if ( mainPanel.items.containsKey("CMREOnDemandServiceInputPanel") ) {
				           		serviceConfigurationPanel = mainPanel.items.get("CMREOnDemandServiceInputPanel");
				            }

				            if (serviceConfigurationPanel) {
				            	mainPanel.remove(serviceConfigurationPanel);
				            }

				            var bounds = new OpenLayers.Bounds(
						        /*143.835, -43.648,
						        148.479, -39.574*/
						       -20037508.34, -20037508.34,
								20037508.34, 20037508.34
						    );
						    var mapPanel = new GeoExt.MapPanel({
						        region: "center",
						        map: {
						        	controls: [
						        		new OpenLayers.Control.Navigation(),
				                        new OpenLayers.Control.ScaleLine(),
				                        new OpenLayers.Control.MousePosition({
						                    prefix: '<strong>EPSG:4326</strong> coordinates: ',
						                    separator: ' | ',
						                    numDigits: 4,
						                    emptyString: 'Mouse is not over map.'
						                })
						        	],
						            maxExtent: bounds,
						            maxZoomLevel: 3,
									zoom: 4,
						            /*maxResolution: 0.018140625,
						            projection: "EPSG:4326",
						            units: 'degrees'*/
						            displayProjection: "EPSG:4326",
						            projection: "EPSG:900913",
									units: "m",
									center: [7697651.41, 751677.98] // Indian Ocean
						        },
						        layers: [
						            /*new OpenLayers.Layer.WMS("Tasmania State Boundaries",
						                "http://demo.opengeo.org/geoserver/wms",
						                {layers: "topp:tasmania_state_boundaries"},
						                {singleTile: true, numZoomLevels: 8}),
						            new OpenLayers.Layer.WMS("Tasmania Water Bodies",
						                "http://demo.opengeo.org/geoserver/wms",
						                {layers: "topp:tasmania_water_bodies", transparent: true},
						                {buffer: 0})*/
						            new OpenLayers.Layer.OSM("OpenStreetMap",
						                [
						                    "http://a.tile.openstreetmap.org/${z}/${x}/${y}.png",
						                    "http://b.tile.openstreetmap.org/${z}/${x}/${y}.png",
						                    "http://c.tile.openstreetmap.org/${z}/${x}/${y}.png"
						                ],
						                OpenLayers.Util.applyDefaults({                
						                    attribution: "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
						                    type: "mapnik"
						                	}, 
						                	//options
						                	{
									            projection: "EPSG:900913",
									            maxExtent: bounds/*new OpenLayers.Bounds(
									                -128 * 156543.0339, -128 * 156543.0339,
									                128 * 156543.0339, 128 * 156543.0339
									            )*/,
									            //maxResolution: 19567.87923828125,//156543.03390625
									            numZoomLevels: 19,
									            units: "m",
									            buffer: 1,
									            transitionEffect: "resize",
												tileOptions: {crossOriginKeyword: null}
									        }
						                )
						            )
						        ],
						        extent: bounds,
						        items: [{
						            xtype: "gx_zoomslider",
						            vertical: true,
						            height: 100,
						            x: 10,
						            y: 20,
						            plugins: new GeoExt.ZoomSliderTip()
						        }]
						    });
						    
			            	mainPanel.add({
					            layout: 'border',
								itemId:'CMREOnDemandServiceInputPanel',
					            xtype:'panel',
					            closable: true,
					            closeAction: 'close',
					            iconCls: 'nato_ic',  
					            header: false,
					            deferredReneder:false,
					            viewConfig: {
					                forceFit: true
					            },
					            title: "CMRE On Demand Service: " + serviceName,
					            items:[
					            	{
							            xtype:'mxp_cmre_ondemand_services_input_form',
							            tbar:null,
							            geoBatchRestURL: this.geoBatchRestURL,
							            mapPanel: mapPanel,
							            region:'west',
										iconCls:'nato_ic',
										title: serviceName + " Inputs",
							            autoScroll:true,
							            width:600,
							            ref:'list',
							            collapsible:true,   
							            auth: this.auth,
							            sm: null
							        },
							        mapPanel
					            ]
					        }).show();
				        }catch (e){
				            // FIXME: some error here
				            console.log(e);
				        }
					}
				},
			    icon: Ext.MessageBox.QUESTION
			}); 
    }
});

/** api: xtype = mxp_geobatch_consumer_grid */
Ext.reg(mxp.widgets.CMREOnDemandServicesGrid.prototype.xtype, mxp.widgets.CMREOnDemandServicesGrid);
