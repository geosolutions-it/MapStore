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
 *  class = GeoBatchFlowsGrid
 *  
 */
Ext.ns('mxp.widgets');

/**
 * Class: GeoBatchFlowsGrid
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
mxp.widgets.GeoBatchFlowsGrid = Ext.extend(Ext.grid.GridPanel, {

    /** api: xtype = mxp_viewport */
    xtype: "mxw_geobatch_flows_grid",
    
     /**
	 * Property: geoBatchRestURL
	 * {string} the GeoBatch ReST Url
	 */
    geoBatchRestURL: 'http://localhost:8080/geobatch/rest/',
    autoload:true,
    autoExpandColumn: 'description',
    forceOrder: false,
    /* i18n */
    nameText: 'Title',
    descriptionText:'Description',
    loadingMessage: 'Loading...',
	errorContactingGeobatch: 'Error loading flows from GeoBatch',
    runButtonTooltip: 'Run',
    /* end of i18n */
    //extjs grid specific config
    autoload:true,
    loadMask:true,
    
	flows: null,
    
   
    initComponent : function() {
        //FIX FOR IE10 and responseXML TODO: port this as a global fix
         var ie10XmlStore  = Ext.extend(Ext.data.XmlReader, {
            read : function(response){
                        var data = response.responseXML;
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
            url: this.geoBatchRestURL + 'flows/',
            record: 'flow',
            idPath: 'id',
            fields: [
                   'id',
                   'name',
                   'description',
                    {name: 'order', defaultValue: 1000000}
           ],
            reader:  new ie10XmlStore({
                record: 'flow',
                idPath: 'uuid',
                fields: [
                   'id',
                   'name',
                   'description',
                    {name: 'order', defaultValue: 1000000}
                ]
            }),
            listeners:{
                beforeload: function(a,b,c){
                   
                    if( a.proxy.conn.headers ){
                        if(this.auth){
                            a.proxy.conn.headers['Authorization'] = this.auth;
                        }
                        a.proxy.conn.headers['Accept'] = 'application/xml';
                    }else{
                        a.proxy.conn.headers = {'Accept': 'application/xml'};
                        if(this.auth){
                            a.proxy.conn.headers['Authorization'] = this.auth;
                        }
                    }
                   
                },
				load: function(store, records, options) {
					if(this.flows) {
						store.filterBy(function(record) {
							return this.flows[record.get('id')];
						}, this);
                        if(this.forceOrder) {
                            store.each(function(record) {
                                record.set('order', this.flows[record.get('id')].order || 1000000);
                            }, this);
                            store.sort("order");
                        }
					}
                    
				},
				exception: function(proxy, type, action, options, response) {
					Ext.Msg.show({
					   msg: this.errorContactingGeobatch,
					   buttons: Ext.Msg.OK,
					   icon: Ext.MessageBox.ERROR
					});
				},
				scope: this
            },
            sortInfo: {
                field: 'id',
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
            {id: 'id', header: "ID", width: 100, dataIndex: 'id', sortable: true,hidden:true},
            {id: 'name', header: this.nameText, width: 200, dataIndex: 'name', sortable: true},
            {id: 'description', header: this.descriptionText, dataIndex: 'description', sortable: true},
            {   
                xtype:'actioncolumn',
                dataIndex: 'id',
                width: 35,
                tooltip: this.runButtonTooltip,
                scope:this,
                handler: function(grid, rowIndex, colIndex){
                    var record =  grid.getStore().getAt(rowIndex);
                    this.runHandler.call(this.scope, record.get('id'), record.get('name'));
                },
                items:[{
                    iconCls:'update_manager_ic',
                    tooltip: this.runButtonTooltip,
                    width:25,
                    getClass: function(v, meta, rec) {
                        return 'x-grid-center-icon action_column_btn';
                    }
                }]
            }
        ],
        mxp.widgets.GeoBatchFlowsGrid.superclass.initComponent.call(this, arguments);
    }
   
    
});

/** api: xtype = mxp_geobatch_consumer_grid */
Ext.reg(mxp.widgets.GeoBatchFlowsGrid.prototype.xtype, mxp.widgets.GeoBatchFlowsGrid);
